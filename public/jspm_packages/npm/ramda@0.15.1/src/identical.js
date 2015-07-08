/* */ 
var _curry2 = require("./internal/_curry2");
module.exports = _curry2(function identical(a, b) {
  if (a === b) {
    return a !== 0 || 1 / a === 1 / b;
  } else {
    return a !== a && b !== b;
  }
});
