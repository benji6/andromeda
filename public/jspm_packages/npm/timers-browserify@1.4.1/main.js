/* */ 
(function(process) {
  var nextTick = require("process/browser").nextTick;
  var apply = Function.prototype.apply;
  var slice = Array.prototype.slice;
  var immediateIds = {};
  var nextImmediateId = 0;
  exports.setTimeout = function() {
    return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
  };
  exports.setInterval = function() {
    return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
  };
  exports.clearTimeout = exports.clearInterval = function(timeout) {
    timeout.close();
  };
  function Timeout(id, clearFn) {
    this._id = id;
    this._clearFn = clearFn;
  }
  Timeout.prototype.unref = Timeout.prototype.ref = function() {};
  Timeout.prototype.close = function() {
    this._clearFn.call(window, this._id);
  };
  exports.enroll = function(item, msecs) {
    clearTimeout(item._idleTimeoutId);
    item._idleTimeout = msecs;
  };
  exports.unenroll = function(item) {
    clearTimeout(item._idleTimeoutId);
    item._idleTimeout = -1;
  };
  exports._unrefActive = exports.active = function(item) {
    clearTimeout(item._idleTimeoutId);
    var msecs = item._idleTimeout;
    if (msecs >= 0) {
      item._idleTimeoutId = setTimeout(function onTimeout() {
        if (item._onTimeout)
          item._onTimeout();
      }, msecs);
    }
  };
  exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
    var id = nextImmediateId++;
    var args = arguments.length < 2 ? false : slice.call(arguments, 1);
    immediateIds[id] = true;
    nextTick(function onNextTick() {
      if (immediateIds[id]) {
        if (args) {
          fn.apply(null, args);
        } else {
          fn.call(null);
        }
        exports.clearImmediate(id);
      }
    });
    return id;
  };
  exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
    delete immediateIds[id];
  };
})(require("process"));
