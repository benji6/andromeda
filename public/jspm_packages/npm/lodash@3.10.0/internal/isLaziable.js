/* */ 
var LazyWrapper = require("./LazyWrapper"),
    getData = require("./getData"),
    getFuncName = require("./getFuncName"),
    lodash = require("../chain/lodash");
function isLaziable(func) {
  var funcName = getFuncName(func);
  if (!(funcName in LazyWrapper.prototype)) {
    return false;
  }
  var other = lodash[funcName];
  if (func === other) {
    return true;
  }
  var data = getData(other);
  return !!data && func === data[0];
}
module.exports = isLaziable;
