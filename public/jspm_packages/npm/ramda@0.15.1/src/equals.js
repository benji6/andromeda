/* */ 
var _curry2 = require("./internal/_curry2");
var _equals = require("./internal/_equals");
var _hasMethod = require("./internal/_hasMethod");
module.exports = _curry2(function equals(a, b) {
  return _hasMethod('equals', a) ? a.equals(b) : _hasMethod('equals', b) ? b.equals(a) : _equals(a, b, [], []);
});
