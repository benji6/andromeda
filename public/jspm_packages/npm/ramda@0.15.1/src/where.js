/* */ 
var _curry2 = require("./internal/_curry2");
var _has = require("./internal/_has");
module.exports = _curry2(function where(spec, testObj) {
  for (var prop in spec) {
    if (_has(prop, spec) && !spec[prop](testObj[prop])) {
      return false;
    }
  }
  return true;
});
