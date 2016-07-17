
var Token = require('cst').Token;
var types = require('cst').types;

var removeComma = require('./util').removeComma;
var removeWhiteSpace = require('./util').removeWhiteSpace;
var wrapStringLiteralToQuotes = require('./util').wrapStringLiteralToQuotes;

// var toSingleQuotes = require('to-single-quotes');
// var toDoubleQuotes = require('to-double-quotes');

var stripUndefined = function(und) {
    return Boolean(und);
};

/**
 * Create CST object expression
 *
 * @params {Map} obj - key/value source object
 * @params {Object}  [opts] - key/value source object
 * @params {Boolean} [opts.objectKeysOnNewLine] - false -> {1:1, 2:2} /true -> {1:1,\n2:2}
 * @params {Boolean} [opts.paddingNewLinesInObjects] - false -> {1:1} /true -> {\n1:1\n}
 * @params {Boolean} [opts.spaceBeforeObjectValues=true] - true -> {1: 1} / false -> {1:1}
 * @params {Boolean} [opts.spaceAfterObjectKeys] - true -> {1 :1}/ false - {1:1}
 * @params {Boolean} [opts.spacesInsideObjectBrackets] - { 1:1 } / {1:1}
 * @params {Boolean} [opts.multiLine] objectKeysOnNewLine=true && paddingNewLinesInObjects=true
 * @params {Boolean} [opts.singleQuotes=true] use singleQuotes for StringLiterals
 * @params {Boolean} [opts.quotedKeysInObjects=false] quote all keys with suitable quote
 * @returns {ArrayExpression}
 */
function createObject(map, opts) {
    if (!map || typeof map.size !== 'number') {
        throw new Error('provide Map');
    }
    opts || (opts = {});
    if (opts.spaceBeforeObjectValues !== false) {
        opts.spaceBeforeObjectValues = true;
    }
    if (opts.singleQuotes !== false) {
        opts.singleQuotes = true;
    }
    if (opts.multiLine) {
        // some sugar
        opts.objectKeysOnNewLine = true;
        opts.paddingNewLinesInObjects = true;
    }

    var arr = [];
    arr.push(new Token('Punctuator', '{'));
    opts.spacesInsideObjectBrackets && arr.push(new Token('Whitespace', ' '));
    opts.paddingNewLinesInObjects && arr.push(new Token('Whitespace', '\n'));
    var i = 0;
    map.forEach(function(value, key) {
        wrapStringLiteralToQuotes(value, opts.singleQuotes ? '\'' : '"');

        // TODO : new types.Identifier([new Token('Identifier', key)]),
        // use Maps() here?
        var keyString = new types.StringLiteral([new Token('String', key.toString())]);
        opts.quotedKeysInObjects && wrapStringLiteralToQuotes(keyString, opts.singleQuotes ? '\'' : '"');

        if (i++ > 0) {
            arr.push(new Token('Punctuator', ','));
            opts.objectKeysOnNewLine ?
                arr.push(new Token('Whitespace', '\n')) :
                arr.push(new Token('Whitespace', ' '));
        }
        arr.push(new types.ObjectProperty([
            keyString,
            opts.spaceAfterObjectKeys && new Token('Whitespace', ' '),
            new Token('Punctuator', ':'),
            opts.spaceBeforeObjectValues && new Token('Whitespace', ' '),
            value
        ].filter(stripUndefined)
        ));
    });
    opts.paddingNewLinesInObjects && arr.push(new Token('Whitespace', '\n'));
    opts.spacesInsideObjectBrackets && arr.push(new Token('Whitespace', ' '));
    arr.push(new Token('Punctuator', '}'));

    return new types.ObjectExpression(arr);
}

/**
 * Get all keys values from object
 *
 * @params {ObjectExpression} obj
 * @returns {Array}
 */
function getKeysFromObject(obj) {
    return obj.properties
            .map(function(prop) { var k = prop.key; return k.value ? k.value : k.name; });
}

/**
 * Get all prop.values raw values from object
 *
 * @params {ObjectExpression} obj
 * @returns {Array}
 */
function getValuesFromObject(obj) {
    return obj.properties
            .map(function(prop) { var v = prop.value; return (v.value || v.value === false) ? v.value : v.name; });
}

/**
 * Find property of object expression by it's key name
 *
 * @params {ObjectExpression} obj
 * @params {String}  keyName
 * @returns {ObjectProperty | null}
 */
function getPropFromObjectByKeyName(obj, keyName) {
    var props = obj.properties;
    for (var i = 0; i < props.length; i++) {
        var prop = props[i];
        if (prop.key.value === keyName.toString()) {
            return prop;
        }
    }
    return null;
}

// TODO : tests
function removeElementFromObject(obj, el) {
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
module.exports.getKeysFromObject = getKeysFromObject;
module.exports.getValuesFromObject = getValuesFromObject;
module.exports.getPropFromObjectByKeyName = getPropFromObjectByKeyName;
