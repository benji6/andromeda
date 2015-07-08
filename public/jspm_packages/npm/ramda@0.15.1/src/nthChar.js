/* */ 
var _curry2 = require("./internal/_curry2");
module.exports = _curry2(function nthChar(n, str) {
  return str.charAt(n < 0 ? str.length + n : n);
});
