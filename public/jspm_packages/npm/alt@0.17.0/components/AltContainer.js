/* */ 
var React = require("react/addons");
var mixinContainer = require("./mixinContainer");
var assign = require("../utils/functions").assign;
var AltContainer = React.createClass(assign({
  displayName: 'AltContainer',
  render: function() {
    return this.altRender('div');
  }
}, mixinContainer(React)));
module.exports = AltContainer;
