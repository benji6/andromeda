/* */ 
(function(process) {
  'use strict';
  var AutoFocusUtils = require("./AutoFocusUtils");
  var CSSPropertyOperations = require("./CSSPropertyOperations");
  var DOMProperty = require("./DOMProperty");
  var DOMPropertyOperations = require("./DOMPropertyOperations");
  var EventConstants = require("./EventConstants");
  var ReactBrowserEventEmitter = require("./ReactBrowserEventEmitter");
  var ReactComponentBrowserEnvironment = require("./ReactComponentBrowserEnvironment");
  var ReactDOMButton = require("./ReactDOMButton");
  var ReactDOMInput = require("./ReactDOMInput");
  var ReactDOMOption = require("./ReactDOMOption");
  var ReactDOMSelect = require("./ReactDOMSelect");
  var ReactDOMTextarea = require("./ReactDOMTextarea");
  var ReactMount = require("./ReactMount");
  var ReactMultiChild = require("./ReactMultiChild");
  var ReactPerf = require("./ReactPerf");
  var ReactUpdateQueue = require("./ReactUpdateQueue");
  var assign = require("./Object.assign");
  var escapeTextContentForBrowser = require("./escapeTextContentForBrowser");
  var invariant = require("./invariant");
  var isEventSupported = require("./isEventSupported");
  var keyOf = require("./keyOf");
  var shallowEqual = require("./shallowEqual");
  var validateDOMNesting = require("./validateDOMNesting");
  var warning = require("./warning");
  var deleteListener = ReactBrowserEventEmitter.deleteListener;
  var listenTo = ReactBrowserEventEmitter.listenTo;
  var registrationNameModules = ReactBrowserEventEmitter.registrationNameModules;
  var CONTENT_TYPES = {
    'string': true,
    'number': true
  };
  var STYLE = keyOf({style: null});
  var ELEMENT_NODE_TYPE = 1;
  var canDefineProperty = false;
  try {
    Object.defineProperty({}, 'test', {get: function() {}});
    canDefineProperty = true;
  } catch (e) {}
  function getDeclarationErrorAddendum(internalInstance) {
    if (internalInstance) {
      var owner = internalInstance._currentElement._owner || null;
      if (owner) {
        var name = owner.getName();
        if (name) {
          return ' This DOM node was rendered by `' + name + '`.';
        }
      }
    }
    return '';
  }
  var legacyPropsDescriptor;
  if ('production' !== process.env.NODE_ENV) {
    legacyPropsDescriptor = {props: {
        enumerable: false,
        get: function() {
          var component = this._reactInternalComponent;
          'production' !== process.env.NODE_ENV ? warning(false, 'ReactDOMComponent: Do not access .props of a DOM node; instead, ' + 'recreate the props as `render` did originally or read the DOM ' + 'properties/attributes directly from this node (e.g., ' + 'this.refs.box.className).%s', getDeclarationErrorAddendum(component)) : undefined;
          return component._currentElement.props;
        }
      }};
  }
  function legacyGetDOMNode() {
    if ('production' !== process.env.NODE_ENV) {
      var component = this._reactInternalComponent;
      'production' !== process.env.NODE_ENV ? warning(false, 'ReactDOMComponent: Do not access .getDOMNode() of a DOM node; ' + 'instead, use the node directly.%s', getDeclarationErrorAddendum(component)) : undefined;
    }
    return this;
  }
  function legacyIsMounted() {
    var component = this._reactInternalComponent;
    if ('production' !== process.env.NODE_ENV) {
      'production' !== process.env.NODE_ENV ? warning(false, 'ReactDOMComponent: Do not access .isMounted() of a DOM node.%s', getDeclarationErrorAddendum(component)) : undefined;
    }
    return !!component;
  }
  function legacySetStateEtc() {
    if ('production' !== process.env.NODE_ENV) {
      var component = this._reactInternalComponent;
      'production' !== process.env.NODE_ENV ? warning(false, 'ReactDOMComponent: Do not access .setState(), .replaceState(), or ' + '.forceUpdate() of a DOM node. This is a no-op.%s', getDeclarationErrorAddendum(component)) : undefined;
    }
  }
  function legacySetProps(partialProps, callback) {
    var component = this._reactInternalComponent;
    if ('production' !== process.env.NODE_ENV) {
      'production' !== process.env.NODE_ENV ? warning(false, 'ReactDOMComponent: Do not access .setProps() of a DOM node. ' + 'Instead, call React.render again at the top level.%s', getDeclarationErrorAddendum(component)) : undefined;
    }
    if (!component) {
      return ;
    }
    ReactUpdateQueue.enqueueSetPropsInternal(component, partialProps);
    if (callback) {
      ReactUpdateQueue.enqueueCallbackInternal(component, callback);
    }
  }
  function legacyReplaceProps(partialProps, callback) {
    var component = this._reactInternalComponent;
    if ('production' !== process.env.NODE_ENV) {
      'production' !== process.env.NODE_ENV ? warning(false, 'ReactDOMComponent: Do not access .replaceProps() of a DOM node. ' + 'Instead, call React.render again at the top level.%s', getDeclarationErrorAddendum(component)) : undefined;
    }
    if (!component) {
      return ;
    }
    ReactUpdateQueue.enqueueReplacePropsInternal(component, partialProps);
    if (callback) {
      ReactUpdateQueue.enqueueCallbackInternal(component, callback);
    }
  }
  var styleMutationWarning = {};
  function checkAndWarnForMutatedStyle(style1, style2, component) {
    if (style1 == null || style2 == null) {
      return ;
    }
    if (shallowEqual(style1, style2)) {
      return ;
    }
    var componentName = component._tag;
    var owner = component._currentElement._owner;
    var ownerName;
    if (owner) {
      ownerName = owner.getName();
    }
    var hash = ownerName + '|' + componentName;
    if (styleMutationWarning.hasOwnProperty(hash)) {
      return ;
    }
    styleMutationWarning[hash] = true;
    'production' !== process.env.NODE_ENV ? warning(false, '`%s` was passed a style object that has previously been mutated. ' + 'Mutating `style` is deprecated. Consider cloning it beforehand. Check ' + 'the `render` %s. Previous style: %s. Mutated style: %s.', componentName, owner ? 'of `' + ownerName + '`' : 'using <' + componentName + '>', JSON.stringify(style1), JSON.stringify(style2)) : undefined;
  }
  var BackendIDOperations = null;
  function assertValidProps(component, props) {
    if (!props) {
      return ;
    }
    if ('production' !== process.env.NODE_ENV) {
      if (voidElementTags[component._tag]) {
        'production' !== process.env.NODE_ENV ? warning(props.children == null && props.dangerouslySetInnerHTML == null, '%s is a void element tag and must not have `children` or ' + 'use `props.dangerouslySetInnerHTML`.%s', component._tag, component._currentElement._owner ? ' Check the render method of ' + component._currentElement._owner.getName() + '.' : '') : undefined;
      }
    }
    if (props.dangerouslySetInnerHTML != null) {
      !(props.children == null) ? 'production' !== process.env.NODE_ENV ? invariant(false, 'Can only set one of `children` or `props.dangerouslySetInnerHTML`.') : invariant(false) : undefined;
      !(typeof props.dangerouslySetInnerHTML === 'object' && '__html' in props.dangerouslySetInnerHTML) ? 'production' !== process.env.NODE_ENV ? invariant(false, '`props.dangerouslySetInnerHTML` must be in the form `{__html: ...}`. ' + 'Please visit https://fb.me/react-invariant-dangerously-set-inner-html ' + 'for more information.') : invariant(false) : undefined;
    }
    if ('production' !== process.env.NODE_ENV) {
      'production' !== process.env.NODE_ENV ? warning(props.innerHTML == null, 'Directly setting property `innerHTML` is not permitted. ' + 'For more information, lookup documentation on `dangerouslySetInnerHTML`.') : undefined;
      'production' !== process.env.NODE_ENV ? warning(!props.contentEditable || props.children == null, 'A component is `contentEditable` and contains `children` managed by ' + 'React. It is now your responsibility to guarantee that none of ' + 'those nodes are unexpectedly modified or duplicated. This is ' + 'probably not intentional.') : undefined;
    }
    !(props.style == null || typeof props.style === 'object') ? 'production' !== process.env.NODE_ENV ? invariant(false, 'The `style` prop expects a mapping from style properties to values, ' + 'not a string. For example, style={{marginRight: spacing + \'em\'}} when ' + 'using JSX.') : invariant(false) : undefined;
  }
  function enqueuePutListener(id, registrationName, listener, transaction) {
    if ('production' !== process.env.NODE_ENV) {
      'production' !== process.env.NODE_ENV ? warning(registrationName !== 'onScroll' || isEventSupported('scroll', true), 'This browser doesn\'t support the `onScroll` event') : undefined;
    }
    var container = ReactMount.findReactContainerForID(id);
    if (container) {
      var doc = container.nodeType === ELEMENT_NODE_TYPE ? container.ownerDocument : container;
      listenTo(registrationName, doc);
    }
    transaction.getReactMountReady().enqueue(putListener, {
      id: id,
      registrationName: registrationName,
      listener: listener
    });
  }
  function putListener() {
    var listenerToPut = this;
    ReactBrowserEventEmitter.putListener(listenerToPut.id, listenerToPut.registrationName, listenerToPut.listener);
  }
  function trapBubbledEventsLocal() {
    var inst = this;
    !inst._rootNodeID ? 'production' !== process.env.NODE_ENV ? invariant(false, 'Must be mounted to trap events') : invariant(false) : undefined;
    var node = ReactMount.getNode(inst._rootNodeID);
    !node ? 'production' !== process.env.NODE_ENV ? invariant(false, 'trapBubbledEvent(...): Requires node to be rendered.') : invariant(false) : undefined;
    switch (inst._tag) {
      case 'iframe':
        inst._wrapperState.listeners = [ReactBrowserEventEmitter.trapBubbledEvent(EventConstants.topLevelTypes.topLoad, 'load', node)];
        break;
      case 'img':
        inst._wrapperState.listeners = [ReactBrowserEventEmitter.trapBubbledEvent(EventConstants.topLevelTypes.topError, 'error', node), ReactBrowserEventEmitter.trapBubbledEvent(EventConstants.topLevelTypes.topLoad, 'load', node)];
        break;
      case 'form':
        inst._wrapperState.listeners = [ReactBrowserEventEmitter.trapBubbledEvent(EventConstants.topLevelTypes.topReset, 'reset', node), ReactBrowserEventEmitter.trapBubbledEvent(EventConstants.topLevelTypes.topSubmit, 'submit', node)];
        break;
    }
  }
  function postUpdateSelectWrapper() {
    ReactDOMSelect.postUpdateWrapper(this);
  }
  var omittedCloseTags = {
    'area': true,
    'base': true,
    'br': true,
    'col': true,
    'embed': true,
    'hr': true,
    'img': true,
    'input': true,
    'keygen': true,
    'link': true,
    'meta': true,
    'param': true,
    'source': true,
    'track': true,
    'wbr': true
  };
  var newlineEatingTags = {
    'listing': true,
    'pre': true,
    'textarea': true
  };
  var voidElementTags = assign({'menuitem': true}, omittedCloseTags);
  var VALID_TAG_REGEX = /^[a-zA-Z][a-zA-Z:_\.\-\d]*$/;
  var validatedTagCache = {};
  var hasOwnProperty = ({}).hasOwnProperty;
  function validateDangerousTag(tag) {
    if (!hasOwnProperty.call(validatedTagCache, tag)) {
      !VALID_TAG_REGEX.test(tag) ? 'production' !== process.env.NODE_ENV ? invariant(false, 'Invalid tag: %s', tag) : invariant(false) : undefined;
      validatedTagCache[tag] = true;
    }
  }
  function processChildContext(context, inst) {
    if ('production' !== process.env.NODE_ENV) {
      context = assign({}, context);
      var info = context[validateDOMNesting.ancestorInfoContextKey];
      context[validateDOMNesting.ancestorInfoContextKey] = validateDOMNesting.updatedAncestorInfo(info, inst._tag, inst);
    }
    return context;
  }
  function isCustomComponent(tagName, props) {
    return tagName.indexOf('-') >= 0 || props.is != null;
  }
  function ReactDOMComponent(tag) {
    validateDangerousTag(tag);
    this._tag = tag.toLowerCase();
    this._renderedChildren = null;
    this._previousStyle = null;
    this._previousStyleCopy = null;
    this._rootNodeID = null;
    this._wrapperState = null;
    this._topLevelWrapper = null;
    this._nodeWithLegacyProperties = null;
  }
  ReactDOMComponent.displayName = 'ReactDOMComponent';
  ReactDOMComponent.Mixin = {
    construct: function(element) {
      this._currentElement = element;
    },
    mountComponent: function(rootID, transaction, context) {
      this._rootNodeID = rootID;
      var props = this._currentElement.props;
      switch (this._tag) {
        case 'iframe':
        case 'img':
        case 'form':
          this._wrapperState = {listeners: null};
          transaction.getReactMountReady().enqueue(trapBubbledEventsLocal, this);
          break;
        case 'button':
          props = ReactDOMButton.getNativeProps(this, props, context);
          break;
        case 'input':
          ReactDOMInput.mountWrapper(this, props, context);
          props = ReactDOMInput.getNativeProps(this, props, context);
          break;
        case 'option':
          ReactDOMOption.mountWrapper(this, props, context);
          props = ReactDOMOption.getNativeProps(this, props, context);
          break;
        case 'select':
          ReactDOMSelect.mountWrapper(this, props, context);
          props = ReactDOMSelect.getNativeProps(this, props, context);
          context = ReactDOMSelect.processChildContext(this, props, context);
          break;
        case 'textarea':
          ReactDOMTextarea.mountWrapper(this, props, context);
          props = ReactDOMTextarea.getNativeProps(this, props, context);
          break;
      }
      assertValidProps(this, props);
      if ('production' !== process.env.NODE_ENV) {
        if (context[validateDOMNesting.ancestorInfoContextKey]) {
          validateDOMNesting(this._tag, this, context[validateDOMNesting.ancestorInfoContextKey]);
        }
      }
      var tagOpen = this._createOpenTagMarkupAndPutListeners(transaction, props);
      var tagContent = this._createContentMarkup(transaction, props, context);
      switch (this._tag) {
        case 'button':
        case 'input':
        case 'select':
        case 'textarea':
          if (props.autoFocus) {
            transaction.getReactMountReady().enqueue(AutoFocusUtils.focusDOMComponent, this);
          }
          break;
      }
      if (!tagContent && omittedCloseTags[this._tag]) {
        return tagOpen + '/>';
      }
      return tagOpen + '>' + tagContent + '</' + this._currentElement.type + '>';
    },
    _createOpenTagMarkupAndPutListeners: function(transaction, props) {
      var ret = '<' + this._currentElement.type;
      for (var propKey in props) {
        if (!props.hasOwnProperty(propKey)) {
          continue;
        }
        var propValue = props[propKey];
        if (propValue == null) {
          continue;
        }
        if (registrationNameModules.hasOwnProperty(propKey)) {
          enqueuePutListener(this._rootNodeID, propKey, propValue, transaction);
        } else {
          if (propKey === STYLE) {
            if (propValue) {
              if ('production' !== process.env.NODE_ENV) {
                this._previousStyle = propValue;
              }
              propValue = this._previousStyleCopy = assign({}, props.style);
            }
            propValue = CSSPropertyOperations.createMarkupForStyles(propValue);
          }
          var markup = null;
          if (this._tag != null && isCustomComponent(this._tag, props)) {
            markup = DOMPropertyOperations.createMarkupForCustomAttribute(propKey, propValue);
          } else {
            markup = DOMPropertyOperations.createMarkupForProperty(propKey, propValue);
          }
          if (markup) {
            ret += ' ' + markup;
          }
        }
      }
      if (transaction.renderToStaticMarkup) {
        return ret;
      }
      var markupForID = DOMPropertyOperations.createMarkupForID(this._rootNodeID);
      return ret + ' ' + markupForID;
    },
    _createContentMarkup: function(transaction, props, context) {
      var ret = '';
      var innerHTML = props.dangerouslySetInnerHTML;
      if (innerHTML != null) {
        if (innerHTML.__html != null) {
          ret = innerHTML.__html;
        }
      } else {
        var contentToUse = CONTENT_TYPES[typeof props.children] ? props.children : null;
        var childrenToUse = contentToUse != null ? null : props.children;
        if (contentToUse != null) {
          ret = escapeTextContentForBrowser(contentToUse);
        } else if (childrenToUse != null) {
          var mountImages = this.mountChildren(childrenToUse, transaction, processChildContext(context, this));
          ret = mountImages.join('');
        }
      }
      if (newlineEatingTags[this._tag] && ret.charAt(0) === '\n') {
        return '\n' + ret;
      } else {
        return ret;
      }
    },
    receiveComponent: function(nextElement, transaction, context) {
      var prevElement = this._currentElement;
      this._currentElement = nextElement;
      this.updateComponent(transaction, prevElement, nextElement, context);
    },
    updateComponent: function(transaction, prevElement, nextElement, context) {
      var lastProps = prevElement.props;
      var nextProps = this._currentElement.props;
      switch (this._tag) {
        case 'button':
          lastProps = ReactDOMButton.getNativeProps(this, lastProps);
          nextProps = ReactDOMButton.getNativeProps(this, nextProps);
          break;
        case 'input':
          ReactDOMInput.updateWrapper(this);
          lastProps = ReactDOMInput.getNativeProps(this, lastProps);
          nextProps = ReactDOMInput.getNativeProps(this, nextProps);
          break;
        case 'option':
          lastProps = ReactDOMOption.getNativeProps(this, lastProps);
          nextProps = ReactDOMOption.getNativeProps(this, nextProps);
          break;
        case 'select':
          lastProps = ReactDOMSelect.getNativeProps(this, lastProps);
          nextProps = ReactDOMSelect.getNativeProps(this, nextProps);
          break;
        case 'textarea':
          ReactDOMTextarea.updateWrapper(this);
          lastProps = ReactDOMTextarea.getNativeProps(this, lastProps);
          nextProps = ReactDOMTextarea.getNativeProps(this, nextProps);
          break;
      }
      assertValidProps(this, nextProps);
      this._updateDOMProperties(lastProps, nextProps, transaction);
      this._updateDOMChildren(lastProps, nextProps, transaction, processChildContext(context, this));
      if (!canDefineProperty && this._nodeWithLegacyProperties) {
        this._nodeWithLegacyProperties.props = nextProps;
      }
      if (this._tag === 'select') {
        transaction.getReactMountReady().enqueue(postUpdateSelectWrapper, this);
      }
    },
    _updateDOMProperties: function(lastProps, nextProps, transaction) {
      var propKey;
      var styleName;
      var styleUpdates;
      for (propKey in lastProps) {
        if (nextProps.hasOwnProperty(propKey) || !lastProps.hasOwnProperty(propKey)) {
          continue;
        }
        if (propKey === STYLE) {
          var lastStyle = this._previousStyleCopy;
          for (styleName in lastStyle) {
            if (lastStyle.hasOwnProperty(styleName)) {
              styleUpdates = styleUpdates || {};
              styleUpdates[styleName] = '';
            }
          }
          this._previousStyleCopy = null;
        } else if (registrationNameModules.hasOwnProperty(propKey)) {
          if (lastProps[propKey]) {
            deleteListener(this._rootNodeID, propKey);
          }
        } else if (DOMProperty.properties[propKey] || DOMProperty.isCustomAttribute(propKey)) {
          BackendIDOperations.deletePropertyByID(this._rootNodeID, propKey);
        }
      }
      for (propKey in nextProps) {
        var nextProp = nextProps[propKey];
        var lastProp = propKey === STYLE ? this._previousStyleCopy : lastProps[propKey];
        if (!nextProps.hasOwnProperty(propKey) || nextProp === lastProp) {
          continue;
        }
        if (propKey === STYLE) {
          if (nextProp) {
            if ('production' !== process.env.NODE_ENV) {
              checkAndWarnForMutatedStyle(this._previousStyleCopy, this._previousStyle, this);
              this._previousStyle = nextProp;
            }
            nextProp = this._previousStyleCopy = assign({}, nextProp);
          } else {
            this._previousStyleCopy = null;
          }
          if (lastProp) {
            for (styleName in lastProp) {
              if (lastProp.hasOwnProperty(styleName) && (!nextProp || !nextProp.hasOwnProperty(styleName))) {
                styleUpdates = styleUpdates || {};
                styleUpdates[styleName] = '';
              }
            }
            for (styleName in nextProp) {
              if (nextProp.hasOwnProperty(styleName) && lastProp[styleName] !== nextProp[styleName]) {
                styleUpdates = styleUpdates || {};
                styleUpdates[styleName] = nextProp[styleName];
              }
            }
          } else {
            styleUpdates = nextProp;
          }
        } else if (registrationNameModules.hasOwnProperty(propKey)) {
          if (nextProp) {
            enqueuePutListener(this._rootNodeID, propKey, nextProp, transaction);
          } else if (lastProp) {
            deleteListener(this._rootNodeID, propKey);
          }
        } else if (isCustomComponent(this._tag, nextProps)) {
          BackendIDOperations.updateAttributeByID(this._rootNodeID, propKey, nextProp);
        } else if (DOMProperty.properties[propKey] || DOMProperty.isCustomAttribute(propKey)) {
          BackendIDOperations.updatePropertyByID(this._rootNodeID, propKey, nextProp);
        }
      }
      if (styleUpdates) {
        BackendIDOperations.updateStylesByID(this._rootNodeID, styleUpdates);
      }
    },
    _updateDOMChildren: function(lastProps, nextProps, transaction, context) {
      var lastContent = CONTENT_TYPES[typeof lastProps.children] ? lastProps.children : null;
      var nextContent = CONTENT_TYPES[typeof nextProps.children] ? nextProps.children : null;
      var lastHtml = lastProps.dangerouslySetInnerHTML && lastProps.dangerouslySetInnerHTML.__html;
      var nextHtml = nextProps.dangerouslySetInnerHTML && nextProps.dangerouslySetInnerHTML.__html;
      var lastChildren = lastContent != null ? null : lastProps.children;
      var nextChildren = nextContent != null ? null : nextProps.children;
      var lastHasContentOrHtml = lastContent != null || lastHtml != null;
      var nextHasContentOrHtml = nextContent != null || nextHtml != null;
      if (lastChildren != null && nextChildren == null) {
        this.updateChildren(null, transaction, context);
      } else if (lastHasContentOrHtml && !nextHasContentOrHtml) {
        this.updateTextContent('');
      }
      if (nextContent != null) {
        if (lastContent !== nextContent) {
          this.updateTextContent('' + nextContent);
        }
      } else if (nextHtml != null) {
        if (lastHtml !== nextHtml) {
          BackendIDOperations.updateInnerHTMLByID(this._rootNodeID, nextHtml);
        }
      } else if (nextChildren != null) {
        this.updateChildren(nextChildren, transaction, context);
      }
    },
    unmountComponent: function() {
      switch (this._tag) {
        case 'iframe':
        case 'img':
        case 'form':
          var listeners = this._wrapperState.listeners;
          if (listeners) {
            for (var i = 0; i < listeners.length; i++) {
              listeners[i].remove();
            }
          }
          break;
        case 'input':
          ReactDOMInput.unmountWrapper(this);
          break;
        case 'html':
        case 'head':
        case 'body':
          !false ? 'production' !== process.env.NODE_ENV ? invariant(false, '<%s> tried to unmount. Because of cross-browser quirks it is ' + 'impossible to unmount some top-level components (eg <html>, ' + '<head>, and <body>) reliably and efficiently. To fix this, have a ' + 'single top-level component that never unmounts render these ' + 'elements.', this._tag) : invariant(false) : undefined;
          break;
      }
      this.unmountChildren();
      ReactBrowserEventEmitter.deleteAllListeners(this._rootNodeID);
      ReactComponentBrowserEnvironment.unmountIDFromEnvironment(this._rootNodeID);
      this._rootNodeID = null;
      this._wrapperState = null;
      if (this._nodeWithLegacyProperties) {
        var node = this._nodeWithLegacyProperties;
        node._reactInternalComponent = null;
        this._nodeWithLegacyProperties = null;
      }
    },
    getPublicInstance: function() {
      if (!this._nodeWithLegacyProperties) {
        var node = ReactMount.getNode(this._rootNodeID);
        node._reactInternalComponent = this;
        node.getDOMNode = legacyGetDOMNode;
        node.isMounted = legacyIsMounted;
        node.setState = legacySetStateEtc;
        node.replaceState = legacySetStateEtc;
        node.forceUpdate = legacySetStateEtc;
        node.setProps = legacySetProps;
        node.replaceProps = legacyReplaceProps;
        if ('production' !== process.env.NODE_ENV) {
          if (canDefineProperty) {
            Object.defineProperties(node, legacyPropsDescriptor);
          } else {
            node.props = this._currentElement.props;
          }
        } else {
          node.props = this._currentElement.props;
        }
        this._nodeWithLegacyProperties = node;
      }
      return this._nodeWithLegacyProperties;
    }
  };
  ReactPerf.measureMethods(ReactDOMComponent, 'ReactDOMComponent', {
    mountComponent: 'mountComponent',
    updateComponent: 'updateComponent'
  });
  assign(ReactDOMComponent.prototype, ReactDOMComponent.Mixin, ReactMultiChild.Mixin);
  ReactDOMComponent.injection = {injectIDOperations: function(IDOperations) {
      ReactDOMComponent.BackendIDOperations = BackendIDOperations = IDOperations;
    }};
  module.exports = ReactDOMComponent;
})(require("process"));
