/* */ 
var _curry2 = require("./internal/_curry2");
module.exports = _curry2(function props(ps, obj) {
  var len = ps.length;
  var out = [];
  var idx = 0;
  while (idx < len) {
    out[idx] = obj[ps[idx]];
    idx += 1;
  }
  return out;
});
