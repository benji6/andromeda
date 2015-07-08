/* */ 
var _curry2 = require("./internal/_curry2");
var _dispatchable = require("./internal/_dispatchable");
var _xtake = require("./internal/_xtake");
var slice = require("./slice");
module.exports = _curry2(_dispatchable('take', _xtake, function take(n, xs) {
  return slice(0, n < 0 ? Infinity : n, xs);
}));
