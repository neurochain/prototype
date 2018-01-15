
var util = require('util'),
 bus = require('../bus/bus'),
 ConSocketSenderModule = require('./socket/conSocketSender.js');

function ConnectionManager() {
    // SubAgents creation : external app connection
   var conSock = new ConSocketSenderModule();
       bus.eventBus.on(CONSOCKET_CONMGR_INPUT, function (input) { bus.eventBus.sendEvent(CONMGR_CTRL_INPUT, input); });
}

module.exports = ConnectionManager;
