/* */ 
'use strict';
Object.defineProperty(exports, '__esModule', {value: true});
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {'default': obj};
}
var _react = require("react");
var _react2 = _interopRequireDefault(_react);
var _functions = require("./functions");
function connectToStores(Spec) {
  var Component = arguments[1] === undefined ? Spec : arguments[1];
  return (function() {
    if (!(0, _functions.isFunction)(Spec.getStores)) {
      throw new Error('connectToStores() expects the wrapped component to have a static getStores() method');
    }
    if (!(0, _functions.isFunction)(Spec.getPropsFromStores)) {
      throw new Error('connectToStores() expects the wrapped component to have a static getPropsFromStores() method');
    }
    var StoreConnection = _react2['default'].createClass({
      displayName: 'StoreConnection',
      getInitialState: function getInitialState() {
        return Spec.getPropsFromStores(this.props, this.context);
      },
      componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        this.setState(Spec.getPropsFromStores(nextProps, this.context));
      },
      componentDidMount: function componentDidMount() {
        var _this = this;
        var stores = Spec.getStores(this.props, this.context);
        this.storeListeners = stores.map(function(store) {
          return store.listen(_this.onChange);
        });
        if (Spec.componentDidConnect) {
          Spec.componentDidConnect(this.props, this.context);
        }
      },
      componentWillUnmount: function componentWillUnmount() {
        this.storeListeners.forEach(function(unlisten) {
          return unlisten();
        });
      },
      onChange: function onChange() {
        this.setState(Spec.getPropsFromStores(this.props, this.context));
      },
      render: function render() {
        return _react2['default'].createElement(Component, (0, _functions.assign)({}, this.props, this.state));
      }
    });
    return StoreConnection;
  })();
}
exports['default'] = connectToStores;
module.exports = exports['default'];
