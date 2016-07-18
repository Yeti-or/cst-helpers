
var Token = require('cst').Token;
var types = require('cst').types;

var removeComma = require('./util').removeComma;
var removeWhiteSpace = require('./util').removeWhiteSpace;

/**
 * Create CST array expression
 *
 * @params {Element[]} elements - elements to put in array
 * @params {Object}  [opts]
 * @params {Boolean} [opts.spacesInsideArrayBrackets] - [ 1, 2, 3 ]
 * @params {Boolean} [opts.newlineAfterArrayElements] - [1,\n2,\n3]
 * @params {Boolean} [opts.paddingNewLinesInArray] - [\n1, 2, 3\n]
 * @params {Boolean} [opts.multiLine] newlineAfterArrayElements=true && paddingNewLinesInArray=true
 * @returns {ArrayExpression}
 */
function createArray(elements, opts) {
    if (!elements || !Array.isArray(elements)) {
        throw new Error('provide array of elements');
    }

    opts || (opts = {});
    if (opts.multiLine) {
        // some sugar
        opts.newlineAfterArrayElements = true;
        opts.paddingNewLinesInArray = true;
    }

    var arr = [];
    arr.push(new Token('Punctuator', '['));
    opts.spacesInsideArrayBrackets && arr.push(new Token('Whitespace', ' '));
    opts.paddingNewLinesInArray && arr.push(new Token('Whitespace', '\n'));

    for (var i = 0; i < elements.length; i++) {
        if (i > 0) {
            arr.push(new Token('Punctuator', ','));
            opts.newlineAfterArrayElements ?
                arr.push(new Token('Whitespace', '\n')) :
                arr.push(new Token('Whitespace', ' '));
        }
        arr.push(elements[i]);
    }

    opts.paddingNewLinesInArray && arr.push(new Token('Whitespace', '\n'));
    opts.spacesInsideArrayBrackets && arr.push(new Token('Whitespace', ' '));
    arr.push(new Token('Punctuator', ']'));

    return new types.ArrayExpression(arr);
}

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
