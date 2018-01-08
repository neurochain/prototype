var bus = require('../bus/bus.js'),
nodeRSAModule = require('node-rsa'),
SHA256 = require('crypto-js/sha256');


function SecurityManager() {
     bus.eventBus.on(CTRL_SECMGR_SIGN_TO_BROADCAST, function (data) { signMessage(data, true); });
     bus.eventBus.on(COMMGR_SECMGR_VALIDATE_MESSAGE, function (data) { validateMessage(data); });
     bus.eventBus.on(CTRL_SECMGR_SIGN_TO_SEND_MESSAGE, function (message) { signMessage(message,false); });
}

function signMessage(message, broadcast) {
    logger.log(LOG_SEC, 'Sign message ');
    var privateKeyToSign = new nodeRSAModule();
    privateKeyToSign.importKey(global.PrivateKey, 'pkcs1-der'); //TODO pkcs1-der configurable
    var hash = SHA256(message.content);
    message.signature = privateKeyToSign.sign(hash, 'base64', 'utf8');
    message.hash = hash;
    logger.log(LOG_SEC,hash);
    logger.log(LOG_SEC,global.localBot.publicKey);
    logger.log(LOG_SEC, message.signature);

    if (broadcast)
        bus.eventBus.sendEvent(SECMGR_COMMGR_BROADCAST_MESSAGE, message);
    else {
        bus.eventBus.sendEvent(SECMGR_COMMGR_SEND_MESSAGE, message);
    }
}

function validateMessage(message) {
    logger.log(LOG_SEC, 'Authenticate message ');
    var publicKeyToVerify = new nodeRSAModule();
    var emetterPK = new Buffer.from(message.emetter.publicKey);
    logger.log(LOG_SEC,emetterPK);
    publicKeyToVerify.importKey(emetterPK, 'pkcs8-public-der');
    logger.log(LOG_SEC,message.hash);
    logger.log(LOG_SEC,message.signature);

    var is_authentic = publicKeyToVerify.verify(message.hash, message.signature, 'utf8', 'base64');

    if (is_authentic) {
        bus.eventBus.sendEvent(SECMGR_CTRL_VALIDATED_MESSAGE, message);
    }
    else {
        logger.log(LOG_SEC, 'Authentication failed');
    }
}

module.exports = SecurityManager;
