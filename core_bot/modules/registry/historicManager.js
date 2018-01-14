
var bus = require('../bus/bus'),
pouchbaserModule = require('./pouchbaser/pouchbaser.js');

var pouchbaser;

function HistoricManager() {
    var pouchbaser = new pouchbaserModule(global.cfg.database.objects, global.cfg.database.blockchain);

     bus.eventBus.on(CTRL_HISTMGR_BACKUP_OBJECT, function (data) { backupObject(data); });
     bus.eventBus.on(CTRL_HISTMGR_BACKUP_BLOCK, function (data) { backupBlock(data); });
}

function backupObject(obj) {
    bus.eventBus.sendEvent(HISTMGR_POUCHBASER_BACKUP_OBJ, obj);
}

function backupBlock(block) {
    bus.eventBus.sendEvent(HISTMGR_POUCHBASER_BACKUP_BLK, block);
}

module.exports = HistoricManager;
