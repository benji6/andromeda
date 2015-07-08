/* */ 
var _curry3 = require("./internal/_curry3");
var _path = require("./internal/_path");
var equals = require("./equals");
module.exports = _curry3(function pathEq(path, val, obj) {
  return equals(_path(path, obj), val);
});
