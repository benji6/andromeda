/* */ 
var _curry2 = require("./internal/_curry2");
var _forEach = require("./internal/_forEach");
var _hasMethod = require("./internal/_hasMethod");
module.exports = _curry2(function forEach(fn, list) {
  return _hasMethod('forEach', list) ? list.forEach(fn) : _forEach(fn, list);
});
