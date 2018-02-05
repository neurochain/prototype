// node --max-old-space-size=8192 enthalpy.js

var paramBots = 25000;
var paramBlocks = 4000;
var paramTrxPerBlock = 15000;

var paramTop = 3;

var arr = [];
function set() {
  var bots = [];
  for(var botsCount = 1; botsCount <paramBots; botsCount++){
    bots.push(botsCount);
  }
  for(var i= 0; i<paramBlocks; i++) {
      var block ={};
      block.blockId = i;
      block.content =[];
      for(var trxCount=0; trxCount <paramTrxPerBlock; trxCount++) {
        var trx = {};
        trx.trxId = trxCount * i;
        trx.emitterId = bots[Math.floor(Math.random() * bots.length)];
        trx.receiverId = bots[Math.floor(Math.random() * bots.length)];
        while(trx.emitterId == trx.receiverId){
          trx.receiverId = bots[Math.floor(Math.random() * bots.length)];
        }
        trx.value = Math.floor(Math.random() * Math.floor(99));
        block.content.push(trx);
      }
      arr.push(block);
  }
}
set();
var top = [];
var enthalpy = {};
var start = Date.now();
//enthalpy : Somme des valeurs
var valByBotsSyBlocks = arr.map(function(obj){
  var rObj = {};
  obj.content.forEach(function(trx) {
    enthalpy[trx.emitterId] = (enthalpy[trx.emitterId] || 0) + trx.value;
  });
  return rObj;
});
var stop = Date.now();

var startSort =Date.now();
var arrE = [];
Object.entries(enthalpy).forEach(
  (entry) => {
    //console.log(arrE.length, entry);
    if (arrE.length < paramTop) {
      arrE.push(entry);
      // sort arrE
    } else {
      for (var j=0;j<arrE.length;j++) {
        if (entry[1] > arrE[j][1]) {
          arrE[j] = entry;
          // sort arrE
          return;
        }
      }
    }
  }
);
var stopSort = Date.now();

console.log("Total Transactions : "+  paramBots*paramTrxPerBlock);
console.log('enthalpy process time (ms) ' + parseInt(stop-start));
console.log('sort process time (ms) ' + parseInt(stopSort-startSort));
console.log('Top ');
for(var i = 0; i<arrE.length; i++){
  console.log(arrE[i]);
}
