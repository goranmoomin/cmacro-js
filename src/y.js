// not a Y, but a why (see https://raganwald.com/2018/09/10/why-y.html)
module.exports = le => (f => f(f))(f => (...x) => le(f(f), ...x));
