/* */ 
'use strict';
var test = require("tap").test,
    generator = require("inline-source-map"),
    rx = require("../index").commentRegex,
    mapFileRx = require("../index").mapFileCommentRegex;
function comment(prefix, suffix) {
  rx.lastIndex = 0;
  return rx.test(prefix + 'sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlcyI6WyJmdW5jdGlvbiBmb28oKSB7XG4gY29uc29sZS5sb2coXCJoZWxsbyBJIGFtIGZvb1wiKTtcbiBjb25zb2xlLmxvZyhcIndobyBhcmUgeW91XCIpO1xufVxuXG5mb28oKTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSJ9' + suffix);
}
function commentWithCharSet(prefix, suffix, sep) {
  sep = sep || ':';
  rx.lastIndex = 0;
  return rx.test(prefix + 'sourceMappingURL=data:application/json;charset' + sep + 'utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlcyI6WyJmdW5jdGlvbiBmb28oKSB7XG4gY29uc29sZS5sb2coXCJoZWxsbyBJIGFtIGZvb1wiKTtcbiBjb25zb2xlLmxvZyhcIndobyBhcmUgeW91XCIpO1xufVxuXG5mb28oKTtcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSJ9' + suffix);
}
test('comment regex old spec - @', function(t) {
  ['//@ ', '  //@ ', '\t//@ ', '//@ ', '/*@ ', '  /*@ ', '\t/*@ ', '/*@ '].forEach(function(x) {
    t.ok(comment(x, ''), 'matches ' + x);
    t.ok(commentWithCharSet(x, ''), 'matches ' + x + ' with charset');
    t.ok(commentWithCharSet(x, '', '='), 'matches ' + x + ' with charset');
  });
  [' @// @', ' @/* @'].forEach(function(x) {
    t.ok(!comment(x, ''), 'should not match ' + x);
  });
  t.end();
});
test('comment regex new spec - #', function(t) {
  ['  //# ', '\t//# ', '//# ', '/*# ', '  /*# ', '\t/*# ', '/*# '].forEach(function(x) {
    t.ok(comment(x, ''), 'matches ' + x);
    t.ok(commentWithCharSet(x, ''), 'matches ' + x + ' with charset');
    t.ok(commentWithCharSet(x, '', '='), 'matches ' + x + ' with charset');
  });
  [' #// #', ' #/* #'].forEach(function(x) {
    t.ok(!comment(x, ''), 'should not match ' + x);
  });
  t.end();
});
function mapFileCommentWrap(s1, s2) {
  mapFileRx.lastIndex = 0;
  return mapFileRx.test(s1 + 'sourceMappingURL=foo.js.map' + s2);
}
test('mapFileComment regex old spec - @', function(t) {
  [['//@ ', ''], ['  //@ ', ''], ['\t//@ ', ''], ['///@ ', ''], [';//@ ', ''], ['return//@ ', '']].forEach(function(x) {
    t.ok(mapFileCommentWrap(x[0], x[1]), 'matches ' + x.join(' :: '));
  });
  [[' @// @', ''], ['var sm = "//@ ', '"'], ['var sm = \'//@ ', '\''], ['var sm = \' //@ ', '\'']].forEach(function(x) {
    t.ok(!mapFileCommentWrap(x[0], x[1]), 'does not match ' + x.join(' :: '));
  });
  t.end();
});
test('mapFileComment regex new spec - #', function(t) {
  [['//# ', ''], ['  //# ', ''], ['\t//# ', ''], ['///# ', ''], [';//# ', ''], ['return//# ', '']].forEach(function(x) {
    t.ok(mapFileCommentWrap(x[0], x[1]), 'matches ' + x.join(' :: '));
  });
  [[' #// #', ''], ['var sm = "//# ', '"'], ['var sm = \'//# ', '\''], ['var sm = \' //# ', '\'']].forEach(function(x) {
    t.ok(!mapFileCommentWrap(x[0], x[1]), 'does not match ' + x.join(' :: '));
  });
  t.end();
});
test('mapFileComment regex /* */ old spec - @', function(t) {
  [['/*@ ', '*/'], ['  /*@ ', '  */ '], ['\t/*@ ', ' \t*/\t '], ['leading string/*@ ', '*/'], ['/*@ ', ' \t*/\t ']].forEach(function(x) {
    t.ok(mapFileCommentWrap(x[0], x[1]), 'matches ' + x.join(' :: '));
  });
  [['/*@ ', ' */ */ '], ['/*@ ', ' */ more text ']].forEach(function(x) {
    t.ok(!mapFileCommentWrap(x[0], x[1]), 'does not match ' + x.join(' :: '));
  });
  t.end();
});
test('mapFileComment regex /* */ new spec - #', function(t) {
  [['/*# ', '*/'], ['  /*# ', '  */ '], ['\t/*# ', ' \t*/\t '], ['leading string/*# ', '*/'], ['/*# ', ' \t*/\t ']].forEach(function(x) {
    t.ok(mapFileCommentWrap(x[0], x[1]), 'matches ' + x.join(' :: '));
  });
  [['/*# ', ' */ */ '], ['/*# ', ' */ more text ']].forEach(function(x) {
    t.ok(!mapFileCommentWrap(x[0], x[1]), 'does not match ' + x.join(' :: '));
  });
  t.end();
});
