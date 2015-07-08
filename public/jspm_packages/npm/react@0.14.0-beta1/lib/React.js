/* */ 
'use strict';
var ReactDOMClient = require("./ReactDOMClient");
var ReactDOMServer = require("./ReactDOMServer");
var ReactIsomorphic = require("./ReactIsomorphic");
var assign = require("./Object.assign");
var React = {};
assign(React, ReactIsomorphic);
assign(React, ReactDOMClient);
assign(React, ReactDOMServer);
React.version = '0.14.0-beta1';
module.exports = React;
