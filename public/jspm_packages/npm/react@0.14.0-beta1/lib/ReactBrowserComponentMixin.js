/* */ 
(function(process) {
  'use strict';
  var ReactInstanceMap = require("./ReactInstanceMap");
  var findDOMNode = require("./findDOMNode");
  var warning = require("./warning");
  var didWarnKey = '_getDOMNodeDidWarn';
  var ReactBrowserComponentMixin = {getDOMNode: function() {
      'production' !== process.env.NODE_ENV ? warning(this.constructor[didWarnKey], '%s.getDOMNode(...) is deprecated. Please use ' + 'React.findDOMNode(instance) instead.', ReactInstanceMap.get(this).getName() || this.tagName || 'Unknown') : undefined;
      this.constructor[didWarnKey] = true;
      return findDOMNode(this);
    }};
  module.exports = ReactBrowserComponentMixin;
})(require("process"));
