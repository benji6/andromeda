/* */ 
var _curry3 = require("./internal/_curry3");
var equals = require("./equals");
module.exports = _curry3(function eqProps(prop, obj1, obj2) {
  return equals(obj1[prop], obj2[prop]);
});
