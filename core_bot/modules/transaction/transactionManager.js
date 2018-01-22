
var bus = require('../bus/bus.js'),
H = require('../../utils/helper'),
randomString = require('randomstring'),
messageClass = require('../../utils/objects/message.js'),
transactionClass = require('../../utils/objects/transaction.js');

/// TRANSACTION MANAGER
// This module handles all trasactions matters.
// A transaction contains a business information. When a business information is generated, a transaction is created.
// Transaction is send to the network. Each bot validates received transactions then propagates transactions to the network.

function TransactionManager() {
    logger.log('info', 'Transaction Manager subscribing events');
     bus.eventBus.on(CTRL_TRXMGR_PROCESS, function (message) { processTransaction(message); });
     bus.eventBus.on(CTRL_TRXMGR_SHARE, function (bot) { shareTransactions(bot); });
     bus.eventBus.on(CTRL_TRXMGR_UPDATE_TRXS, function (message) { updateTransactions(message); });
     bus.eventBus.on(CTRL_TRXMGR_CREATE_TRX, function (bizObject) { createTransaction(bizObject); });
}

// CreateTransaction
// A transaction is created from a business object.
// A message is created to transport the transaction.
//
function createTransaction(bizObject) {
    // Generate random id
    var trId = randomString.generate({ length: 8, charset: 'alphanumeric' });
    // Create transaction
    var transac = new transactionClass();
    transac.originBot = global.localBot;
    transac.id = trId;
    transac.creationDate = Date.now();
    transac.content = bizObject;
    logger.log(LOG_TRX, 'Transaction ' + trId + ' created : ' + JSON.stringify(transac.content));// TODO : configure text

    //Create Message
    var transacMessage = new messageClass();
    transacMessage.emetter = global.localBot;
    transacMessage.channel = 'UDP';
    transacMessage.content = transac;
    transacMessage.contentType = MESSAGE_NEW_TRX;
    // Send message
    bus.eventBus.sendEvent(TRXMGR_CTRL_BROADCAST, transacMessage);
}

//LaunchRandomTransaction
// not use since business manager
/*
function launchRandomTransaction() {
    logger.log(LOG_TRX, 'Launch Random Transaction');

    var delay = randomString.generate({
        length: 1,
        charset: 'numeric'
    });

    var trId = randomString.generate({
        length: 8,
        charset: 'alphanumeric'
    });

    logger.log(LOG_TRX, ' Transaction coming in ' + delay + ' s');
    setTimeout(function () {
        var transacMessage = new messageClass();
        transacMessage.emetter = global.localBot;
        transacMessage.channel = 'UDP';
        transacMessage.contentType = MESSAGE_NEW_TRX;
        var transac = new transactionClass();
        transac.id = trId;
        // TRANSACTION BASIC
        // transac.content = 'Transaction ID : ' + trId + ' from ' + global.localBot.botID;
        // TRANSACTION ADVANCED : using bot actvitity

        transac.content = 'Transaction ID : ' + trId + ' from ' + global.localBot.botID;
        logger.log(LOG_TRX, 'Transaction created : ' + transac.content);
        transacMessage.content = transac;
        bus.eventBus.sendEvent(TRXMGR_CTRL_BROADCAST, transacMessage);

        launchRandomTransaction();
    }, delay * 1000)
}
*/

// Process Transaction
// When a message containing a transaction is received, transaction is added to the list of available transactions
function processTransaction(message) {

    if (global.transactionsMap.get(message.content.id) != null) {
        // Transaction already exists
        logger.log(LOG_TRX, 'Transaction  ' + message.content.id + ' already in memory. Currently ' + global.transactionsMap.size + ' in memory'); // TODO configure text
    }
    else {
        // Transaction does not exist, add it then propagate it
        global.transactionsMap.set(message.content.id, message.content);
        logger.log(LOG_TRX, 'Transaction  ' + message.content.id + ' added. Currently ' + global.transactionsMap.size + ' in memory'); // TODO configure text
        bus.eventBus.sendEvent(TRXMGR_CTRL_BROADCAST, message);
    }
}

// shareTransactions
// When a bot need an update, this function is called to send to this particular bot all knowned transactions.
function shareTransactions(bot) {
    //Create message
    var transacMessage = new messageClass();
    transacMessage.emetter = global.localBot;
    transacMessage.channel = 'UDP';
    // Insert transactions list into the message
    transacMessage.content = H.mapToJson(global.transactionsMap);
    transacMessage.contentType = MESSAGE_UDPATE_TRX;
    logger.log(LOG_TRX, 'Sharing ' + global.transactionsMap.size + ' transactions with bot' + bot.botID);
    transacMessage.receiver = bot;
    // send the message
    bus.eventBus.sendEvent(TRXMGR_CTRL_SEND_MESSAGE, transacMessage);
}

// UpdateTransactions
// when the localbot ask for an update of the list of transactions, it receives the list in a message from another bot
//this function get the list and save it
function updateTransactions(message) {

    var newTrxsMap = H.jsonToMap(message.content);

    logger.log(LOG_TRX, 'Received ' + newTrxsMap.size + ' transactions from bot ' + message.emetter.botID);// TODO configure text
    newTrxsMap.forEach(function (value, key) {
        if (global.transactionsMap.get(key) != null) {
            // do not save known transactions
            logger.log(LOG_TRX, 'Transaction  ' + key + ' already in memory. Currently ' + global.transactionsMap.size + ' in memory');// TODO configure text
        }
        else {
            // save transactions
            global.transactionsMap.set(key, value);
            logger.log(LOG_TRX, 'Transaction ' + key + ' added. Currently ' + global.transactionsMap.size + ' in memory');// TODO configure text
        }
    });
    logger.log('info', 'Transactions Updated'); // TODO configure text
}

module.exports = TransactionManager;
