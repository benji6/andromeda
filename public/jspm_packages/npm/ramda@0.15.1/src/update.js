/* */ 
var _curry3 = require("./internal/_curry3");
var adjust = require("./adjust");
var always = require("./always");
module.exports = _curry3(function(idx, x, list) {
  return adjust(always(x), idx, list);
});
