var bus = require('../bus/bus.js'),
H = require('../../utils/helper'),
randomString = require('randomstring'),
messageClass = require('../../utils/objects/message.js'),
botClass = require('../../utils/objects/bot.js');

function NetworkManager() {
    logger.log('info', 'Network Manager subscribing events');
     bus.eventBus.on(CTRL_NTKMGR_ASK_REGISTER, function () { askRegister(); });
     bus.eventBus.on(CTRL_NTKMGR_NEW_REGISTRATION_ASK, function (message) { manageNewRegistrationAsk(message); });
     bus.eventBus.on(CTRL_NTKMGR_NEW_REGISTRATION_OK, function (message) { manageNewRegistrationOK(message); });

}

function askRegister() {
    var message = new messageClass();
    global.localBot.registrationNumber = randomString.generate();
    message.emetter = global.localBot;
    var receiverBot = new botClass();
    receiverBot.IP = argSeedIP;
    receiverBot.UDPListeningPort = argSeedListeningPort;
    message.receiver = receiverBot;
    message.emetter = global.localBot;
    message.content = { registrationNumber: global.localBot.registrationNumber, askingBot: global.localBot };
    message.contentType = MESSAGE_REGISTER_ASK;
    logger.log(LOG_REG, ' Message to ' + argSeedIP + ':' + argSeedListeningPort + ' - ' + message.contentType + ' - ' + message.content.registrationNumber);
    bus.eventBus.sendEvent(NTKMGR_CTRL_SEND_MESSAGE, message);
}

function manageNewRegistrationAsk(message) {
    // Automatic acceptation
    // bot agrees, no vote needed

    // adding bot to the list
    global.botsMap.set(message.content.askingBot.botID, message.content.askingBot);

    // Creating message for acceptation
    var registrationOKMess = new messageClass();
    registrationOKMess.emetter = global.localBot;
    // the body message is the same, just need to add my vote
    registrationOKMess.content = message.content;
    registrationOKMess.contentType = MESSAGE_REGISTER_OK;
    registrationOKMess.content.botsList = H.mapToJson(global.botsMap);

    logger.log(LOG_REG, message.content.askingBot.botID + ' accepted in NeuroChain network');
    logger.log(LOG_REG, 'Sending list of bots (contains ' + global.botsMap.size + ' elements)');
    logger.log(LOG_REG, 'Sending list of blocks (contains ' + global.blocksMap.size + ' elements)');
    logger.log(LOG_REG, 'Sending list of transactions  (contains ' + global.transactionsMap.size + ' elements)');
    // sending acceptation to all network
    bus.eventBus.sendEvent(NTKMGR_CTRL_BROADCAST, registrationOKMess);
    // asking for update transactions and block for the just added bot
    bus.eventBus.sendEvent(NTKMGR_CTRL_SHARE_TRX, message.content.askingBot);
    bus.eventBus.sendEvent(NTKMGR_CTRL_SHARE_BLK, message.content.askingBot);



}

function manageNewRegistrationOK(message) {
    var tmpMap = H.jsonToMap(message.content.botsList);
    var atLeastOneNew = false;
    logger.log(LOG_REG, 'Registraion validated by '+ message.emetter.botID + '. Getting ' + tmpMap.size + ' bots.');
    tmpMap.forEach(function (value, key) {
        if (global.botsMap.get(key) == null) {
            global.botsMap.set(key, value);
            logger.log(LOG_REG, 'New Bot in my list ' + key);
            atLeastOneNew = true;
        }
    });
    logger.log(LOG_REG, 'New bots list size ' + global.botsMap.size);

    message.emetter = global.localBot;
    message.content.botsList = H.mapToJson(global.botsMap);
    if (atLeastOneNew) {
        logger.log(LOG_REG, 'At least one new bot in the list. Forwarding this list ( ' + global.botsMap.size + ' bots)');
        bus.eventBus.sendEvent(NTKMGR_CTRL_BROADCAST, message);
    }

}

module.exports = NetworkManager;
