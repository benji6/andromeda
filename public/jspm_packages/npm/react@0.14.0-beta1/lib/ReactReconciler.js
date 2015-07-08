/* */ 
'use strict';
var ReactRef = require("./ReactRef");
function attachRefs() {
  ReactRef.attachRefs(this, this._currentElement);
}
var ReactReconciler = {
  mountComponent: function(internalInstance, rootID, transaction, context) {
    var markup = internalInstance.mountComponent(rootID, transaction, context);
    if (internalInstance._currentElement.ref != null) {
      transaction.getReactMountReady().enqueue(attachRefs, internalInstance);
    }
    return markup;
  },
  unmountComponent: function(internalInstance) {
    ReactRef.detachRefs(internalInstance, internalInstance._currentElement);
    internalInstance.unmountComponent();
  },
  receiveComponent: function(internalInstance, nextElement, transaction, context) {
    var prevElement = internalInstance._currentElement;
    if (nextElement === prevElement && nextElement._owner != null) {
      return ;
    }
    var refsChanged = ReactRef.shouldUpdateRefs(prevElement, nextElement);
    if (refsChanged) {
      ReactRef.detachRefs(internalInstance, prevElement);
    }
    internalInstance.receiveComponent(nextElement, transaction, context);
    if (refsChanged) {
      transaction.getReactMountReady().enqueue(attachRefs, internalInstance);
    }
  },
  performUpdateIfNecessary: function(internalInstance, transaction) {
    internalInstance.performUpdateIfNecessary(transaction);
  }
};
module.exports = ReactReconciler;
