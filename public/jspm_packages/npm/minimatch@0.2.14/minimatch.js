/* */ 
(function(process) {
  ;
  (function(require, exports, module, platform) {
    if (module)
      module.exports = minimatch;
    else
      exports.minimatch = minimatch;
    if (!require) {
      require = function(id) {
        switch (id) {
          case "sigmund":
            return function sigmund(obj) {
              return JSON.stringify(obj);
            };
          case "path":
            return {basename: function(f) {
                f = f.split(/[\/\\]/);
                var e = f.pop();
                if (!e)
                  e = f.pop();
                return e;
              }};
          case "lru-cache":
            return function LRUCache() {
              var cache = {};
              var cnt = 0;
              this.set = function(k, v) {
                cnt++;
                if (cnt >= 100)
                  cache = {};
                cache[k] = v;
              };
              this.get = function(k) {
                return cache[k];
              };
            };
        }
      };
    }
    minimatch.Minimatch = Minimatch;
    var LRU = require("lru-cache"),
        cache = minimatch.cache = new LRU({max: 100}),
        GLOBSTAR = minimatch.GLOBSTAR = Minimatch.GLOBSTAR = {},
        sigmund = require("sigmund");
    var path = require("path"),
        qmark = "[^/]",
        star = qmark + "*?",
        twoStarDot = "(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?",
        twoStarNoDot = "(?:(?!(?:\\\/|^)\\.).)*?",
        reSpecials = charSet("().*{}+?[]^$\\!");
    function charSet(s) {
      return s.split("").reduce(function(set, c) {
        set[c] = true;
        return set;
      }, {});
    }
    var slashSplit = /\/+/;
    minimatch.filter = filter;
    function filter(pattern, options) {
      options = options || {};
      return function(p, i, list) {
        return minimatch(p, pattern, options);
      };
    }
    function ext(a, b) {
      a = a || {};
      b = b || {};
      var t = {};
      Object.keys(b).forEach(function(k) {
        t[k] = b[k];
      });
      Object.keys(a).forEach(function(k) {
        t[k] = a[k];
      });
      return t;
    }
    minimatch.defaults = function(def) {
      if (!def || !Object.keys(def).length)
        return minimatch;
      var orig = minimatch;
      var m = function minimatch(p, pattern, options) {
        return orig.minimatch(p, pattern, ext(def, options));
      };
      m.Minimatch = function Minimatch(pattern, options) {
        return new orig.Minimatch(pattern, ext(def, options));
      };
      return m;
    };
    Minimatch.defaults = function(def) {
      if (!def || !Object.keys(def).length)
        return Minimatch;
      return minimatch.defaults(def).Minimatch;
    };
    function minimatch(p, pattern, options) {
      if (typeof pattern !== "string") {
        throw new TypeError("glob pattern string required");
      }
      if (!options)
        options = {};
      if (!options.nocomment && pattern.charAt(0) === "#") {
        return false;
      }
      if (pattern.trim() === "")
        return p === "";
      return new Minimatch(pattern, options).match(p);
    }
    function Minimatch(pattern, options) {
      if (!(this instanceof Minimatch)) {
        return new Minimatch(pattern, options, cache);
      }
      if (typeof pattern !== "string") {
        throw new TypeError("glob pattern string required");
      }
      if (!options)
        options = {};
      pattern = pattern.trim();
      if (platform === "win32") {
        pattern = pattern.split("\\").join("/");
      }
      var cacheKey = pattern + "\n" + sigmund(options);
      var cached = minimatch.cache.get(cacheKey);
      if (cached)
        return cached;
      minimatch.cache.set(cacheKey, this);
      this.options = options;
      this.set = [];
      this.pattern = pattern;
      this.regexp = null;
      this.negate = false;
      this.comment = false;
      this.empty = false;
      this.make();
    }
    Minimatch.prototype.debug = function() {};
    Minimatch.prototype.make = make;
    function make() {
      if (this._made)
        return ;
      var pattern = this.pattern;
      var options = this.options;
      if (!options.nocomment && pattern.charAt(0) === "#") {
        this.comment = true;
        return ;
      }
      if (!pattern) {
        this.empty = true;
        return ;
      }
      this.parseNegate();
      var set = this.globSet = this.braceExpand();
      if (options.debug)
        this.debug = console.error;
      this.debug(this.pattern, set);
      set = this.globParts = set.map(function(s) {
        return s.split(slashSplit);
      });
      this.debug(this.pattern, set);
      set = set.map(function(s, si, set) {
        return s.map(this.parse, this);
      }, this);
      this.debug(this.pattern, set);
      set = set.filter(function(s) {
        return -1 === s.indexOf(false);
      });
      this.debug(this.pattern, set);
      this.set = set;
    }
    Minimatch.prototype.parseNegate = parseNegate;
    function parseNegate() {
      var pattern = this.pattern,
          negate = false,
          options = this.options,
          negateOffset = 0;
      if (options.nonegate)
        return ;
      for (var i = 0,
          l = pattern.length; i < l && pattern.charAt(i) === "!"; i++) {
        negate = !negate;
        negateOffset++;
      }
      if (negateOffset)
        this.pattern = pattern.substr(negateOffset);
      this.negate = negate;
    }
    minimatch.braceExpand = function(pattern, options) {
      return new Minimatch(pattern, options).braceExpand();
    };
    Minimatch.prototype.braceExpand = braceExpand;
    function braceExpand(pattern, options) {
      options = options || this.options;
      pattern = typeof pattern === "undefined" ? this.pattern : pattern;
      if (typeof pattern === "undefined") {
        throw new Error("undefined pattern");
      }
      if (options.nobrace || !pattern.match(/\{.*\}/)) {
        return [pattern];
      }
      var escaping = false;
      if (pattern.charAt(0) !== "{") {
        this.debug(pattern);
        var prefix = null;
        for (var i = 0,
            l = pattern.length; i < l; i++) {
          var c = pattern.charAt(i);
          this.debug(i, c);
          if (c === "\\") {
            escaping = !escaping;
          } else if (c === "{" && !escaping) {
            prefix = pattern.substr(0, i);
            break;
          }
        }
        if (prefix === null) {
          this.debug("no sets");
          return [pattern];
        }
        var tail = braceExpand.call(this, pattern.substr(i), options);
        return tail.map(function(t) {
          return prefix + t;
        });
      }
      var numset = pattern.match(/^\{(-?[0-9]+)\.\.(-?[0-9]+)\}/);
      if (numset) {
        this.debug("numset", numset[1], numset[2]);
        var suf = braceExpand.call(this, pattern.substr(numset[0].length), options),
            start = +numset[1],
            end = +numset[2],
            inc = start > end ? -1 : 1,
            set = [];
        for (var i = start; i != (end + inc); i += inc) {
          for (var ii = 0,
              ll = suf.length; ii < ll; ii++) {
            set.push(i + suf[ii]);
          }
        }
        return set;
      }
      var i = 1,
          depth = 1,
          set = [],
          member = "",
          sawEnd = false,
          escaping = false;
      function addMember() {
        set.push(member);
        member = "";
      }
      this.debug("Entering for");
      FOR: for (i = 1, l = pattern.length; i < l; i++) {
        var c = pattern.charAt(i);
        this.debug("", i, c);
        if (escaping) {
          escaping = false;
          member += "\\" + c;
        } else {
          switch (c) {
            case "\\":
              escaping = true;
              continue;
            case "{":
              depth++;
              member += "{";
              continue;
            case "}":
              depth--;
              if (depth === 0) {
                addMember();
                i++;
                break FOR;
              } else {
                member += c;
                continue;
              }
            case ",":
              if (depth === 1) {
                addMember();
              } else {
                member += c;
              }
              continue;
            default:
              member += c;
              continue;
          }
        }
      }
      if (depth !== 0) {
        this.debug("didn't close", pattern);
        return braceExpand.call(this, "\\" + pattern, options);
      }
      this.debug("set", set);
      this.debug("suffix", pattern.substr(i));
      var suf = braceExpand.call(this, pattern.substr(i), options);
      var addBraces = set.length === 1;
      this.debug("set pre-expanded", set);
      set = set.map(function(p) {
        return braceExpand.call(this, p, options);
      }, this);
      this.debug("set expanded", set);
      set = set.reduce(function(l, r) {
        return l.concat(r);
      });
      if (addBraces) {
        set = set.map(function(s) {
          return "{" + s + "}";
        });
      }
      var ret = [];
      for (var i = 0,
          l = set.length; i < l; i++) {
        for (var ii = 0,
            ll = suf.length; ii < ll; ii++) {
          ret.push(set[i] + suf[ii]);
        }
      }
      return ret;
    }
    Minimatch.prototype.parse = parse;
    var SUBPARSE = {};
    function parse(pattern, isSub) {
      var options = this.options;
      if (!options.noglobstar && pattern === "**")
        return GLOBSTAR;
      if (pattern === "")
        return "";
      var re = "",
          hasMagic = !!options.nocase,
          escaping = false,
          patternListStack = [],
          plType,
          stateChar,
          inClass = false,
          reClassStart = -1,
          classStart = -1,
          patternStart = pattern.charAt(0) === "." ? "" : options.dot ? "(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))" : "(?!\\.)",
          self = this;
      function clearStateChar() {
        if (stateChar) {
          switch (stateChar) {
            case "*":
              re += star;
              hasMagic = true;
              break;
            case "?":
              re += qmark;
              hasMagic = true;
              break;
            default:
              re += "\\" + stateChar;
              break;
          }
          self.debug('clearStateChar %j %j', stateChar, re);
          stateChar = false;
        }
      }
      for (var i = 0,
          len = pattern.length,
          c; (i < len) && (c = pattern.charAt(i)); i++) {
        this.debug("%s\t%s %s %j", pattern, i, re, c);
        if (escaping && reSpecials[c]) {
          re += "\\" + c;
          escaping = false;
          continue;
        }
        SWITCH: switch (c) {
          case "/":
            return false;
          case "\\":
            clearStateChar();
            escaping = true;
            continue;
          case "?":
          case "*":
          case "+":
          case "@":
          case "!":
            this.debug("%s\t%s %s %j <-- stateChar", pattern, i, re, c);
            if (inClass) {
              this.debug('  in class');
              if (c === "!" && i === classStart + 1)
                c = "^";
              re += c;
              continue;
            }
            self.debug('call clearStateChar %j', stateChar);
            clearStateChar();
            stateChar = c;
            if (options.noext)
              clearStateChar();
            continue;
          case "(":
            if (inClass) {
              re += "(";
              continue;
            }
            if (!stateChar) {
              re += "\\(";
              continue;
            }
            plType = stateChar;
            patternListStack.push({
              type: plType,
              start: i - 1,
              reStart: re.length
            });
            re += stateChar === "!" ? "(?:(?!" : "(?:";
            this.debug('plType %j %j', stateChar, re);
            stateChar = false;
            continue;
          case ")":
            if (inClass || !patternListStack.length) {
              re += "\\)";
              continue;
            }
            clearStateChar();
            hasMagic = true;
            re += ")";
            plType = patternListStack.pop().type;
            switch (plType) {
              case "!":
                re += "[^/]*?)";
                break;
              case "?":
              case "+":
              case "*":
                re += plType;
              case "@":
                break;
            }
            continue;
          case "|":
            if (inClass || !patternListStack.length || escaping) {
              re += "\\|";
              escaping = false;
              continue;
            }
            clearStateChar();
            re += "|";
            continue;
          case "[":
            clearStateChar();
            if (inClass) {
              re += "\\" + c;
              continue;
            }
            inClass = true;
            classStart = i;
            reClassStart = re.length;
            re += c;
            continue;
          case "]":
            if (i === classStart + 1 || !inClass) {
              re += "\\" + c;
              escaping = false;
              continue;
            }
            hasMagic = true;
            inClass = false;
            re += c;
            continue;
          default:
            clearStateChar();
            if (escaping) {
              escaping = false;
            } else if (reSpecials[c] && !(c === "^" && inClass)) {
              re += "\\";
            }
            re += c;
        }
      }
      if (inClass) {
        var cs = pattern.substr(classStart + 1),
            sp = this.parse(cs, SUBPARSE);
        re = re.substr(0, reClassStart) + "\\[" + sp[0];
        hasMagic = hasMagic || sp[1];
      }
      var pl;
      while (pl = patternListStack.pop()) {
        var tail = re.slice(pl.reStart + 3);
        tail = tail.replace(/((?:\\{2})*)(\\?)\|/g, function(_, $1, $2) {
          if (!$2) {
            $2 = "\\";
          }
          return $1 + $1 + $2 + "|";
        });
        this.debug("tail=%j\n   %s", tail, tail);
        var t = pl.type === "*" ? star : pl.type === "?" ? qmark : "\\" + pl.type;
        hasMagic = true;
        re = re.slice(0, pl.reStart) + t + "\\(" + tail;
      }
      clearStateChar();
      if (escaping) {
        re += "\\\\";
      }
      var addPatternStart = false;
      switch (re.charAt(0)) {
        case ".":
        case "[":
        case "(":
          addPatternStart = true;
      }
      if (re !== "" && hasMagic)
        re = "(?=.)" + re;
      if (addPatternStart)
        re = patternStart + re;
      if (isSub === SUBPARSE) {
        return [re, hasMagic];
      }
      if (!hasMagic) {
        return globUnescape(pattern);
      }
      var flags = options.nocase ? "i" : "",
          regExp = new RegExp("^" + re + "$", flags);
      regExp._glob = pattern;
      regExp._src = re;
      return regExp;
    }
    minimatch.makeRe = function(pattern, options) {
      return new Minimatch(pattern, options || {}).makeRe();
    };
    Minimatch.prototype.makeRe = makeRe;
    function makeRe() {
      if (this.regexp || this.regexp === false)
        return this.regexp;
      var set = this.set;
      if (!set.length)
        return this.regexp = false;
      var options = this.options;
      var twoStar = options.noglobstar ? star : options.dot ? twoStarDot : twoStarNoDot,
          flags = options.nocase ? "i" : "";
      var re = set.map(function(pattern) {
        return pattern.map(function(p) {
          return (p === GLOBSTAR) ? twoStar : (typeof p === "string") ? regExpEscape(p) : p._src;
        }).join("\\\/");
      }).join("|");
      re = "^(?:" + re + ")$";
      if (this.negate)
        re = "^(?!" + re + ").*$";
      try {
        return this.regexp = new RegExp(re, flags);
      } catch (ex) {
        return this.regexp = false;
      }
    }
    minimatch.match = function(list, pattern, options) {
      var mm = new Minimatch(pattern, options);
      list = list.filter(function(f) {
        return mm.match(f);
      });
      if (options.nonull && !list.length) {
        list.push(pattern);
      }
      return list;
    };
    Minimatch.prototype.match = match;
    function match(f, partial) {
      this.debug("match", f, this.pattern);
      if (this.comment)
        return false;
      if (this.empty)
        return f === "";
      if (f === "/" && partial)
        return true;
      var options = this.options;
      if (platform === "win32") {
        f = f.split("\\").join("/");
      }
      f = f.split(slashSplit);
      this.debug(this.pattern, "split", f);
      var set = this.set;
      this.debug(this.pattern, "set", set);
      var splitFile = path.basename(f.join("/")).split("/");
      for (var i = 0,
          l = set.length; i < l; i++) {
        var pattern = set[i],
            file = f;
        if (options.matchBase && pattern.length === 1) {
          file = splitFile;
        }
        var hit = this.matchOne(file, pattern, partial);
        if (hit) {
          if (options.flipNegate)
            return true;
          return !this.negate;
        }
      }
      if (options.flipNegate)
        return false;
      return this.negate;
    }
    Minimatch.prototype.matchOne = function(file, pattern, partial) {
      var options = this.options;
      this.debug("matchOne", {
        "this": this,
        file: file,
        pattern: pattern
      });
      this.debug("matchOne", file.length, pattern.length);
      for (var fi = 0,
          pi = 0,
          fl = file.length,
          pl = pattern.length; (fi < fl) && (pi < pl); fi++, pi++) {
        this.debug("matchOne loop");
        var p = pattern[pi],
            f = file[fi];
        this.debug(pattern, p, f);
        if (p === false)
          return false;
        if (p === GLOBSTAR) {
          this.debug('GLOBSTAR', [pattern, p, f]);
          var fr = fi,
              pr = pi + 1;
          if (pr === pl) {
            this.debug('** at the end');
            for (; fi < fl; fi++) {
              if (file[fi] === "." || file[fi] === ".." || (!options.dot && file[fi].charAt(0) === "."))
                return false;
            }
            return true;
          }
          WHILE: while (fr < fl) {
            var swallowee = file[fr];
            this.debug('\nglobstar while', file, fr, pattern, pr, swallowee);
            if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
              this.debug('globstar found match!', fr, fl, swallowee);
              return true;
            } else {
              if (swallowee === "." || swallowee === ".." || (!options.dot && swallowee.charAt(0) === ".")) {
                this.debug("dot detected!", file, fr, pattern, pr);
                break WHILE;
              }
              this.debug('globstar swallow a segment, and continue');
              fr++;
            }
          }
          if (partial) {
            this.debug("\n>>> no match, partial?", file, fr, pattern, pr);
            if (fr === fl)
              return true;
          }
          return false;
        }
        var hit;
        if (typeof p === "string") {
          if (options.nocase) {
            hit = f.toLowerCase() === p.toLowerCase();
          } else {
            hit = f === p;
          }
          this.debug("string match", p, f, hit);
        } else {
          hit = f.match(p);
          this.debug("pattern match", p, f, hit);
        }
        if (!hit)
          return false;
      }
      if (fi === fl && pi === pl) {
        return true;
      } else if (fi === fl) {
        return partial;
      } else if (pi === pl) {
        var emptyFileEnd = (fi === fl - 1) && (file[fi] === "");
        return emptyFileEnd;
      }
      throw new Error("wtf?");
    };
    function globUnescape(s) {
      return s.replace(/\\(.)/g, "$1");
    }
    function regExpEscape(s) {
      return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    }
  })(typeof require === "function" ? require : null, this, typeof module === "object" ? module : null, typeof process === "object" ? process.platform : "win32");
})(require("process"));
