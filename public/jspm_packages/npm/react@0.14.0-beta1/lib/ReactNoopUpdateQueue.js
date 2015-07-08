/* */ 
(function(process) {
  'use strict';
  var warning = require("./warning");
  function warnTDZ(publicInstance, callerName) {
    if ('production' !== process.env.NODE_ENV) {
      'production' !== process.env.NODE_ENV ? warning(false, '%s(...): Can only update a mounted or mounting component. ' + 'This usually means you called %s() on an unmounted component. ' + 'This is a no-op. Please check the code for the %s component.', callerName, callerName, publicInstance.constructor && publicInstance.constructor.displayName || '') : undefined;
    }
  }
  var ReactNoopUpdateQueue = {
    isMounted: function(publicInstance) {
      return false;
    },
    enqueueCallback: function(publicInstance, callback) {},
    enqueueForceUpdate: function(publicInstance) {
      warnTDZ(publicInstance, 'forceUpdate');
    },
    enqueueReplaceState: function(publicInstance, completeState) {
      warnTDZ(publicInstance, 'replaceState');
    },
    enqueueSetState: function(publicInstance, partialState) {
      warnTDZ(publicInstance, 'setState');
    },
    enqueueSetProps: function(publicInstance, partialProps) {
      warnTDZ(publicInstance, 'setProps');
    },
    enqueueReplaceProps: function(publicInstance, props) {
      warnTDZ(publicInstance, 'replaceProps');
    }
  };
  module.exports = ReactNoopUpdateQueue;
})(require("process"));
