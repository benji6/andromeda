/* */ 
(function(process) {
  'use strict';
  var LinkedValueUtils = require("./LinkedValueUtils");
  var ReactDOMIDOperations = require("./ReactDOMIDOperations");
  var ReactUpdates = require("./ReactUpdates");
  var assign = require("./Object.assign");
  var invariant = require("./invariant");
  var warning = require("./warning");
  function forceUpdateIfMounted() {
    if (this._rootNodeID) {
      ReactDOMTextarea.updateWrapper(this);
    }
  }
  var ReactDOMTextarea = {
    getNativeProps: function(inst, props, context) {
      !(props.dangerouslySetInnerHTML == null) ? 'production' !== process.env.NODE_ENV ? invariant(false, '`dangerouslySetInnerHTML` does not make sense on <textarea>.') : invariant(false) : undefined;
      var nativeProps = assign({}, props, {
        defaultValue: undefined,
        value: undefined,
        children: inst._wrapperState.initialValue,
        onChange: inst._wrapperState.onChange
      });
      return nativeProps;
    },
    mountWrapper: function(inst, props) {
      LinkedValueUtils.checkPropTypes('textarea', props, inst._currentElement._owner);
      var defaultValue = props.defaultValue;
      var children = props.children;
      if (children != null) {
        if ('production' !== process.env.NODE_ENV) {
          'production' !== process.env.NODE_ENV ? warning(false, 'Use the `defaultValue` or `value` props instead of setting ' + 'children on <textarea>.') : undefined;
        }
        !(defaultValue == null) ? 'production' !== process.env.NODE_ENV ? invariant(false, 'If you supply `defaultValue` on a <textarea>, do not pass children.') : invariant(false) : undefined;
        if (Array.isArray(children)) {
          !(children.length <= 1) ? 'production' !== process.env.NODE_ENV ? invariant(false, '<textarea> can only have at most one child.') : invariant(false) : undefined;
          children = children[0];
        }
        defaultValue = '' + children;
      }
      if (defaultValue == null) {
        defaultValue = '';
      }
      var value = LinkedValueUtils.getValue(props);
      inst._wrapperState = {
        initialValue: '' + (value != null ? value : defaultValue),
        onChange: _handleChange.bind(inst)
      };
    },
    updateWrapper: function(inst) {
      var props = inst._currentElement.props;
      var value = LinkedValueUtils.getValue(props);
      if (value != null) {
        ReactDOMIDOperations.updatePropertyByID(inst._rootNodeID, 'value', '' + value);
      }
    }
  };
  function _handleChange(event) {
    var props = this._currentElement.props;
    var returnValue = LinkedValueUtils.executeOnChange(props, event);
    ReactUpdates.asap(forceUpdateIfMounted, this);
    return returnValue;
  }
  module.exports = ReactDOMTextarea;
})(require("process"));
