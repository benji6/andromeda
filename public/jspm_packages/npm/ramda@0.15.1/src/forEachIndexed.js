/* */ 
var _curry2 = require("./internal/_curry2");
module.exports = _curry2(function forEachIndexed(fn, list) {
  var idx = 0,
      len = list.length;
  while (idx < len) {
    fn(list[idx], idx, list);
    idx += 1;
  }
  return list;
});
