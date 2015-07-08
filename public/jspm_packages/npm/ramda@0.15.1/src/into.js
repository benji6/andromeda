/* */ 
var _curry3 = require("./internal/_curry3");
var _isTransformer = require("./internal/_isTransformer");
var _reduce = require("./internal/_reduce");
var _stepCat = require("./internal/_stepCat");
module.exports = _curry3(function into(acc, xf, list) {
  return _isTransformer(acc) ? _reduce(xf(acc), acc['@@transducer/init'](), list) : _reduce(xf(_stepCat(acc)), acc, list);
});
