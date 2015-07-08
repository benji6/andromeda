/* */ 
var _curry2 = require("./internal/_curry2");
var _slice = require("./internal/_slice");
var curryN = require("./curryN");
module.exports = _curry2(function invoker(arity, method) {
  return curryN(arity + 1, function() {
    var target = arguments[arity];
    return target[method].apply(target, _slice(arguments, 0, arity));
  });
});
