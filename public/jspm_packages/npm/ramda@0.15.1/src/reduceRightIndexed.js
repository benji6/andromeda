/* */ 
var _curry3 = require("./internal/_curry3");
module.exports = _curry3(function reduceRightIndexed(fn, acc, list) {
  var idx = list.length - 1;
  while (idx >= 0) {
    acc = fn(acc, list[idx], idx, list);
    idx -= 1;
  }
  return acc;
});
