
var Token = require('cst').Token;
var types = require('cst').types;

var removeComma = require('./util').removeComma;
var removeWhiteSpace = require('./util').removeWhiteSpace;

/**
 * Create CST object expression
 *
 * @params {Object} obj - key/value source object
 * @params {Object}  [opts] - key/value source object
 * @params {Boolean} [opts.objectKeysOnNewLine] - false -> {1:1, 2:2} /true -> {1:1,\n2:2}
 * @params {Boolean} [opts.paddingNewLinesInObjects] - false -> {1:1} /true -> {\n1:1\n}
 * @params {Boolean} [opts.spaceBeforeObjectValues=true] - true -> {1: 1} / false -> {1:1}
 * @params {Boolean} [opts.spaceAfterObjectKeys] - true -> {1 :1}/ false - {1:1}
 * @params {Boolean} [opts.spacesInsideObjectBrackets] - { 1:1 } / {1:1}
 * @params {Boolean} [opts.multiLine] objectKeysOnNewLine=true && paddingNewLinesInObjects=true
 * @returns {ArrayExpression}
 */

function createObject(obj, opts) {

    if (!obj || typeof obj !== 'object') {
        throw new Error('provide obj');
    }
    opts || (opts = {});
    if (opts.spaceBeforeObjectValues !== false) {
        opts.spaceBeforeObjectValues = true;
    }
    if (opts.multiLine) {
        // some sugar
        opts.objectKeysOnNewLine = true;
        opts.paddingNewLinesInObjects = true;
    }

    var arr = [];
    var keys = Object.keys(obj);
    var stripUndefined = function(und) {
        return Boolean(und);
    };

    arr.push(new Token('Punctuator', '{'));
    opts.spacesInsideObjectBrackets && arr.push(new Token('Whitespace', ' '));
    opts.paddingNewLinesInObjects && arr.push(new Token('Whitespace', '\n'));
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (i > 0) {
            arr.push(new Token('Punctuator', ','));
            opts.objectKeysOnNewLine ?
                arr.push(new Token('Whitespace', '\n')) :
                arr.push(new Token('Whitespace', ' '));
        }
        arr.push(new types.ObjectProperty([
            new types.Identifier([new Token('Identifier', key)]),
            opts.spaceAfterObjectKeys && new Token('Whitespace', ' '),
            new Token('Punctuator', ':'),
            opts.spaceBeforeObjectValues && new Token('Whitespace', ' '),
            obj[key]
        ].filter(stripUndefined)
        ));
    }
    opts.paddingNewLinesInObjects && arr.push(new Token('Whitespace', '\n'));
    opts.spacesInsideObjectBrackets && arr.push(new Token('Whitespace', ' '));
    arr.push(new Token('Punctuator', '}'));

    return new types.ObjectExpression(arr);
}

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
module.exports.createObject = createObject;
