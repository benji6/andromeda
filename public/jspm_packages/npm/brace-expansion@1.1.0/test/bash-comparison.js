/* */ 
var test = require("tape");
var expand = require("../index");
var fs = require("fs");
var resfile = __dirname + '/bash-results.txt';
var cases = fs.readFileSync(resfile, 'utf8').split('><><><><');
cases.pop();
test('matches bash expansions', function(t) {
  cases.forEach(function(testcase) {
    var set = testcase.split('\n');
    var pattern = set.shift();
    var actual = expand(pattern);
    if (set.length === 1 && set[0] === '') {
      set = [];
    } else {
      set = set.map(function(s) {
        return s.replace(/^\[|\]$/g, '');
      });
    }
    t.same(actual, set, pattern);
  });
  t.end();
});
