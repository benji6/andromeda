/* */ 
var _curry2 = require("./internal/_curry2");
module.exports = _curry2(function either(f, g) {
  return function _either() {
    return f.apply(this, arguments) || g.apply(this, arguments);
  };
});
