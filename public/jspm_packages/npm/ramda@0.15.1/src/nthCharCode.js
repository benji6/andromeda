/* */ 
var _curry2 = require("./internal/_curry2");
module.exports = _curry2(function nthCharCode(n, str) {
  return str.charCodeAt(n < 0 ? str.length + n : n);
});
