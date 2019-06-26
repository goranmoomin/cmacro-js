const nearley = require("nearley");
const grammar = require("./grammar.js");
const Y = require("./y.js");
const textify = require("./textify.js");
const match = require("./match.js");

const extractSlot = Y((self, match, tokens) => match.reduce((acc, cur, idx) => {
    if(cur.type === "slot") { return { ...acc, [cur.value]: tokens[idx] }; }
    if(Array.isArray(cur.value)) { return { ...acc, ...self(cur.value, tokens[idx].value) }; }
    return acc;
}, {}));

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

module.exports = stringToParse => {
    parser.feed(stringToParse);
    let tokens = parser.results[0];
    const topLevel = [];
    const macros = tokens.filter(token => token.type === "macro").map(macro => Y((self, tokens) => {
        tokens.filter(token => Array.isArray(token.value)).map(token => token.value).forEach(self);
        Y((self, macroEls, env) => {
            if(Array.isArray(macroEls) && macroEls.length == 0) { return; }
            switch(macroEls[0].type) {
            case "match": {
                env.idx = tokens.findIndex((_, idx, src) => match(src.slice(idx), macroEls[0].value));
                if(env.idx === -1) { return; }
                const newEnv = { ...env, ...extractSlot(macroEls[0].value, tokens.slice(env.idx)) };
                self(macroEls.slice(1), newEnv);
                break;
            }
            case "eval": {
                eval(textify(macroEls[0].value));
                self(macroEls.slice(1), env);
                break;
            }
            case "template":
            case "toplevel": {
                const expand = Y((self, cur) => {
                    if(cur.type === "slot") { return env[cur.value]; }
                    if(Array.isArray(cur.value)) { return { ...cur, value: cur.value.map(self) }; }
                    return cur;
                });

                const addTokens = macroEls[0].value.map(expand);

                if(macroEls[0].type === "template") {
                    tokens.splice(env.idx, macroEls[0].value.length, ...addTokens);
                } else if(macroEls.type === "toplevel") {
                    topLevel.push(...addTokens);
                }

                self(macroEls.slice(1), env);
                break;
            }
            }
        })(macro.value, {});
    }));

    tokens = tokens.filter(token => token.type !== "macro");
    macros.forEach(macro => macro(tokens));
    tokens.splice(0, 0, ...topLevel);
    return textify(tokens);
};
