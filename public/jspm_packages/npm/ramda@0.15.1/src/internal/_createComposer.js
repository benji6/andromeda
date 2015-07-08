/* */ 
var arity = require("../arity");
module.exports = function _createComposer(composeFunction) {
  return function() {
    var fn = arguments[arguments.length - 1];
    var length = fn.length;
    var idx = arguments.length - 2;
    while (idx >= 0) {
      fn = composeFunction(arguments[idx], fn);
      idx -= 1;
    }
    return arity(length, fn);
  };
};
