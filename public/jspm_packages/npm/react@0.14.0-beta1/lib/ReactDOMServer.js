/* */ 
'use strict';
var ReactDefaultInjection = require("./ReactDefaultInjection");
var ReactServerRendering = require("./ReactServerRendering");
ReactDefaultInjection.inject();
var ReactDOMServer = {
  renderToString: ReactServerRendering.renderToString,
  renderToStaticMarkup: ReactServerRendering.renderToStaticMarkup
};
module.exports = ReactDOMServer;
