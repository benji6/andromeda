/* */ 
var test = require("tap").test;
var wrappy = require("../wrappy");
test('basic', function(t) {
  function onceifier(cb) {
    var called = false;
    return function() {
      if (called)
        return ;
      called = true;
      return cb.apply(this, arguments);
    };
  }
  onceifier.iAmOnce = {};
  var once = wrappy(onceifier);
  t.equal(once.iAmOnce, onceifier.iAmOnce);
  var called = 0;
  function boo() {
    t.equal(called, 0);
    called++;
  }
  boo.iAmBoo = true;
  var onlyPrintOnce = once(boo);
  onlyPrintOnce();
  onlyPrintOnce();
  t.equal(called, 1);
  t.equal(onlyPrintOnce.iAmBoo, true);
  var logs = [];
  var logwrap = wrappy(function(msg, cb) {
    logs.push(msg + ' wrapping cb');
    return function() {
      logs.push(msg + ' before cb');
      var ret = cb.apply(this, arguments);
      logs.push(msg + ' after cb');
    };
  });
  var c = logwrap('foo', function() {
    t.same(logs, ['foo wrapping cb', 'foo before cb']);
  });
  c();
  t.same(logs, ['foo wrapping cb', 'foo before cb', 'foo after cb']);
  t.end();
});
