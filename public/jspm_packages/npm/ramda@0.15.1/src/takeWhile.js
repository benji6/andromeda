/* */ 
var _curry2 = require("./internal/_curry2");
var _dispatchable = require("./internal/_dispatchable");
var _slice = require("./internal/_slice");
var _xtakeWhile = require("./internal/_xtakeWhile");
module.exports = _curry2(_dispatchable('takeWhile', _xtakeWhile, function takeWhile(fn, list) {
  var idx = 0,
      len = list.length;
  while (idx < len && fn(list[idx])) {
    idx += 1;
  }
  return _slice(list, 0, idx);
}));
