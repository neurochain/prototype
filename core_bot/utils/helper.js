module.exports = {
mapToJson: function (map) {
        if( map==null) return '{}';
         return JSON.stringify([...map]);         
    },
jsonToMap: function (jsonStr) {
    if (jsonStr == null) return new Map();
    return new Map(JSON.parse(jsonStr));
    }
};
