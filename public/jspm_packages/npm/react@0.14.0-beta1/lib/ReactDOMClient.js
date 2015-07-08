/* */ 
(function(process) {
  'use strict';
  var ReactCurrentOwner = require("./ReactCurrentOwner");
  var ReactDOMTextComponent = require("./ReactDOMTextComponent");
  var ReactDefaultInjection = require("./ReactDefaultInjection");
  var ReactInstanceHandles = require("./ReactInstanceHandles");
  var ReactMount = require("./ReactMount");
  var ReactPerf = require("./ReactPerf");
  var ReactReconciler = require("./ReactReconciler");
  var ReactUpdates = require("./ReactUpdates");
  var findDOMNode = require("./findDOMNode");
  var renderSubtreeIntoContainer = require("./renderSubtreeIntoContainer");
  var warning = require("./warning");
  ReactDefaultInjection.inject();
  var render = ReactPerf.measure('React', 'render', ReactMount.render);
  var React = {
    findDOMNode: findDOMNode,
    render: render,
    unmountComponentAtNode: ReactMount.unmountComponentAtNode,
    unstable_batchedUpdates: ReactUpdates.batchedUpdates,
    unstable_renderSubtreeIntoContainer: renderSubtreeIntoContainer
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.inject === 'function') {
    __REACT_DEVTOOLS_GLOBAL_HOOK__.inject({
      CurrentOwner: ReactCurrentOwner,
      InstanceHandles: ReactInstanceHandles,
      Mount: ReactMount,
      Reconciler: ReactReconciler,
      TextComponent: ReactDOMTextComponent
    });
  }
  if ('production' !== process.env.NODE_ENV) {
    var ExecutionEnvironment = require("./ExecutionEnvironment");
    if (ExecutionEnvironment.canUseDOM && window.top === window.self) {
      if (navigator.userAgent.indexOf('Chrome') > -1) {
        if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === 'undefined') {
          console.debug('Download the React DevTools for a better development experience: ' + 'https://fb.me/react-devtools');
        }
      }
      var ieCompatibilityMode = document.documentMode && document.documentMode < 8;
      'production' !== process.env.NODE_ENV ? warning(!ieCompatibilityMode, 'Internet Explorer is running in compatibility mode; please add the ' + 'following tag to your HTML to prevent this from happening: ' + '<meta http-equiv="X-UA-Compatible" content="IE=edge" />') : undefined;
      var expectedFeatures = [Array.isArray, Array.prototype.every, Array.prototype.forEach, Array.prototype.indexOf, Array.prototype.map, Date.now, Function.prototype.bind, Object.keys, String.prototype.split, String.prototype.trim, Object.create, Object.freeze];
      for (var i = 0; i < expectedFeatures.length; i++) {
        if (!expectedFeatures[i]) {
          console.error('One or more ES5 shim/shams expected by React are not available: ' + 'https://fb.me/react-warning-polyfills');
          break;
        }
      }
    }
  }
  module.exports = React;
})(require("process"));
