const SHA256 = require('crypto-js/sha256');
const moment = require('moment');

class Block{
    constructor(index,timestamp,data,previousHash = ""){
        this.index          =   index;
        this.timestamp      =   timestamp;
        this.data           =   data;
        this.previousHash   =   previousHash;
        this.hash           =   this.calculateHash();
    }

    calculateHash(){
        return SHA256( this.index + this.timestamp + JSON.stringify(this.data) ).toString();
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock(){
        return new Block(0, moment().format('MMMM Do YYYY, h:mm:ss a'),{voterID:'Genesis Block',vote:'NA'}, "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length -1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
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

const voteChain = new Blockchain();
voteChain.addBlock(new Block(1,moment().format('MMMM Do YYYY, h:mm:ss a'),{voterID:'SOK6723439',vote:'NOTA'}));
voteChain.addBlock(new Block(2,moment().format('MMMM Do YYYY, h:mm:ss a'),{voterID:'SOK6723455',vote:'BJP'}));
console.log("Is voter chain valid :",voteChain.isChainValid());
console.log(voteChain);