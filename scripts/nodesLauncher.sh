#!/bin/bash
localListeningPort=12345
localSendingPort=5000
seedPort=12345
changeSeedPort=0
seedIP=127.0.0.1
numberOfNodes=4
botid=1
nodeVersion=v8.4.0
mode=LocalChain

# Server.js has 5 parameters
# 1. Bot ID
# 2. localListeningPort
# 3. localSendingPort
# 4. SeedIP [OPT]
# 5. SeedListeningPort [OPT]

# starting first node
echo "$botid $localListeningPort $localSendingPort"
pm2 start server.js --name botchain-dev-$botid -- $mode $botid $localListeningPort $localSendingPort
numberOfNodes=$(($numberOfNodes-1))

timeout () {
  if [ $numberOfNodes -ne 0 ]; then
		numberOfNodes=$(($numberOfNodes-1))
		echo "number of nodes = $numberOfNodes"
		changeSeedPort=$(($changeSeedPort+1))
		if [ $changeSeedPort -eq 6 ]; then
			seedPort=$(($seedPort+1))
			changeSeedPort=0
		fi
		botid=$(($botid+1))
		localListeningPort=$(($localListeningPort+1))
		localSendingPort=$(($localSendingPort+1))
		echo "$botid $localListeningPort $localSendingPort $seedIP $seedPort"
		pm2 start server.js --name botchain-dev-$botid -- $mode $botid $localListeningPort $localSendingPort $seedIP $seedPort
		timeout
	fi
}

# starting other node recursively
timeout
exit 0
