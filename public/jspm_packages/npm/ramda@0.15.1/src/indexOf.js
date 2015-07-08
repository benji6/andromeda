/* */ 
var _curry2 = require("./internal/_curry2");
var _hasMethod = require("./internal/_hasMethod");
var _indexOf = require("./internal/_indexOf");
module.exports = _curry2(function indexOf(target, xs) {
  return _hasMethod('indexOf', xs) ? xs.indexOf(target) : _indexOf(xs, target);
});
