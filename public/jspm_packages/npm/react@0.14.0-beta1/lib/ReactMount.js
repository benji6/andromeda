/* */ 
(function(process) {
  'use strict';
  var DOMProperty = require("./DOMProperty");
  var ReactBrowserEventEmitter = require("./ReactBrowserEventEmitter");
  var ReactCurrentOwner = require("./ReactCurrentOwner");
  var ReactElement = require("./ReactElement");
  var ReactEmptyComponent = require("./ReactEmptyComponent");
  var ReactInstanceHandles = require("./ReactInstanceHandles");
  var ReactInstanceMap = require("./ReactInstanceMap");
  var ReactMarkupChecksum = require("./ReactMarkupChecksum");
  var ReactPerf = require("./ReactPerf");
  var ReactReconciler = require("./ReactReconciler");
  var ReactUpdateQueue = require("./ReactUpdateQueue");
  var ReactUpdates = require("./ReactUpdates");
  var emptyObject = require("./emptyObject");
  var containsNode = require("./containsNode");
  var instantiateReactComponent = require("./instantiateReactComponent");
  var invariant = require("./invariant");
  var setInnerHTML = require("./setInnerHTML");
  var shouldUpdateReactComponent = require("./shouldUpdateReactComponent");
  var validateDOMNesting = require("./validateDOMNesting");
  var warning = require("./warning");
  var SEPARATOR = ReactInstanceHandles.SEPARATOR;
  var ATTR_NAME = DOMProperty.ID_ATTRIBUTE_NAME;
  var nodeCache = {};
  var ELEMENT_NODE_TYPE = 1;
  var DOC_NODE_TYPE = 9;
  var DOCUMENT_FRAGMENT_NODE_TYPE = 11;
  var instancesByReactRootID = {};
  var containersByReactRootID = {};
  if ('production' !== process.env.NODE_ENV) {
    var rootElementsByReactRootID = {};
  }
  var findComponentRootReusableArray = [];
  function firstDifferenceIndex(string1, string2) {
    var minLen = Math.min(string1.length, string2.length);
    for (var i = 0; i < minLen; i++) {
      if (string1.charAt(i) !== string2.charAt(i)) {
        return i;
      }
    }
    return string1.length === string2.length ? -1 : minLen;
  }
  function getReactRootElementInContainer(container) {
    if (!container) {
      return null;
    }
    if (container.nodeType === DOC_NODE_TYPE) {
      return container.documentElement;
    } else {
      return container.firstChild;
    }
  }
  function getReactRootID(container) {
    var rootElement = getReactRootElementInContainer(container);
    return rootElement && ReactMount.getID(rootElement);
  }
  function getID(node) {
    var id = internalGetID(node);
    if (id) {
      if (nodeCache.hasOwnProperty(id)) {
        var cached = nodeCache[id];
        if (cached !== node) {
          !!isValid(cached, id) ? 'production' !== process.env.NODE_ENV ? invariant(false, 'ReactMount: Two valid but unequal nodes with the same `%s`: %s', ATTR_NAME, id) : invariant(false) : undefined;
          nodeCache[id] = node;
        }
      } else {
        nodeCache[id] = node;
      }
    }
    return id;
  }
  function internalGetID(node) {
    return node && node.getAttribute && node.getAttribute(ATTR_NAME) || '';
  }
  function setID(node, id) {
    var oldID = internalGetID(node);
    if (oldID !== id) {
      delete nodeCache[oldID];
    }
    node.setAttribute(ATTR_NAME, id);
    nodeCache[id] = node;
  }
  function getNode(id) {
    if (!nodeCache.hasOwnProperty(id) || !isValid(nodeCache[id], id)) {
      nodeCache[id] = ReactMount.findReactNodeByID(id);
    }
    return nodeCache[id];
  }
  function getNodeFromInstance(instance) {
    var id = ReactInstanceMap.get(instance)._rootNodeID;
    if (ReactEmptyComponent.isNullComponentID(id)) {
      return null;
    }
    if (!nodeCache.hasOwnProperty(id) || !isValid(nodeCache[id], id)) {
      nodeCache[id] = ReactMount.findReactNodeByID(id);
    }
    return nodeCache[id];
  }
  function isValid(node, id) {
    if (node) {
      !(internalGetID(node) === id) ? 'production' !== process.env.NODE_ENV ? invariant(false, 'ReactMount: Unexpected modification of `%s`', ATTR_NAME) : invariant(false) : undefined;
      var container = ReactMount.findReactContainerForID(id);
      if (container && containsNode(container, node)) {
        return true;
      }
    }
    return false;
  }
  function purgeID(id) {
    delete nodeCache[id];
  }
  var deepestNodeSoFar = null;
  function findDeepestCachedAncestorImpl(ancestorID) {
    var ancestor = nodeCache[ancestorID];
    if (ancestor && isValid(ancestor, ancestorID)) {
      deepestNodeSoFar = ancestor;
    } else {
      return false;
    }
  }
  function findDeepestCachedAncestor(targetID) {
    deepestNodeSoFar = null;
    ReactInstanceHandles.traverseAncestors(targetID, findDeepestCachedAncestorImpl);
    var foundNode = deepestNodeSoFar;
    deepestNodeSoFar = null;
    return foundNode;
  }
  function mountComponentIntoNode(componentInstance, rootID, container, transaction, shouldReuseMarkup, context) {
    if ('production' !== process.env.NODE_ENV) {
      if (context === emptyObject) {
        context = {};
      }
      var tag = container.nodeName.toLowerCase();
      context[validateDOMNesting.ancestorInfoContextKey] = validateDOMNesting.updatedAncestorInfo(null, tag, null);
    }
    var markup = ReactReconciler.mountComponent(componentInstance, rootID, transaction, context);
    componentInstance._renderedComponent._topLevelWrapper = componentInstance;
    ReactMount._mountImageIntoNode(markup, container, shouldReuseMarkup);
  }
  function batchedMountComponentIntoNode(componentInstance, rootID, container, shouldReuseMarkup, context) {
    var transaction = ReactUpdates.ReactReconcileTransaction.getPooled();
    transaction.perform(mountComponentIntoNode, null, componentInstance, rootID, container, transaction, shouldReuseMarkup, context);
    ReactUpdates.ReactReconcileTransaction.release(transaction);
  }
  function unmountComponentFromNode(instance, container) {
    ReactReconciler.unmountComponent(instance);
    if (container.nodeType === DOC_NODE_TYPE) {
      container = container.documentElement;
    }
    while (container.lastChild) {
      container.removeChild(container.lastChild);
    }
  }
  var TopLevelWrapper = function() {};
  TopLevelWrapper.prototype.render = function() {
    return this.props;
  };
  var ReactMount = {
    _instancesByReactRootID: instancesByReactRootID,
    scrollMonitor: function(container, renderCallback) {
      renderCallback();
    },
    _updateRootComponent: function(prevComponent, nextElement, container, callback) {
      ReactMount.scrollMonitor(container, function() {
        ReactUpdateQueue.enqueueElementInternal(prevComponent, nextElement);
        if (callback) {
          ReactUpdateQueue.enqueueCallbackInternal(prevComponent, callback);
        }
      });
      if ('production' !== process.env.NODE_ENV) {
        rootElementsByReactRootID[getReactRootID(container)] = getReactRootElementInContainer(container);
      }
      return prevComponent;
    },
    _registerComponent: function(nextComponent, container) {
      !(container && (container.nodeType === ELEMENT_NODE_TYPE || container.nodeType === DOC_NODE_TYPE || container.nodeType === DOCUMENT_FRAGMENT_NODE_TYPE)) ? 'production' !== process.env.NODE_ENV ? invariant(false, '_registerComponent(...): Target container is not a DOM element.') : invariant(false) : undefined;
      ReactBrowserEventEmitter.ensureScrollValueMonitoring();
      var reactRootID = ReactMount.registerContainer(container);
      instancesByReactRootID[reactRootID] = nextComponent;
      return reactRootID;
    },
    _renderNewRootComponent: function(nextElement, container, shouldReuseMarkup, context) {
      'production' !== process.env.NODE_ENV ? warning(ReactCurrentOwner.current == null, '_renderNewRootComponent(): Render methods should be a pure function ' + 'of props and state; triggering nested component updates from ' + 'render is not allowed. If necessary, trigger nested updates in ' + 'componentDidUpdate. Check the render method of %s.', ReactCurrentOwner.current && ReactCurrentOwner.current.getName() || 'ReactCompositeComponent') : undefined;
      var componentInstance = instantiateReactComponent(nextElement, null);
      var reactRootID = ReactMount._registerComponent(componentInstance, container);
      ReactUpdates.batchedUpdates(batchedMountComponentIntoNode, componentInstance, reactRootID, container, shouldReuseMarkup, context);
      if ('production' !== process.env.NODE_ENV) {
        rootElementsByReactRootID[reactRootID] = getReactRootElementInContainer(container);
      }
      return componentInstance;
    },
    renderSubtreeIntoContainer: function(parentComponent, nextElement, container, callback) {
      !(parentComponent != null && parentComponent._reactInternalInstance != null) ? 'production' !== process.env.NODE_ENV ? invariant(false, 'parentComponent must be a valid React Component') : invariant(false) : undefined;
      return ReactMount._renderSubtreeIntoContainer(parentComponent, nextElement, container, callback);
    },
    _renderSubtreeIntoContainer: function(parentComponent, nextElement, container, callback) {
      !ReactElement.isValidElement(nextElement) ? 'production' !== process.env.NODE_ENV ? invariant(false, 'React.render(): Invalid component element.%s', typeof nextElement === 'string' ? ' Instead of passing an element string, make sure to instantiate ' + 'it by passing it to React.createElement.' : typeof nextElement === 'function' ? ' Instead of passing a component class, make sure to instantiate ' + 'it by passing it to React.createElement.' : nextElement != null && nextElement.props !== undefined ? ' This may be caused by unintentionally loading two independent ' + 'copies of React.' : '') : invariant(false) : undefined;
      'production' !== process.env.NODE_ENV ? warning(!container || !container.tagName || container.tagName.toUpperCase() !== 'BODY', 'render(): Rendering components directly into document.body is ' + 'discouraged, since its children are often manipulated by third-party ' + 'scripts and browser extensions. This may lead to subtle ' + 'reconciliation issues. Try rendering into a container element created ' + 'for your app.') : undefined;
      var nextWrappedElement = new ReactElement(TopLevelWrapper, null, null, null, nextElement);
      var prevComponent = instancesByReactRootID[getReactRootID(container)];
      if (prevComponent) {
        var prevWrappedElement = prevComponent._currentElement;
        var prevElement = prevWrappedElement.props;
        if (shouldUpdateReactComponent(prevElement, nextElement)) {
          return ReactMount._updateRootComponent(prevComponent, nextWrappedElement, container, callback)._renderedComponent.getPublicInstance();
        } else {
          ReactMount.unmountComponentAtNode(container);
        }
      }
      var reactRootElement = getReactRootElementInContainer(container);
      var containerHasReactMarkup = reactRootElement && ReactMount.isRenderedByReact(reactRootElement);
      if ('production' !== process.env.NODE_ENV) {
        if (!containerHasReactMarkup || reactRootElement.nextSibling) {
          var rootElementSibling = reactRootElement;
          while (rootElementSibling) {
            if (ReactMount.isRenderedByReact(rootElementSibling)) {
              'production' !== process.env.NODE_ENV ? warning(false, 'render(): Target node has markup rendered by React, but there ' + 'are unrelated nodes as well. This is most commonly caused by ' + 'white-space inserted around server-rendered markup.') : undefined;
              break;
            }
            rootElementSibling = rootElementSibling.nextSibling;
          }
        }
      }
      var shouldReuseMarkup = containerHasReactMarkup && !prevComponent;
      var component = ReactMount._renderNewRootComponent(nextWrappedElement, container, shouldReuseMarkup, parentComponent != null ? parentComponent._reactInternalInstance._processChildContext(parentComponent._reactInternalInstance._context) : emptyObject)._renderedComponent.getPublicInstance();
      if (callback) {
        callback.call(component);
      }
      return component;
    },
    render: function(nextElement, container, callback) {
      return ReactMount._renderSubtreeIntoContainer(null, nextElement, container, callback);
    },
    registerContainer: function(container) {
      var reactRootID = getReactRootID(container);
      if (reactRootID) {
        reactRootID = ReactInstanceHandles.getReactRootIDFromNodeID(reactRootID);
      }
      if (!reactRootID) {
        reactRootID = ReactInstanceHandles.createReactRootID();
      }
      containersByReactRootID[reactRootID] = container;
      return reactRootID;
    },
    unmountComponentAtNode: function(container) {
      'production' !== process.env.NODE_ENV ? warning(ReactCurrentOwner.current == null, 'unmountComponentAtNode(): Render methods should be a pure function ' + 'of props and state; triggering nested component updates from render ' + 'is not allowed. If necessary, trigger nested updates in ' + 'componentDidUpdate. Check the render method of %s.', ReactCurrentOwner.current && ReactCurrentOwner.current.getName() || 'ReactCompositeComponent') : undefined;
      !(container && (container.nodeType === ELEMENT_NODE_TYPE || container.nodeType === DOC_NODE_TYPE || container.nodeType === DOCUMENT_FRAGMENT_NODE_TYPE)) ? 'production' !== process.env.NODE_ENV ? invariant(false, 'unmountComponentAtNode(...): Target container is not a DOM element.') : invariant(false) : undefined;
      var reactRootID = getReactRootID(container);
      var component = instancesByReactRootID[reactRootID];
      if (!component) {
        return false;
      }
      ReactUpdates.batchedUpdates(unmountComponentFromNode, component, container);
      delete instancesByReactRootID[reactRootID];
      delete containersByReactRootID[reactRootID];
      if ('production' !== process.env.NODE_ENV) {
        delete rootElementsByReactRootID[reactRootID];
      }
      return true;
    },
    findReactContainerForID: function(id) {
      var reactRootID = ReactInstanceHandles.getReactRootIDFromNodeID(id);
      var container = containersByReactRootID[reactRootID];
      if ('production' !== process.env.NODE_ENV) {
        var rootElement = rootElementsByReactRootID[reactRootID];
        if (rootElement && rootElement.parentNode !== container) {
          'production' !== process.env.NODE_ENV ? warning(internalGetID(rootElement) === reactRootID, 'ReactMount: Root element ID differed from reactRootID.') : undefined;
          var containerChild = container.firstChild;
          if (containerChild && reactRootID === internalGetID(containerChild)) {
            rootElementsByReactRootID[reactRootID] = containerChild;
          } else {
            'production' !== process.env.NODE_ENV ? warning(false, 'ReactMount: Root element has been removed from its original ' + 'container. New container: %s', rootElement.parentNode) : undefined;
          }
        }
      }
      return container;
    },
    findReactNodeByID: function(id) {
      var reactRoot = ReactMount.findReactContainerForID(id);
      return ReactMount.findComponentRoot(reactRoot, id);
    },
    isRenderedByReact: function(node) {
      if (node.nodeType !== 1) {
        return false;
      }
      var id = ReactMount.getID(node);
      return id ? id.charAt(0) === SEPARATOR : false;
    },
    getFirstReactDOM: function(node) {
      var current = node;
      while (current && current.parentNode !== current) {
        if (ReactMount.isRenderedByReact(current)) {
          return current;
        }
        current = current.parentNode;
      }
      return null;
    },
    findComponentRoot: function(ancestorNode, targetID) {
      var firstChildren = findComponentRootReusableArray;
      var childIndex = 0;
      var deepestAncestor = findDeepestCachedAncestor(targetID) || ancestorNode;
      firstChildren[0] = deepestAncestor.firstChild;
      firstChildren.length = 1;
      while (childIndex < firstChildren.length) {
        var child = firstChildren[childIndex++];
        var targetChild;
        while (child) {
          var childID = ReactMount.getID(child);
          if (childID) {
            if (targetID === childID) {
              targetChild = child;
            } else if (ReactInstanceHandles.isAncestorIDOf(childID, targetID)) {
              firstChildren.length = childIndex = 0;
              firstChildren.push(child.firstChild);
            }
          } else {
            firstChildren.push(child.firstChild);
          }
          child = child.nextSibling;
        }
        if (targetChild) {
          firstChildren.length = 0;
          return targetChild;
        }
      }
      firstChildren.length = 0;
      !false ? 'production' !== process.env.NODE_ENV ? invariant(false, 'findComponentRoot(..., %s): Unable to find element. This probably ' + 'means the DOM was unexpectedly mutated (e.g., by the browser), ' + 'usually due to forgetting a <tbody> when using tables, nesting tags ' + 'like <form>, <p>, or <a>, or using non-SVG elements in an <svg> ' + 'parent. ' + 'Try inspecting the child nodes of the element with React ID `%s`.', targetID, ReactMount.getID(ancestorNode)) : invariant(false) : undefined;
    },
    _mountImageIntoNode: function(markup, container, shouldReuseMarkup) {
      !(container && (container.nodeType === ELEMENT_NODE_TYPE || container.nodeType === DOC_NODE_TYPE || container.nodeType === DOCUMENT_FRAGMENT_NODE_TYPE)) ? 'production' !== process.env.NODE_ENV ? invariant(false, 'mountComponentIntoNode(...): Target container is not valid.') : invariant(false) : undefined;
      if (shouldReuseMarkup) {
        var rootElement = getReactRootElementInContainer(container);
        if (ReactMarkupChecksum.canReuseMarkup(markup, rootElement)) {
          return ;
        } else {
          var checksum = rootElement.getAttribute(ReactMarkupChecksum.CHECKSUM_ATTR_NAME);
          rootElement.removeAttribute(ReactMarkupChecksum.CHECKSUM_ATTR_NAME);
          var rootMarkup = rootElement.outerHTML;
          rootElement.setAttribute(ReactMarkupChecksum.CHECKSUM_ATTR_NAME, checksum);
          var diffIndex = firstDifferenceIndex(markup, rootMarkup);
          var difference = ' (client) ' + markup.substring(diffIndex - 20, diffIndex + 20) + '\n (server) ' + rootMarkup.substring(diffIndex - 20, diffIndex + 20);
          !(container.nodeType !== DOC_NODE_TYPE) ? 'production' !== process.env.NODE_ENV ? invariant(false, 'You\'re trying to render a component to the document using ' + 'server rendering but the checksum was invalid. This usually ' + 'means you rendered a different component type or props on ' + 'the client from the one on the server, or your render() ' + 'methods are impure. React cannot handle this case due to ' + 'cross-browser quirks by rendering at the document root. You ' + 'should look for environment dependent code in your components ' + 'and ensure the props are the same client and server side:\n%s', difference) : invariant(false) : undefined;
          if ('production' !== process.env.NODE_ENV) {
            'production' !== process.env.NODE_ENV ? warning(false, 'React attempted to reuse markup in a container but the ' + 'checksum was invalid. This generally means that you are ' + 'using server rendering and the markup generated on the ' + 'server was not what the client was expecting. React injected ' + 'new markup to compensate which works but you have lost many ' + 'of the benefits of server rendering. Instead, figure out ' + 'why the markup being generated is different on the client ' + 'or server:\n%s', difference) : undefined;
          }
        }
      }
      !(container.nodeType !== DOC_NODE_TYPE) ? 'production' !== process.env.NODE_ENV ? invariant(false, 'You\'re trying to render a component to the document but ' + 'you didn\'t use server rendering. We can\'t do this ' + 'without using server rendering due to cross-browser quirks. ' + 'See React.renderToString() for server rendering.') : invariant(false) : undefined;
      setInnerHTML(container, markup);
    },
    getReactRootID: getReactRootID,
    getID: getID,
    setID: setID,
    getNode: getNode,
    getNodeFromInstance: getNodeFromInstance,
    purgeID: purgeID
  };
  ReactPerf.measureMethods(ReactMount, 'ReactMount', {
    _renderNewRootComponent: '_renderNewRootComponent',
    _mountImageIntoNode: '_mountImageIntoNode'
  });
  module.exports = ReactMount;
})(require("process"));
