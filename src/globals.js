const crypto = require("crypto");

const gensym = () => {
    const symbol = "gensym_" + crypto.randomBytes(2).toString("hex");
    return {
        type: "identifier",
        value: symbol,
        text: symbol
    };
};

module.exports = { gensym };
