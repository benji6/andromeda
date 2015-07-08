/* */ 
(function(process) {
  'use strict';
  var invariant = require("./invariant");
  var injected = false;
  var ReactComponentEnvironment = {
    unmountIDFromEnvironment: null,
    replaceNodeWithMarkupByID: null,
    processChildrenUpdates: null,
    injection: {injectEnvironment: function(environment) {
        !!injected ? 'production' !== process.env.NODE_ENV ? invariant(false, 'ReactCompositeComponent: injectEnvironment() can only be called once.') : invariant(false) : undefined;
        ReactComponentEnvironment.unmountIDFromEnvironment = environment.unmountIDFromEnvironment;
        ReactComponentEnvironment.replaceNodeWithMarkupByID = environment.replaceNodeWithMarkupByID;
        ReactComponentEnvironment.processChildrenUpdates = environment.processChildrenUpdates;
        injected = true;
      }}
  };
  module.exports = ReactComponentEnvironment;
})(require("process"));
