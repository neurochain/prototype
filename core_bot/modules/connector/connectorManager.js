
var util = require('util'),
 bus = require('../bus/bus'),
 ConSocketSenderModule = require('./socket/conSocketListener.js');

function ConnectionManager() {
    // SubAgents creation : external app connection
   var conSock = new ConSocketSenderModule();
       bus.eventBus.on(CNTSOCKET_CONMGR_INPUT, function (input) { bus.eventBus.sendEvent(CNTMGR_CTRL_INPUT, input); });
}

module.exports = ConnectionManager;
