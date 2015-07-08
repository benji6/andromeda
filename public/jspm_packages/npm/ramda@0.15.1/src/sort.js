/* */ 
var _curry2 = require("./internal/_curry2");
var _slice = require("./internal/_slice");
module.exports = _curry2(function sort(comparator, list) {
  return _slice(list).sort(comparator);
});
