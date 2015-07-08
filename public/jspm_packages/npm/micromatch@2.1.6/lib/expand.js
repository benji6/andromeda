/* */ 
(function(process) {
  'use strict';
  var utils = require("./utils");
  var Glob = require("./glob");
  module.exports = expand;
  function expand(pattern, options) {
    if (typeof pattern !== 'string') {
      throw new TypeError('micromatch.expand(): argument should be a string.');
    }
    var glob = new Glob(pattern, options || {});
    var opts = glob.options;
    if (specialCase(pattern) && opts.safemode) {
      return new RegExp(utils.escapeRe(pattern), 'g');
    }
    if (opts.nonegate !== true) {
      opts.negated = glob.negated;
    }
    glob._replace('/.', '/\\.');
    glob.parse();
    var tok = glob.tokens;
    tok.is.negated = opts.negated;
    if (tok.is.dotfile) {
      glob.options.dot = true;
      opts.dot = true;
    }
    if (!tok.is.glob) {
      return {
        pattern: utils.escapePath(glob.pattern),
        tokens: tok,
        options: opts
      };
    }
    if (/[{,]\./.test(glob.pattern)) {
      opts.makeRe = false;
      opts.dot = true;
    }
    glob.track('before brackets');
    if (tok.is.brackets) {
      glob.brackets();
    }
    glob.track('before braces');
    if (tok.is.braces) {
      glob.braces();
    }
    glob.track('after braces');
    glob._replace('[]', '\\[\\]');
    glob._replace('(?', '__QMARK_GROUP__');
    glob._replace(/^(\w):([\\\/]+?)/gi, lookahead + '$1:$2', true);
    if (glob.pattern.indexOf('[^') !== -1) {
      glob.pattern = negateSlash(glob.pattern);
    }
    if (glob.pattern === '**' && opts.globstar !== false) {
      glob.pattern = globstar(opts);
    } else {
      if (/^\*\.\w*$/.test(glob.pattern)) {
        glob._replace('*', star(opts.dot) + '\\');
        glob._replace('__QMARK_GROUP__', '(?');
        return glob;
      }
      glob._replace(/(\/\*)+/g, function(match) {
        var len = match.length / 2;
        if (len === 1) {
          return match;
        }
        return '(?:\\/*){' + len + '}';
      });
      glob.pattern = balance(glob.pattern, '[', ']');
      glob.escape(glob.pattern);
      if (tok.path.dirname === '' && !tok.is.globstar) {
        glob.track('before expand filename');
        return expandFilename(glob, opts);
      }
      if (tok.is.globstar) {
        glob._replace(/\*{2,}/g, '**');
        glob.pattern = collapse(glob.pattern, '/**');
        glob.pattern = optionalGlobstar(glob.pattern);
        glob._replace(/(^|[^\\])\*{2,}([^\\]|$)/g, '$1**$2');
        glob._replace(/(\w+)\*(?!\/)/g, '(?=.)$1[^/]*?', true);
        glob._replace('**', globstar(opts), true);
      }
      glob._replace(/\/\*$/, '\\/' + stardot(opts), true);
      glob._replace(/(?!\/)\*$/, boxQ, true);
      glob._replace('*', stardot(opts), true);
      glob._replace('?.', '?\\.', true);
      glob._replace('?:', '?:', true);
      glob._replace(/\?+/g, function(match) {
        var len = match.length;
        if (len === 1) {
          return box;
        }
        return box + '{' + len + '}';
      });
      glob._replace(/\.([*\w]+)/g, '\\.$1');
      glob._replace(/\[\^[\\\/]+\]/g, box);
      glob._replace(/\/+/g, '\\/');
      glob._replace(/\\{2,}/g, '\\');
    }
    glob._replace('__QMARK_GROUP__', '(?');
    glob.unescape(glob.pattern);
    glob._replace('__UNESC_STAR__', '*');
    glob._replace('%~', '?');
    glob._replace('%%', '*');
    glob._replace('?.', '?\\.');
    glob._replace('[^\\/]', '[^/]');
    return glob;
  }
  function expandFilename(glob, opts) {
    var tok = glob.tokens;
    switch (glob.pattern) {
      case '.':
        glob.pattern = '\\.';
        break;
      case '.*':
        glob.pattern = '\\..*';
        break;
      case '*.*':
        glob.pattern = star(opts.dot) + '\\.[^/]*?';
        break;
      case '*':
        glob.pattern = star(opts.dot);
        break;
      default:
        if (tok.path.filename === '*' && !tok.path.dirname) {
          glob.pattern = star(opts.dot) + '\\' + glob.pattern.slice(1);
        } else {
          glob._replace(/(?!\()\?/g, '[^/]');
          if (tok.path.basename.charAt(0) !== '.') {
            opts.dot = true;
          }
          glob._replace('*', star(opts.dot));
        }
    }
    if (glob.pattern.charAt(0) === '.') {
      glob.pattern = '\\' + glob.pattern;
    }
    glob._replace('__QMARK_GROUP__', '(?');
    glob.unescape(glob.pattern);
    glob._replace('__UNESC_STAR__', '*');
    glob._replace('%~', '?');
    glob._replace('%%', '*');
    return glob;
  }
  function specialCase(glob) {
    if (glob === '\\') {
      return true;
    }
    return false;
  }
  function collapse(str, ch, repeat) {
    var res = str.split(ch);
    var len = res.length;
    var isFirst = res[0] === '';
    var isLast = res[res.length - 1] === '';
    res = res.filter(Boolean);
    if (isFirst) {
      res.unshift('');
    }
    if (isLast) {
      res.push('');
    }
    var diff = len - res.length;
    if (repeat && diff >= 1) {
      ch = '(?:' + ch + '){' + (diff + 1) + '}';
    }
    return res.join(ch);
  }
  function optionalGlobstar(glob) {
    if (/[^\/]\/\*\*\/[^\/]/.test(glob)) {
      var tmp = glob.split('/**/').join('/');
      glob = '(?:' + tmp + '|' + glob + ')';
    } else if (/^\*\*\/[^\/]/.test(glob)) {
      glob = glob.split(/^\*\*\//).join('(^|.+\\/)');
    }
    return glob;
  }
  function negateSlash(str) {
    var re = /\[\^([^\]]*?)\]/g;
    return str.replace(re, function(match, inner) {
      if (inner.indexOf('/') === -1) {
        inner = '\\/' + inner;
      }
      return '[^' + inner + ']';
    });
  }
  function balance(str, a, b) {
    var aarr = str.split(a);
    var alen = aarr.join('').length;
    var blen = str.split(b).join('').length;
    if (alen !== blen) {
      str = aarr.join('\\' + a);
      return str.split(b).join('\\' + b);
    }
    return str;
  }
  function esc(str) {
    str = str.split('?').join('%~');
    str = str.split('*').join('%%');
    return str;
  }
  var box = '[^/]';
  var boxQ = '[^/]*?';
  var lookahead = '(?=.)';
  var nodot = '(?!\\.)(?=.)';
  var ex = {};
  ex.dotfileGlob = '(?:^|\\/)(?:\\.{1,2})(?:$|\\/)';
  ex.stardot = '(?!' + ex.dotfileGlob + ')(?=.)[^/]*?';
  ex.twoStarDot = '(?:(?!' + ex.dotfileGlob + ').)*?';
  function star(dotfile) {
    return dotfile ? boxQ : nodot + boxQ;
  }
  function dotstarbase(dotfile) {
    var re = dotfile ? ex.dotfileGlob : '\\.';
    return '(?!' + re + ')' + lookahead;
  }
  function globstar(opts) {
    if (opts.dot) {
      return ex.twoStarDot;
    }
    return '(?:(?!(?:^|\\/)\\.).)*?';
  }
  function stardot(opts) {
    return dotstarbase(opts && opts.dot) + '[^/]*?';
  }
})(require("process"));
