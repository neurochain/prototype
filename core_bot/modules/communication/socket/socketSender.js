var bus = require('../../bus/bus.js'),
dgram = require('dgram');

function SocketSender() {
     bus.eventBus.on(COMMGR_SOCKETSENDER_SEND_MESSAGE, function (message) {sendMessage(messageToSocketMess(message)); });
}

function messageToSocketMess(message) {
    logger.log(LOG_COM, 'Converting Message ' + message.contentType + ' to socketMessage');
    message.dateSent = Date.now().toString();
    message.channel = 'SOCKET';
    return {
        host: message.receiver.IP,
        port: message.receiver.UDPListeningPort,
        localport: message.emetter.UDPSendingPort,
        message: new Buffer.from(JSON.stringify(message))
    };
}

function sendMessage(socketMess) {
    var port = socketMess.port;
    var host = socketMess.host;
    var localport = socketMess.localport;
    var message = socketMess.message;

    if (port == null || host == null || localport == null) {
        logger.log(LOG_COM, 'Cannnot send socketmessage, data is missing');
        return;
    }

    var client = dgram.createSocket({ type: 'udp4', reuseAddr: true });
    client.bind(localport);
    client.send(message, 0, message.length, port, host, function (err, bytes) {
        if (err) throw err;
        logger.log(LOG_COM,'UDP message sent to ' + host + ':' + port);
    });

}

module.exports = SocketSender;
