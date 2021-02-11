const express   =   require('express')
const router    =   express.Router();
const moment    =   require('moment');
const axios     =   require('axios');
const { body, validationResult } = require("express-validator");
require('dotenv').config();

const { votersData } = require('./voterDetails');
const { Block,Blockchain } = require('./blockchain');

//Creating  a new instance of the blockchain

const VoterChain = new Blockchain();
console.log("\nGenesis Block : "+JSON.stringify(VoterChain)+"\n");

const peopleWhoVoted = {};
globalThis.noOfNodes = 0;

// Socket IO 

const io = require("socket.io")(5000);
io.on("connection", (socket) => {

    // When a new node connects to the network
    console.log('A new node connected : '+socket.id);
    globalThis.noOfNodes++

    socket.on("disconnect", () => {
        // When a node gets disconnected
        console.log('A node disconnected : '+socket.id);
        globalThis.noOfNodes--
    });

    //Sending data to nodes and mining new block
    socket.on("BlockMined", function(data){
    const block = data;

        //Sending the block that is mine to validate in the network
        socket.emit("validateBlock",block,VoterChain);


    });

    //Checking the validation status of block 
    socket.on("BlockIsValid",function(status,block){
        if(status){
        //API call to add block to the blockchain
        axios.post('http://localhost:8080/api/addBlock', {"block":block},{ validateStatus: false })
            .then(response =>  {
                console.log("\n\n\n\n")
                console.log(response.data);
                console.log("\n\nUpdated VoterChain : \n\n")
                console.log(VoterChain);
            })
            .catch(function (error) {
                console.log(error);
            });
        }
        else{
            console.log("\n\nBlock is not valid anymore : "+block.hash)
        }
        
    })
});




// Add a new vote to the blockchain

router.post('/vote',
    [body('party').not().isEmpty(),
    body('voterID').not().isEmpty()],
    async (req,res)=>{
        try{

            // Input field validation

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                error: errors.array()[0],
                });
            }

            const party     =   req.body.party;
            const voterID   =   req.body.voterID;

            //Checking if the user has voted before

            //If the user has not voted before
            if(!peopleWhoVoted.hasOwnProperty(voterID)){

                //Adding the voterId of the voters who have not voted yet
                peopleWhoVoted[voterID] = moment().format('MMMM Do YYYY, h:mm:ss a') 

                //Emit the new block details to all the nodes in the network
                io.emit('MineBlock',{
                    VoterChain:VoterChain,
                    time:moment().format('MMMM Do YYYY, h:mm:ss a'),
                    voterID:voterID,
                    party:party
                })

                return res.status(200).json({
                    result:true,
                    msg:"Your vote has been registered"
                })

            }

            //If the voter has voted before
            else{
                return res.status(400).json({
                        result:false,
                        msg:"The user has already voted"
                })
            }
            
        }
        catch(err){
            console.log(err);
            return res.status(500).json({
                result:false,
                msg:"There was a problem registering your vote"
            })
        }

});




//Adding block to the blockchain

router.post('/addBlock',(req,res)=>{
    try{
        const block = req.body.block;
        const latestBlock = VoterChain.getLatestBlock();

        //Checking if the block is valid
        if(block.previousHash !== latestBlock.hash){
            console.log("Here");
            return res.status(400).json({
                result:false,
                msg:"The block has already been added"
            })
        }

        //Checking if the blockchain is valid
        if(!VoterChain.isChainValid()){
            return res.status(400).json({
                result:false,
                msg:"The blockchain has been tampered"
            })
        }
        else{
            VoterChain.addBlock(block);
            return res.status(200).json({
                result:true,
                msg:"Block added to the blockchain"
            })
        }
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            result:false,
            msg:"There was a problem adding block to the VoterChain"
        })
    }
})




//Check if the voter has voted before

router.post('/checkIfVotedBefore',
    body('voterID').not().isEmpty(),
    (req,res)=>{
        try{

            // Input field validation

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({
                error: errors.array()[0],
                });
            }

            const voterID = req.body.voterID;

            //Check if the voter has voted before

            if(peopleWhoVoted.hasOwnProperty(voterID)){
                return res.status(200).json({
                    hasVotedBefore:true,
                    msg:"You have already voted"
                })
            }
            else{
                return res.status(200).json({
                    hasVotedBefore:false,
                    msg:"The user has not voted before"
                })
            }
        }
        catch(err){
            console.log(err);
            return res.status(500).json({
                result:false,
                msg:"There was a problem fetching users voting data"
            })
        }


});

//Fetching the election result

router.get('/votingResult',
    (req,res)=>{
        try{
            let votingCounts = {
                'BNP':0,
                'AAP':0,
                'BSN':0,
                'INP':0,
                'CIP':0,
                'NCS':0
            }

            //Storing the votes in the votingCounts object
            for(index in VoterChain.chain){
                let vote = VoterChain.chain[index].data.vote;
                if(vote != 'NA'){
                    votingCounts[vote]++;
                }
            }

            return res.status(200).json({
                result:true,
                msg:'Election result fetched',
                data:votingCounts
            });

        }
        catch(err){
            return res.status(500).json({
                result:false,
                msg:"There was a problem fetching all the votes"
            })
        }
});



module.exports = router;