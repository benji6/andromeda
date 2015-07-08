/* */ 
var _curry2 = require("./internal/_curry2");
module.exports = _curry2(function range(from, to) {
  var result = [];
  var n = from;
  while (n < to) {
    result[result.length] = n;
    n += 1;
  }
  return result;
});
