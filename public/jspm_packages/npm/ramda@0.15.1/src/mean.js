/* */ 
var _curry1 = require("./internal/_curry1");
var sum = require("./sum");
module.exports = _curry1(function mean(list) {
  return sum(list) / list.length;
});
