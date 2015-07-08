/* */ 
var _curry3 = require("./internal/_curry3");
var _reduce = require("./internal/_reduce");
var ap = require("./ap");
var append = require("./append");
var map = require("./map");
module.exports = _curry3(function commuteMap(fn, of, list) {
  function consF(acc, ftor) {
    return ap(map(append, fn(ftor)), acc);
  }
  return _reduce(consF, of([]), list);
});
