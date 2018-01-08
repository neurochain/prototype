var ot = require('./objectTypes.js');

function Bot() {
    this._id = '';
    this.objectType = OBJECT_TYPE_BOT;
    this.IP = '';
    this.UDPListeningPort = '';
    this.UDPSendingPort = '';
    this.botID = '';
    this.date_creation = '';
    this.reads = '';
    this.writes = '';
    this.emmittedTransaction = '';
    this.validatedTransaction = '';
    this.blockedTransaction = '';
    this.network = '';
    this.techDateStored = '';
    this.registrationNumber = '';
    this.publicKey = '';
    this.activity = '';
    this.variety = '';

}

module.exports = Bot;
