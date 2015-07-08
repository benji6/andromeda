/* */ 
"use strict";

function transmitter() {
  var subscriptions = [];

  var unsubscribe = function unsubscribe(onChange) {
    var id = subscriptions.indexOf(onChange);
    if (id >= 0) subscriptions.splice(id, 1);
  };

  var subscribe = function subscribe(onChange) {
    subscriptions.push(onChange);
    var dispose = function dispose() {
      return unsubscribe(onChange);
    };
    return { dispose: dispose };
  };

  var push = function push(value) {
    subscriptions.forEach(function (subscription) {
      return subscription(value);
    });
  };

  return { subscribe: subscribe, push: push, unsubscribe: unsubscribe };
}

module.exports = transmitter;