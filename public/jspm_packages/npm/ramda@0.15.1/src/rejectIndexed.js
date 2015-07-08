/* */ 
var _complement = require("./internal/_complement");
var _curry2 = require("./internal/_curry2");
var _filterIndexed = require("./internal/_filterIndexed");
module.exports = _curry2(function rejectIndexed(fn, list) {
  return _filterIndexed(_complement(fn), list);
});
