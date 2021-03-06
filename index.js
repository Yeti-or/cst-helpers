var array = require('./lib/array');
var object = require('./lib/object');

// Array helpers
module.exports.createArray = array.createArray;
module.exports.removeElementFromArray = array.removeElementFromArray;

// Object helpers
module.exports.createObject = object.createObject;
module.exports.createObjectFromObject = object.createObjectFromObject;
module.exports.removePropertyFromObject = object.removePropertyFromObject;
module.exports.removePropertyFromObjectByKeyName = object.removePropertyFromObjectByKeyName;
module.exports.getKeysFromObject = object.getKeysFromObject;
module.exports.getValueFromObject = object.getValueFromObject;
module.exports.getValuesFromObject = object.getValuesFromObject;
module.exports.getPropFromObject = object.getPropFromObject;
module.exports.updatePropValueFromObject = object.updatePropValueFromObject;
module.exports.updatePropKeyFromObject = object.updatePropKeyFromObject;
