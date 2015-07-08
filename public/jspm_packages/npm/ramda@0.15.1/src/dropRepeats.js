/* */ 
var _curry1 = require("./internal/_curry1");
var _dispatchable = require("./internal/_dispatchable");
var _xdropRepeatsWith = require("./internal/_xdropRepeatsWith");
var dropRepeatsWith = require("./dropRepeatsWith");
var equals = require("./equals");
module.exports = _curry1(_dispatchable('dropRepeats', _xdropRepeatsWith(equals), dropRepeatsWith(equals)));
