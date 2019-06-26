const Y = require("./y.js");

const matchOne = match => (token, patternToken) => {
    if(!token) { return false; }
    if(!patternToken) { return true; }
    if(patternToken.type === "slot") { return token.type === patternToken.match; }
    if(Array.isArray(patternToken.value)) { return match(token.value, patternToken.value); }
    return token.value === patternToken.value;
};

const match = Y((self, tokens, pattern) => {
    if(!pattern.length) { return true; }
    return matchOne(self)(tokens[0], pattern[0]) &&
        self(tokens.slice(1), pattern.slice(1));
});

module.exports = match;
