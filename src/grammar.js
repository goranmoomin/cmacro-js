// Generated automatically by nearley, version 2.16.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require("moo");

const lexer = moo.compile({
    _: { match: /\s+/, lineBreaks: true },
    string: /"(?:\\["\\]|[^\n"\\])*"/,
    char: /'(?:[^\\']|\\[abefnrtv\\'"?])'/,
    preproc: /^#.*$/,
    integer: /(?:0[0-7]+|\d+|0[xX][0-9A-Fa-f])[lLuU]?/,
    listStart: "(",
    listEnd: ")",
    blockStart: "{",
    blockEnd: "}",
    varStart: "$",
    identifier: /(?:[A-z_]+|[^A-z_\s])/
});

 const nuller = () => null; 
 const debug = arg => { console.log(JSON.stringify(arg, null, 2)); return arg; }; var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "toplevel$ebnf$1", "symbols": ["_"], "postprocess": id},
    {"name": "toplevel$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "toplevel$ebnf$2", "symbols": []},
    {"name": "toplevel$ebnf$2", "symbols": ["toplevel$ebnf$2", "anything"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "toplevel", "symbols": ["toplevel$ebnf$1", "toplevel$ebnf$2"], "postprocess": d => (d[1])},
    {"name": "anything$subexpression$1", "symbols": ["preproc"]},
    {"name": "anything$subexpression$1", "symbols": ["macro"]},
    {"name": "anything$subexpression$1", "symbols": ["block"]},
    {"name": "anything$subexpression$1", "symbols": ["list"]},
    {"name": "anything$subexpression$1", "symbols": ["atom"]},
    {"name": "anything$subexpression$1", "symbols": ["slot"]},
    {"name": "anything$subexpression$1", "symbols": ["listslot"]},
    {"name": "anything$subexpression$1", "symbols": ["blockslot"]},
    {"name": "anything$ebnf$1", "symbols": ["_"], "postprocess": id},
    {"name": "anything$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "anything", "symbols": ["anything$subexpression$1", "anything$ebnf$1"], "postprocess": d => (d[0][0])},
    {"name": "preproc", "symbols": [(lexer.has("preproc") ? {type: "preproc"} : preproc)], "postprocess": d => ({ ...d[0], text: d[0].text + "\n" })},
    {"name": "block", "symbols": [(lexer.has("blockStart") ? {type: "blockStart"} : blockStart), "toplevel", (lexer.has("blockEnd") ? {type: "blockEnd"} : blockEnd)], "postprocess": 
        d => ({
            type: "block",
            value: d[1]
        })
        },
    {"name": "list", "symbols": [(lexer.has("listStart") ? {type: "listStart"} : listStart), "toplevel", (lexer.has("listEnd") ? {type: "listEnd"} : listEnd)], "postprocess": 
        d => ({
            type: "list",
            value: d[1]
        })
        },
    {"name": "atom$subexpression$1", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)]},
    {"name": "atom$subexpression$1", "symbols": [(lexer.has("char") ? {type: "char"} : char)]},
    {"name": "atom$subexpression$1", "symbols": [(lexer.has("string") ? {type: "string"} : string)]},
    {"name": "atom$subexpression$1", "symbols": [(lexer.has("integer") ? {type: "integer"} : integer)]},
    {"name": "atom", "symbols": ["atom$subexpression$1"], "postprocess": d => (d[0][0])},
    {"name": "slot", "symbols": [(lexer.has("varStart") ? {type: "varStart"} : varStart), "atom"], "postprocess": d => ({ type: "slot", value: d[1].value, match: "identifier" })},
    {"name": "listslot", "symbols": [(lexer.has("varStart") ? {type: "varStart"} : varStart), (lexer.has("listStart") ? {type: "listStart"} : listStart), "atom", (lexer.has("listEnd") ? {type: "listEnd"} : listEnd)], "postprocess": d => ({ type: "slot", value: d[2].value, match: "list" })},
    {"name": "blockslot", "symbols": [(lexer.has("varStart") ? {type: "varStart"} : varStart), (lexer.has("blockStart") ? {type: "blockStart"} : blockStart), "atom", (lexer.has("blockEnd") ? {type: "blockEnd"} : blockEnd)], "postprocess": d => ({ type: "slot", value: d[2].value, match: "block" })},
    {"name": "match$ebnf$1", "symbols": ["_"], "postprocess": id},
    {"name": "match$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "match", "symbols": [{"literal":"match"}, "match$ebnf$1", "block"], "postprocess": 
        d => ({
            type: "match",
            value: d[2].value
        })
        },
    {"name": "eval$ebnf$1", "symbols": ["_"], "postprocess": id},
    {"name": "eval$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "eval", "symbols": [{"literal":"eval"}, "eval$ebnf$1", "block"], "postprocess": 
        d => ({
            type: "eval",
            value: d[2].value
        })
        },
    {"name": "template$ebnf$1", "symbols": ["_"], "postprocess": id},
    {"name": "template$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "template", "symbols": [{"literal":"template"}, "template$ebnf$1", "block"], "postprocess": 
        d => ({
            type: "template",
            value: d[2].value
        })
        },
    {"name": "topl$ebnf$1", "symbols": ["_"], "postprocess": id},
    {"name": "topl$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "topl", "symbols": [{"literal":"toplevel"}, "topl$ebnf$1", "block"], "postprocess": 
        d => ({
            type: "toplevel",
            value: d[2].value
        })
        },
    {"name": "macroEl$subexpression$1", "symbols": ["match"]},
    {"name": "macroEl$subexpression$1", "symbols": ["eval"]},
    {"name": "macroEl$subexpression$1", "symbols": ["template"]},
    {"name": "macroEl$subexpression$1", "symbols": ["topl"]},
    {"name": "macroEl$ebnf$1", "symbols": ["_"], "postprocess": id},
    {"name": "macroEl$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "macroEl", "symbols": ["macroEl$subexpression$1", "macroEl$ebnf$1"], "postprocess": d => d[0][0]},
    {"name": "macro$ebnf$1", "symbols": ["_"], "postprocess": id},
    {"name": "macro$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "macro$ebnf$2", "symbols": ["_"], "postprocess": id},
    {"name": "macro$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "macro$ebnf$3", "symbols": []},
    {"name": "macro$ebnf$3", "symbols": ["macro$ebnf$3", "macroEl"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "macro", "symbols": [{"literal":"macro"}, "macro$ebnf$1", (lexer.has("blockStart") ? {type: "blockStart"} : blockStart), "macro$ebnf$2", "macro$ebnf$3", (lexer.has("blockEnd") ? {type: "blockEnd"} : blockEnd)], "postprocess": 
        d => ({
            type: "macro",
            value: d[4]
        })
        },
    {"name": "_", "symbols": [(lexer.has("_") ? {type: "_"} : _)], "postprocess": nuller}
]
  , ParserStart: "toplevel"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
