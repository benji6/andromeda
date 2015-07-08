/* */ 
(function(process) {
  'use strict';
  var React = require("./lib/React");
  var assign = require("./lib/Object.assign");
  var deprecated = require("./lib/deprecated");
  if (process.env.NODE_ENV !== 'production') {
    var deprecations = {
      findDOMNode: deprecated('findDOMNode', 'react-dom', React, React.findDOMNode),
      render: deprecated('render', 'react-dom', React, React.render),
      unmountComponentAtNode: deprecated('unmountComponentAtNode', 'react-dom', React, React.unmountComponentAtNode),
      renderToString: deprecated('renderToString', 'react-dom/server', React, React.renderToString),
      renderToStaticMarkup: deprecated('renderToStaticMarkup', 'react-dom/server', React, React.renderToStaticMarkup)
    };
    module.exports = assign({}, React, deprecations);
  } else {
    module.exports = React;
  }
})(require("process"));
