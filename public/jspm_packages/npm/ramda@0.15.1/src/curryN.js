/* */ 
var _curry2 = require("./internal/_curry2");
var _curryN = require("./internal/_curryN");
var arity = require("./arity");
module.exports = _curry2(function curryN(length, fn) {
  return arity(length, _curryN(length, [], fn));
});
