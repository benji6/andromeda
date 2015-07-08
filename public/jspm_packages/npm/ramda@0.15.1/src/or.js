/* */ 
var _curry2 = require("./internal/_curry2");
var _hasMethod = require("./internal/_hasMethod");
module.exports = _curry2(function or(a, b) {
  return _hasMethod('or', a) ? a.or(b) : a || b;
});
