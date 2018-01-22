
var bus = require('../../bus/bus.js'),
dgram = require('dgram'),
server = dgram.createSocket('udp4');

function ConSocketListener() {
    var port = global.localBot.ConnectorUDPPort;
    var host = global.cfg.socket.ip;

    server.on('listening', function () {
        var address = server.address();
        logger.log(LOG_CON,'Connector - UDP Server listening on port:' + address.port);
    });

    server.on('message', function (socketMessage, remote) {
        logger.log(LOG_CON,'Connector - UDP received from port' + remote.port);
        bus.eventBus.sendEvent(CNTSOCKET_CONMGR_INPUT, socketInputToInput(socketInput));
    });
    server.bind(port, host);
}

function socketInputToInput(socketInput) {
    logger.log(LOG_CON, 'Converting connector input to input');
    var input = JSON.parse(socketInput);
    logger.log(LOG_CON, 'Input Type : ' + input.inputType);
    logger.log(LOG_CON, mess.signature);
    return mess;
}

module.exports = ConSocketListener;
