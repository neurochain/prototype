#!/bin/bash
nodeVersion=v8.9.1
# clean old pm2 process
~/.nvm/versions/node/$nodeVersion/bin/pm2 stop all
rm -rf ~/.pm2/logs/*
~/.nvm/versions/node/$nodeVersion/bin/pm2 flush
~/.nvm/versions/node/$nodeVersion/bin/pm2 delete all

# clean old couchdb
curl -X DELETE http://127.0.0.1:5984/remoteblockchaindb
curl -X DELETE http://127.0.0.1:5984/remoteobjectdb

# clean folders
rm -rf blockchaindb_BOT*
rm -rf objectsdb_BOT*
