/* */ 
var _reduce = require("./internal/_reduce");
var _xwrap = require("./internal/_xwrap");
var curryN = require("./curryN");
module.exports = curryN(4, function(xf, fn, acc, list) {
  return _reduce(xf(typeof fn === 'function' ? _xwrap(fn) : fn), acc, list);
});
