var bus = require('../modules/bus/bus.js'),
statisticClass = require('../../utils/objects/statistic.js');


function StatisticsManager() {
    var startDate = Date.now();
    var statistic = new statisticClass();

     bus.eventBus.on(TRXMGR_STATMGR_ADD_TRX, function () {  statistic.totalTrxCurrent += 1; statistic.totalTrxEver+=1; });
     bus.eventBus.on(CSNMGR_STATMGR_BLOCKCHAIN_INCREMENT, function () {  statistic.totalTrxCurrent = 0; statistic.totalSubBlocksCurrent = 0; statistic.chainSize +=1; });
     bus.eventBus.on(BLKMGR_STATMGR_ADD_BLOCK, function() { statistic.totalSubBlocksCurrent += 1; statistic.totalSubBlocksEver +=1; });
     bus.eventBus.on(NTKMGR_STATMGR_ADD_BOT, function() {statistic.netSize +=1;});

     setTimeout(function () { sendStatitistic(); }, 5 * 1000);

}

// Total available transactions + - ok
// Total seen transactions + - ok
// Time alive
// total available submitted blocks -+ ok
// toal seen submitted blocks + ok
// new transaction per second
// new submitted block per second
// current blockchain size ok


function sendStatitistic() {
  statistic.timeAlive = Date.now()-startDate;
  statistic.trxPerSecond = Math.floor(statistic.totalTrxEver/(statistic.timeAlive/1000));// new transaction per second
  this.blkPerSecond = Math.floor(statistic.totalTrxEver/(statistic.timeAlive/1000));// new submitted block per second
  this.chainSize=0;// current blockchain size
  this.netSize = 0; // number of bots
}

module.exports = StatisticsManager;
