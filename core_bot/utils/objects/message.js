var ot = require('./objectTypes.js');

function Message() {

    this.techDateStored = '';
    this._id = '';
    this.objectType = OBJECT_TYPE_MESSAGE;
    this.receiver = '';
    this.emetter = '';
    this.channel = '';
    this.dateReceived = '';
    this.dateSent = '';
    this.latency = '';
    this.lamport = 0;
    this.content = '';
    this.contentType = '';
}

module.exports = Message;
