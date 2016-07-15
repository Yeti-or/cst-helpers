
// var Token = require('cst').Token;
// var types = require('cst').types;

var removeComma = require('./util').removeComma;
var removeWhiteSpace = require('./util').removeWhiteSpace;

function removeElementFromObject(el, obj) {
    var length = obj.properties.length;
    if (length > 1) {
        if (obj.properties[length - 1] === el) {
            removeWhiteSpace(el.previousSibling, obj);
            removeComma(el.previousSibling, obj);
        } else {
            removeComma(el.nextSibling, obj);
            removeWhiteSpace(el.nextSibling, obj);
        }
    }

    obj.removeChild(el);
}

module.exports.removeElementFromObject = removeElementFromObject;
