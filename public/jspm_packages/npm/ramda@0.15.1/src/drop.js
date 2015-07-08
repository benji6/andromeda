/* */ 
var _curry2 = require("./internal/_curry2");
var _dispatchable = require("./internal/_dispatchable");
var _xdrop = require("./internal/_xdrop");
var slice = require("./slice");
module.exports = _curry2(_dispatchable('drop', _xdrop, function drop(n, xs) {
  return slice(Math.max(0, n), Infinity, xs);
}));
