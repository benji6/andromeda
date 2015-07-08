/* */ 
var _curry2 = require("./internal/_curry2");
var _dispatchable = require("./internal/_dispatchable");
var _xfindLast = require("./internal/_xfindLast");
module.exports = _curry2(_dispatchable('findLast', _xfindLast, function findLast(fn, list) {
  var idx = list.length - 1;
  while (idx >= 0) {
    if (fn(list[idx])) {
      return list[idx];
    }
    idx -= 1;
  }
}));
