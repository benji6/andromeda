/* */ 
var _curry3 = require("./internal/_curry3");
module.exports = _curry3(function scan(fn, acc, list) {
  var idx = 0,
      len = list.length,
      result = [acc];
  while (idx < len) {
    acc = fn(acc, list[idx]);
    result[idx + 1] = acc;
    idx += 1;
  }
  return result;
});
