/* */ 
(function(process) {
  'use strict';
  var ReactCurrentOwner = require("./ReactCurrentOwner");
  var assign = require("./Object.assign");
  var RESERVED_PROPS = {
    key: true,
    ref: true
  };
  var ReactElement = function(type, key, ref, owner, props) {
    this.type = type;
    this.key = key;
    this.ref = ref;
    this._owner = owner;
    this.props = props;
    if ('production' !== process.env.NODE_ENV) {
      this._store = {};
      try {
        Object.defineProperty(this._store, 'validated', {
          configurable: false,
          enumerable: false,
          writable: true,
          value: false
        });
      } catch (x) {
        this._store.validated = false;
      }
      Object.freeze(this.props);
      Object.freeze(this);
    }
  };
  ReactElement.prototype = {_isReactElement: true};
  ReactElement.createElement = function(type, config, children) {
    var propName;
    var props = {};
    var key = null;
    var ref = null;
    if (config != null) {
      ref = config.ref === undefined ? null : config.ref;
      key = config.key === undefined ? null : '' + config.key;
      for (propName in config) {
        if (config.hasOwnProperty(propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
          props[propName] = config[propName];
        }
      }
    }
    var childrenLength = arguments.length - 2;
    if (childrenLength === 1) {
      props.children = children;
    } else if (childrenLength > 1) {
      var childArray = Array(childrenLength);
      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 2];
      }
      props.children = childArray;
    }
    if (type && type.defaultProps) {
      var defaultProps = type.defaultProps;
      for (propName in defaultProps) {
        if (typeof props[propName] === 'undefined') {
          props[propName] = defaultProps[propName];
        }
      }
    }
    return new ReactElement(type, key, ref, ReactCurrentOwner.current, props);
  };
  ReactElement.createFactory = function(type) {
    var factory = ReactElement.createElement.bind(null, type);
    factory.type = type;
    return factory;
  };
  ReactElement.cloneAndReplaceProps = function(oldElement, newProps) {
    var newElement = new ReactElement(oldElement.type, oldElement.key, oldElement.ref, oldElement._owner, newProps);
    if ('production' !== process.env.NODE_ENV) {
      newElement._store.validated = oldElement._store.validated;
    }
    return newElement;
  };
  ReactElement.cloneElement = function(element, config, children) {
    var propName;
    var props = assign({}, element.props);
    var key = element.key;
    var ref = element.ref;
    var owner = element._owner;
    if (config != null) {
      if (config.ref !== undefined) {
        ref = config.ref;
        owner = ReactCurrentOwner.current;
      }
      if (config.key !== undefined) {
        key = '' + config.key;
      }
      for (propName in config) {
        if (config.hasOwnProperty(propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
          props[propName] = config[propName];
        }
      }
    }
    var childrenLength = arguments.length - 2;
    if (childrenLength === 1) {
      props.children = children;
    } else if (childrenLength > 1) {
      var childArray = Array(childrenLength);
      for (var i = 0; i < childrenLength; i++) {
        childArray[i] = arguments[i + 2];
      }
      props.children = childArray;
    }
    return new ReactElement(element.type, key, ref, owner, props);
  };
  ReactElement.isValidElement = function(object) {
    var isElement = !!(object && object._isReactElement);
    return isElement;
  };
  module.exports = ReactElement;
})(require("process"));
