const nearley = require("nearley");
const grammar = require("./grammar.js");
const Y = require("./y.js");
const textify = require("./textify.js");
const match = require("./match.js");

const extractSlots = Y((self, match, tokens) => match.reduce((acc, cur, idx) => {
    if(cur.type === "slot") { return { ...acc, [cur.value]: tokens[idx] }; }
    if(Array.isArray(cur.value)) { return { ...acc, ...self(cur.value, tokens[idx].value) }; }
    return acc;
}, {}));

const expandWithEnv = env => Y((self, cur) => {
    if(cur.type === "slot") { return env[cur.value]; }
    if(Array.isArray(cur.value)) { return { ...cur, value: cur.value.map(self) }; }
    return cur;
});

const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

module.exports = stringToParse => {
    parser.feed(stringToParse);
    let tokens = parser.results[0];
    const topLevel = [];
    const macros = tokens.filter(token => token.type === "macro").map(macro => Y((self, tokens) => {
        tokens.filter(token => Array.isArray(token.value)).map(token => token.value).forEach(self);
        Y((self, macroEls, env) => {
            if(Array.isArray(macroEls) && macroEls.length == 0) { return; }
            const curEl = macroEls[0].value;
            const remEls = macroEls.slice(1);
            switch(macroEls[0].type) {
            case "match":
                env.idx = tokens.findIndex((_, idx, src) => match(src.slice(idx), curEl));
                if(env.idx === -1) { return; }
                self(remEls, { ...env, ...extractSlots(curEl, tokens.slice(env.idx)) });
                break;
            case "eval":
                eval(textify(curEl));
                self(remEls, env);
                break;
            case "template":
                tokens.splice(env.idx, curEl.length, ...curEl.map(expandWithEnv(env)));
                self(remEls, env);
                break;
            case "toplevel":
                topLevel.push(...curEl.map(expandWithEnv(env)));
                self(remEls, env);
                break;
            }
        })(macro.value, {});
    }));

    tokens = tokens.filter(token => token.type !== "macro");
    macros.forEach(macro => macro(tokens));
    tokens.splice(0, 0, ...topLevel);
    return textify(tokens);
};
