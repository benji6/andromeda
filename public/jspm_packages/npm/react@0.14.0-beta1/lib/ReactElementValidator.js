/* */ 
(function(process) {
  'use strict';
  var ReactElement = require("./ReactElement");
  var ReactFragment = require("./ReactFragment");
  var ReactPropTypeLocations = require("./ReactPropTypeLocations");
  var ReactPropTypeLocationNames = require("./ReactPropTypeLocationNames");
  var ReactCurrentOwner = require("./ReactCurrentOwner");
  var getIteratorFn = require("./getIteratorFn");
  var invariant = require("./invariant");
  var warning = require("./warning");
  function getDeclarationErrorAddendum() {
    if (ReactCurrentOwner.current) {
      var name = ReactCurrentOwner.current.getName();
      if (name) {
        return ' Check the render method of `' + name + '`.';
      }
    }
    return '';
  }
  var ownerHasKeyUseWarning = {};
  var loggedTypeFailures = {};
  var NUMERIC_PROPERTY_REGEX = /^\d+$/;
  function getName(instance) {
    var publicInstance = instance && instance.getPublicInstance();
    if (!publicInstance) {
      return undefined;
    }
    var constructor = publicInstance.constructor;
    if (!constructor) {
      return undefined;
    }
    return constructor.displayName || constructor.name || undefined;
  }
  function getCurrentOwnerDisplayName() {
    var current = ReactCurrentOwner.current;
    return current && getName(current) || undefined;
  }
  function validateExplicitKey(element, parentType) {
    if (element._store.validated || element.key != null) {
      return ;
    }
    element._store.validated = true;
    var addenda = getAddendaForKeyUse('uniqueKey', element, parentType);
    if (addenda === null) {
      return ;
    }
    'production' !== process.env.NODE_ENV ? warning(false, 'Each child in an array or iterator should have a unique "key" prop.' + '%s%s%s', addenda.parentOrOwner || '', addenda.childOwner || '', addenda.url || '') : undefined;
  }
  function validatePropertyKey(name, element, parentType) {
    if (!NUMERIC_PROPERTY_REGEX.test(name)) {
      return ;
    }
    var addenda = getAddendaForKeyUse('numericKeys', element, parentType);
    if (addenda === null) {
      return ;
    }
    'production' !== process.env.NODE_ENV ? warning(false, 'Child objects should have non-numeric keys so ordering is preserved.' + '%s%s%s', addenda.parentOrOwner || '', addenda.childOwner || '', addenda.url || '') : undefined;
  }
  function getAddendaForKeyUse(messageType, element, parentType) {
    var ownerName = getCurrentOwnerDisplayName();
    var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;
    var useName = ownerName || parentName;
    var memoizer = ownerHasKeyUseWarning[messageType] || (ownerHasKeyUseWarning[messageType] = {});
    if (memoizer[useName]) {
      return null;
    }
    memoizer[useName] = true;
    var addenda = {
      parentOrOwner: ownerName ? ' Check the render method of ' + ownerName + '.' : parentName ? ' Check the React.render call using <' + parentName + '>.' : null,
      url: ' See https://fb.me/react-warning-keys for more information.',
      childOwner: null
    };
    if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
      addenda.childOwner = ' It was passed a child from ' + getName(element._owner) + '.';
    }
    return addenda;
  }
  function validateChildKeys(node, parentType) {
    if (Array.isArray(node)) {
      for (var i = 0; i < node.length; i++) {
        var child = node[i];
        if (ReactElement.isValidElement(child)) {
          validateExplicitKey(child, parentType);
        }
      }
    } else if (ReactElement.isValidElement(node)) {
      node._store.validated = true;
    } else if (node) {
      var iteratorFn = getIteratorFn(node);
      if (iteratorFn) {
        if (iteratorFn !== node.entries) {
          var iterator = iteratorFn.call(node);
          var step;
          while (!(step = iterator.next()).done) {
            if (ReactElement.isValidElement(step.value)) {
              validateExplicitKey(step.value, parentType);
            }
          }
        }
      } else if (typeof node === 'object') {
        var fragment = ReactFragment.extractIfFragment(node);
        for (var key in fragment) {
          if (fragment.hasOwnProperty(key)) {
            validatePropertyKey(key, fragment[key], parentType);
          }
        }
      }
    }
  }
  function checkPropTypes(componentName, propTypes, props, location) {
    for (var propName in propTypes) {
      if (propTypes.hasOwnProperty(propName)) {
        var error;
        try {
          !(typeof propTypes[propName] === 'function') ? 'production' !== process.env.NODE_ENV ? invariant(false, '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'React.PropTypes.', componentName || 'React class', ReactPropTypeLocationNames[location], propName) : invariant(false) : undefined;
          error = propTypes[propName](props, propName, componentName, location);
        } catch (ex) {
          error = ex;
        }
        'production' !== process.env.NODE_ENV ? warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', ReactPropTypeLocationNames[location], propName, typeof error) : undefined;
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          loggedTypeFailures[error.message] = true;
          var addendum = getDeclarationErrorAddendum();
          'production' !== process.env.NODE_ENV ? warning(false, 'Failed propType: %s%s', error.message, addendum) : undefined;
        }
      }
    }
  }
  function validatePropTypes(element) {
    var componentClass = element.type;
    if (typeof componentClass !== 'function') {
      return ;
    }
    var name = componentClass.displayName || componentClass.name;
    if (componentClass.propTypes) {
      checkPropTypes(name, componentClass.propTypes, element.props, ReactPropTypeLocations.prop);
    }
    if (typeof componentClass.getDefaultProps === 'function') {
      'production' !== process.env.NODE_ENV ? warning(componentClass.getDefaultProps.isReactClassApproved, 'getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.') : undefined;
    }
  }
  var ReactElementValidator = {
    createElement: function(type, props, children) {
      'production' !== process.env.NODE_ENV ? warning(typeof type === 'string' || typeof type === 'function', 'React.createElement: type should not be null, undefined, boolean, or ' + 'number. It should be a string (for DOM elements) or a ReactClass ' + '(for composite components).%s', getDeclarationErrorAddendum()) : undefined;
      var element = ReactElement.createElement.apply(this, arguments);
      if (element == null) {
        return element;
      }
      for (var i = 2; i < arguments.length; i++) {
        validateChildKeys(arguments[i], type);
      }
      validatePropTypes(element);
      return element;
    },
    createFactory: function(type) {
      var validatedFactory = ReactElementValidator.createElement.bind(null, type);
      validatedFactory.type = type;
      if ('production' !== process.env.NODE_ENV) {
        try {
          Object.defineProperty(validatedFactory, 'type', {
            enumerable: false,
            get: function() {
              'production' !== process.env.NODE_ENV ? warning(false, 'Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.') : undefined;
              Object.defineProperty(this, 'type', {value: type});
              return type;
            }
          });
        } catch (x) {}
      }
      return validatedFactory;
    },
    cloneElement: function(element, props, children) {
      var newElement = ReactElement.cloneElement.apply(this, arguments);
      for (var i = 2; i < arguments.length; i++) {
        validateChildKeys(arguments[i], newElement.type);
      }
      validatePropTypes(newElement);
      return newElement;
    }
  };
  module.exports = ReactElementValidator;
})(require("process"));
