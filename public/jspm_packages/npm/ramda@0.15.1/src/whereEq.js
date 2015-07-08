/* */ 
var _curry2 = require("./internal/_curry2");
var equals = require("./equals");
var mapObj = require("./mapObj");
var where = require("./where");
module.exports = _curry2(function whereEq(spec, testObj) {
  return where(mapObj(equals, spec), testObj);
});
