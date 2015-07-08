/* */ 
var _curry3 = require("./internal/_curry3");
var equals = require("./equals");
module.exports = _curry3(function propEq(name, val, obj) {
  return equals(obj[name], val);
});
