/* */ 
var _containsWith = require("./internal/_containsWith");
var _curry3 = require("./internal/_curry3");
var uniqWith = require("./uniqWith");
module.exports = _curry3(function intersectionWith(pred, list1, list2) {
  var results = [],
      idx = 0;
  while (idx < list1.length) {
    if (_containsWith(pred, list1[idx], list2)) {
      results[results.length] = list1[idx];
    }
    idx += 1;
  }
  return uniqWith(pred, results);
});
