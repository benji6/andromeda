/* */ 
var _curry1 = require("./internal/_curry1");
var _has = require("./internal/_has");
module.exports = (function() {
  var hasEnumBug = !({toString: null}).propertyIsEnumerable('toString');
  var nonEnumerableProps = ['constructor', 'valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
  var contains = function contains(list, item) {
    var idx = 0;
    while (idx < list.length) {
      if (list[idx] === item) {
        return true;
      }
      idx += 1;
    }
    return false;
  };
  return typeof Object.keys === 'function' ? _curry1(function keys(obj) {
    return Object(obj) !== obj ? [] : Object.keys(obj);
  }) : _curry1(function keys(obj) {
    if (Object(obj) !== obj) {
      return [];
    }
    var prop,
        ks = [],
        nIdx;
    for (prop in obj) {
      if (_has(prop, obj)) {
        ks[ks.length] = prop;
      }
    }
    if (hasEnumBug) {
      nIdx = nonEnumerableProps.length - 1;
      while (nIdx >= 0) {
        prop = nonEnumerableProps[nIdx];
        if (_has(prop, obj) && !contains(ks, prop)) {
          ks[ks.length] = prop;
        }
        nIdx -= 1;
      }
    }
    return ks;
  });
}());
