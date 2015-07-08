/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
var _extends = Object.assign || function(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];
    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
};
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {'default': obj};
}
var _react = require("react");
var _react2 = _interopRequireDefault(_react);
var _Render = require("./Render");
var _Render2 = _interopRequireDefault(_Render);
function connect(Spec, MaybeComponent) {
  function bind(Component) {
    return _react2['default'].createClass({
      getInitialState: function getInitialState() {
        return Spec.reduceProps(this.props, this.context);
      },
      componentWillMount: function componentWillMount() {
        if (Spec.willMount)
          Spec.willMount(this.props, this.context);
      },
      componentDidMount: function componentDidMount() {
        var _this = this;
        var stores = Spec.listenTo(this.props, this.context);
        this.storeListeners = stores.map(function(store) {
          return store.listen(_this.onChange);
        });
        if (Spec.didMount)
          Spec.didMount(this.props, this.context);
      },
      componentWillUnmount: function componentWillUnmount() {
        this.storeListeners.forEach(function(unlisten) {
          return unlisten();
        });
      },
      onChange: function onChange() {
        this.setState(Spec.reduceProps(this.props, this.context));
      },
      render: function render() {
        return _react2['default'].createElement(Component, _extends({}, this.props, this.state));
      }
    });
  }
  var createResolver = Spec.resolveAsync ? _Render2['default'].withData(Spec.resolveAsync) : function(x) {
    return x;
  };
  return MaybeComponent ? createResolver(bind(MaybeComponent)) : function(Component) {
    return createResolver(bind(Component));
  };
}
exports['default'] = connect;
module.exports = exports['default'];
