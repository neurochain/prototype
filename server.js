
/****************************************************************
*****************************************************************
***   _   _                       _____ _           _         ***
***  | \ | |                     / ____| |         (_)        ***
***  |  \| | ___ _   _ _ __ ___ | |    | |__   __ _ _ _ __    ***
***  | . ` |/ _ \ | | | '__/ _ \| |    | '_ \ / _` | | '_ \   ***
***  | |\  |  __/ |_| | | | (_) | |____| | | | (_| | | | | |  ***
***  |_| \_|\___|\__,_|_|  \___/ \_____|_| |_|\__,_|_|_| |_|  ***
***                                                           ***
*****************************************************************
*** Demonstrator                                              ***
***                                        by NeuroChainTech  ***
*****************************************************************/

////////////////////////////////////////////////
//////////////// EXTERNAL REQUIREMENTS
var nodeRSAModule = require('node-rsa'),
randomString = require('randomstring');

////////////////////////////////////////////////
//////////////// INTERNAL REQUIREMENTS
var H = require('./core_bot/utils/helper');

// Core bot dependencies
var bus = require('./core_bot/modules/bus/bus'),
  MinerModule = require('./core_bot/modules/miner/miner'),
  SecurityManagerModule = require('./core_bot/modules/security/securityManager'),
  Controller = require('./core_bot/modules/bus/controller'),
  CommunicationManagerModule = require('./core_bot/modules/communication/communicationManager'),
  HistoricManagerModule = require('./core_bot/modules/registry/historicManager'),
  TransactionManagerModule = require('./core_bot/modules/transaction/transactionManager'),
  BlockManagerModule = require('./core_bot/modules/block/blockManager'),
  NetworkManagerModule = require('./core_bot/modules/network/networkManager'),
  ConsensusManagerModule = require('./core_bot/modules/consensus/consensusManager');
  ConnectorManagerModule = require('./core_bot/modules/connector/connectorManager');
  StatisticsManagerModule = require('./core_bot/modules/statistic/statisticsManager');

var BotClass = require('./core_bot/utils/objects/bot'),
  cfg = require('config.json')('./botconfig.json');

//  Business implementation
var BusinessManagerModule = require('./business_impl/businessManager');

////////////////////////////////////////////////
//////////////// GET LAUNCHER PARAMETERS
var argLocalListeningPort = process.argv[3];
var argLocalSendingPort = process.argv[4];
argSeedIP = process.argv[5];
argSeedListeningPort = process.argv[6];


////////////////////////////////////////////////
//////////////// GLOBAL VARIABLES
global ={};
global.cfg=cfg;
global.transactionsMap = new Map(); // List of all transactions submitted by bots (not yet in a block) (key transactionID, value transaction)
global.botsMap = new Map(); // List of all known bots
global.blocksMap = new Map(); // List of all unchained blocks
global.tempBlocksMap = new Map(); // List of all eligible blocks
global.currentVote = new Map(); // For the current vote, it contains the list of all voting bot and their ballot
global.lastBlockId = 0; // Index of the last block validated
global.assembly = new Map(); // i build a map of bots filtered on entropy
global.electedBot = null; // i am sorting ballot, there is a winner, i store it
global.validateElectionMap = new Map(); // i am elected, i store all relative counters here
global.elected = false; // am i the elected one ?

global.httpPort = parseInt(8080); // if mono bot, use 8080. If simulation NeuroChain, increment httpPort on bot id. // TODO: set port configurable
global.httpPort = parseInt(process.argv[8]);

global.dbSync = process.argv[9] == 'true'; // Replicate ledger in CouchDB

//Generate bot private key (obviously, it will be external in production release)
var nodeRSA = new nodeRSAModule({ b: 512 });
global.PrivateKey = nodeRSA.exportKey('pkcs1-der'); //TODO pkcs1-der configurable

////////////////////////////////////////////////
//////////////// GLOBAL LOCAL BOT
// Settings all attributes of the local bot
global.localBot = new BotClass();
global.localBot.IP = argSeedIP; // TODO: set local IP in configuration
global.localBot.UDPListeningPort = argLocalListeningPort;
global.localBot.UDPSendingPort = argLocalSendingPort;

global.localBot.botID = 'BOT'+process.argv[2];
global.localBot.ConnectorUDPPort = parseInt(process.argv[7]);

global.localBot.date_creation = Date.now().toString();
global.localBot.emmitedTransaction = 0; // Count of all transactions submitted to the network, created by the local bot //TODO
global.localBot.validatedTransaction = 0;  // Count of all transactions validated by the network, created by the local bot //TODO
global.localBot.blockedTransaction = 0; // Count of all transactions added to a block, created by the local bot //TODO
global.localBot.network = 'UDP';   // TODO: UDP configurable
global.localBot.publicKey = nodeRSA.exportKey('pkcs8-public-der'); // Generate Public key of local bot  //TODO pkcs8-public-der configurable
global.localBot.entropy = randomString.generate({
    length: 2,
    charset: 'numeric'
});
global.botsMap.set(global.localBot.botID, global.localBot); //Local bot is one of the all known bots

// START LOGGER
logger = require('./core_bot/utils/logger');


////////////////////////////////////////////////
//////////////// GET ARGUMENTS
if (!argSeedIP) { argSeedIP = global.cfg.socket.ip; global.localBot.IP = global.cfg.socket.ip; }
if (!argSeedListeningPort) { argSeedListeningPort = 5000 }

logger.log(LOG_INF, '- Local Listening Port : ' + argLocalListeningPort);
logger.log(LOG_INF, '- Local Sending Port : ' + argLocalSendingPort);
logger.log(LOG_INF, '- Seed IP : ' + argSeedIP);
logger.log(LOG_INF, '- Seed Listening Port : ' + argSeedListeningPort);

////////////////////////////////////////////////
//////////////// LAUNCHING INTERNAL MODULES
var histManager = new HistoricManagerModule();
var miner = new MinerModule();
var commgr = new CommunicationManagerModule();
var secMgr = new SecurityManagerModule();
var trxMgr = new TransactionManagerModule();
var blkMgr = new BlockManagerModule();
var ntkMgr = new NetworkManagerModule();
var bizMgr = new BusinessManagerModule();
var controller = new Controller();
var csnMgr = new ConsensusManagerModule();
var cntMgr = new ConnectorManagerModule();
var statMgr = new StatisticsManagerModule();

// START BOT
bus.eventBus.sendEvent(SRV_CTRL_SET_CONF,null);
bus.eventBus.sendEvent(SRV_CTRL_START, null);
