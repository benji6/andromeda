/* */ 
(function(process) {
  'use strict';
  var PooledClass = require("./PooledClass");
  var ReactFragment = require("./ReactFragment");
  var traverseAllChildren = require("./traverseAllChildren");
  var warning = require("./warning");
  var twoArgumentPooler = PooledClass.twoArgumentPooler;
  var threeArgumentPooler = PooledClass.threeArgumentPooler;
  function ForEachBookKeeping(forEachFunction, forEachContext) {
    this.func = forEachFunction;
    this.context = forEachContext;
    this.count = 0;
  }
  PooledClass.addPoolingTo(ForEachBookKeeping, twoArgumentPooler);
  function forEachSingleChild(traverseContext, child, name) {
    var bookKeeping = traverseContext;
    bookKeeping.func.call(bookKeeping.context, child, bookKeeping.count++);
  }
  function forEachChildren(children, forEachFunc, forEachContext) {
    if (children == null) {
      return children;
    }
    var traverseContext = ForEachBookKeeping.getPooled(forEachFunc, forEachContext);
    traverseAllChildren(children, forEachSingleChild, traverseContext);
    ForEachBookKeeping.release(traverseContext);
  }
  function MapBookKeeping(mapResult, mapFunction, mapContext) {
    this.result = mapResult;
    this.func = mapFunction;
    this.context = mapContext;
    this.count = 0;
  }
  PooledClass.addPoolingTo(MapBookKeeping, threeArgumentPooler);
  function mapSingleChildIntoContext(traverseContext, child, name) {
    var bookKeeping = traverseContext;
    var mapResult = bookKeeping.result;
    var keyUnique = mapResult[name] === undefined;
    if ('production' !== process.env.NODE_ENV) {
      'production' !== process.env.NODE_ENV ? warning(keyUnique, 'ReactChildren.map(...): Encountered two children with the same key, ' + '`%s`. Child keys must be unique; when two children share a key, only ' + 'the first child will be used.', name) : undefined;
    }
    if (keyUnique) {
      var mappedChild = bookKeeping.func.call(bookKeeping.context, child, bookKeeping.count++);
      mapResult[name] = mappedChild;
    }
  }
  function mapChildren(children, func, context) {
    if (children == null) {
      return children;
    }
    var mapResult = {};
    var traverseContext = MapBookKeeping.getPooled(mapResult, func, context);
    traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
    MapBookKeeping.release(traverseContext);
    return ReactFragment.create(mapResult);
  }
  function forEachSingleChildDummy(traverseContext, child, name) {
    return null;
  }
  function countChildren(children, context) {
    return traverseAllChildren(children, forEachSingleChildDummy, null);
  }
  var ReactChildren = {
    forEach: forEachChildren,
    map: mapChildren,
    count: countChildren
  };
  module.exports = ReactChildren;
})(require("process"));
