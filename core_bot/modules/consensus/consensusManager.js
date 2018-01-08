var bus = require('../bus/bus.js'),
  H = require('../../utils/helper'),
  messageClass = require('../../utils/objects/message.js');

// CONSENSUS MANAGER
// This module contains the automatic intelligence of the distributed system
// the main difficulty is to get consensus.
// NeuroChain consensus is based on an electoring system with great electors
// TODO :add entropy calculation
function ConsensusManager() {
  bus.eventBus.on(CTRL_CSNMGR_ELECTED, function(message) {
    processElected(message);
  });
  bus.eventBus.on(CTRL_CSNMGR_CHOSEN_BLOCK, function(message) {
    processChosenBlock(message);
  });
  bus.eventBus.on(CTRL_CSNMGR_START, function() {
    setTimeout(function() {
      createAssembly();
    }, 80 * 1000); // TODO : configure timer
    setTimeout(function() {
      selectWriter();
    }, 110 * 1000); // TODO : configure timer
  });
}

// createAssembly
// From the list of bots, this function create a list of great electors.
// this list contains the bots having the biggest entropy
// Entropy is calculated by and for all bots every X blocks.
function createAssembly() {
  // The list of elector is not empty, a vote is running. Stop.
  if (global.assembly != null && global.assembly.size != 0) {
    logger.log(LOG_CSN, 'Can not create assembly now, a block writing is running '); // TODO : configure text
    return;
  }
  // Sort bots by entropy
  var botsByEntropy = Array.from(global.botsMap.values());
  logger.log(LOG_CSN, 'Number of bots :' + botsByEntropy.length); // TODO : configure text
  botsByEntropy.sort(function(a, b) {
    return b.entropy - a.entropy;
  });

  // Select a limited number of bots, depending on their entropy
  var limit = botsByEntropy.length * 60 / 100; // TODO : configure threshold
  for (var i = 0; i < limit; i++) {
    logger.log(LOG_CSN, botsByEntropy[i].botID + ' ' + botsByEntropy[i].entropy); // TODO : configure text
    global.assembly.set(botsByEntropy[i].botID, global.botsMap.get(botsByEntropy[i].botID));
  }
}

// SelectWriter
// Every bots of the assembly will run this function and determine the bot that have the write into the blockcain
function selectWriter() {
  // if an assembly exists
  if (global.assembly == null || global.assembly.size == 0) {
    logger.log(LOG_CSN, 'No assembly defined yet'); //TODO: configure text
    return;
  }
  // A bot can vote only if it is one of the great electors
  if (global.assembly.get(global.localBot.botID) == null) {
    logger.log(LOG_CSN, 'Not selected to be in the assembly'); //TODO: configure text
    return;
  }

  logger.log(LOG_CSN, 'Starting writer selection'); //TODO: configure text
  var electorArray = Array.from(global.assembly.keys());
  electorArray.sort();

  // Each bot contains the same function determining from a list, what bot is elected. the seed function.
  // so normally, if all the distributed system is up to date, every bots will vote for the same bot.
  // the frist seed parameter is the sum of entropy of all bots in the assembly (ones that have maximum entropy)
  // the second seed parameter is a value between 0 and 1 wrote in the last block
  // Let's reate a vector with bots id in the assembly with X occurences (where X is the entropy of the bot)
  // more the entropy of the bot is, more the id of the is present in the vector
  var randomBySeed = parseInt(0);
  var weightedEntropyVector = [];
  global.assembly.forEach(function(value, key) {
    randomBySeed += parseInt(value.entropy);
    for (var i = 0; i < value.entropy; i++) {
      weightedEntropyVector.push(key);
    }
  });

  logger.log(LOG_CSN, 'Entropy sum :' + randomBySeed);
  logger.log(LOG_CSN, 'Seed Vector size :' + weightedEntropyVector.length);

  // Get the second seed param
  var randomFromBlock = 0;
  if (global.blocksMap.size > 0) {
    randomFromBlock = global.blocksMap.get(global.lastBlockId).randomValue;
  } else { //in out demonstrator, we do not manage genesis block yet
    randomFromBlock = 0.17;
  }
  // Fetch in elector array the bot with id <randomBySeed>
  var indexToFind = Math.floor(parseInt(randomBySeed) * randomFromBlock);
  var selectedBotId = weightedEntropyVector[indexToFind];
  logger.log(LOG_CSN, 'Selected bot id :' + selectedBotId);

  global.electedBot = global.assembly.get(selectedBotId);
  // Writer bot is selected. If local bot is the writer, go. if not, wait for the writer bot to send a block.
  if (selectedBotId == global.localBot.botID) {
    logger.log(LOG_CSN, 'I am THE bot ! Let\'s choose a block to write');
    bus.eventBus.sendEvent(CTRL_BLKMGR_CHOOSE_BLOCK, '');
  }
}

// ProcessChosenBlock
// When a block is chosen by the elected bot, it has to be aded to the blockchain.
function processChosenBlock(message) {

  // Because everything happened everytime in a distributed system, Check if another block has not been written in the blockchain
  if (global.blocksMap.get(message.content.block.blockID) != null) {
    logger.log(LOG_CSN, 'Block ' + message.content.block.generationID + ' created by ' + message.content.block.creator.botID + ' is now to old'); // TODO : configure text
    return;
  }

  // check if the sender is the elected one
  if (global.electedBot != null && global.electedBot.botID != message.content.electedBot.botID) {
    logger.log(LOG_CSN, 'Chosen block has not been sent by the elected bot (elected' + global.electedBot.botID + '  - sender ' + message.content.electedBot.botID + ')');
  }
  var trxsOK = true;
  // Let's validate once again all transactions contained in the block
  var trxFromBlock = H.jsonToMap(message.content.block.content);
  logger.log(LOG_CSN, 'Block ' + message.content.block.generationID + ' validation'); // TODO : configure text
  trxFromBlock.forEach(function(value, key) {
    if (trxsOK) {
      if (global.transactionsMap.get(key) == null) {
        trxsOK = false;
        logger.log('block', message.content.block.generationID + ': is trx ' + key + ' in my list ?  ---> NO'); // TODO : configure text
      } else {
        logger.log('block', message.content.block.generationID + ': is trx ' + key + ' in my list ?  ---> YES'); // TODO : configure text
      }
    }
  });
  if (!trxsOK) {
    //The block is not valid. Delete it and do not propagate the mesage.
    logger.log('block', 'Block ' + message.content.block.generationID + ' is not valid. Cannot add it to the blockchain'); // TODO : configure text
    if (global.tempBlocksMap.has(message.content.block.generationID)) {
      global.tempBlocksMap.delete(message.content.block.generationID);
    }
    return;
  } else {
    // Block is valid
    logger.log(LOG_CSN, 'Block ' + message.content.block.generationID + ' is valid'); // TODO : configure text
    // 1. deleting blocks
    var tmpBlockMapSize = global.tempBlocksMap.size;
    global.tempBlocksMap = new Map();
    logger.log(LOG_CSN, 'Deleting blocks from pool (' + tmpBlockMapSize + ' -> ' + global.tempBlocksMap.size + ')'); // TODO : configure text
    // 2. deleting transactions
    var tmpTrxSize = global.transactionsMap.size;
    trxFromBlock.forEach(function(value, key) {
      value.lastBlockID = global.lastBlockId;
      global.transactionsMap.delete(key);
    });
    logger.log('info', 'Deleting transactions from pool ( ' + tmpTrxSize + ' -> ' + global.transactionsMap.size + ')'); // TODO : configure text
    // 3. Resetting vote environement
    global.currentVote = new Map();
    global.elected = false;
    global.electedBot = null;
    global.validateElectionMap = new Map();
    global.currentVote = new Map();
    logger.log(LOG_CSN, 'Resetting Vote '); // TODO : configure text
    // 4.writing block
    global.lastBlockId += 1;
    message.content.block.blockID = global.lastBlockId;
    global.blocksMap.set(message.content.block.blockID, message.content.block);
    logger.log(LOG_CSN, 'Block ' + message.content.block.generationID + ' added');
    // 5. popagate the original message
    message.emetter = global.localBot;
    bus.eventBus.sendEvent(CSNMGR_CTRL_BACKUP_BLOCK, message.content.block);
    bus.eventBus.sendEvent(CSNMGR_CTRL_BROADCAST, message);
    bus.eventBus.sendEvent(CSNMGR_CTRL_CLEAN_BLOCKLIST, '');
    bus.eventBus.sendEvent(CSNMGR_CTRL_CHECK_BLOCK, message.content.block);
    // 6. Select a new writer  in X seconds
    setTimeout(function() {
      selectWriter();
    }, 8 * 1000); // TODO : configure timer

    // 7. Create a new assembly every X blocks
    if (global.lastBlockId % 5 == 0) {
      createAssembly();
    }
  }
}

module.exports = ConsensusManager;
