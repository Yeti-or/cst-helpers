var Token = require('cst').Token;

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

/**
 * wrap StringLiteral to double or singleQuote
 *
 * @params {StringLiteral} string
 * @params {String} [quote] - '"' | '\''
 * @returns {StringLiteral}
 */
function wrapStringLiteralToQuotes(string, quote) {
    if (string.type === 'StringLiteral') {
        var token = string.childElements[0];
        var quotedToken = Token.createFromToken({
            type: 'String',
            value: token.value,
            sourceCode: quote + token.value + quote
        });
        string.replaceChild(quotedToken, token);
    }
    return string;
}

module.exports = {
    removeComma: removeComma,
    removeWhiteSpace: removeWhiteSpace,
    wrapStringLiteralToQuotes: wrapStringLiteralToQuotes
};
