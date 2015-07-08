/* */ 
var _curry1 = require("./internal/_curry1");
var lens = require("./lens");
var nth = require("./nth");
var update = require("./update");
module.exports = _curry1(function lensIndex(n) {
  return lens(nth(n), update(n));
});
