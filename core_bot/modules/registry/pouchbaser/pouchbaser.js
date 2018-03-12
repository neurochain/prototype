
var bus = require('../../bus/bus.js'),
PouchDB = require('pouchdb'),
objectTypesModule = require('../../../utils/objects/objectTypes.js'),
transactionClass = require('../../../utils/objects/transaction.js'),
botClass = require('../../../utils/objects/bot.js'),
messageClass = require('../../../utils/objects/message.js'),
blockClass = require('../../../utils/objects/block'),
SHA256 = require('crypto-js/sha256');

var blockdb;
var objectdb;

function Pouchbaser(objectdbName, blockchaindbName) {

    objectdb = new PouchDB(__dirname+'/db/'+objectdbName+'_'+ global.localBot.botID);
    blockdb = new PouchDB(__dirname+'/db/'+blockchaindbName +'_'+ global.localBot.botID);

    if (global.dbSync) {
      blockdb.sync(new PouchDB(global.cfg.database.remoteServerURL + global.cfg.database.remoteBlockchainDB), { live: true })
        .catch(function (err) {
          console.log('Blockdb sync error - ' + err);
        });
    }

    bus.eventBus.on(HISTMGR_POUCHBASER_BACKUP_OBJ, function (data) { backupElement(data); });
    bus.eventBus.on(HISTMGR_POUCHBASER_BACKUP_BLK, function (data) { backupElement(data); });
}

function backupElement(data) {
  if(data==null) {
    console.log('Cannot back up object');
    return;
  }

    data.techDateStored = Date.now().toString();
    var dbToUse;

    switch (data.objectType) {
    /*    case OBJECT_TYPE_TRANSACTION:
            dbToUse = objectdb;
            data._id = SHA256(data.dateReceived + '-' + data.dateSent + '-' + data.content).toString();
            break;
        case OBJECT_TYPE_BOT:
            dbToUse = objectdb;
            data._id = SHA256(data.date_creation + '-' + data.botID).toString();
            break;*/
        case OBJECT_TYPE_MESSAGE:
            dbToUse = objectdb;
            data._id = SHA256(data.dateReceived + '-' + data.dateSent + '-' + data.content).toString();
            break;
        case OBJECT_TYPE_BLOCK:
            dbToUse = blockdb;
            data._id = SHA256(data.creator + '-' + data.previousBlockID + '-' + data.blockID + ' - ' + data.content).toString();
            break;
    }

    dbToUse.put((data), function callback(err, result) {
        if (!err) {
            logger.log('LOG_HST','Data saved in the db! ' + data.objectType);
        }
    });

    var result;
    dbToUse.get(data._id, function (err, doc) {
        if (err) {
            return logger.log('LOG_HST',err);
        } else {
            result = doc;
            logger.log('LOG_HST',doc);
        }
    });
    logger.log('LOG_HST',result);
}

function getAll(objectType) {
    var dbToUse;

    switch (objectType) {

        case OBJECT_TYPE_TRANSACTION:
            dbToUse = trxdb;

            break;
        case OBJECT_TYPE_BOT:
            dbToUse = botdb;

            break;
        case OBJECT_TYPE_MESSAGE:
            dbToUse = messagedb;

            break;
        case OBJECT_TYPE_BLOCK:
            dbToUse = blockdb;
            break;
    }

    dbToUse.allDocs({ include_docs: true, attachments: true  }).then(
       function (result) {
           logger.log('LOG_HST',result);
    }).catch(function (err) {
        logger.log('LOG_HST',err);
    });
}

module.exports = Pouchbaser;
