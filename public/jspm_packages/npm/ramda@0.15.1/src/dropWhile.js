/* */ 
var _curry2 = require("./internal/_curry2");
var _dispatchable = require("./internal/_dispatchable");
var _slice = require("./internal/_slice");
var _xdropWhile = require("./internal/_xdropWhile");
module.exports = _curry2(_dispatchable('dropWhile', _xdropWhile, function dropWhile(pred, list) {
  var idx = 0,
      len = list.length;
  while (idx < len && pred(list[idx])) {
    idx += 1;
  }
  return _slice(list, idx);
}));
