var bus = require('./bus.js'),
transactionClass = require('../../utils/objects/transaction.js'),
botClass = require('../../utils/objects/bot.js'),
messageClass = require('../../utils/objects/message.js'),
blockClass = require('../../utils/objects/block'),
objectTypesModule = require('../../utils/objects/objectTypes.js'),
randomString = require('randomstring'),
H = require('../../utils/helper');

function Controller() {
     bus.eventBus.on(SECMGR_CTRL_VALIDATED_MESSAGE, function (message) { logger.log('debug', 'message validated - worker'); processMessage(message); });
     bus.eventBus.on(MINER_CTRL_TRANSACTION_OK, function (message) { bus.eventBus.sendEvent(CTRL_TRXMGR_PROCESS, message); });
     bus.eventBus.on(CSNMGR_CTRL_SEND_MESSAGE, function (message) { bus.eventBus.sendEvent(CTRL_SECMGR_SIGN_TO_SEND_MESSAGE, message); });
     bus.eventBus.on(CSNMGR_CTRL_BACKUP_BLOCK, function (block) { bus.eventBus.sendEvent(CTRL_HISTMGR_BACKUP_BLOCK, block); });
     bus.eventBus.on(CSNMGR_CTRL_CHECK_BLOCK, function (block) { bus.eventBus.sendEvent(CTRL_BIZMGR_CHECK_BLOCK, block); });
     bus.eventBus.on(CSNMGR_CTRL_CLEAN_BLOCKLIST, function () { bus.eventBus.sendEvent(CTRL_BLKMGR_CLEAN_BLOCKLIST); });
     bus.eventBus.on(CSNMGR_CTRL_BROADCAST, function (message) { bus.eventBus.sendEvent(CTRL_SECMGR_SIGN_TO_BROADCAST, message); });
     bus.eventBus.on(NTKMGR_CTRL_SEND_MESSAGE, function (message) { bus.eventBus.sendEvent(CTRL_SECMGR_SIGN_TO_SEND_MESSAGE, message); });
     bus.eventBus.on(NTKMGR_CTRL_BROADCAST, function (message) { bus.eventBus.sendEvent(CTRL_SECMGR_SIGN_TO_BROADCAST, message); });
     bus.eventBus.on(NTKMGR_CTRL_SHARE_TRX, function (bot) { bus.eventBus.sendEvent(CTRL_TRXMGR_SHARE, bot); });
     bus.eventBus.on(NTKMGR_CTRL_SHARE_BLK, function (bot) { bus.eventBus.sendEvent(CTRL_BLKMGR_SHARE, bot); });
     bus.eventBus.on(TRXMGR_CTRL_BROADCAST, function (message) { bus.eventBus.sendEvent(CTRL_SECMGR_SIGN_TO_BROADCAST, message); });
     bus.eventBus.on(TRXMGR_CTRL_SEND_MESSAGE, function (message) { bus.eventBus.sendEvent(CTRL_SECMGR_SIGN_TO_SEND_MESSAGE, message); });
     bus.eventBus.on(BLKMGR_CTRL_SEND_MESSAGE, function (message) { bus.eventBus.sendEvent(CTRL_SECMGR_SIGN_TO_SEND_MESSAGE, message); });
     bus.eventBus.on(BLKMGR_CTRL_BROADCAST, function (message) { bus.eventBus.sendEvent(CTRL_SECMGR_SIGN_TO_BROADCAST, message); });
     bus.eventBus.on(BIZMGR_CTRL_NEW_BIZ, function (bizObject) { bus.eventBus.sendEvent(CTRL_TRXMGR_CREATE_TRX, bizObject); });
     bus.eventBus.on(TERMMGR_CTRL_SET_CONF, function (conf) { bus.eventBus.sendEvent(CTRL_BIZMGR_SET_CONF, conf) });
     bus.eventBus.on(TERMMGR_CTRL_START, function () {
        //START NETWORK
        bus.eventBus.sendEvent(CTRL_NTKMGR_ASK_REGISTER);
        // START TRANSACTIONS
        bus.eventBus.sendEvent(CTRL_BIZMGR_START);
        // START ELECTORING
        bus.eventBus.sendEvent(CTRL_CSNMGR_START);
        // START BLOCKS
        bus.eventBus.sendEvent(CTRL_BLKMGR_LAUNCH);
    });
     bus.eventBus.on(TERMMGR_CTRL_CREATE_TRX, function (seedTrx) { bus.eventBus.sendEvent(CTRL_BIZMGR_CREATE_TRX, seedTrx) });
};

// From Message type, launch the right process
function processMessage(message) {
    switch (message.contentType) {
        case MESSAGE_REGISTER_ASK: bus.eventBus.sendEvent(CTRL_NTKMGR_NEW_REGISTRATION_ASK, message); break;
        case MESSAGE_REGISTER_OK: bus.eventBus.sendEvent(CTRL_NTKMGR_NEW_REGISTRATION_OK, message); break;
        case MESSAGE_NEW_TRX: bus.eventBus.sendEvent(CTRL_MINER_VALIDATE_TRX, message);  break;
        case MESSAGE_NEW_BLOCK: bus.eventBus.sendEvent(CTRL_BLKMGR_NEW_BLOCK, message.content); break;
        case MESSAGE_VOTE_ELECTED: bus.eventBus.sendEvent(CTRL_CSNMGR_ELECTED, message); break;
        case MESSAGE_CHOSEN_BLOCK:bus.eventBus.sendEvent(CTRL_CSNMGR_CHOSEN_BLOCK, message);  break;
        case MESSAGE_UDPATE_BLK: bus.eventBus.sendEvent(CTRL_BLKMGR_UPDATE_BLOCKS, message); break;
        case MESSAGE_UDPATE_TRX: bus.eventBus.sendEvent(CTRL_TRXMGR_UPDATE_TRXS, message); break;
    }
}





function lamportCheck(message) {
    //LAMPORT CLOCK
    logger.log('debug','Local Lamport ' + global.lamport + '   coming Lamport ' + message.lamport);
    if (global.lamport >= message.lamport)
        if (message.contentType != MESSAGE_REGISTER_ASK)
            return false;

    if (message.contentType != MESSAGE_REGISTER_ASK) {
        global.lamport = message.lamport;
        logger.log('debug',' Update local Lamport to ' + global.lamport);
    }
    return true;
}

module.exports = Controller;
