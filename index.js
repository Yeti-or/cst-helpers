var array = require('./lib/array');
var object = require('./lib/object');

// Array helpers
module.exports.createArray = array.createArray;
module.exports.removeElementFromArray = array.removeElementFromArray;

// Object helpers
module.exports.createObject = object.createObject;
module.exports.removePropertyFromObject = object.removePropertyFromObject;
module.exports.removePropertyFromObjectByKeyName = object.removePropertyFromObjectByKeyName;
module.exports.getKeysFromObject = object.getKeysFromObject;
module.exports.getValuesFromObject = object.getValuesFromObject;
module.exports.getPropFromObjectByKeyName = object.getPropFromObjectByKeyName;
