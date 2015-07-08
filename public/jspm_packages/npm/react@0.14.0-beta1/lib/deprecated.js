/* */ 
(function(process) {
  'use strict';
  var assign = require("./Object.assign");
  var warning = require("./warning");
  function deprecated(fnName, newModule, ctx, fn) {
    var warned = false;
    if ('production' !== process.env.NODE_ENV) {
      var newFn = function() {
        'production' !== process.env.NODE_ENV ? warning(warned, '`require' + '("react").%s` is deprecated. Please use `require' + '("%s").%s` ' + 'instead.', fnName, newModule, fnName) : undefined;
        warned = true;
        return fn.apply(ctx, arguments);
      };
      return assign(newFn, fn);
    }
    return fn;
  }
  module.exports = deprecated;
})(require("process"));
