
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


module.exports = {
    removeComma: removeComma,
    removeWhiteSpace: removeWhiteSpace
};
