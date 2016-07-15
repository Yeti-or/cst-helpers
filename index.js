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

        arr.push(elements[i].cloneElement());
    }

    arr.push(new Token('Punctuator', ']'));

    return new types.ArrayExpression(arr);
}

module.exports.removeElementFromArray = removeElementFromArray;
module.exports.removeElementFromObject = removeElementFromObject;
module.exports.createArray = createArray;
