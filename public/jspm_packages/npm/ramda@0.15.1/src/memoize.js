/* */ 
var _curry1 = require("./internal/_curry1");
var _has = require("./internal/_has");
var toString = require("./toString");
module.exports = _curry1(function memoize(fn) {
  var cache = {};
  return function() {
    var key = toString(arguments);
    if (!_has(key, cache)) {
      cache[key] = fn.apply(this, arguments);
    }
    return cache[key];
  };
});
