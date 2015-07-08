/* */ 
var _cloneRegExp = require("./internal/_cloneRegExp");
var _curry2 = require("./internal/_curry2");
module.exports = _curry2(function test(pattern, str) {
  return _cloneRegExp(pattern).test(str);
});
