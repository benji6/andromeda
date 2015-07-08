/* */ 
(function(process) {
  'use strict';
  var invariant = require("./invariant");
  function toArray(obj) {
    var length = obj.length;
    !(!Array.isArray(obj) && (typeof obj === 'object' || typeof obj === 'function')) ? 'production' !== process.env.NODE_ENV ? invariant(false, 'toArray: Array-like object expected') : invariant(false) : undefined;
    !(typeof length === 'number') ? 'production' !== process.env.NODE_ENV ? invariant(false, 'toArray: Object needs a length property') : invariant(false) : undefined;
    !(length === 0 || length - 1 in obj) ? 'production' !== process.env.NODE_ENV ? invariant(false, 'toArray: Object should have keys for indices') : invariant(false) : undefined;
    if (obj.hasOwnProperty) {
      try {
        return Array.prototype.slice.call(obj);
      } catch (e) {}
    }
    var ret = Array(length);
    for (var ii = 0; ii < length; ii++) {
      ret[ii] = obj[ii];
    }
    return ret;
  }
  module.exports = toArray;
})(require("process"));
