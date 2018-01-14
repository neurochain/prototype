
module.exports = {
mapToJson: function (map) {
        if( map==null) return '{}';
         return JSON.stringify([...map]);
    },
jsonToMap: function (jsonStr) {
    if (jsonStr == null) return new Map();
    return new Map(JSON.parse(jsonStr));
  },
arrayToMap: function(array){
  //var result = new Map(arr.map((i) => [i.id, i])); // TODO
var map = new Map();
  array.forEach(function(element) {
  map.set(element.id, element);
  console.log(element.id);
});
  return map;
  }
};
