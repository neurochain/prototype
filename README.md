# NeuroChain

## First public version of our sandbox prototype
Take a deep look at the project [NeuroChain](https://www.neurochaintech.io/). Future of blockchains coming soon...


This sandbox permits us to test some features of our projects. Mainly about communication and consensus matters. We are currently using NodeJS to develop this prototype for quickness reason. Final version of NeuroChain will be mostly developed in C++.


Updates are coming every day.


**What is doing this program ?**


The current version shows a 4 bots environment playing a Traceability use case.

Each bot has a specific role : producer, carrier, warehouse and shop. 


Producer creates fruits and converts it into transactions.


Transactions are propagated to the other bots.


When there are enough transactions, bots create blocks.


Consensus is established between the 4 bots to decide which one is going to write in the ledger. The block is written.


When Production transactions are written into the NeuroChain, the carrier, then the warehouse, then the shop can perfom their jobs too. 


Every information is shared, approved and validated by the network.


## Run this prototype
Clone this repository then run:
```
npm install
```
For Windows environment, run: 
```
./scripts/nodesLauncher.bat 
```
For Unix environment, run: 
```
./scripts/nodesLauncher.sh
```

##
