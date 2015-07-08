/* */ 
var _map = require("./internal/_map");
var _slice = require("./internal/_slice");
var curryN = require("./curryN");
var max = require("./max");
var pluck = require("./pluck");
module.exports = curryN(3, function(after) {
  var fns = _slice(arguments, 1);
  return curryN(max(pluck('length', fns)), function() {
    var args = arguments;
    var context = this;
    return after.apply(context, _map(function(fn) {
      return fn.apply(context, args);
    }, fns));
  });
});
