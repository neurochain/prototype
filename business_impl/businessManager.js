
var bus = require('../core_bot/modules/bus/bus'),
randomString = require('randomstring'),
H = require('../core_bot/utils/helper');


producedMap = new Map();
carriedMap = new Map();
stockedMap = new Map();
soldMap = new Map();
proposedProduction = new Map();
proposedCarriying = new Map();
proposedStock = new Map();
proposedSold = new Map();

var i = 0;

function BusinessManager() {
    logger.log('info', 'Business Manager subscribing events');
     bus.eventBus.on(CTRL_BIZMGR_CHECK_BLOCK, function (block) { checkBusiness(block); });
     bus.eventBus.on(CTRL_BIZMGR_START, function () { setTimeout(function () { createBusiness(); }, 5 * 1000);});
     bus.eventBus.on(CTRL_BIZMGR_CREATE_TRX, function (seedBiz) {
        switch (seedBiz.activity) {
            case 'production':
                createProducingBusiness(seedBiz);
                break;
            case 'carrier':
                createCarryingBusiness(seedBiz.lot);
                break;
            case 'warehouse':
                createCarryingBusiness(seedBiz.lot);
                break;
            case 'sell':
                createCarryingBusiness(seedBiz.lot);
                break;
        }
    });
   //if (global.localBot.activity == 'shop') { setTimeout(function () { createSellingBusiness(); }, 150 * 1000); }
     bus.eventBus.on(CTRL_BIZMGR_SET_CONF, function (conf) { setBusinessConf(conf); });
};

var shopVolume = new Map();

function setBusinessConf(conf) {
    if (conf == null) {
        setDefaultChainScenario();
    }
    else {
        global.localBot.activity = conf.activity;
        global.localBot.variety = conf.variety;
    }
    logger.log('info', 'Business configuration done! Bot is ' + global.localBot.activity + ' ' + global.localBot.variety);
}

function setDefaultChainScenario() {
    switch (global.localBot.botID) {
        case 'BOT1':
            setBusinessConf({ activity: 'producer', variety: 'apples' });
            break;
        case 'BOT2':
            setBusinessConf({ activity: 'carrier', variety: '' });
            break;
        case 'BOT3':
            setBusinessConf({ activity: 'warehouse', variety: '' });
            break;
        case 'BOT4':
            setBusinessConf({ activity: 'shop', variety: '' });
            break;
   }
}


proposedProduction = new Map();
proposedCarriying = new Map();
proposedStock = new Map();
proposedSold = new Map();

function createProducingBusiness(seedTrx) {
    if (i > global.cfg.businessTotalTrx ) {
        return;
    }
    i += 1;
    logger.log(LOG_BIZ, 'createProducingBusiness');
    if (global.localBot.activity != 'producer') { return null;}
     var bo = {
        lotId: randomString.generate({ length: 8, charset: 'alphanumeric' }),
        quantity: '',
        variety:'',
        gatherDate: Date.now(),
        status: 0
    };

     if (seedTrx == null) {
         // seedTrx is not set, it's an automatic generation
         var qty = randomString.generate({
             length: 3,
             charset: 'numeric'
         });
         bo.quantity = qty;
         bo.variety = global.localBot.variety;

         // do not stop the automatic generation
         var delay = randomString.generate({ length: 2, charset: 'numeric' });
         setTimeout(function () { createProducingBusiness(); }, delay * 1000);
     }
     else {
         bo.quantity = seedTrx.quantity;
         bo.variety = seedTrx.variety;
     }
     if (proposedProduction.has(bo.lotId)) {
         logger.log(LOG_BIZ, 'Lot : ' + bo.lotId + ' already proposed');
         return;
     }
     proposedProduction.set(bo.lotId, bo);
     logger.log(LOG_BIZ, 'Lot : ' + bo.lotId + ' - Variety : ' + bo.variety + ' - Qty : ' + bo.quantity + ' - status :  ' + bo.status);
     bus.eventBus.sendEvent(BIZMGR_CTRL_NEW_BIZ, bo);


}
function createCarryingBusiness(lot) {
    logger.log(LOG_BIZ, 'createCarryingBusiness');
    if (global.localBot.activity != 'carrier') {
        return;
    }
    var bo = {
        lotId: lot.lotId,
        quantity: lot.quantity,
        variety: lot.variety,
        gatherDate: lot.gatherDate,
        status: 1
    };

    if (proposedCarriying.has(bo.lotId)) {
        logger.log(LOG_BIZ, 'Lot : ' + bo.lotId + ' already proposed');
        return;
    }
    proposedCarriying.set(bo.lotId, bo);
    logger.log(LOG_BIZ, 'Lot : ' + bo.lotId + ' - Variety : ' + bo.variety + ' - Qty : ' + bo.quantity + ' - status :  ' + bo.status);
    bus.eventBus.sendEvent(BIZMGR_CTRL_NEW_BIZ, bo);
}
function createWarehousingBusiness(lot) {
    logger.log(LOG_BIZ, 'createWarehousingBusiness');
    if (global.localBot.activity != 'warehouse') {
        return;
    }
    var bo = {
        lotId: lot.lotId,
        quantity: lot.quantity,
        variety: lot.variety,
        gatherDate: lot.gatherDate,
        status: 2
    };
    if (proposedStock.has(bo.lotId)) {
        logger.log(LOG_BIZ, 'Lot : ' + bo.lotId + ' already proposed');
        return;
    }
    proposedStock.set(bo.lotId, bo);
    logger.log(LOG_BIZ, 'Lot : ' + bo.lotId + ' - Variety : ' + bo.variety + ' - Qty : ' + bo.quantity + ' - status :  ' + bo.status);
    bus.eventBus.sendEvent(BIZMGR_CTRL_NEW_BIZ, bo);
}
function createShoppingBusiness(lot) {
    logger.log(LOG_BIZ, 'createShoppingBusiness');
    if (global.localBot.activity != 'shop') {
        return;
    }
    var bo = {
        lotId: lot.lotId,
        quantity: lot.quantity,
        variety: lot.variety,
        gatherDate: lot.gatherDate,
        status: 3
    };
    if (proposedSold.has(bo.lotId)) {
        logger.log(LOG_BIZ, 'Lot : ' + bo.lotId + ' already proposed');
        return;
    }
    proposedSold.set(bo.lotId, bo);
    logger.log(LOG_BIZ, 'Lot : ' + bo.lotId + ' - Variety : ' + bo.variety + ' - Qty : ' + bo.quantity + ' - status :  ' + bo.status);
    bus.eventBus.sendEvent(BIZMGR_CTRL_NEW_BIZ, bo);
}
function createSellingBusiness() {
    logger.log(LOG_BIZ, 'createSellingBusiness');
    let keys = shopVolume.keys();
    var elementToSell = keys[Math.floor(Math.random() * keys.length)];
    var biz = shopVolume.get(elementToSell);
    var bo = {
        lotId: biz.lotId,
        quantity: biz.quantity,
        variety: biz.variety,
        gatherDate: biz.gatherDate,
        status: 4
    };
    logger.log(LOG_BIZ, 'Lot : ' + bo.lotId + ' - Variety : ' + bo.variety + ' - Qty : ' + bo.quantity + ' - status :  ' + bo.status);
    bus.eventBus.sendEvent(BIZMGR_CTRL_NEW_BIZ, bo);
}



function createBusiness() {
    var rand = randomString.generate({
        length: 1,
        charset: 'numeric'
    });
    if (rand > -1) {
        switch (global.localBot.activity) {
            case 'producer':
                    createProducingBusiness();
                break;
            case 'carrier':
                if (producedMap.size > 0) {
                    var keysP = Array.from(producedMap.keys());
                    var elementP = keysP[Math.floor(Math.random() * keysP.length)];
                    createCarryingBusiness(producedMap.get(elementP));
                }
                break;
            case 'warehouse':
                if (carriedMap.size > 0) {
                    let keysC = Array.from(carriedMap.keys());
                    let elementC = keysC[Math.floor(Math.random() * keysC.length)];
                    createWarehousingBusiness(carriedMap.get(elementC));
                }
                break;
            case 'shop':
                if (stockedMap.size > 0) {
                    let keysS = Array.from(stockedMap.keys());
                    let elementS = keysS[Math.floor(Math.random() * keysS.length)];
                    createShoppingBusiness(stockedMap.get(elementS));
                }
                break;
        }
    }
    setTimeout(function () { createBusiness(); }, 5 * 1000);
}

function checkBusiness(block) {
    var trxmap = H.arrayToMap(block.content);
    logger.log(LOG_BIZ, 'BEFORE');
    logger.log(LOG_BIZ, producedMap.size + ' - ' + carriedMap.size + ' - ' + stockedMap.size + ' - ' + soldMap.size);
    // switch
    // je regarde dans le block-buffer toutes les transactions qui m'intéresse
    trxmap.forEach(function (value, key) {
        switch (value.content.status) {
            case 0:  // just produced
               logger.log(LOG_BIZ,'Production lot validated in a block ' + value.content.lotId +' - '+ JSON.stringify(value.content));
               producedMap.set(value.content.lotId, value.content);
               proposedProduction.delete(value.content.lotId);
               logger.log(LOG_BIZ, producedMap.size + ' - ' + carriedMap.size + ' - ' + stockedMap.size + ' - ' + soldMap.size);
                break;
            case 1: // just carried
                logger.log(LOG_BIZ, 'Carriying lot validated in a block ' + value.content.lotId + ' - ' + JSON.stringify(value.content));
                if (producedMap.has(value.content.lotId)) {
                    logger.log(LOG_BIZ,'lot ' + value.content.lotId + 'was in produced map');
                    producedMap.delete(value.content.lotId);
                    proposedCarriying.delete(value.content.lotId);
                    carriedMap.set(value.content.lotId, value.content);
                }
                logger.log(LOG_BIZ, producedMap.size + ' - ' + carriedMap.size + ' - ' + stockedMap.size + ' - ' + soldMap.size);

                break;
            case 2: // juste warehoused
                logger.log(LOG_BIZ, 'Stocking lot validated in a block ' + value.content.lotId + ' - ' + JSON.stringify(value.content));
                if (carriedMap.has(value.content.lotId)) {
                    logger.log(LOG_BIZ,'lot ' + value.content.lotId + 'was in carried map');
                    carriedMap.delete(value.content.lotId);
                    proposedStock.delete(value.content.lotId);
                    stockedMap.set(value.content.lotId, value.content);
                }
                logger.log(LOG_BIZ, producedMap.size + ' - ' + carriedMap.size + ' - ' + stockedMap.size + ' - ' + soldMap.size);

                break;
            case 3: // just shopped
                logger.log(LOG_BIZ, 'Shoping lot validated in a block ' + value.content.lotId + ' - ' + JSON.stringify(value.content));
                if (stockedMap.has(value.content.lotId)) {
                    logger.log(LOG_BIZ,'lot ' + value.content.lotId + 'was in stocked map');
                    stockedMap.delete(value.content.lotId);
                    proposedSold.delete(value.content.lotId);
                    soldMap.set(value.content.lotId, value.content);
                }
                logger.log(LOG_BIZ, producedMap.size + ' - ' + carriedMap.size + ' - ' + stockedMap.size + ' - ' + soldMap.size);

                break;
            case 4: // just sold
                shopVolume.delete(value.content.lotId);
                logger.log(LOG_BIZ, producedMap.size + ' - ' + carriedMap.size + ' - ' + stockedMap.size + ' - ' + soldMap.size);
                break;
        }
    });
}

module.exports = BusinessManager;
