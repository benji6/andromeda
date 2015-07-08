/* */ 
var _curry2 = require("./internal/_curry2");
module.exports = _curry2(function both(f, g) {
  return function _both() {
    return f.apply(this, arguments) && g.apply(this, arguments);
  };
});
