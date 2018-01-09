# NeuroChain

## First public version of our sandbox prototype
Take a deep look at the project [NeuroChain](https://www.neurochaintech.io/). Future of blockchains coming soon...

This sandbox permits us to test some features of our projects. Mainly about communication and consensus matters.
Updates are coming every day.

**What is doing this program ?**


The current version shows a 4 bots environment playing a Traceability use case.

Each bot has a specific role : producer, carrier, warehouse and shop. 


Producer creates fruits and converts it into transactions.


Transactions are propagated to the other bots.


When transactions are enough, bots create blocks.


Consensus is established between the 4 bots to decide which one is going to write in the ledger. The block is written.


When Production transactions are wrote into the NeuroChain, carrier, then warehouse, then shop can perfom their jobs too. 


Every information is shared and approved and validated by the network. This is the birth of NeuroChain.

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
