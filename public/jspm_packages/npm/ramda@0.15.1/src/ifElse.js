/* */ 
(function(process) {
  var _curry3 = require("./internal/_curry3");
  var curryN = require("./curryN");
  module.exports = _curry3(function ifElse(condition, onTrue, onFalse) {
    return curryN(Math.max(condition.length, onTrue.length, onFalse.length), function _ifElse() {
      return condition.apply(this, arguments) ? onTrue.apply(this, arguments) : onFalse.apply(this, arguments);
    });
  });
})(require("process"));
