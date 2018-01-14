
// BUSINESS MANAGER
 BIZMGR_CTRL_NEW_BIZ = 'BIZMGR_CTRL_NEW_BIZ';
 BLKMGR_CTRL_BROADCAST = 'BLKMGR_CTRL_BROADCAST';

// BLOCK MANAGER
 BLKMGR_CTRL_SEND_MESSAGE = 'BLKMGR_CTRL_SEND_MESSAGE';

// COMMUNICATION MANAGER
 COMMGR_CTRL_NEW_BLOCK = 'COMMGR_CTRL_NEW_BLOCK';
 COMMGR_MAILLOGGER_SEND_EMAIL = 'COMMGR_MAILLOGGER_SEND_EMAIL';
 COMMGR_SECMGR_VALIDATE_MESSAGE = 'COMMGR_SECMGR_VALIDATE_MESSAGE';
 COMMGR_SOCKETSENDER_SEND_MESSAGE = 'COMMGR_SOCKETSENDER_SEND_MESSAGE';
 SOCKETLISTENER_COMMGR_NEW_MESSAGE = 'SOCKETLISTENER_COMMGR_NEW_MESSAGE';
 COMMGR_CTRL_BACKUP_OBJECT = 'COMMGR_CTRL_BACKUP_OBJECT';

// CONSENSUS MANAGER
 CSNMGR_CTRL_BACKUP_BLOCK = 'CSNMGR_CTRL_BACKUP_BLOCK';
 CSNMGR_CTRL_BROADCAST = 'CSNMGR_CTRL_BROADCAST';
 CSNMGR_CTRL_CHECK_BLOCK = 'CSNMGR_CTRL_CHECK_BLOCK';
 CSNMGR_CTRL_CLEAN_BLOCKLIST = 'CSNMGR_CTRL_CLEAN_BLOCKLIST';
 CSNMGR_CTRL_SEND_MESSAGE = 'CSNMGR_CTRL_SEND_MESSAGE';

// CONTROLLER
 CTRL_BLKMGR_NEW_BLOCK = 'CTRL_BLKMGR_NEW_BLOCK';
 CTRL_BIZMGR_CHECK_BLOCK = 'CTRL_BIZMGR_CHECK_BLOCK';
 CTRL_BLKMGR_LAUNCH = 'CTRL_BLKMGR_LAUNCH';
 CTRL_BIZMGR_CREATE_TRX = 'CTRL_BIZMGR_CREATE_TRX';
 CTRL_BIZMGR_SET_CONF = 'CTRL_BIZMGR_SET_CONF';
 CTRL_BIZMGR_START = 'CTRL_BIZMGR_START';
 CTRL_BLKMGR_CLEAN_BLOCKLIST = 'CTRL_BLKMGR_CLEAN_BLOCKLIST';
 CTRL_BLKMGR_CHOOSE_BLOCK = 'CTRL_BLKMGR_CHOOSE_BLOCK';
 CTRL_BLKMGR_UPDATE_BLOCKS = 'CTRL_BLKMGR_UPDATE_BLOCKS';
 CTRL_BLKMGR_SHARE = 'CTRL_BLKMGR_SHARE';
 CTRL_CSNMGR_CHOSEN_BLOCK = 'CTRL_CSNMGR_CHOSEN_BLOCK';
 CTRL_CSNMGR_ELECTED = 'CTRL_CSNMGR_ELECTED';
 CTRL_CSNMGR_START = 'CTRL_CSNMGR_START';
 CTRL_HISTMGR_ADD_VALIDATED_TRX = 'CTRL_HISTMGR_ADD_VALIDATED_TRX';
 CTRL_HISTMGR_BACKUP_BLOCK = 'CTRL_HISTMGR_BACKUP_BLOCK';
 CTRL_HISTMGR_BACKUP_OBJECT = 'CTRL_HISTMGR_BACKUP_OBJECT';
 CTRL_MINER_VALIDATE_TRX = 'CTRL_MINER_VALIDATE_TRX';
 CTRL_NTKMGR_ASK_REGISTER = 'CTRL_NTKMGR_ASK_REGISTER';
 CTRL_NTKMGR_NEW_REGISTRATION_ASK = 'CTRL_NTKMGR_NEW_REGISTRATION_ASK';
 CTRL_NTKMGR_NEW_REGISTRATION_OK = 'CTRL_NTKMGR_NEW_REGISTRATION_OK';
 CTRL_SECMGR_SIGN_TO_SEND_MESSAGE = 'CTRL_SECMGR_SIGN_TO_SEND_MESSAGE';
 CTRL_SECMGR_SIGN_TO_BROADCAST = 'CTRL_SECMGR_SIGN_TO_BROADCAST';
 CTRL_TRXMGR_CREATE_TRX = 'CTRL_TRXMGR_CREATE_TRX';
 CTRL_TRXMGR_PROCESS = 'CTRL_TRXMGR_PROCESS';
 CTRL_TRXMGR_SHARE = 'CTRL_TRXMGR_SHARE';
 CTRL_TRXMGR_UPDATE_TRXS = 'CTRL_TRXMGR_UPDATE_TRXS';

// MINER
 MINER_CTRL_TRANSACTION_OK = 'MINER_CTRL_TRANSACTION_OK';

//NETWORK MANAGER
 NTKMGR_CTRL_BROADCAST = 'NTKMGR_CTRL_BROADCAST';
 NTKMGR_CTRL_SHARE_BLK = 'NTKMGR_CTRL_SHARE_BLK';
 NTKMGR_CTRL_SHARE_TRX = 'NTKMGR_CTRL_SHARE_TRX';
 NTKMGR_CTRL_SEND_MESSAGE = 'NTKMGR_CTRL_SEND_MESSAGE';

// SECURITY MANAGER
 SECMGR_COMMGR_BROADCAST_MESSAGE = 'SECMGR_COMMGR_BROADCAST_MESSAGE';
 SECMGR_COMMGR_SEND_MESSAGE = 'SECMGR_COMMGR_SEND_MESSAGE';
 SECMGR_CTRL_VALIDATED_MESSAGE = 'SECMGR_CTRL_VALIDATED_MESSAGE';

// TERMINAL MANAGER
 TERMMGR_CTRL_CREATE_TRX = 'TERMMGR_CTRL_CREATE_TRX';
 TERMMGR_CTRL_SET_CONF = 'TERMMGR_CTRL_SET_CONF';
 TERMMGR_CTRL_START = 'TERMMGR_CTRL_START';

// TRANSACTION MANAGER
 TRXMGR_CTRL_BROADCAST = 'TRXMGR_CTRL_BROADCAST';
 TRXMGR_CTRL_SEND_MESSAGE = 'TRXMGR_CTRL_SEND_MESSAGE';


// REGISTRY
 HISTMGR_POUCHBASER_BACKUP_BLK = 'HISTMGR_POUCHBASER_BACKUP_BLK';
 HISTMGR_POUCHBASER_BACKUP_OBJ = 'HISTMGR_POUCHBASER_BACKUP_OBJ';

 // ERROR EVENT
 function NotificationsTypes() { };

 module.exports = NotificationsTypes;