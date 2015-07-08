/* */ 
var keys = require("../keys");
module.exports = function _extend(destination, other) {
  var props = keys(other);
  var idx = 0,
      length = props.length;
  while (idx < length) {
    destination[props[idx]] = other[props[idx]];
    idx += 1;
  }
  return destination;
};
