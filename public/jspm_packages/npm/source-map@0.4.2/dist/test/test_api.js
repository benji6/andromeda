/* */ 
"format cjs";
Components.utils.import('resource://test/Utils.jsm');
define("test/source-map/test-api", ["require", "exports", "module"], function(require, exports, module) {
  var sourceMap;
  try {
    sourceMap = require("../../lib/source-map");
  } catch (e) {
    sourceMap = {};
    Components.utils.import('resource:///modules/devtools/SourceMap.jsm', sourceMap);
  }
  exports['test that the api is properly exposed in the top level'] = function(assert, util) {
    assert.equal(typeof sourceMap.SourceMapGenerator, "function");
    assert.equal(typeof sourceMap.SourceMapConsumer, "function");
    assert.equal(typeof sourceMap.SourceNode, "function");
  };
});
function run_test() {
  runSourceMapTests('test/source-map/test-api', do_throw);
}
