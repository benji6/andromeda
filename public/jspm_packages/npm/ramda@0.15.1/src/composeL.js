/* */ 
var _composeL = require("./internal/_composeL");
module.exports = function() {
  var fn = arguments[arguments.length - 1];
  var idx = arguments.length - 2;
  while (idx >= 0) {
    fn = _composeL(arguments[idx], fn);
    idx -= 1;
  }
  return fn;
};
