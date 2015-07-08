/* */ 
var apply = require("./apply");
var compose = require("./compose");
var composeL = require("./composeL");
var reverse = require("./reverse");
var unapply = require("./unapply");
module.exports = compose(apply(composeL), unapply(reverse));
