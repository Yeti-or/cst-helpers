
var Token = require('cst').Token;
var types = require('cst').types;

var removeComma = require('./util').removeComma;
var removeWhiteSpace = require('./util').removeWhiteSpace;

function createArray(elements, whiteSpaces) {

    if (!elements || !Array.isArray(elements)) {
        throw new Error('provide array of elements');
    }

    var arr = [];
    arr.push(new Token('Punctuator', '['));

    for (var i = 0; i < elements.length; i++) {
        if (i > 0) {
            arr.push(new Token('Punctuator', ','));
            whiteSpaces && arr.push(new Token('Whitespace', ' '));
        }

        arr.push(elements[i]);
    }

    arr.push(new Token('Punctuator', ']'));

    return new types.ArrayExpression(arr);
}

// [1, x, 3]
// [1, x]
// [x, 1, 2]
// [x, 1]
// [1, 1, x]
// [x]

// TODO: multyline

function removeElementFromArray(array, el) {
    var length = array.elements.length;
    if (length > 1) {
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

module.exports.removeElementFromArray = removeElementFromArray;
module.exports.createArray = createArray;
