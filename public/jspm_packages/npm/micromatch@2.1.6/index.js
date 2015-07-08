/* */ 
'use strict';
var diff = require("arr-diff");
var debug = require("debug")('micromatch');
var typeOf = require("kind-of");
var omit = require("object.omit");
var cache = require("regex-cache");
var isGlob = require("is-glob");
var expand = require("./lib/expand");
var utils = require("./lib/utils");
function micromatch(files, patterns, opts) {
  if (!files || !patterns)
    return [];
  opts = opts || {};
  if (typeof opts.cache === 'undefined') {
    opts.cache = true;
  }
  if (!Array.isArray(patterns)) {
    return match(files, patterns, opts);
  }
  var len = patterns.length,
      i = 0;
  var omit = [],
      keep = [];
  while (len--) {
    var glob = patterns[i++];
    if (glob.charCodeAt(0) === 33) {
      omit.push.apply(omit, match(files, glob.slice(1), opts));
    } else {
      keep.push.apply(keep, match(files, glob, opts));
    }
  }
  return diff(keep, omit);
}
function match(files, pattern, opts) {
  if (typeOf(files) !== 'string' && !Array.isArray(files)) {
    throw new Error(msg('match', 'files', 'a string or array'));
  }
  files = utils.arrayify(files);
  opts = opts || {};
  var negate = opts.negate || false;
  var orig = pattern;
  if (typeof pattern === 'string' && opts.nonegate !== true) {
    negate = pattern.charAt(0) === '!';
    if (negate) {
      pattern = pattern.slice(1);
    }
  }
  var _isMatch = matcher(pattern, opts);
  var len = files.length,
      i = 0;
  var res = [];
  while (i < len) {
    var file = files[i++];
    var fp = utils.unixify(file, opts);
    if (!_isMatch(fp)) {
      continue;
    }
    res.push(fp);
  }
  if (res.length === 0) {
    if (opts.failglob === true) {
      throw new Error('micromatch.match() found no matches for: "' + orig + '".');
    }
    if (opts.nonull || opts.nullglob) {
      res.push(utils.unescapeGlob(orig));
    }
  }
  if (negate) {
    res = diff(files, res);
  }
  if (opts.ignore && opts.ignore.length) {
    pattern = opts.ignore;
    opts = omit(opts, ['ignore']);
    return diff(res, micromatch(res, pattern, opts));
  }
  return res;
}
function filter(patterns, opts) {
  if (!Array.isArray(patterns) && typeof patterns !== 'string') {
    throw new TypeError(msg('filter', 'patterns', 'a string or array'));
  }
  patterns = utils.arrayify(patterns);
  return function(fp) {
    if (fp == null)
      return [];
    var len = patterns.length,
        i = 0;
    var res = true;
    fp = utils.unixify(fp, opts);
    while (i < len) {
      var fn = matcher(patterns[i++], opts);
      if (!fn(fp)) {
        res = false;
        break;
      }
    }
    return res;
  };
}
function isMatch(fp, pattern, opts) {
  if (typeof fp !== 'string') {
    throw new TypeError(msg('isMatch', 'filepath', 'a string'));
  }
  fp = utils.unixify(fp, opts);
  if (typeOf(pattern) === 'object') {
    return matcher(fp, pattern);
  }
  return matcher(pattern, opts)(fp);
}
function contains(fp, pattern, opts) {
  if (typeof fp !== 'string') {
    throw new TypeError(msg('contains', 'pattern', 'a string'));
  }
  opts = opts || {};
  opts.contains = (pattern !== '');
  fp = utils.unixify(fp, opts);
  if (opts.contains && !isGlob(pattern)) {
    return fp.indexOf(pattern) !== -1;
  }
  return matcher(pattern, opts)(fp);
}
function any(fp, patterns, opts) {
  if (!Array.isArray(patterns) && typeof patterns !== 'string') {
    throw new TypeError(msg('any', 'patterns', 'a string or array'));
  }
  patterns = utils.arrayify(patterns);
  var len = patterns.length;
  fp = utils.unixify(fp, opts);
  while (len--) {
    var isMatch = matcher(patterns[len], opts);
    if (isMatch(fp)) {
      return true;
    }
  }
  return false;
}
function matchKeys(obj, glob, options) {
  if (typeOf(obj) !== 'object') {
    throw new TypeError(msg('matchKeys', 'first argument', 'an object'));
  }
  var fn = matcher(glob, options);
  var res = {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key) && fn(key)) {
      res[key] = obj[key];
    }
  }
  return res;
}
function matcher(pattern, opts) {
  if (typeof pattern === 'function') {
    return pattern;
  }
  if (pattern instanceof RegExp) {
    return function(fp) {
      return pattern.test(fp);
    };
  }
  pattern = utils.unixify(pattern, opts);
  if (!isGlob(pattern)) {
    return utils.matchPath(pattern, opts);
  }
  var re = makeRe(pattern, opts);
  if (opts && opts.matchBase) {
    return utils.hasFilename(re, opts);
  }
  return function(fp) {
    fp = utils.unixify(fp, opts);
    return re.test(fp);
  };
}
function toRegex(glob, options) {
  if (typeOf(glob) !== 'string') {
    throw new Error(msg('toRegex', 'glob', 'a string'));
  }
  var opts = Object.create(options || {});
  var flags = opts.flags || '';
  if (opts.nocase && flags.indexOf('i') === -1) {
    flags += 'i';
  }
  var parsed = expand(glob, opts);
  opts.negated = opts.negated || parsed.negated;
  opts.negate = opts.negated;
  glob = wrapGlob(parsed.pattern, opts);
  var re;
  try {
    re = new RegExp(glob, flags);
    return re;
  } catch (err) {
    var msg = 'micromatch invalid regex: (' + re + ')';
    if (opts.strict)
      throw new SyntaxError(msg + err);
  }
  return /$^/;
}
function wrapGlob(glob, opts) {
  var prefix = (opts && !opts.contains) ? '^' : '';
  var after = (opts && !opts.contains) ? '$' : '';
  glob = ('(?:' + glob + ')' + after);
  if (opts && opts.negate) {
    return prefix + ('(?!^' + glob + ').*$');
  }
  return prefix + glob;
}
function makeRe(glob, opts) {
  return cache(toRegex, glob, opts);
}
function msg(method, what, type) {
  return 'micromatch.' + method + '(): ' + what + ' should be ' + type + '.';
}
micromatch.any = any;
micromatch.braces = micromatch.braceExpand = require("braces");
micromatch.contains = contains;
micromatch.expand = expand;
micromatch.filter = filter;
micromatch.isMatch = isMatch;
micromatch.makeRe = makeRe;
micromatch.match = match;
micromatch.matcher = matcher;
micromatch.matchKeys = matchKeys;
module.exports = micromatch;
