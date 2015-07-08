/* */ 
'use strict';
var shallowEqual = require("./shallowEqual");
function shallowCompare(instance, nextProps, nextState) {
  return !shallowEqual(instance.props, nextProps) || !shallowEqual(instance.state, nextState);
}
module.exports = shallowCompare;
