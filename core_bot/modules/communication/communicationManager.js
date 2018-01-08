
var util = require('util'),
 bus = require('../bus/bus'),
 messageTypes = require('../../utils/messageTypes.js'),
 MessageObject = require('../../utils/objects/message.js'),
 SocketListenerModule = require('./socket/socketListener.js'),
 SocketSenderModule = require('./socket/socketSender.js');

function CommunicationManager() {
    // SubAgents creation : Socket Sender and Listener for UDP communication
   var socketSender = new SocketSenderModule();
   var socketListener = new SocketListenerModule();

    // Internal events subscriptions
     bus.eventBus.on(SECMGR_COMMGR_BROADCAST_MESSAGE, function (message) { broadcastMessage(message);});
     bus.eventBus.on(SECMGR_COMMGR_SEND_MESSAGE, function (message) { bus.eventBus.sendEvent(COMMGR_SOCKETSENDER_SEND_MESSAGE, message);});
     bus.eventBus.on(SOCKETLISTENER_COMMGR_NEW_MESSAGE, function (message) { bus.eventBus.sendEvent(COMMGR_SECMGR_VALIDATE_MESSAGE, message); });
}
function broadcastMessage(message) {
    message.emetter = global.localBot;
    receiverMap = new Map();

    var threshold = 100;
    var botsValues = Array.from(global.botsMap.values());
    var numberToSelect = Math.floor(threshold * global.botsMap.size / 100);
    logger.log(LOG_COM,'Number of bots to select: ' + numberToSelect);
    logger.log(LOG_COM,'global.botsMap.size' + global.botsMap.size);

    while (receiverMap.size < numberToSelect) {
        var tmpBot = botsValues[Math.floor(Math.random() * botsValues.length)];
            receiverMap.set(tmpBot.botID, tmpBot);
    }
    logger.log(LOG_COM, 'Receiver selected : ' + receiverMap.size);
    receiverMap.forEach(function (value, key) {
        if (global.localBot.botID != value.botID) {
            logger.log(LOG_COM, 'Sending message to :' + JSON.stringify(value));
            message.receiver = value;
            bus.eventBus.sendEvent(COMMGR_SOCKETSENDER_SEND_MESSAGE, message);
        }
    });
}

module.exports = CommunicationManager;
