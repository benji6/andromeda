/* */ 
var _concat = require("./internal/_concat");
var _curry1 = require("./internal/_curry1");
var _prepend = require("./internal/_prepend");
var _slice = require("./internal/_slice");
var curryN = require("./curryN");
module.exports = _curry1(function(fn) {
  return curryN(fn.length, function() {
    var idx = 0;
    var origFn = arguments[0];
    var list = arguments[arguments.length - 1];
    var indexedFn = function() {
      var result = origFn.apply(this, _concat(arguments, [idx, list]));
      idx += 1;
      return result;
    };
    return fn.apply(this, _prepend(indexedFn, _slice(arguments, 1)));
  });
});
