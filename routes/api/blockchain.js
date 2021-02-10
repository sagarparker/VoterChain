const SHA256 = require('crypto-js/sha256');
const moment = require('moment');

class Block{
    constructor(timestamp,data,previousHash = ""){
        this.timestamp      =   timestamp;
        this.data           =   data;
        this.previousHash   =   previousHash;
        this.hash           =   this.calculateHash();
        this.nonce          =   0;
    }

    calculateHash(){
        return SHA256(this.timestamp + this.previousHash + this.nonce +JSON.stringify(this.data) ).toString();
    }

    //Proof of Work
    mineBlock(difficulty){

        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){

            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined : "+ this.hash);
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
    }

    createGenesisBlock(){
        return new Block(moment().format('MMMM Do YYYY, h:mm:ss a'),{voterID:'Genesis Block',vote:'NA'}, "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length -1];
    }


    computeBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        return newBlock;
    }

    addBlock(computedBlock){
        this.chain.push(computedBlock);
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            function calculateHash(){
                return SHA256(currentBlock.timestamp + currentBlock.previousHash + currentBlock.nonce +JSON.stringify(currentBlock.data)).toString();
            }

            if(currentBlock.hash !== calculateHash()){
                return false
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

module.exports.Block        =   Block;        
module.exports.Blockchain   =   Blockchain;

