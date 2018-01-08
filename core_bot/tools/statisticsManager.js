var bus = require('../modules/bus/bus.js');


function StatisticsManager() {
     bus.eventBus.on(CTRL_MINER_VALIDATE_TRX, function (message) {  doit()  });
}



function doit(){
};

module.exports = StatisticsManager;
