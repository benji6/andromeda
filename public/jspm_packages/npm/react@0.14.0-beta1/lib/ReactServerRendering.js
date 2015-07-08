/* */ 
(function(process) {
  'use strict';
  var ReactDefaultBatchingStrategy = require("./ReactDefaultBatchingStrategy");
  var ReactElement = require("./ReactElement");
  var ReactInstanceHandles = require("./ReactInstanceHandles");
  var ReactMarkupChecksum = require("./ReactMarkupChecksum");
  var ReactServerBatchingStrategy = require("./ReactServerBatchingStrategy");
  var ReactServerRenderingTransaction = require("./ReactServerRenderingTransaction");
  var ReactUpdates = require("./ReactUpdates");
  var emptyObject = require("./emptyObject");
  var instantiateReactComponent = require("./instantiateReactComponent");
  var invariant = require("./invariant");
  function renderToString(element) {
    !ReactElement.isValidElement(element) ? 'production' !== process.env.NODE_ENV ? invariant(false, 'renderToString(): You must pass a valid ReactElement.') : invariant(false) : undefined;
    var transaction;
    try {
      ReactUpdates.injection.injectBatchingStrategy(ReactServerBatchingStrategy);
      var id = ReactInstanceHandles.createReactRootID();
      transaction = ReactServerRenderingTransaction.getPooled(false);
      return transaction.perform(function() {
        var componentInstance = instantiateReactComponent(element, null);
        var markup = componentInstance.mountComponent(id, transaction, emptyObject);
        return ReactMarkupChecksum.addChecksumToMarkup(markup);
      }, null);
    } finally {
      ReactServerRenderingTransaction.release(transaction);
      ReactUpdates.injection.injectBatchingStrategy(ReactDefaultBatchingStrategy);
    }
  }
  function renderToStaticMarkup(element) {
    !ReactElement.isValidElement(element) ? 'production' !== process.env.NODE_ENV ? invariant(false, 'renderToStaticMarkup(): You must pass a valid ReactElement.') : invariant(false) : undefined;
    var transaction;
    try {
      ReactUpdates.injection.injectBatchingStrategy(ReactServerBatchingStrategy);
      var id = ReactInstanceHandles.createReactRootID();
      transaction = ReactServerRenderingTransaction.getPooled(true);
      return transaction.perform(function() {
        var componentInstance = instantiateReactComponent(element, null);
        return componentInstance.mountComponent(id, transaction, emptyObject);
      }, null);
    } finally {
      ReactServerRenderingTransaction.release(transaction);
      ReactUpdates.injection.injectBatchingStrategy(ReactDefaultBatchingStrategy);
    }
  }
  module.exports = {
    renderToString: renderToString,
    renderToStaticMarkup: renderToStaticMarkup
  };
})(require("process"));
