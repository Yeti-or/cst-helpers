
var Token = require('cst').Token;
var types = require('cst').types;

var removeComma = require('./util').removeComma;
var removeWhiteSpace = require('./util').removeWhiteSpace;
var wrapStringLiteralToQuotes = require('./util').wrapStringLiteralToQuotes;

// var toSingleQuotes = require('to-single-quotes');
// var toDoubleQuotes = require('to-double-quotes');

/**
 * Create CST object expression
 *
 * @params {Map} obj - key/value source object
 * @params {Object}  [opts]
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
// TODO: {x} - Property Value Shorthands
// TODO: {[x]: ''} - Computed Property Names
// TODO: { get fuckES6() {}, set fuckES6() } - Method Definitions
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

        if (i++ > 0) {
            arr.push(new Token('Punctuator', ','));
            opts.objectKeysOnNewLine ?
                arr.push(new Token('Whitespace', '\n')) :
                arr.push(new Token('Whitespace', ' '));
        }
        arr.push(new types.ObjectProperty([
            createKey(key, opts),
            opts.spaceAfterObjectKeys && new Token('Whitespace', ' '),
            new Token('Punctuator', ':'),
            opts.spaceBeforeObjectValues && new Token('Whitespace', ' '),
            value
        ].filter(Boolean)
        ));
    });
    opts.paddingNewLinesInObjects && arr.push(new Token('Whitespace', '\n'));
    opts.spacesInsideObjectBrackets && arr.push(new Token('Whitespace', ' '));
    arr.push(new Token('Punctuator', '}'));

    return new types.ObjectExpression(arr);
}

function keyVal(propKey) {
    return propKey.name || propKey.value;
}

function createKey(keyName, opts) {
    opts || (opts = {});
    if (opts.singleQuotes !== false) {
        opts.singleQuotes = true;
    }
    // TODO: string -> Identifier if Numeric -> Numeric if quotedKeys -> StringLiteral
    var keyString = new types.StringLiteral([new Token('String', keyName.toString())]);
    opts.quotedKeysInObjects && wrapStringLiteralToQuotes(keyString, opts.singleQuotes ? '\'' : '"');
    return keyString;
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
 * Find value of object expression's property by it's key name
 *
 * @params {ObjectExpression} obj
 * @params {String}  keyName
 * @returns {*|undefined}
 */
function getValueFromObject(obj, keyName) {
    for (var i = 0; i < obj.properties.length; i++) {
        var prop = obj.properties[i];
        if (keyVal(prop.key) === keyName.toString()) {
            return prop.value;
        }
    }
}

/**
 * Find property of object expression by it's key name
 *
 * @params {ObjectExpression} obj
 * @params {String}  keyName
 * @returns {ObjectProperty | null}
 */
function getPropFromObject(obj, keyName) {
    var props = obj.properties;
    for (var i = 0; i < props.length; i++) {
        var prop = props[i];
        if (prop.key.value === keyName.toString() ||
            prop.key.name === keyName.toString()) {
            return prop;
        }
    }
    return null;
}

/**
 * Update property.value of object expression by it's key name
 *
 * @params {ObjectExpression} obj
 * @params {String}  keyName
 * @params {Object}  newValue
 * @returns {ObjectProperty | null}
 */
function updatePropValueFromObject(obj, keyName, newValue) {
    var prop = getPropFromObject(obj, keyName);
    prop && prop.replaceChild(newValue, prop.value);
    return prop;
}

/**
 * Update property.keyName of object expression by it's key name
 *
 * @params {ObjectExpression} obj
 * @params {String}  keyName
 * @params {String}  newKeyName
 * @returns {ObjectProperty | null}
 */
function updatePropKeyFromObject(obj, keyName, newKeyName) {
    var prop = getPropFromObject(obj, keyName);
    prop && prop.replaceChild(createKey(newKeyName), prop.key);
    return prop;
}

// TODO: Add props

/**
 * Remove property from object
 *
 * @params {ObjectExpression} obj
 * @params {ObjectProperty}   prop
 */
function removePropertyFromObject(obj, prop) {
    var length = obj.properties.length;
    if (length > 1) {
        if (obj.properties[length - 1] === prop) {
            removeWhiteSpace(prop.previousSibling, obj);
            removeComma(prop.previousSibling, obj);
        } else {
            removeComma(prop.nextSibling, obj);
            removeWhiteSpace(prop.nextSibling, obj);
        }
    }

    obj.removeChild(prop);
    if (!obj.properties.length) {
        obj.childElements.forEach(function(el) {
            removeWhiteSpace(el, obj);
        });
    }
}

/**
 * Remove property from object by it's keyName
 *
 * @params {ObjectExpression} obj
 * @params {String}           keyName
 */
function removePropertyFromObjectByKeyName(obj, keyName) {
    var prop = getPropFromObject(obj, keyName);
    if (prop) {
        removePropertyFromObject(obj, prop);
    }
}

module.exports.removePropertyFromObject = removePropertyFromObject;
module.exports.removePropertyFromObjectByKeyName = removePropertyFromObjectByKeyName;
module.exports.createObject = createObject;
module.exports.getKeysFromObject = getKeysFromObject;
module.exports.getValueFromObject = getValueFromObject;
module.exports.getValuesFromObject = getValuesFromObject;
module.exports.getPropFromObject = getPropFromObject;
module.exports.updatePropKeyFromObject = updatePropKeyFromObject;
module.exports.updatePropValueFromObject = updatePropValueFromObject;
