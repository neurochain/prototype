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
LOG_INF = 'LOG_INF';

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

logger.log = function (domain, message) {

    if (typeof message !== 'string') {
      message = JSON.stringify(message);
    }
    var lo = new logClass();
    lo.botId = global.localBot.botID;
    lo.timestamp=Date.now();
    lo.message=message;
    lo.domain=domain;
    emitlog(JSON.stringify(lo));

};

logger.logStat = function (statistic) {
        emitlog(JSON.stringify(statistic));
};

function emitlog(message) {
    if (localSocket != null)
        localSocket.emit('message', message);
    else
        oldMessages.push(message);

       //console.log(message);
}
