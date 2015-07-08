/* */ 
(function(process) {
  'use strict';
  var DOMProperty = require("./DOMProperty");
  var quoteAttributeValueForBrowser = require("./quoteAttributeValueForBrowser");
  var warning = require("./warning");
  var VALID_ATTRIBUTE_NAME_REGEX = /^[a-zA-Z_][a-zA-Z_\.\-\d]*$/;
  var illegalAttributeNameCache = {};
  var validatedAttributeNameCache = {};
  function isAttributeNameSafe(attributeName) {
    if (validatedAttributeNameCache.hasOwnProperty(attributeName)) {
      return true;
    }
    if (illegalAttributeNameCache.hasOwnProperty(attributeName)) {
      return false;
    }
    if (VALID_ATTRIBUTE_NAME_REGEX.test(attributeName)) {
      validatedAttributeNameCache[attributeName] = true;
      return true;
    }
    illegalAttributeNameCache[attributeName] = true;
    'production' !== process.env.NODE_ENV ? warning(false, 'Invalid attribute name: `%s`', attributeName) : undefined;
    return false;
  }
  function shouldIgnoreValue(propertyInfo, value) {
    return value == null || propertyInfo.hasBooleanValue && !value || propertyInfo.hasNumericValue && isNaN(value) || propertyInfo.hasPositiveNumericValue && value < 1 || propertyInfo.hasOverloadedBooleanValue && value === false;
  }
  if ('production' !== process.env.NODE_ENV) {
    var reactProps = {
      children: true,
      dangerouslySetInnerHTML: true,
      key: true,
      ref: true
    };
    var warnedProperties = {};
    var warnUnknownProperty = function(name) {
      if (reactProps.hasOwnProperty(name) && reactProps[name] || warnedProperties.hasOwnProperty(name) && warnedProperties[name]) {
        return ;
      }
      warnedProperties[name] = true;
      var lowerCasedName = name.toLowerCase();
      var standardName = DOMProperty.isCustomAttribute(lowerCasedName) ? lowerCasedName : DOMProperty.getPossibleStandardName.hasOwnProperty(lowerCasedName) ? DOMProperty.getPossibleStandardName[lowerCasedName] : null;
      'production' !== process.env.NODE_ENV ? warning(standardName == null, 'Unknown DOM property %s. Did you mean %s?', name, standardName) : undefined;
    };
  }
  var DOMPropertyOperations = {
    createMarkupForID: function(id) {
      return DOMProperty.ID_ATTRIBUTE_NAME + '=' + quoteAttributeValueForBrowser(id);
    },
    createMarkupForProperty: function(name, value) {
      var propertyInfo = DOMProperty.properties.hasOwnProperty(name) ? DOMProperty.properties[name] : null;
      if (propertyInfo) {
        if (shouldIgnoreValue(propertyInfo, value)) {
          return '';
        }
        var attributeName = propertyInfo.attributeName;
        if (propertyInfo.hasBooleanValue || propertyInfo.hasOverloadedBooleanValue && value === true) {
          return attributeName + '=""';
        }
        return attributeName + '=' + quoteAttributeValueForBrowser(value);
      } else if (DOMProperty.isCustomAttribute(name)) {
        if (value == null) {
          return '';
        }
        return name + '=' + quoteAttributeValueForBrowser(value);
      } else if ('production' !== process.env.NODE_ENV) {
        warnUnknownProperty(name);
      }
      return null;
    },
    createMarkupForCustomAttribute: function(name, value) {
      if (!isAttributeNameSafe(name) || value == null) {
        return '';
      }
      return name + '=' + quoteAttributeValueForBrowser(value);
    },
    setValueForProperty: function(node, name, value) {
      var propertyInfo = DOMProperty.properties.hasOwnProperty(name) ? DOMProperty.properties[name] : null;
      if (propertyInfo) {
        var mutationMethod = propertyInfo.mutationMethod;
        if (mutationMethod) {
          mutationMethod(node, value);
        } else if (shouldIgnoreValue(propertyInfo, value)) {
          this.deleteValueForProperty(node, name);
        } else if (propertyInfo.mustUseAttribute) {
          var attributeName = propertyInfo.attributeName;
          var namespace = propertyInfo.attributeNamespace;
          if (namespace) {
            node.setAttributeNS(namespace, attributeName, '' + value);
          } else {
            node.setAttribute(attributeName, '' + value);
          }
        } else {
          var propName = propertyInfo.propertyName;
          if (!propertyInfo.hasSideEffects || '' + node[propName] !== '' + value) {
            node[propName] = value;
          }
        }
      } else if (DOMProperty.isCustomAttribute(name)) {
        DOMPropertyOperations.setValueForAttribute(node, name, value);
      } else if ('production' !== process.env.NODE_ENV) {
        warnUnknownProperty(name);
      }
    },
    setValueForAttribute: function(node, name, value) {
      if (!isAttributeNameSafe(name)) {
        return ;
      }
      if (value == null) {
        node.removeAttribute(name);
      } else {
        node.setAttribute(name, '' + value);
      }
    },
    deleteValueForProperty: function(node, name) {
      var propertyInfo = DOMProperty.properties.hasOwnProperty(name) ? DOMProperty.properties[name] : null;
      if (propertyInfo) {
        var mutationMethod = propertyInfo.mutationMethod;
        if (mutationMethod) {
          mutationMethod(node, undefined);
        } else if (propertyInfo.mustUseAttribute) {
          node.removeAttribute(propertyInfo.attributeName);
        } else {
          var propName = propertyInfo.propertyName;
          var defaultValue = DOMProperty.getDefaultValueForProperty(node.nodeName, propName);
          if (!propertyInfo.hasSideEffects || '' + node[propName] !== defaultValue) {
            node[propName] = defaultValue;
          }
        }
      } else if (DOMProperty.isCustomAttribute(name)) {
        node.removeAttribute(name);
      } else if ('production' !== process.env.NODE_ENV) {
        warnUnknownProperty(name);
      }
    }
  };
  module.exports = DOMPropertyOperations;
})(require("process"));
