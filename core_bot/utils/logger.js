var bus = require('../modules/bus/bus.js'),
logClass = require('./objects/log.js'),
fs = require('fs'),
http = require('http');

LOG_CSN = 'LOG_CSN';
LOG_TRX = 'LOG_TRX';
LOG_BLK = 'LOG_BLK';
LOG_REG = 'LOG_REG';
LOG_COM = 'LOG_COM';
LOG_BIZ = 'LOG_BIZ';
LOG_SEC = 'LOG_SEC';
LOG_HST = 'LOG_HST';
LOG_CON = 'LOG_CON';

var oldMessages = [];
var localSocket = null;
var server = http.createServer(function (req, res) {
    fs.readFile('./index.html', 'utf-8', function (error, content) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content.replace('8080', global.httpPort));
    });
});

server.listen(global.httpPort);

var logger = exports;

var io = require('socket.io').listen(server);
io.sockets.on('connection', function (socket) {
    localSocket = socket;
    oldMessages.forEach(function (value) {
       emitlog(value);
    });
  });

logger.log = function (level, message) {
    if (level == 'info' || level == LOG_TRX  || level == LOG_REG ||  level == LOG_CSN){
        if (typeof message !== 'string') {
            message = JSON.stringify(message);
        }
       var lo = new logClass();
       lo.botId = global.localBot.botID;
       lo.timestamp=Date.now();
       lo.message=message;

        emitlog(JSON.stringify(lo));
    }
};

logger.logStat = function (statistic) {
        emitlog(JSON.stringify(statistic));
};

function emitlog(message) {
    if (localSocket != null)
        localSocket.emit('message', message);
    else
        oldMessages.push(message);
}

setTimeout(function () { globalLogs(); }, 15000);
function globalLogs() {
    try {
        logger.log(LOG_BIZ, '---------------------------- \n| tmpblocks ' + global.tempBlocksMap.size + '\n| trx ' + global.transactionsMap.size + '\n| LastBlockId ' + global.lastBlockId + '\n| Blocks ' + global.blocksMap.size + '\n| Bots ' + global.botsMap.size + '\n----------------------------');
    }
    catch (e) { }
    setTimeout(function () { globalLogs(); }, 15000);
}
