var bus = require('../bus/bus.js'),
statisticClass = require('../../utils/objects/statistic.js'),
statistic, startDate;


function StatisticsManager() {
    startDate = Date.now().toString();
    statistic = new statisticClass();

    bus.eventBus.on(TRXMGR_STATMGR_ADD_TRX, function () {  statistic.totalTrxCurrent += 1 | 1; statistic.totalTrxEver+=1 |1; });

    bus.eventBus.on(CSNMGR_STATMGR_BLOCKCHAIN_INCREMENT, function () {  statistic.totalTrxCurrent = 0; statistic.totalSubBlocksCurrent = 0; statistic.chainSize +=1 |1; });

    bus.eventBus.on(BLKMGR_STATMGR_ADD_BLOCK, function() { statistic.totalSubBlocksCurrent += 1 | 1; statistic.totalSubBlocksEver +=1 |1; });
    bus.eventBus.on(NTKMGR_STATMGR_ADD_BOT, function() {statistic.netSize +=1 |1;});

     setTimeout(function () {
        sendStatistic(); }, 5 * 1000);
}

// Total available transactions + - ok
// Total seen transactions + - ok
// Time alive
// total available submitted blocks -+ ok
// toal seen submitted blocks + ok
// new transaction per second
// new submitted block per second
// current blockchain size ok


function sendStatistic() {
  var now = Date.now().toString();
  statistic.timeAlive = now-startDate;
  statistic.trxPerSecond = statistic.totalTrxEver/(statistic.timeAlive/1000);// new transaction per second
  statistic.blkPerSecond = statistic.totalTrxEver/(statistic.timeAlive/1000);// new submitted block per second
  statistic.chainSize= global.blocksMap.size;// current blockchain size
  this.netSize = global.botsMap.size; // number of bots
  
  setTimeout(function () {
     sendStatistic(); }, 10 * 1000);
}

module.exports = StatisticsManager;
