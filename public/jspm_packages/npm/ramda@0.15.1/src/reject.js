/* */ 
var _complement = require("./internal/_complement");
var _curry2 = require("./internal/_curry2");
var filter = require("./filter");
module.exports = _curry2(function reject(fn, list) {
  return filter(_complement(fn), list);
});
