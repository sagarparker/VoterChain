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

            //Incrementing the votes count
            votesCount++;

            //Adding new vote to blockchain
            VoterChain.addBlock(new 
                Block(votesCount,moment().format('MMMM Do YYYY, h:mm:ss a'),{voterID:voterID,vote:party}));
            
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
            return res.status(500).json({
                result:false,
                msg:"There was a problem registering your vote"
            })
        }

});



module.exports = router;