var bus = require('../bus/bus.js');

// Miner
// not developped yet, this module
function Miner() {
     bus.eventBus.on(CTRL_MINER_VALIDATE_TRX, function (message) {
        validateTransaction(message);
    });
}

function validateTransaction(message) {
    logger.log(LOG_TRX, 'transaction validated ' + message.content.id);
    bus.eventBus.sendEvent(MINER_CTRL_TRANSACTION_OK, message);
}

module.exports = Miner;
