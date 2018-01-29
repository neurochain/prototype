var ot = require('./objectTypes.js');

function Log() {

    this.objectType = OBJECT_TYPE_LOG;
    this.botId='';
    this.timestamp='';
    this.message='';
}

module.exports = Log;
