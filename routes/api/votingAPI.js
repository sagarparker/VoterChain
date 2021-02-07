const express = require('express')
const router  = express.Router();
const moment = require('moment');
const { body, validationResult } = require("express-validator");
require('dotenv').config();

const { votersData } = require('./voterDetails');
const {Block,Blockchain} = require('./blockchain');

//Creating  a new instance of the blockchain

const VoterChain = new Blockchain();
console.log("\nGenesis Block : "+JSON.stringify(VoterChain)+"\n");

let votesCount = 0;
const peopleWhoVoted = {};



// Add a new vote to the blockchain

router.post('/vote',
    [body('party').not().isEmpty(),
    body('voterID').not().isEmpty()],
    (req,res)=>{
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

                //Incrementing the votes count
                votesCount++;

                //Adding the voterId of the voters who have not voted yet
                peopleWhoVoted[voterID] = moment().format('MMMM Do YYYY, h:mm:ss a')


                //Adding new vote to blockchain
                VoterChain.addBlock(new 
                    Block(votesCount,moment().format('MMMM Do YYYY, h:mm:ss a'),{voterID:voterID,vote:party}));    
            }

            //If the voter has voted before
            else{
                return res.status(400).json({
                        result:false,
                        msg:"The user has already voted"
                })
            }
            
            //Checking if the blockchain is valid
            if(VoterChain.isChainValid()){
                return res.status(200).json({
                    result:true,
                    msg:"Your vote has been registered",
                    currentVoterChain:VoterChain
                })
            }
            else{
                return res.status(400).json({
                    result:false,
                    msg:"The blockchain has been tampered"
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