const nearley = require("nearley");
const grammar = require("./grammar.js");
const Y = require("./y.js");
const textify = require("./textify.js");
const match = require("./match.js");

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

module.exports = stringToParse => {
    parser.feed(stringToParse);
    let tokens = parser.results[0];

    const topLevel = [];

    const macros = tokens.filter(token => token.type === "macro").map(macro => Y((self, tokens) => {
        tokens.filter(token => Array.isArray(token.value)).map(token => token.value).forEach(self);
        Y((self, macroEls, env) => {
            if(Array.isArray(macroEls) && macroEls.length == 0) { return; }
            if(macroEls[0].type === "match") {
                env.idx = tokens.findIndex((_, idx, src) => match(src.slice(idx), macroEls[0].value));
                if(env.idx === -1) { return; }
                const newEnv = { ...env, ...Y((self, match, tokens) => match.reduce((acc, cur, idx) => {
                    if(cur.type === "slot") { return { ...acc, [cur.value]: tokens[idx] }; }
                    if(Array.isArray(cur.value)) { return { ...acc, ...self(cur.value, tokens[idx].value) }; }
                    return acc;
                }, {}))(macroEls[0].value, tokens.slice(env.idx)) };
                self(macroEls.slice(1), newEnv);
            }
            else if(macroEls[0].type === "eval") {
                eval(textify(macroEls[0].value));
                self(macroEls.slice(1), env);
            } else if(macroEls[0].type === "template" || macroEls[0].type === "toplevel") {
                const expand = Y((self, cur) => {
                    if(cur.type === "slot") { return env[cur.value]; }
                    if(Array.isArray(cur.value)) { return { ...cur, value: cur.value.map(self) }; }
                    return cur;
                });

                if(macroEls[0].type === "template") {
                    const templateTokens = macroEls[0].value.map(expand);
                    tokens.splice(env.idx, macroEls[0].value.length, ...templateTokens);
                } else if(macroEls.type === "toplevel") {
                    const topLevelTokens = macroEls[0].value.map(expand);
                    topLevel.push(...topLevelTokens);
                }
                self(macroEls.slice(1), env);
            }
        })(macro.value, {});
    }));

    tokens = tokens.filter(token => token.type !== "macro");
    macros.forEach(macro => macro(tokens));
    tokens.splice(0, 0, ...topLevel);
    return textify(tokens);
};
