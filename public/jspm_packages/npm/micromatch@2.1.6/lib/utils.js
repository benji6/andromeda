/* */ 
(function(process) {
  'use strict';
  var path = require("path");
  var fileRe = require("filename-regex");
  var win32 = process && process.platform === 'win32';
  var win;
  var utils = {};
  utils.filename = function filename(fp) {
    var seg = fp.match(fileRe());
    return seg && seg[0];
  };
  utils.isPath = function isPath(pattern, opts) {
    return function(fp) {
      return utils.unixify(fp, opts) === pattern;
    };
  };
  utils.hasPath = function hasPath(pattern, opts) {
    return function(fp) {
      return utils.unixify(fp, opts).indexOf(pattern) !== -1;
    };
  };
  utils.matchPath = function matchPath(pattern, opts) {
    var fn = (opts && opts.contains) ? utils.hasPath(pattern, opts) : utils.isPath(pattern, opts);
    return fn;
  };
  utils.hasFilename = function hasFilename(re) {
    return function(fp) {
      var name = utils.filename(fp);
      return name && re.test(name);
    };
  };
  utils.arrayify = function arrayify(val) {
    return !Array.isArray(val) ? [val] : val;
  };
  utils.unixify = function unixify(fp, opts) {
    if (opts && opts.unixify === false)
      return fp;
    if (opts && opts.unixify === true || win32 || path.sep === '\\') {
      return fp.split('\\').join('/');
    }
    return fp;
  };
  utils.escapePath = function escapePath(fp) {
    return fp.replace(/[\\.]/g, '\\$&');
  };
  utils.unescapeGlob = function unescapeGlob(fp) {
    return fp.replace(/[\\"']/g, '');
  };
  utils.escapeRe = function escapeRe(str) {
    return str.replace(/[-[\\$*+?.#^\s{}(|)\]]/g, '\\$&');
  };
  module.exports = utils;
})(require("process"));
