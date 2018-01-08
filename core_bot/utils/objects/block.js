var ot = require('./objectTypes.js');

// Block is the object composing the blockchain.
// Currently, a block contains 1 transaction.

function Block() {

    this.objectType = OBJECT_TYPE_BLOCK;
    this.blockID = 0;
    this.dateReceived = '';
    this.dateSent = '';
    this.previousBlockID = '';
    this.timestamp = '';
    this.creator = '';
    this.content = '';
    this.generationID = '';
    this.randomValue = 0.17;
}


Block.prototype.transacFunction = function () {

};

module.exports = Block;
