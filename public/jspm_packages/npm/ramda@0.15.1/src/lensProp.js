/* */ 
var _curry1 = require("./internal/_curry1");
var assoc = require("./assoc");
var lens = require("./lens");
var prop = require("./prop");
module.exports = _curry1(function lensProp(k) {
  return lens(prop(k), assoc(k));
});
