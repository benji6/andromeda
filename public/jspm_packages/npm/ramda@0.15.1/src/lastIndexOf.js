/* */ 
var _curry2 = require("./internal/_curry2");
var _hasMethod = require("./internal/_hasMethod");
var _lastIndexOf = require("./internal/_lastIndexOf");
module.exports = _curry2(function lastIndexOf(target, xs) {
  return _hasMethod('lastIndexOf', xs) ? xs.lastIndexOf(target) : _lastIndexOf(xs, target);
});
