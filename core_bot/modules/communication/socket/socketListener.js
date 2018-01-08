
var bus = require('../../bus/bus.js'),
dgram = require('dgram'),
server = dgram.createSocket('udp4');

function SocketListener() {
    var port = global.localBot.UDPListeningPort;
    var host = global.cfg.socket.ip;

    server.on('listening', function () {
        var address = server.address();
        logger.log(LOG_COM,'UDP Server listening on ' + address.address + ':' + address.port);
    });

    server.on('message', function (socketMessage, remote) {
        logger.log(LOG_COM,'UDP received from port' + remote.port);
        bus.eventBus.sendEvent(SOCKETLISTENER_COMMGR_NEW_MESSAGE, socketMessToMessage(socketMessage));
    });
    server.bind(port, host);
}

function socketMessToMessage(socketMess) {
    logger.log(LOG_COM, 'Converting socketMessage to Message');
    var mess = JSON.parse(socketMess);
    mess.dateReceived = Date.now().toString();
    mess.latency = mess.dateReceived - mess.dateSent;
    logger.log(LOG_COM, 'Message Latency : ' + mess.latency);
    logger.log(LOG_COM, 'Message Type : ' + mess.contentType);
    logger.log(LOG_COM, mess.signature);
    return mess;
}

module.exports = SocketListener;
