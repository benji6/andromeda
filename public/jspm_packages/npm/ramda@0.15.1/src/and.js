/* */ 
var _curry2 = require("./internal/_curry2");
var _hasMethod = require("./internal/_hasMethod");
module.exports = _curry2(function and(a, b) {
  return _hasMethod('and', a) ? a.and(b) : a && b;
});
