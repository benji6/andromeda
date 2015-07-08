/* */ 
var _concat = require("./internal/_concat");
var _curry2 = require("./internal/_curry2");
var _hasMethod = require("./internal/_hasMethod");
var _reduce = require("./internal/_reduce");
var map = require("./map");
module.exports = _curry2(function ap(fns, vs) {
  return _hasMethod('ap', fns) ? fns.ap(vs) : _reduce(function(acc, fn) {
    return _concat(acc, map(fn, vs));
  }, [], fns);
});
