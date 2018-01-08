
var ot = require('./objectTypes.js');

function Transaction() {
    this.objectType = OBJECT_TYPE_TRANSACTION;
    this.originBot = '';
    this.lastBlockID = '';
    this.content = '';
    this.creationDate = '';
    this.techDateStored = '';
    this._id = '';
}
module.exports = Transaction;
