/* */ 
var curry = require("./curry");
module.exports = curry(function invoke(methodName, args, obj) {
  return obj[methodName].apply(obj, args);
});
