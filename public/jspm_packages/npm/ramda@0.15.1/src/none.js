/* */ 
var _any = require("./internal/_any");
var _complement = require("./internal/_complement");
var _curry2 = require("./internal/_curry2");
var _dispatchable = require("./internal/_dispatchable");
var _xany = require("./internal/_xany");
module.exports = _curry2(_complement(_dispatchable('any', _xany, _any)));
