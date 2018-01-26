var ot = require('./objectTypes.js');


function Statistic() {

    this.objectType = OBJECT_TYPE_STAT;
    this.totalTrxCurrent = 0;// Total available transactions
    this.totalTrxEver = 0;// Total seen transactions
    this.timeAlive = 0;// Time alive (ms)
    this.totalSubBlocksCurrent = 0;// toal available submitted blocks
    this.totalSubBlocksEver = 0;// toal seen submitted blocks
    this.trxPerSecond = 0;// new transaction per second
    this.blkPerSecond = 0;// new submitted block per second
    this.chainSize=0;// current blockchain size
    this.netSize = 0; // number of bots

}


module.exports = Statistic;
