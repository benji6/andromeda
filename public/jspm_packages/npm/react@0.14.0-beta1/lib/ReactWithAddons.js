/* */ 
(function(process) {
  'use strict';
  var LinkedStateMixin = require("./LinkedStateMixin");
  var React = require("./React");
  var ReactComponentWithPureRenderMixin = require("./ReactComponentWithPureRenderMixin");
  var ReactCSSTransitionGroup = require("./ReactCSSTransitionGroup");
  var ReactFragment = require("./ReactFragment");
  var ReactTransitionGroup = require("./ReactTransitionGroup");
  var ReactUpdates = require("./ReactUpdates");
  var cloneWithProps = require("./cloneWithProps");
  var shallowCompare = require("./shallowCompare");
  var update = require("./update");
  React.addons = {
    CSSTransitionGroup: ReactCSSTransitionGroup,
    LinkedStateMixin: LinkedStateMixin,
    PureRenderMixin: ReactComponentWithPureRenderMixin,
    TransitionGroup: ReactTransitionGroup,
    batchedUpdates: ReactUpdates.batchedUpdates,
    cloneWithProps: cloneWithProps,
    createFragment: ReactFragment.create,
    shallowCompare: shallowCompare,
    update: update
  };
  if ('production' !== process.env.NODE_ENV) {
    React.addons.Perf = require("./ReactDefaultPerf");
    React.addons.TestUtils = require("./ReactTestUtils");
  }
  module.exports = React;
})(require("process"));
