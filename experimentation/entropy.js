
var paramBots =25000;
var paramBlocks = 2000;
var paramTrxPerBlock = 10000;
var paramTop =3;

// Creating samples of blocks and transactions
var arr = [];

function set() {
  var bots = [];
  for (var botsCount = 1; botsCount < paramBots; botsCount++) {
    bots.push(botsCount);
  }
  for (var i = 0; i < paramBlocks; i++) {
    var block = {};
    block.blockId = i;
    block.content = [];
    for (var trxCount = 0; trxCount < paramTrxPerBlock; trxCount++) {
      var trx = {};
      trx.trxId = trxCount * i;
      trx.emitterId = bots[Math.floor(Math.random() * bots.length)];
      trx.receiverId = bots[Math.floor(Math.random() * bots.length)];
      while (trx.emitterId == trx.receiverId) {
        trx.receiverId = bots[Math.floor(Math.random() * bots.length)];
      }
      trx.value = Math.floor(Math.random() * Math.floor(99));
      block.content.push(trx);
    }
    arr.push(block);
  }
}
set();

//  Calculating Entropy
var top = [];
var exchByBot = new Map();
var sumByBot = new Map();
var start = Date.now();
//entropy : number of transactions by tuple (botA;botB)
var mapper = arr.map(function(obj) {
  obj.content.forEach(function(trx) {
    if (exchByBot.has(trx.emitterId)) {
      var botmap = exchByBot.get(trx.emitterId) ;
      if (botmap.has(trx.receiverId)) {
        botmap.set(trx.receiverId, botmap.get(trx.receiverId) + 1);
      } else {
        botmap.set(trx.receiverId, 1);
      }
    } else {
      exchByBot.set(trx.emitterId, new Map().set(trx.receiverId, 1));
    }
    sumByBot.set(trx.emitterId, sumByBot.get(trx.emitterId) + 1 || 1);
  });
});

var entropy = new Map();
exchByBot.forEach(function(botExch, keyE) {
  var currentBotSum = sumByBot.get(keyE);
  botExch.forEach(function(value) {
    // pi * log 1/pi
    var ent = (value / currentBotSum) * Math.log10(1 / (value / currentBotSum));
    entropy.set(keyE, entropy.get(keyE) + ent || ent);
  });
});
var stop = Date.now();

var startSort = Date.now();
var arrE = Array.from(entropy);
arrE.sort(function(a, b) {
  return b[1] - a[1];
});
var stopSort = Date.now();

console.log("Total Transactions : " + paramBlocks*paramTrxPerBlock);
console.log('Entropy process time (ms) ' + parseInt(stop - start));
for (var i = 0; i < paramTop; i++) {
  console.log(arrE[i]);
}
