const Y = require("./y.js");

module.exports = Y((self, node) => {
    if(Array.isArray(node)) { return node.map(self).join(" "); }
    if(node.text) { return node.text; }
    switch(node.type) {
    case "macro":
        return "macro {" +
            `match { ${self(node.match)} }\n` +
            `eval { ${self(node.eval)} }\n` +
            `template { ${self(node.template)} }\n` +
            `toplevel { ${self(node.topLevel)} }\n` +
            "}\n";
    case "block":
        return `{ ${self(node.value)} }\n`;
    case "list":
        return `(${self(node.value)})\n`;
    case "slot": {
        let left = node.match === "block" ? "{" : node.match === "list" ? "(" : "";
        let right = node.match === "block" ? "}" : node.match === "list" ? ")" : "";
        return `$${left}${node.value}${right}`;
    }
    default:
        throw new Error(`Unknown type ${node.type} of ${JSON.stringify(node)}`);
    }
});
