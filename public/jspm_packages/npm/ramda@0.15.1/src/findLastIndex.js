/* */ 
var _curry2 = require("./internal/_curry2");
var _dispatchable = require("./internal/_dispatchable");
var _xfindLastIndex = require("./internal/_xfindLastIndex");
module.exports = _curry2(_dispatchable('findLastIndex', _xfindLastIndex, function findLastIndex(fn, list) {
  var idx = list.length - 1;
  while (idx >= 0) {
    if (fn(list[idx])) {
      return idx;
    }
    idx -= 1;
  }
  return -1;
}));
