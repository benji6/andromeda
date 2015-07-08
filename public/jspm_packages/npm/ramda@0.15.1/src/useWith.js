/* */ 
var _slice = require("./internal/_slice");
var arity = require("./arity");
var curry = require("./curry");
module.exports = curry(function useWith(fn) {
  var transformers = _slice(arguments, 1);
  var tlen = transformers.length;
  return curry(arity(tlen, function() {
    var args = [],
        idx = 0;
    while (idx < tlen) {
      args[idx] = transformers[idx](arguments[idx]);
      idx += 1;
    }
    return fn.apply(this, args.concat(_slice(arguments, tlen)));
  }));
});
