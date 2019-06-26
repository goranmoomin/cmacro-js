# -*- eval: (font-lock-mode -1) -*-

@{%
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
%}

@{% const nuller = () => null; %}
@{% const debug = arg => { console.log(JSON.stringify(arg, null, 2)); return arg; }; %}

@lexer lexer

toplevel -> _:? anything:*
{% d => (d[1]) %}

anything -> (preproc | macro | block | list | atom | slot | listslot | blockslot) _:?
{% d => (d[0][0]) %}

preproc -> %preproc {% d => ({ ...d[0], text: d[0].text + "\n" }) %}

block -> %blockStart toplevel %blockEnd
{%
d => ({
    type: "block",
    value: d[1]
})
%}

list -> %listStart toplevel %listEnd
{%
d => ({
    type: "list",
    value: d[1]
})
%}

atom -> (%identifier | %char | %string | %integer)
{% d => (d[0][0]) %}

slot -> %varStart atom
{% d => ({ type: "slot", value: d[1].value, match: "identifier" }) %}

listslot -> %varStart %listStart atom %listEnd
{% d => ({ type: "slot", value: d[2].value, match: "list" }) %}

blockslot -> %varStart %blockStart atom %blockEnd
{% d => ({ type: "slot", value: d[2].value, match: "block" }) %}

match -> "match" _:? block
{%
d => ({
    type: "match",
    value: d[2].value
})
%}

eval -> "eval" _:? block
{%
d => ({
    type: "eval",
    value: d[2].value
})
%}

template -> "template" _:? block
{%
d => ({
    type: "template",
    value: d[2].value
})
%}

topl -> "toplevel" _:? block
{%
d => ({
    type: "toplevel",
    value: d[2].value
})
%}

macroEl -> (match | eval | template | topl) _:? {% d => d[0][0] %}

macro -> "macro" _:? %blockStart _:? macroEl:* %blockEnd
{%
d => ({
    type: "macro",
    value: d[4]
})
%}

_ -> %_ {% nuller %}