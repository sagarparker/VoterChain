const SHA256 = require('crypto-js/sha256');
const moment = require('moment');

class Block{
    constructor(index,timestamp,data,previousHash = ""){
        this.index          =   index;
        this.timestamp      =   timestamp;
        this.data           =   data;
        this.previousHash   =   previousHash;
        this.hash           =   this.calculateHash();
        this.nonce          =   0;
    }

    calculateHash(){
        return SHA256( this.index + this.timestamp + this.previousHash + this.nonce +JSON.stringify(this.data) ).toString();
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
        this.difficulty = 3;
    }

    createGenesisBlock(){
        return new Block(0, moment().format('MMMM Do YYYY, h:mm:ss a'),{voterID:'Genesis Block',vote:'NA'}, "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length -1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];
            if(currentBlock.hash !== currentBlock.calculateHash()){
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

// voteChain.addBlock(new Block(1,moment().format('MMMM Do YYYY, h:mm:ss a'),{voterID:'SOK6723439',vote:'NOTA'}));
// voteChain.addBlock(new Block(2,moment().format('MMMM Do YYYY, h:mm:ss a'),{voterID:'SOK6723455',vote:'BJP'}));
// console.log("Is voter chain valid :",voteChain.isChainValid());
// console.log(voteChain);