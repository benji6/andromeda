/* */ 
"use strict";
var invariant = require("./invariant");
var _lastID = 1;
var _prefix = 'ID_';
function Dispatcher() {
  this.$Dispatcher_callbacks = {};
  this.$Dispatcher_isPending = {};
  this.$Dispatcher_isHandled = {};
  this.$Dispatcher_isDispatching = false;
  this.$Dispatcher_pendingPayload = null;
}
Dispatcher.prototype.register = function(callback) {
  var id = _prefix + _lastID++;
  this.$Dispatcher_callbacks[id] = callback;
  return id;
};
Dispatcher.prototype.unregister = function(id) {
  invariant(this.$Dispatcher_callbacks[id], 'Dispatcher.unregister(...): `%s` does not map to a registered callback.', id);
  delete this.$Dispatcher_callbacks[id];
};
Dispatcher.prototype.waitFor = function(ids) {
  invariant(this.$Dispatcher_isDispatching, 'Dispatcher.waitFor(...): Must be invoked while dispatching.');
  for (var ii = 0; ii < ids.length; ii++) {
    var id = ids[ii];
    if (this.$Dispatcher_isPending[id]) {
      invariant(this.$Dispatcher_isHandled[id], 'Dispatcher.waitFor(...): Circular dependency detected while ' + 'waiting for `%s`.', id);
      continue;
    }
    invariant(this.$Dispatcher_callbacks[id], 'Dispatcher.waitFor(...): `%s` does not map to a registered callback.', id);
    this.$Dispatcher_invokeCallback(id);
  }
};
Dispatcher.prototype.dispatch = function(payload) {
  invariant(!this.$Dispatcher_isDispatching, 'Dispatch.dispatch(...): Cannot dispatch in the middle of a dispatch.');
  this.$Dispatcher_startDispatching(payload);
  try {
    for (var id in this.$Dispatcher_callbacks) {
      if (this.$Dispatcher_isPending[id]) {
        continue;
      }
      this.$Dispatcher_invokeCallback(id);
    }
  } finally {
    this.$Dispatcher_stopDispatching();
  }
};
Dispatcher.prototype.isDispatching = function() {
  return this.$Dispatcher_isDispatching;
};
Dispatcher.prototype.$Dispatcher_invokeCallback = function(id) {
  this.$Dispatcher_isPending[id] = true;
  this.$Dispatcher_callbacks[id](this.$Dispatcher_pendingPayload);
  this.$Dispatcher_isHandled[id] = true;
};
Dispatcher.prototype.$Dispatcher_startDispatching = function(payload) {
  for (var id in this.$Dispatcher_callbacks) {
    this.$Dispatcher_isPending[id] = false;
    this.$Dispatcher_isHandled[id] = false;
  }
  this.$Dispatcher_pendingPayload = payload;
  this.$Dispatcher_isDispatching = true;
};
Dispatcher.prototype.$Dispatcher_stopDispatching = function() {
  this.$Dispatcher_pendingPayload = null;
  this.$Dispatcher_isDispatching = false;
};
module.exports = Dispatcher;
