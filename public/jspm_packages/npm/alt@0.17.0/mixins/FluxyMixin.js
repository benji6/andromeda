/* */ 
'use strict';
var Subscribe = require("./Subscribe");
var FluxyMixin = {
  componentDidMount: function() {
    Subscribe.create(this);
    var stores = this.constructor.storeListeners;
    if (Array.isArray(stores)) {
      if (!this.onChange) {
        throw new ReferenceError('onChange should exist in your React component but is not defined');
      }
      stores.forEach(function(store) {
        Subscribe.add(this, store, this.onChange);
      }, this);
    } else {
      Object.keys(stores).forEach(function(handler) {
        if (!this[handler]) {
          throw new ReferenceError(handler + ' does not exist in your React component');
        }
        Subscribe.add(this, stores[handler], this[handler]);
      }, this);
    }
  },
  componentWillUnmount: function() {
    Subscribe.destroy(this);
  }
};
module.exports = FluxyMixin;
