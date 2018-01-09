var bus = require('./bus.js'),
transactionClass = require('../../utils/objects/transaction.js'),
botClass = require('../../utils/objects/bot.js'),
messageClass = require('../../utils/objects/message.js'),
blockClass = require('../../utils/objects/block'),
objectTypesModule = require('../../utils/objects/objectTypes.js'),
randomString = require('randomstring'),
H = require('../../utils/helper');

function Controller() {
      linkEvents(MINER_CTRL_TRANSACTION_OK, CTRL_TRXMGR_PROCESS);
      linkEvents(CSNMGR_CTRL_SEND_MESSAGE, CTRL_SECMGR_SIGN_TO_SEND_MESSAGE);
      linkEvents(CSNMGR_CTRL_BACKUP_BLOCK, CTRL_HISTMGR_BACKUP_BLOCK);
      linkEvents(CSNMGR_CTRL_CHECK_BLOCK, CTRL_BIZMGR_CHECK_BLOCK);
      linkEvents(CSNMGR_CTRL_CLEAN_BLOCKLIST, CTRL_BLKMGR_CLEAN_BLOCKLIST);
      linkEvents(CSNMGR_CTRL_BROADCAST, CTRL_SECMGR_SIGN_TO_BROADCAST);
      linkEvents(NTKMGR_CTRL_SEND_MESSAGE, CTRL_SECMGR_SIGN_TO_SEND_MESSAGE);
      linkEvents(NTKMGR_CTRL_BROADCAST, CTRL_SECMGR_SIGN_TO_BROADCAST);
      linkEvents(NTKMGR_CTRL_SHARE_TRX, CTRL_TRXMGR_SHARE);
      linkEvents(NTKMGR_CTRL_SHARE_BLK, CTRL_BLKMGR_SHARE);
      linkEvents(TRXMGR_CTRL_BROADCAST, CTRL_SECMGR_SIGN_TO_BROADCAST);
      linkEvents(TRXMGR_CTRL_SEND_MESSAGE, CTRL_SECMGR_SIGN_TO_SEND_MESSAGE);
      linkEvents(BLKMGR_CTRL_SEND_MESSAGE, CTRL_SECMGR_SIGN_TO_SEND_MESSAGE);
      linkEvents(BLKMGR_CTRL_BROADCAST, CTRL_SECMGR_SIGN_TO_BROADCAST);
      linkEvents(BIZMGR_CTRL_NEW_BIZ, CTRL_TRXMGR_CREATE_TRX);
      linkEvents(TERMMGR_CTRL_SET_CONF, CTRL_BIZMGR_SET_CONF);
      linkEvents(TERMMGR_CTRL_CREATE_TRX, CTRL_BIZMGR_CREATE_TRX);
      linkEvents(TERMMGR_CTRL_START, CTRL_NTKMGR_ASK_REGISTER);
      linkEvents(TERMMGR_CTRL_START, CTRL_BIZMGR_START);
      linkEvents(TERMMGR_CTRL_START, CTRL_CSNMGR_START);
      linkEvents(TERMMGR_CTRL_START, CTRL_BLKMGR_LAUNCH);
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

function linkEvents(source, target) {
  bus.eventBus.on(source, (data) => bus.eventBus.sendEvent(target, data));
}

module.exports = Controller;
