var cst = require('cst');
var Token = cst.Token;
var types = cst.types;
var Property = types.ObjectProperty;
var Identifier = types.Identifier;


// [1, x, 3]
// [1, x]
// [x, 1, 2]
// [x, 1]
// [1, 1, x]
// [x]

function removeComma(maybeComma, el) {
    if (maybeComma.type === 'Punctuator' && maybeComma.value === ',') {
        el.removeChild(maybeComma);
    }
}

function removeWhiteSpace(maybeWhitespace, el) {
    if (maybeWhitespace.type === 'Whitespace') {
        el.removeChild(maybeWhitespace);
    }
}

// TODO: multyline

function removeElementFromArray(el, array) {
    var length = array.elements.length;
    if (length > 1) {
        var maybeComma;
        var maybeWhitespace;
        if (array.elements[length - 1] === el) {
            removeWhiteSpace(el.previousSibling, array);
            removeComma(el.previousSibling, array);
        } else {
            removeComma(el.nextSibling, array);
            removeWhiteSpace(el.nextSibling, array);
        }
    }

    array.removeChild(el);
}

function removeElementFromObject(el, obj) {
    var length = obj.properties.length;
    if (length > 1) {
        var maybeComma;
        var maybeWhitespace;
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

module.exports.removeElementFromArray = removeElementFromArray;
module.exports.removeElementFromObject = removeElementFromObject;
