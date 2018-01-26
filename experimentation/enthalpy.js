var paramBots =25000;
var paramBlocks = 2000;
var paramTrxPerBlock = 10000;
var paramTop =3;

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
var enthalpy= new Map();
var start = Date.now();
// Enthalpy is sum of transaction by bots
arr.map(function(obj){
  obj.content.forEach(function(trx) {
    enthalpy.set(trx.emitterId, (enthalpy.get(trx.emitterId) || 0) + trx.value );
  });
});

var stop = Date.now();

var startSort =Date.now();
var arrE = Array.from(enthalpy);
arrE.sort(function(a, b){
  return b[1] -a[1];
});
var stopSort =Date.now();



console.log("Total Transactions : " + paramBlocks*paramTrxPerBlock);
console.log('enthalpy process time (ms) ' + parseInt(stop-start));
console.log('sort process time (ms) ' + parseInt(stopSort-startSort));
console.log('Top ' + paramTop);
for(var i = 0; i<paramTop; i++){
  console.log(arrE[i]);
}
