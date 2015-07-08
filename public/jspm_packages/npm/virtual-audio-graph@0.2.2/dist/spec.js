/* */ 
"format cjs";
(function(process) {
  (function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          var a = typeof require == "function" && require;
          if (!u && a)
            return a(o, !0);
          if (i)
            return i(o, !0);
          var f = new Error("Cannot find module '" + o + "'");
          throw f.code = "MODULE_NOT_FOUND", f;
        }
        var l = n[o] = {exports: {}};
        t[o][0].call(l.exports, function(e) {
          var n = t[o][1][e];
          return s(n ? n : e);
        }, l, l.exports, e, t, n, r);
      }
      return n[o].exports;
    }
    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++)
      s(r[o]);
    return s;
  })({
    1: [function(require, module, exports) {
      module.exports = {
        "default": require("core-js/library/fn/object/define-property"),
        __esModule: true
      };
    }, {"core-js/library/fn/object/define-property": 4}],
    2: [function(require, module, exports) {
      "use strict";
      exports["default"] = function(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError("Cannot call a class as a function");
        }
      };
      exports.__esModule = true;
    }, {}],
    3: [function(require, module, exports) {
      "use strict";
      var _Object$defineProperty = require("babel-runtime/core-js/object/define-property")["default"];
      exports["default"] = (function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor)
              descriptor.writable = true;
            _Object$defineProperty(target, descriptor.key, descriptor);
          }
        }
        return function(Constructor, protoProps, staticProps) {
          if (protoProps)
            defineProperties(Constructor.prototype, protoProps);
          if (staticProps)
            defineProperties(Constructor, staticProps);
          return Constructor;
        };
      })();
      exports.__esModule = true;
    }, {"babel-runtime/core-js/object/define-property": 1}],
    4: [function(require, module, exports) {
      var $ = require("../../modules/$");
      module.exports = function defineProperty(it, key, desc) {
        return $.setDesc(it, key, desc);
      };
    }, {"../../modules/$": 6}],
    5: [function(require, module, exports) {
      module.exports = function($) {
        $.FW = false;
        $.path = $.core;
        return $;
      };
    }, {}],
    6: [function(require, module, exports) {
      'use strict';
      var global = typeof self != 'undefined' ? self : Function('return this')(),
          core = {},
          defineProperty = Object.defineProperty,
          hasOwnProperty = {}.hasOwnProperty,
          ceil = Math.ceil,
          floor = Math.floor,
          max = Math.max,
          min = Math.min;
      var DESC = !!function() {
        try {
          return defineProperty({}, 'a', {get: function() {
              return 2;
            }}).a == 2;
        } catch (e) {}
      }();
      var hide = createDefiner(1);
      function toInteger(it) {
        return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
      }
      function desc(bitmap, value) {
        return {
          enumerable: !(bitmap & 1),
          configurable: !(bitmap & 2),
          writable: !(bitmap & 4),
          value: value
        };
      }
      function simpleSet(object, key, value) {
        object[key] = value;
        return object;
      }
      function createDefiner(bitmap) {
        return DESC ? function(object, key, value) {
          return $.setDesc(object, key, desc(bitmap, value));
        } : simpleSet;
      }
      function isObject(it) {
        return it !== null && (typeof it == 'object' || typeof it == 'function');
      }
      function isFunction(it) {
        return typeof it == 'function';
      }
      function assertDefined(it) {
        if (it == undefined)
          throw TypeError("Can't call method on  " + it);
        return it;
      }
      var $ = module.exports = require("./$.fw")({
        g: global,
        core: core,
        html: global.document && document.documentElement,
        isObject: isObject,
        isFunction: isFunction,
        that: function() {
          return this;
        },
        toInteger: toInteger,
        toLength: function(it) {
          return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0;
        },
        toIndex: function(index, length) {
          index = toInteger(index);
          return index < 0 ? max(index + length, 0) : min(index, length);
        },
        has: function(it, key) {
          return hasOwnProperty.call(it, key);
        },
        create: Object.create,
        getProto: Object.getPrototypeOf,
        DESC: DESC,
        desc: desc,
        getDesc: Object.getOwnPropertyDescriptor,
        setDesc: defineProperty,
        setDescs: Object.defineProperties,
        getKeys: Object.keys,
        getNames: Object.getOwnPropertyNames,
        getSymbols: Object.getOwnPropertySymbols,
        assertDefined: assertDefined,
        ES5Object: Object,
        toObject: function(it) {
          return $.ES5Object(assertDefined(it));
        },
        hide: hide,
        def: createDefiner(0),
        set: global.Symbol ? simpleSet : hide,
        each: [].forEach
      });
      if (typeof __e != 'undefined')
        __e = core;
      if (typeof __g != 'undefined')
        __g = global;
    }, {"./$.fw": 5}],
    7: [function(require, module, exports) {
      module.exports = function(string) {
        return string.charAt(0).toUpperCase() + string.substring(1);
      };
      module.exports.words = function(string) {
        return string.replace(/(^|[^a-zA-Z\u00C0-\u017F'])([a-zA-Z\u00C0-\u017F])/g, function(m) {
          return m.toUpperCase();
        });
      };
    }, {}],
    8: [function(require, module, exports) {
      ;
      (function() {
        'use strict';
        var __ = {'@@functional/placeholder': true};
        var _add = function _add(a, b) {
          return a + b;
        };
        var _all = function _all(fn, list) {
          var idx = 0;
          while (idx < list.length) {
            if (!fn(list[idx])) {
              return false;
            }
            idx += 1;
          }
          return true;
        };
        var _any = function _any(fn, list) {
          var idx = 0;
          while (idx < list.length) {
            if (fn(list[idx])) {
              return true;
            }
            idx += 1;
          }
          return false;
        };
        var _assoc = function _assoc(prop, val, obj) {
          var result = {};
          for (var p in obj) {
            result[p] = obj[p];
          }
          result[prop] = val;
          return result;
        };
        var _cloneRegExp = function _cloneRegExp(pattern) {
          return new RegExp(pattern.source, (pattern.global ? 'g' : '') + (pattern.ignoreCase ? 'i' : '') + (pattern.multiline ? 'm' : '') + (pattern.sticky ? 'y' : '') + (pattern.unicode ? 'u' : ''));
        };
        var _complement = function _complement(f) {
          return function() {
            return !f.apply(this, arguments);
          };
        };
        var _compose = function _compose(f, g) {
          return function() {
            return f.call(this, g.apply(this, arguments));
          };
        };
        var _concat = function _concat(set1, set2) {
          set1 = set1 || [];
          set2 = set2 || [];
          var idx;
          var len1 = set1.length;
          var len2 = set2.length;
          var result = [];
          idx = 0;
          while (idx < len1) {
            result[result.length] = set1[idx];
            idx += 1;
          }
          idx = 0;
          while (idx < len2) {
            result[result.length] = set2[idx];
            idx += 1;
          }
          return result;
        };
        var _containsWith = function _containsWith(pred, x, list) {
          var idx = 0,
              len = list.length;
          while (idx < len) {
            if (pred(x, list[idx])) {
              return true;
            }
            idx += 1;
          }
          return false;
        };
        var _createMapEntry = function _createMapEntry(key, val) {
          var obj = {};
          obj[key] = val;
          return obj;
        };
        var _createMaxMinBy = function _createMaxMinBy(comparator) {
          return function(valueComputer, list) {
            if (!(list && list.length > 0)) {
              return ;
            }
            var idx = 1;
            var winner = list[idx];
            var computedWinner = valueComputer(winner);
            var computedCurrent;
            while (idx < list.length) {
              computedCurrent = valueComputer(list[idx]);
              if (comparator(computedCurrent, computedWinner)) {
                computedWinner = computedCurrent;
                winner = list[idx];
              }
              idx += 1;
            }
            return winner;
          };
        };
        var _curry1 = function _curry1(fn) {
          return function f1(a) {
            if (arguments.length === 0) {
              return f1;
            } else if (a != null && a['@@functional/placeholder'] === true) {
              return f1;
            } else {
              return fn(a);
            }
          };
        };
        var _curry2 = function _curry2(fn) {
          return function f2(a, b) {
            var n = arguments.length;
            if (n === 0) {
              return f2;
            } else if (n === 1 && a != null && a['@@functional/placeholder'] === true) {
              return f2;
            } else if (n === 1) {
              return _curry1(function(b) {
                return fn(a, b);
              });
            } else if (n === 2 && a != null && a['@@functional/placeholder'] === true && b != null && b['@@functional/placeholder'] === true) {
              return f2;
            } else if (n === 2 && a != null && a['@@functional/placeholder'] === true) {
              return _curry1(function(a) {
                return fn(a, b);
              });
            } else if (n === 2 && b != null && b['@@functional/placeholder'] === true) {
              return _curry1(function(b) {
                return fn(a, b);
              });
            } else {
              return fn(a, b);
            }
          };
        };
        var _curry3 = function _curry3(fn) {
          return function f3(a, b, c) {
            var n = arguments.length;
            if (n === 0) {
              return f3;
            } else if (n === 1 && a != null && a['@@functional/placeholder'] === true) {
              return f3;
            } else if (n === 1) {
              return _curry2(function(b, c) {
                return fn(a, b, c);
              });
            } else if (n === 2 && a != null && a['@@functional/placeholder'] === true && b != null && b['@@functional/placeholder'] === true) {
              return f3;
            } else if (n === 2 && a != null && a['@@functional/placeholder'] === true) {
              return _curry2(function(a, c) {
                return fn(a, b, c);
              });
            } else if (n === 2 && b != null && b['@@functional/placeholder'] === true) {
              return _curry2(function(b, c) {
                return fn(a, b, c);
              });
            } else if (n === 2) {
              return _curry1(function(c) {
                return fn(a, b, c);
              });
            } else if (n === 3 && a != null && a['@@functional/placeholder'] === true && b != null && b['@@functional/placeholder'] === true && c != null && c['@@functional/placeholder'] === true) {
              return f3;
            } else if (n === 3 && a != null && a['@@functional/placeholder'] === true && b != null && b['@@functional/placeholder'] === true) {
              return _curry2(function(a, b) {
                return fn(a, b, c);
              });
            } else if (n === 3 && a != null && a['@@functional/placeholder'] === true && c != null && c['@@functional/placeholder'] === true) {
              return _curry2(function(a, c) {
                return fn(a, b, c);
              });
            } else if (n === 3 && b != null && b['@@functional/placeholder'] === true && c != null && c['@@functional/placeholder'] === true) {
              return _curry2(function(b, c) {
                return fn(a, b, c);
              });
            } else if (n === 3 && a != null && a['@@functional/placeholder'] === true) {
              return _curry1(function(a) {
                return fn(a, b, c);
              });
            } else if (n === 3 && b != null && b['@@functional/placeholder'] === true) {
              return _curry1(function(b) {
                return fn(a, b, c);
              });
            } else if (n === 3 && c != null && c['@@functional/placeholder'] === true) {
              return _curry1(function(c) {
                return fn(a, b, c);
              });
            } else {
              return fn(a, b, c);
            }
          };
        };
        var _dissoc = function _dissoc(prop, obj) {
          var result = {};
          for (var p in obj) {
            if (p !== prop) {
              result[p] = obj[p];
            }
          }
          return result;
        };
        var _eq = function _eq(x, y) {
          if (x === y) {
            return x !== 0 || 1 / x === 1 / y;
          } else {
            return x !== x && y !== y;
          }
        };
        var _filter = function _filter(fn, list) {
          var idx = 0,
              len = list.length,
              result = [];
          while (idx < len) {
            if (fn(list[idx])) {
              result[result.length] = list[idx];
            }
            idx += 1;
          }
          return result;
        };
        var _filterIndexed = function _filterIndexed(fn, list) {
          var idx = 0,
              len = list.length,
              result = [];
          while (idx < len) {
            if (fn(list[idx], idx, list)) {
              result[result.length] = list[idx];
            }
            idx += 1;
          }
          return result;
        };
        var _forEach = function _forEach(fn, list) {
          var idx = 0,
              len = list.length;
          while (idx < len) {
            fn(list[idx]);
            idx += 1;
          }
          return list;
        };
        var _forceReduced = function _forceReduced(x) {
          return {
            '@@transducer/value': x,
            '@@transducer/reduced': true
          };
        };
        var _functionsWith = function _functionsWith(fn) {
          return function(obj) {
            return _filter(function(key) {
              return typeof obj[key] === 'function';
            }, fn(obj));
          };
        };
        var _gt = function _gt(a, b) {
          return a > b;
        };
        var _has = function _has(prop, obj) {
          return Object.prototype.hasOwnProperty.call(obj, prop);
        };
        var _identity = function _identity(x) {
          return x;
        };
        var _isArray = Array.isArray || function _isArray(val) {
          return val != null && val.length >= 0 && Object.prototype.toString.call(val) === '[object Array]';
        };
        var _isInteger = Number.isInteger || function _isInteger(n) {
          return n << 0 === n;
        };
        var _isThenable = function _isThenable(value) {
          return value != null && value === Object(value) && typeof value.then === 'function';
        };
        var _isTransformer = function _isTransformer(obj) {
          return typeof obj['@@transducer/step'] === 'function';
        };
        var _lt = function _lt(a, b) {
          return a < b;
        };
        var _map = function _map(fn, list) {
          var idx = 0,
              len = list.length,
              result = [];
          while (idx < len) {
            result[idx] = fn(list[idx]);
            idx += 1;
          }
          return result;
        };
        var _multiply = function _multiply(a, b) {
          return a * b;
        };
        var _nth = function _nth(n, list) {
          return n < 0 ? list[list.length + n] : list[n];
        };
        var _path = function _path(paths, obj) {
          if (obj == null) {
            return ;
          } else {
            var val = obj;
            for (var idx = 0,
                len = paths.length; idx < len && val != null; idx += 1) {
              val = val[paths[idx]];
            }
            return val;
          }
        };
        var _prepend = function _prepend(el, list) {
          return _concat([el], list);
        };
        var _quote = function _quote(s) {
          return '"' + s.replace(/"/g, '\\"') + '"';
        };
        var _reduced = function _reduced(x) {
          return x && x['@@transducer/reduced'] ? x : {
            '@@transducer/value': x,
            '@@transducer/reduced': true
          };
        };
        var _slice = function _slice(args, from, to) {
          switch (arguments.length) {
            case 1:
              return _slice(args, 0, args.length);
            case 2:
              return _slice(args, from, args.length);
            default:
              var list = [];
              var idx = 0;
              var len = Math.max(0, Math.min(args.length, to) - from);
              while (idx < len) {
                list[idx] = args[from + idx];
                idx += 1;
              }
              return list;
          }
        };
        var _toISOString = function() {
          var pad = function pad(n) {
            return (n < 10 ? '0' : '') + n;
          };
          return typeof Date.prototype.toISOString === 'function' ? function _toISOString(d) {
            return d.toISOString();
          } : function _toISOString(d) {
            return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()) + 'T' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds()) + '.' + (d.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) + 'Z';
          };
        }();
        var _xdropRepeatsWith = function() {
          function XDropRepeatsWith(pred, xf) {
            this.xf = xf;
            this.pred = pred;
            this.lastValue = undefined;
            this.seenFirstValue = false;
          }
          XDropRepeatsWith.prototype['@@transducer/init'] = function() {
            return this.xf['@@transducer/init']();
          };
          XDropRepeatsWith.prototype['@@transducer/result'] = function(result) {
            return this.xf['@@transducer/result'](result);
          };
          XDropRepeatsWith.prototype['@@transducer/step'] = function(result, input) {
            var sameAsLast = false;
            if (!this.seenFirstValue) {
              this.seenFirstValue = true;
            } else if (this.pred(this.lastValue, input)) {
              sameAsLast = true;
            }
            this.lastValue = input;
            return sameAsLast ? result : this.xf['@@transducer/step'](result, input);
          };
          return _curry2(function _xdropRepeatsWith(pred, xf) {
            return new XDropRepeatsWith(pred, xf);
          });
        }();
        var _xfBase = {
          init: function() {
            return this.xf['@@transducer/init']();
          },
          result: function(result) {
            return this.xf['@@transducer/result'](result);
          }
        };
        var _xfilter = function() {
          function XFilter(f, xf) {
            this.xf = xf;
            this.f = f;
          }
          XFilter.prototype['@@transducer/init'] = _xfBase.init;
          XFilter.prototype['@@transducer/result'] = _xfBase.result;
          XFilter.prototype['@@transducer/step'] = function(result, input) {
            return this.f(input) ? this.xf['@@transducer/step'](result, input) : result;
          };
          return _curry2(function _xfilter(f, xf) {
            return new XFilter(f, xf);
          });
        }();
        var _xfind = function() {
          function XFind(f, xf) {
            this.xf = xf;
            this.f = f;
            this.found = false;
          }
          XFind.prototype['@@transducer/init'] = _xfBase.init;
          XFind.prototype['@@transducer/result'] = function(result) {
            if (!this.found) {
              result = this.xf['@@transducer/step'](result, void 0);
            }
            return this.xf['@@transducer/result'](result);
          };
          XFind.prototype['@@transducer/step'] = function(result, input) {
            if (this.f(input)) {
              this.found = true;
              result = _reduced(this.xf['@@transducer/step'](result, input));
            }
            return result;
          };
          return _curry2(function _xfind(f, xf) {
            return new XFind(f, xf);
          });
        }();
        var _xfindIndex = function() {
          function XFindIndex(f, xf) {
            this.xf = xf;
            this.f = f;
            this.idx = -1;
            this.found = false;
          }
          XFindIndex.prototype['@@transducer/init'] = _xfBase.init;
          XFindIndex.prototype['@@transducer/result'] = function(result) {
            if (!this.found) {
              result = this.xf['@@transducer/step'](result, -1);
            }
            return this.xf['@@transducer/result'](result);
          };
          XFindIndex.prototype['@@transducer/step'] = function(result, input) {
            this.idx += 1;
            if (this.f(input)) {
              this.found = true;
              result = _reduced(this.xf['@@transducer/step'](result, this.idx));
            }
            return result;
          };
          return _curry2(function _xfindIndex(f, xf) {
            return new XFindIndex(f, xf);
          });
        }();
        var _xfindLast = function() {
          function XFindLast(f, xf) {
            this.xf = xf;
            this.f = f;
          }
          XFindLast.prototype['@@transducer/init'] = _xfBase.init;
          XFindLast.prototype['@@transducer/result'] = function(result) {
            return this.xf['@@transducer/result'](this.xf['@@transducer/step'](result, this.last));
          };
          XFindLast.prototype['@@transducer/step'] = function(result, input) {
            if (this.f(input)) {
              this.last = input;
            }
            return result;
          };
          return _curry2(function _xfindLast(f, xf) {
            return new XFindLast(f, xf);
          });
        }();
        var _xfindLastIndex = function() {
          function XFindLastIndex(f, xf) {
            this.xf = xf;
            this.f = f;
            this.idx = -1;
            this.lastIdx = -1;
          }
          XFindLastIndex.prototype['@@transducer/init'] = _xfBase.init;
          XFindLastIndex.prototype['@@transducer/result'] = function(result) {
            return this.xf['@@transducer/result'](this.xf['@@transducer/step'](result, this.lastIdx));
          };
          XFindLastIndex.prototype['@@transducer/step'] = function(result, input) {
            this.idx += 1;
            if (this.f(input)) {
              this.lastIdx = this.idx;
            }
            return result;
          };
          return _curry2(function _xfindLastIndex(f, xf) {
            return new XFindLastIndex(f, xf);
          });
        }();
        var _xmap = function() {
          function XMap(f, xf) {
            this.xf = xf;
            this.f = f;
          }
          XMap.prototype['@@transducer/init'] = _xfBase.init;
          XMap.prototype['@@transducer/result'] = _xfBase.result;
          XMap.prototype['@@transducer/step'] = function(result, input) {
            return this.xf['@@transducer/step'](result, this.f(input));
          };
          return _curry2(function _xmap(f, xf) {
            return new XMap(f, xf);
          });
        }();
        var _xtake = function() {
          function XTake(n, xf) {
            this.xf = xf;
            this.n = n;
          }
          XTake.prototype['@@transducer/init'] = _xfBase.init;
          XTake.prototype['@@transducer/result'] = _xfBase.result;
          XTake.prototype['@@transducer/step'] = function(result, input) {
            this.n -= 1;
            return this.n === 0 ? _reduced(this.xf['@@transducer/step'](result, input)) : this.xf['@@transducer/step'](result, input);
          };
          return _curry2(function _xtake(n, xf) {
            return new XTake(n, xf);
          });
        }();
        var _xtakeWhile = function() {
          function XTakeWhile(f, xf) {
            this.xf = xf;
            this.f = f;
          }
          XTakeWhile.prototype['@@transducer/init'] = _xfBase.init;
          XTakeWhile.prototype['@@transducer/result'] = _xfBase.result;
          XTakeWhile.prototype['@@transducer/step'] = function(result, input) {
            return this.f(input) ? this.xf['@@transducer/step'](result, input) : _reduced(result);
          };
          return _curry2(function _xtakeWhile(f, xf) {
            return new XTakeWhile(f, xf);
          });
        }();
        var _xwrap = function() {
          function XWrap(fn) {
            this.f = fn;
          }
          XWrap.prototype['@@transducer/init'] = function() {
            throw new Error('init not implemented on XWrap');
          };
          XWrap.prototype['@@transducer/result'] = function(acc) {
            return acc;
          };
          XWrap.prototype['@@transducer/step'] = function(acc, x) {
            return this.f(acc, x);
          };
          return function _xwrap(fn) {
            return new XWrap(fn);
          };
        }();
        var add = _curry2(_add);
        var adjust = _curry3(function(fn, idx, list) {
          if (idx >= list.length || idx < -list.length) {
            return list;
          }
          var start = idx < 0 ? list.length : 0;
          var _idx = start + idx;
          var _list = _concat(list);
          _list[_idx] = fn(list[_idx]);
          return _list;
        });
        var always = _curry1(function always(val) {
          return function() {
            return val;
          };
        });
        var aperture = _curry2(function aperture(n, list) {
          var idx = 0;
          var limit = list.length - (n - 1);
          var acc = new Array(limit >= 0 ? limit : 0);
          while (idx < limit) {
            acc[idx] = _slice(list, idx, idx + n);
            idx += 1;
          }
          return acc;
        });
        var apply = _curry2(function apply(fn, args) {
          return fn.apply(this, args);
        });
        var arity = _curry2(function(n, fn) {
          switch (n) {
            case 0:
              return function() {
                return fn.apply(this, arguments);
              };
            case 1:
              return function(a0) {
                return fn.apply(this, arguments);
              };
            case 2:
              return function(a0, a1) {
                return fn.apply(this, arguments);
              };
            case 3:
              return function(a0, a1, a2) {
                return fn.apply(this, arguments);
              };
            case 4:
              return function(a0, a1, a2, a3) {
                return fn.apply(this, arguments);
              };
            case 5:
              return function(a0, a1, a2, a3, a4) {
                return fn.apply(this, arguments);
              };
            case 6:
              return function(a0, a1, a2, a3, a4, a5) {
                return fn.apply(this, arguments);
              };
            case 7:
              return function(a0, a1, a2, a3, a4, a5, a6) {
                return fn.apply(this, arguments);
              };
            case 8:
              return function(a0, a1, a2, a3, a4, a5, a6, a7) {
                return fn.apply(this, arguments);
              };
            case 9:
              return function(a0, a1, a2, a3, a4, a5, a6, a7, a8) {
                return fn.apply(this, arguments);
              };
            case 10:
              return function(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
                return fn.apply(this, arguments);
              };
            default:
              throw new Error('First argument to arity must be a non-negative integer no greater than ten');
          }
        });
        var assoc = _curry3(_assoc);
        var bind = _curry2(function bind(fn, thisObj) {
          return arity(fn.length, function() {
            return fn.apply(thisObj, arguments);
          });
        });
        var both = _curry2(function both(f, g) {
          return function _both() {
            return f.apply(this, arguments) && g.apply(this, arguments);
          };
        });
        var comparator = _curry1(function comparator(pred) {
          return function(a, b) {
            return pred(a, b) ? -1 : pred(b, a) ? 1 : 0;
          };
        });
        var complement = _curry1(_complement);
        var cond = function cond() {
          var pairs = arguments;
          return function() {
            var idx = 0;
            while (idx < pairs.length) {
              if (pairs[idx][0].apply(this, arguments)) {
                return pairs[idx][1].apply(this, arguments);
              }
              idx += 1;
            }
          };
        };
        var containsWith = _curry3(_containsWith);
        var countBy = _curry2(function countBy(fn, list) {
          var counts = {};
          var len = list.length;
          var idx = 0;
          while (idx < len) {
            var key = fn(list[idx]);
            counts[key] = (_has(key, counts) ? counts[key] : 0) + 1;
            idx += 1;
          }
          return counts;
        });
        var createMapEntry = _curry2(_createMapEntry);
        var dec = add(-1);
        var defaultTo = _curry2(function defaultTo(d, v) {
          return v == null ? d : v;
        });
        var differenceWith = _curry3(function differenceWith(pred, first, second) {
          var out = [];
          var idx = 0;
          var firstLen = first.length;
          var containsPred = containsWith(pred);
          while (idx < firstLen) {
            if (!containsPred(first[idx], second) && !containsPred(first[idx], out)) {
              out[out.length] = first[idx];
            }
            idx += 1;
          }
          return out;
        });
        var dissoc = _curry2(_dissoc);
        var divide = _curry2(function divide(a, b) {
          return a / b;
        });
        var either = _curry2(function either(f, g) {
          return function _either() {
            return f.apply(this, arguments) || g.apply(this, arguments);
          };
        });
        var eq = _curry2(_eq);
        var evolve = _curry2(function evolve(transformations, object) {
          var transformation,
              key,
              type,
              result = {};
          for (key in object) {
            transformation = transformations[key];
            type = typeof transformation;
            result[key] = type === 'function' ? transformation(object[key]) : type === 'object' ? evolve(transformations[key], object[key]) : object[key];
          }
          return result;
        });
        var filterIndexed = _curry2(_filterIndexed);
        var forEachIndexed = _curry2(function forEachIndexed(fn, list) {
          var idx = 0,
              len = list.length;
          while (idx < len) {
            fn(list[idx], idx, list);
            idx += 1;
          }
          return list;
        });
        var fromPairs = _curry1(function fromPairs(pairs) {
          var idx = 0,
              len = pairs.length,
              out = {};
          while (idx < len) {
            if (_isArray(pairs[idx]) && pairs[idx].length) {
              out[pairs[idx][0]] = pairs[idx][1];
            }
            idx += 1;
          }
          return out;
        });
        var gt = _curry2(_gt);
        var gte = _curry2(function gte(a, b) {
          return a >= b;
        });
        var has = _curry2(_has);
        var hasIn = _curry2(function(prop, obj) {
          return prop in obj;
        });
        var identical = _curry2(function identical(a, b) {
          if (a === b) {
            return a !== 0 || 1 / a === 1 / b;
          } else {
            return a !== a && b !== b;
          }
        });
        var identity = _curry1(_identity);
        var inc = add(1);
        var insertAll = _curry3(function insertAll(idx, elts, list) {
          idx = idx < list.length && idx >= 0 ? idx : list.length;
          return _concat(_concat(_slice(list, 0, idx), elts), _slice(list, idx));
        });
        var is = _curry2(function is(Ctor, val) {
          return val != null && val.constructor === Ctor || val instanceof Ctor;
        });
        var isArrayLike = _curry1(function isArrayLike(x) {
          if (_isArray(x)) {
            return true;
          }
          if (!x) {
            return false;
          }
          if (typeof x !== 'object') {
            return false;
          }
          if (x instanceof String) {
            return false;
          }
          if (x.nodeType === 1) {
            return !!x.length;
          }
          if (x.length === 0) {
            return true;
          }
          if (x.length > 0) {
            return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
          }
          return false;
        });
        var isEmpty = _curry1(function isEmpty(list) {
          return Object(list).length === 0;
        });
        var isNil = _curry1(function isNil(x) {
          return x == null;
        });
        var keys = function() {
          var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
          var nonEnumerableProps = ['constructor', 'valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
          var contains = function contains(list, item) {
            var idx = 0;
            while (idx < list.length) {
              if (list[idx] === item) {
                return true;
              }
              idx += 1;
            }
            return false;
          };
          return typeof Object.keys === 'function' ? _curry1(function keys(obj) {
            return Object(obj) !== obj ? [] : Object.keys(obj);
          }) : _curry1(function keys(obj) {
            if (Object(obj) !== obj) {
              return [];
            }
            var prop,
                ks = [],
                nIdx;
            for (prop in obj) {
              if (_has(prop, obj)) {
                ks[ks.length] = prop;
              }
            }
            if (hasEnumBug) {
              nIdx = nonEnumerableProps.length - 1;
              while (nIdx >= 0) {
                prop = nonEnumerableProps[nIdx];
                if (_has(prop, obj) && !contains(ks, prop)) {
                  ks[ks.length] = prop;
                }
                nIdx -= 1;
              }
            }
            return ks;
          });
        }();
        var keysIn = _curry1(function keysIn(obj) {
          var prop,
              ks = [];
          for (prop in obj) {
            ks[ks.length] = prop;
          }
          return ks;
        });
        var length = _curry1(function length(list) {
          return list != null && is(Number, list.length) ? list.length : NaN;
        });
        var lens = _curry2(function lens(get, set) {
          var lns = function(a) {
            return get(a);
          };
          lns.set = _curry2(set);
          lns.map = _curry2(function(fn, a) {
            return set(fn(get(a)), a);
          });
          return lns;
        });
        var lensOn = _curry3(function lensOn(get, set, obj) {
          var lns = function() {
            return get(obj);
          };
          lns.set = set;
          lns.map = function(fn) {
            return set(fn(get(obj)));
          };
          return lns;
        });
        var lt = _curry2(_lt);
        var lte = _curry2(function lte(a, b) {
          return a <= b;
        });
        var mapAccum = _curry3(function mapAccum(fn, acc, list) {
          var idx = 0,
              len = list.length,
              result = [],
              tuple = [acc];
          while (idx < len) {
            tuple = fn(tuple[0], list[idx]);
            result[idx] = tuple[1];
            idx += 1;
          }
          return [tuple[0], result];
        });
        var mapAccumRight = _curry3(function mapAccumRight(fn, acc, list) {
          var idx = list.length - 1,
              result = [],
              tuple = [acc];
          while (idx >= 0) {
            tuple = fn(tuple[0], list[idx]);
            result[idx] = tuple[1];
            idx -= 1;
          }
          return [tuple[0], result];
        });
        var mapIndexed = _curry2(function mapIndexed(fn, list) {
          var idx = 0,
              len = list.length,
              result = [];
          while (idx < len) {
            result[idx] = fn(list[idx], idx, list);
            idx += 1;
          }
          return result;
        });
        var mathMod = _curry2(function mathMod(m, p) {
          if (!_isInteger(m)) {
            return NaN;
          }
          if (!_isInteger(p) || p < 1) {
            return NaN;
          }
          return (m % p + p) % p;
        });
        var maxBy = _curry2(_createMaxMinBy(_gt));
        var minBy = _curry2(_createMaxMinBy(_lt));
        var modulo = _curry2(function modulo(a, b) {
          return a % b;
        });
        var multiply = _curry2(_multiply);
        var nAry = _curry2(function(n, fn) {
          switch (n) {
            case 0:
              return function() {
                return fn.call(this);
              };
            case 1:
              return function(a0) {
                return fn.call(this, a0);
              };
            case 2:
              return function(a0, a1) {
                return fn.call(this, a0, a1);
              };
            case 3:
              return function(a0, a1, a2) {
                return fn.call(this, a0, a1, a2);
              };
            case 4:
              return function(a0, a1, a2, a3) {
                return fn.call(this, a0, a1, a2, a3);
              };
            case 5:
              return function(a0, a1, a2, a3, a4) {
                return fn.call(this, a0, a1, a2, a3, a4);
              };
            case 6:
              return function(a0, a1, a2, a3, a4, a5) {
                return fn.call(this, a0, a1, a2, a3, a4, a5);
              };
            case 7:
              return function(a0, a1, a2, a3, a4, a5, a6) {
                return fn.call(this, a0, a1, a2, a3, a4, a5, a6);
              };
            case 8:
              return function(a0, a1, a2, a3, a4, a5, a6, a7) {
                return fn.call(this, a0, a1, a2, a3, a4, a5, a6, a7);
              };
            case 9:
              return function(a0, a1, a2, a3, a4, a5, a6, a7, a8) {
                return fn.call(this, a0, a1, a2, a3, a4, a5, a6, a7, a8);
              };
            case 10:
              return function(a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
                return fn.call(this, a0, a1, a2, a3, a4, a5, a6, a7, a8, a9);
              };
            default:
              throw new Error('First argument to nAry must be a non-negative integer no greater than ten');
          }
        });
        var negate = _curry1(function negate(n) {
          return -n;
        });
        var not = _curry1(function not(a) {
          return !a;
        });
        var nth = _curry2(_nth);
        var nthArg = _curry1(function nthArg(n) {
          return function() {
            return _nth(n, arguments);
          };
        });
        var nthChar = _curry2(function nthChar(n, str) {
          return str.charAt(n < 0 ? str.length + n : n);
        });
        var nthCharCode = _curry2(function nthCharCode(n, str) {
          return str.charCodeAt(n < 0 ? str.length + n : n);
        });
        var of = _curry1(function of(x) {
          return [x];
        });
        var once = _curry1(function once(fn) {
          var called = false,
              result;
          return function() {
            if (called) {
              return result;
            }
            called = true;
            result = fn.apply(this, arguments);
            return result;
          };
        });
        var path = _curry2(_path);
        var pick = _curry2(function pick(names, obj) {
          var result = {};
          var idx = 0;
          while (idx < names.length) {
            if (names[idx] in obj) {
              result[names[idx]] = obj[names[idx]];
            }
            idx += 1;
          }
          return result;
        });
        var pickAll = _curry2(function pickAll(names, obj) {
          var result = {};
          var idx = 0;
          var len = names.length;
          while (idx < len) {
            var name = names[idx];
            result[name] = obj[name];
            idx += 1;
          }
          return result;
        });
        var pickBy = _curry2(function pickBy(test, obj) {
          var result = {};
          for (var prop in obj) {
            if (test(obj[prop], prop, obj)) {
              result[prop] = obj[prop];
            }
          }
          return result;
        });
        var prepend = _curry2(_prepend);
        var prop = _curry2(function prop(p, obj) {
          return obj[p];
        });
        var propOr = _curry3(function propOr(val, p, obj) {
          return obj != null && _has(p, obj) ? obj[p] : val;
        });
        var props = _curry2(function props(ps, obj) {
          var len = ps.length;
          var out = [];
          var idx = 0;
          while (idx < len) {
            out[idx] = obj[ps[idx]];
            idx += 1;
          }
          return out;
        });
        var range = _curry2(function range(from, to) {
          var result = [];
          var n = from;
          while (n < to) {
            result[result.length] = n;
            n += 1;
          }
          return result;
        });
        var reduceIndexed = _curry3(function reduceIndexed(fn, acc, list) {
          var idx = 0,
              len = list.length;
          while (idx < len) {
            acc = fn(acc, list[idx], idx, list);
            idx += 1;
          }
          return acc;
        });
        var reduceRight = _curry3(function reduceRight(fn, acc, list) {
          var idx = list.length - 1;
          while (idx >= 0) {
            acc = fn(acc, list[idx]);
            idx -= 1;
          }
          return acc;
        });
        var reduceRightIndexed = _curry3(function reduceRightIndexed(fn, acc, list) {
          var idx = list.length - 1;
          while (idx >= 0) {
            acc = fn(acc, list[idx], idx, list);
            idx -= 1;
          }
          return acc;
        });
        var reduced = _curry1(_reduced);
        var rejectIndexed = _curry2(function rejectIndexed(fn, list) {
          return _filterIndexed(_complement(fn), list);
        });
        var remove = _curry3(function remove(start, count, list) {
          return _concat(_slice(list, 0, Math.min(start, list.length)), _slice(list, Math.min(list.length, start + count)));
        });
        var replace = _curry3(function replace(regex, replacement, str) {
          return str.replace(regex, replacement);
        });
        var reverse = _curry1(function reverse(list) {
          return _slice(list).reverse();
        });
        var scan = _curry3(function scan(fn, acc, list) {
          var idx = 0,
              len = list.length,
              result = [acc];
          while (idx < len) {
            acc = fn(acc, list[idx]);
            result[idx + 1] = acc;
            idx += 1;
          }
          return result;
        });
        var sort = _curry2(function sort(comparator, list) {
          return _slice(list).sort(comparator);
        });
        var sortBy = _curry2(function sortBy(fn, list) {
          return _slice(list).sort(function(a, b) {
            var aa = fn(a);
            var bb = fn(b);
            return aa < bb ? -1 : aa > bb ? 1 : 0;
          });
        });
        var strIndexOf = _curry2(function strIndexOf(c, str) {
          return str.indexOf(c);
        });
        var strLastIndexOf = _curry2(function(c, str) {
          return str.lastIndexOf(c);
        });
        var subtract = _curry2(function subtract(a, b) {
          return a - b;
        });
        var tap = _curry2(function tap(fn, x) {
          fn(x);
          return x;
        });
        var test = _curry2(function test(pattern, str) {
          return _cloneRegExp(pattern).test(str);
        });
        var times = _curry2(function times(fn, n) {
          var len = Number(n);
          var list = new Array(len);
          var idx = 0;
          while (idx < len) {
            list[idx] = fn(idx);
            idx += 1;
          }
          return list;
        });
        var toPairs = _curry1(function toPairs(obj) {
          var pairs = [];
          for (var prop in obj) {
            if (_has(prop, obj)) {
              pairs[pairs.length] = [prop, obj[prop]];
            }
          }
          return pairs;
        });
        var toPairsIn = _curry1(function toPairsIn(obj) {
          var pairs = [];
          for (var prop in obj) {
            pairs[pairs.length] = [prop, obj[prop]];
          }
          return pairs;
        });
        var trim = function() {
          var ws = '\t\n\x0B\f\r \xA0\u1680\u180E\u2000\u2001\u2002\u2003' + '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028' + '\u2029\uFEFF';
          var zeroWidth = '\u200B';
          var hasProtoTrim = typeof String.prototype.trim === 'function';
          if (!hasProtoTrim || (ws.trim() || !zeroWidth.trim())) {
            return _curry1(function trim(str) {
              var beginRx = new RegExp('^[' + ws + '][' + ws + ']*');
              var endRx = new RegExp('[' + ws + '][' + ws + ']*$');
              return str.replace(beginRx, '').replace(endRx, '');
            });
          } else {
            return _curry1(function trim(str) {
              return str.trim();
            });
          }
        }();
        var type = _curry1(function type(val) {
          return val === null ? 'Null' : val === undefined ? 'Undefined' : Object.prototype.toString.call(val).slice(8, -1);
        });
        var unapply = _curry1(function unapply(fn) {
          return function() {
            return fn(_slice(arguments));
          };
        });
        var unary = _curry1(function unary(fn) {
          return nAry(1, fn);
        });
        var unfold = _curry2(function unfold(fn, seed) {
          var pair = fn(seed);
          var result = [];
          while (pair && pair.length) {
            result[result.length] = pair[0];
            pair = fn(pair[1]);
          }
          return result;
        });
        var uniqWith = _curry2(function uniqWith(pred, list) {
          var idx = 0,
              len = list.length;
          var result = [],
              item;
          while (idx < len) {
            item = list[idx];
            if (!_containsWith(pred, item, result)) {
              result[result.length] = item;
            }
            idx += 1;
          }
          return result;
        });
        var update = _curry3(function(idx, x, list) {
          return adjust(always(x), idx, list);
        });
        var values = _curry1(function values(obj) {
          var props = keys(obj);
          var len = props.length;
          var vals = [];
          var idx = 0;
          while (idx < len) {
            vals[idx] = obj[props[idx]];
            idx += 1;
          }
          return vals;
        });
        var valuesIn = _curry1(function valuesIn(obj) {
          var prop,
              vs = [];
          for (prop in obj) {
            vs[vs.length] = obj[prop];
          }
          return vs;
        });
        var where = _curry2(function where(spec, testObj) {
          for (var prop in spec) {
            if (_has(prop, spec) && !spec[prop](testObj[prop])) {
              return false;
            }
          }
          return true;
        });
        var xprod = _curry2(function xprod(a, b) {
          var idx = 0;
          var ilen = a.length;
          var j;
          var jlen = b.length;
          var result = [];
          while (idx < ilen) {
            j = 0;
            while (j < jlen) {
              result[result.length] = [a[idx], b[j]];
              j += 1;
            }
            idx += 1;
          }
          return result;
        });
        var zip = _curry2(function zip(a, b) {
          var rv = [];
          var idx = 0;
          var len = Math.min(a.length, b.length);
          while (idx < len) {
            rv[idx] = [a[idx], b[idx]];
            idx += 1;
          }
          return rv;
        });
        var zipObj = _curry2(function zipObj(keys, values) {
          var idx = 0,
              len = keys.length,
              out = {};
          while (idx < len) {
            out[keys[idx]] = values[idx];
            idx += 1;
          }
          return out;
        });
        var zipWith = _curry3(function zipWith(fn, a, b) {
          var rv = [],
              idx = 0,
              len = Math.min(a.length, b.length);
          while (idx < len) {
            rv[idx] = fn(a[idx], b[idx]);
            idx += 1;
          }
          return rv;
        });
        var F = always(false);
        var T = always(true);
        var _append = function _append(el, list) {
          return _concat(list, [el]);
        };
        var _assocPath = function _assocPath(path, val, obj) {
          switch (path.length) {
            case 0:
              return obj;
            case 1:
              return _assoc(path[0], val, obj);
            default:
              return _assoc(path[0], _assocPath(_slice(path, 1), val, Object(obj[path[0]])), obj);
          }
        };
        var _baseCopy = function _baseCopy(value, refFrom, refTo) {
          var copy = function copy(copiedValue) {
            var len = refFrom.length;
            var idx = 0;
            while (idx < len) {
              if (value === refFrom[idx]) {
                return refTo[idx];
              }
              idx += 1;
            }
            refFrom[idx + 1] = value;
            refTo[idx + 1] = copiedValue;
            for (var key in value) {
              copiedValue[key] = _baseCopy(value[key], refFrom, refTo);
            }
            return copiedValue;
          };
          switch (type(value)) {
            case 'Object':
              return copy({});
            case 'Array':
              return copy([]);
            case 'Date':
              return new Date(value);
            case 'RegExp':
              return _cloneRegExp(value);
            default:
              return value;
          }
        };
        var _checkForMethod = function _checkForMethod(methodname, fn) {
          return function() {
            var length = arguments.length;
            if (length === 0) {
              return fn();
            }
            var obj = arguments[length - 1];
            return _isArray(obj) || typeof obj[methodname] !== 'function' ? fn.apply(this, arguments) : obj[methodname].apply(obj, _slice(arguments, 0, length - 1));
          };
        };
        var _composeL = function _composeL(innerLens, outerLens) {
          return lens(_compose(innerLens, outerLens), function(x, source) {
            var newInnerValue = innerLens.set(x, outerLens(source));
            return outerLens.set(newInnerValue, source);
          });
        };
        var _composeP = function _composeP(f, g) {
          return function() {
            var context = this;
            var value = g.apply(this, arguments);
            if (_isThenable(value)) {
              return value.then(function(result) {
                return f.call(context, result);
              });
            } else {
              return f.call(this, value);
            }
          };
        };
        var _createComposer = function _createComposer(composeFunction) {
          return function() {
            var fn = arguments[arguments.length - 1];
            var length = fn.length;
            var idx = arguments.length - 2;
            while (idx >= 0) {
              fn = composeFunction(arguments[idx], fn);
              idx -= 1;
            }
            return arity(length, fn);
          };
        };
        var _createMaxMin = function _createMaxMin(comparator, initialVal) {
          return _curry1(function(list) {
            var idx = 0,
                winner = initialVal,
                computed;
            while (idx < list.length) {
              computed = +list[idx];
              if (comparator(computed, winner)) {
                winner = computed;
              }
              idx += 1;
            }
            return winner;
          });
        };
        var _createPartialApplicator = function _createPartialApplicator(concat) {
          return function(fn) {
            var args = _slice(arguments, 1);
            return arity(Math.max(0, fn.length - args.length), function() {
              return fn.apply(this, concat(args, arguments));
            });
          };
        };
        var _curryN = function _curryN(length, received, fn) {
          return function() {
            var combined = [];
            var argsIdx = 0;
            var left = length;
            var combinedIdx = 0;
            while (combinedIdx < received.length || argsIdx < arguments.length) {
              var result;
              if (combinedIdx < received.length && (received[combinedIdx] == null || received[combinedIdx]['@@functional/placeholder'] !== true || argsIdx >= arguments.length)) {
                result = received[combinedIdx];
              } else {
                result = arguments[argsIdx];
                argsIdx += 1;
              }
              combined[combinedIdx] = result;
              if (result == null || result['@@functional/placeholder'] !== true) {
                left -= 1;
              }
              combinedIdx += 1;
            }
            return left <= 0 ? fn.apply(this, combined) : arity(left, _curryN(length, combined, fn));
          };
        };
        var _dispatchable = function _dispatchable(methodname, xf, fn) {
          return function() {
            var length = arguments.length;
            if (length === 0) {
              return fn();
            }
            var obj = arguments[length - 1];
            if (!_isArray(obj)) {
              var args = _slice(arguments, 0, length - 1);
              if (typeof obj[methodname] === 'function') {
                return obj[methodname].apply(obj, args);
              }
              if (_isTransformer(obj)) {
                var transducer = xf.apply(null, args);
                return transducer(obj);
              }
            }
            return fn.apply(this, arguments);
          };
        };
        var _dissocPath = function _dissocPath(path, obj) {
          switch (path.length) {
            case 0:
              return obj;
            case 1:
              return _dissoc(path[0], obj);
            default:
              var head = path[0];
              var tail = _slice(path, 1);
              return obj[head] == null ? obj : _assoc(head, _dissocPath(tail, obj[head]), obj);
          }
        };
        var _equals = function _eqDeep(a, b, stackA, stackB) {
          var typeA = type(a);
          if (typeA !== type(b)) {
            return false;
          }
          if (typeA === 'Boolean' || typeA === 'Number' || typeA === 'String') {
            return typeof a === 'object' ? typeof b === 'object' && identical(a.valueOf(), b.valueOf()) : identical(a, b);
          }
          if (identical(a, b)) {
            return true;
          }
          if (typeA === 'RegExp') {
            return a.source === b.source && a.global === b.global && a.ignoreCase === b.ignoreCase && a.multiline === b.multiline && a.sticky === b.sticky && a.unicode === b.unicode;
          }
          if (Object(a) === a) {
            if (typeA === 'Date' && a.getTime() !== b.getTime()) {
              return false;
            }
            var keysA = keys(a);
            if (keysA.length !== keys(b).length) {
              return false;
            }
            var idx = stackA.length - 1;
            while (idx >= 0) {
              if (stackA[idx] === a) {
                return stackB[idx] === b;
              }
              idx -= 1;
            }
            stackA[stackA.length] = a;
            stackB[stackB.length] = b;
            idx = keysA.length - 1;
            while (idx >= 0) {
              var key = keysA[idx];
              if (!_has(key, b) || !_eqDeep(b[key], a[key], stackA, stackB)) {
                return false;
              }
              idx -= 1;
            }
            stackA.pop();
            stackB.pop();
            return true;
          }
          return false;
        };
        var _extend = function _extend(destination, other) {
          var props = keys(other);
          var idx = 0,
              length = props.length;
          while (idx < length) {
            destination[props[idx]] = other[props[idx]];
            idx += 1;
          }
          return destination;
        };
        var _hasMethod = function _hasMethod(methodName, obj) {
          return obj != null && !_isArray(obj) && typeof obj[methodName] === 'function';
        };
        var _makeFlat = function _makeFlat(recursive) {
          return function flatt(list) {
            var value,
                result = [],
                idx = 0,
                j,
                ilen = list.length,
                jlen;
            while (idx < ilen) {
              if (isArrayLike(list[idx])) {
                value = recursive ? flatt(list[idx]) : list[idx];
                j = 0;
                jlen = value.length;
                while (j < jlen) {
                  result[result.length] = value[j];
                  j += 1;
                }
              } else {
                result[result.length] = list[idx];
              }
              idx += 1;
            }
            return result;
          };
        };
        var _reduce = function() {
          function _arrayReduce(xf, acc, list) {
            var idx = 0,
                len = list.length;
            while (idx < len) {
              acc = xf['@@transducer/step'](acc, list[idx]);
              if (acc && acc['@@transducer/reduced']) {
                acc = acc['@@transducer/value'];
                break;
              }
              idx += 1;
            }
            return xf['@@transducer/result'](acc);
          }
          function _iterableReduce(xf, acc, iter) {
            var step = iter.next();
            while (!step.done) {
              acc = xf['@@transducer/step'](acc, step.value);
              if (acc && acc['@@transducer/reduced']) {
                acc = acc['@@transducer/value'];
                break;
              }
              step = iter.next();
            }
            return xf['@@transducer/result'](acc);
          }
          function _methodReduce(xf, acc, obj) {
            return xf['@@transducer/result'](obj.reduce(bind(xf['@@transducer/step'], xf), acc));
          }
          var symIterator = typeof Symbol !== 'undefined' ? Symbol.iterator : '@@iterator';
          return function _reduce(fn, acc, list) {
            if (typeof fn === 'function') {
              fn = _xwrap(fn);
            }
            if (isArrayLike(list)) {
              return _arrayReduce(fn, acc, list);
            }
            if (typeof list.reduce === 'function') {
              return _methodReduce(fn, acc, list);
            }
            if (list[symIterator] != null) {
              return _iterableReduce(fn, acc, list[symIterator]());
            }
            if (typeof list.next === 'function') {
              return _iterableReduce(fn, acc, list);
            }
            throw new TypeError('reduce: list must be array or iterable');
          };
        }();
        var _xall = function() {
          function XAll(f, xf) {
            this.xf = xf;
            this.f = f;
            this.all = true;
          }
          XAll.prototype['@@transducer/init'] = _xfBase.init;
          XAll.prototype['@@transducer/result'] = function(result) {
            if (this.all) {
              result = this.xf['@@transducer/step'](result, true);
            }
            return this.xf['@@transducer/result'](result);
          };
          XAll.prototype['@@transducer/step'] = function(result, input) {
            if (!this.f(input)) {
              this.all = false;
              result = _reduced(this.xf['@@transducer/step'](result, false));
            }
            return result;
          };
          return _curry2(function _xall(f, xf) {
            return new XAll(f, xf);
          });
        }();
        var _xany = function() {
          function XAny(f, xf) {
            this.xf = xf;
            this.f = f;
            this.any = false;
          }
          XAny.prototype['@@transducer/init'] = _xfBase.init;
          XAny.prototype['@@transducer/result'] = function(result) {
            if (!this.any) {
              result = this.xf['@@transducer/step'](result, false);
            }
            return this.xf['@@transducer/result'](result);
          };
          XAny.prototype['@@transducer/step'] = function(result, input) {
            if (this.f(input)) {
              this.any = true;
              result = _reduced(this.xf['@@transducer/step'](result, true));
            }
            return result;
          };
          return _curry2(function _xany(f, xf) {
            return new XAny(f, xf);
          });
        }();
        var _xdrop = function() {
          function XDrop(n, xf) {
            this.xf = xf;
            this.n = n;
          }
          XDrop.prototype['@@transducer/init'] = _xfBase.init;
          XDrop.prototype['@@transducer/result'] = _xfBase.result;
          XDrop.prototype.step = function(result, input) {
            if (this.n > 0) {
              this.n -= 1;
              return result;
            }
            return this.xf['@@transducer/step'](result, input);
          };
          return _curry2(function _xdrop(n, xf) {
            return new XDrop(n, xf);
          });
        }();
        var _xdropWhile = function() {
          function XDropWhile(f, xf) {
            this.xf = xf;
            this.f = f;
          }
          XDropWhile.prototype['@@transducer/init'] = _xfBase.init;
          XDropWhile.prototype['@@transducer/result'] = _xfBase.result;
          XDropWhile.prototype['@@transducer/step'] = function(result, input) {
            if (this.f) {
              if (this.f(input)) {
                return result;
              }
              this.f = null;
            }
            return this.xf['@@transducer/step'](result, input);
          };
          return _curry2(function _xdropWhile(f, xf) {
            return new XDropWhile(f, xf);
          });
        }();
        var _xgroupBy = function() {
          function XGroupBy(f, xf) {
            this.xf = xf;
            this.f = f;
            this.inputs = {};
          }
          XGroupBy.prototype['@@transducer/init'] = _xfBase.init;
          XGroupBy.prototype['@@transducer/result'] = function(result) {
            var key;
            for (key in this.inputs) {
              if (_has(key, this.inputs)) {
                result = this.xf['@@transducer/step'](result, this.inputs[key]);
                if (result['@@transducer/reduced']) {
                  result = result['@@transducer/value'];
                  break;
                }
              }
            }
            return this.xf['@@transducer/result'](result);
          };
          XGroupBy.prototype['@@transducer/step'] = function(result, input) {
            var key = this.f(input);
            this.inputs[key] = this.inputs[key] || [key, []];
            this.inputs[key][1] = _append(input, this.inputs[key][1]);
            return result;
          };
          return _curry2(function _xgroupBy(f, xf) {
            return new XGroupBy(f, xf);
          });
        }();
        var all = _curry2(_dispatchable('all', _xall, _all));
        var and = _curry2(function and(a, b) {
          return _hasMethod('and', a) ? a.and(b) : a && b;
        });
        var any = _curry2(_dispatchable('any', _xany, _any));
        var append = _curry2(_append);
        var assocPath = _curry3(_assocPath);
        var binary = _curry1(function binary(fn) {
          return nAry(2, fn);
        });
        var clone = _curry1(function clone(value) {
          return _baseCopy(value, [], []);
        });
        var compose = _createComposer(_compose);
        var composeL = function() {
          var fn = arguments[arguments.length - 1];
          var idx = arguments.length - 2;
          while (idx >= 0) {
            fn = _composeL(arguments[idx], fn);
            idx -= 1;
          }
          return fn;
        };
        var composeP = _createComposer(_composeP);
        var concat = _curry2(function(set1, set2) {
          if (_isArray(set2)) {
            return _concat(set1, set2);
          } else if (_hasMethod('concat', set1)) {
            return set1.concat(set2);
          } else {
            throw new TypeError('can\'t concat ' + typeof set1);
          }
        });
        var curryN = _curry2(function curryN(length, fn) {
          return arity(length, _curryN(length, [], fn));
        });
        var dissocPath = _curry2(_dissocPath);
        var dropWhile = _curry2(_dispatchable('dropWhile', _xdropWhile, function dropWhile(pred, list) {
          var idx = 0,
              len = list.length;
          while (idx < len && pred(list[idx])) {
            idx += 1;
          }
          return _slice(list, idx);
        }));
        var empty = _curry1(function empty(x) {
          return _hasMethod('empty', x) ? x.empty() : [];
        });
        var equals = _curry2(function equals(a, b) {
          return _hasMethod('equals', a) ? a.equals(b) : _hasMethod('equals', b) ? b.equals(a) : _equals(a, b, [], []);
        });
        var filter = _curry2(_dispatchable('filter', _xfilter, _filter));
        var find = _curry2(_dispatchable('find', _xfind, function find(fn, list) {
          var idx = 0;
          var len = list.length;
          while (idx < len) {
            if (fn(list[idx])) {
              return list[idx];
            }
            idx += 1;
          }
        }));
        var findIndex = _curry2(_dispatchable('findIndex', _xfindIndex, function findIndex(fn, list) {
          var idx = 0;
          var len = list.length;
          while (idx < len) {
            if (fn(list[idx])) {
              return idx;
            }
            idx += 1;
          }
          return -1;
        }));
        var findLast = _curry2(_dispatchable('findLast', _xfindLast, function findLast(fn, list) {
          var idx = list.length - 1;
          while (idx >= 0) {
            if (fn(list[idx])) {
              return list[idx];
            }
            idx -= 1;
          }
        }));
        var findLastIndex = _curry2(_dispatchable('findLastIndex', _xfindLastIndex, function findLastIndex(fn, list) {
          var idx = list.length - 1;
          while (idx >= 0) {
            if (fn(list[idx])) {
              return idx;
            }
            idx -= 1;
          }
          return -1;
        }));
        var flatten = _curry1(_makeFlat(true));
        var forEach = _curry2(function forEach(fn, list) {
          return _hasMethod('forEach', list) ? list.forEach(fn) : _forEach(fn, list);
        });
        var functions = _curry1(_functionsWith(keys));
        var functionsIn = _curry1(_functionsWith(keysIn));
        var groupBy = _curry2(_dispatchable('groupBy', _xgroupBy, function groupBy(fn, list) {
          return _reduce(function(acc, elt) {
            var key = fn(elt);
            acc[key] = _append(elt, acc[key] || (acc[key] = []));
            return acc;
          }, {}, list);
        }));
        var head = nth(0);
        var ifElse = _curry3(function ifElse(condition, onTrue, onFalse) {
          return curryN(Math.max(condition.length, onTrue.length, onFalse.length), function _ifElse() {
            return condition.apply(this, arguments) ? onTrue.apply(this, arguments) : onFalse.apply(this, arguments);
          });
        });
        var insert = _curry3(function insert(idx, elt, list) {
          idx = idx < list.length && idx >= 0 ? idx : list.length;
          return _concat(_append(elt, _slice(list, 0, idx)), _slice(list, idx));
        });
        var intersectionWith = _curry3(function intersectionWith(pred, list1, list2) {
          var results = [],
              idx = 0;
          while (idx < list1.length) {
            if (_containsWith(pred, list1[idx], list2)) {
              results[results.length] = list1[idx];
            }
            idx += 1;
          }
          return uniqWith(pred, results);
        });
        var intersperse = _curry2(_checkForMethod('intersperse', function intersperse(separator, list) {
          var out = [];
          var idx = 0;
          var length = list.length;
          while (idx < length) {
            if (idx === length - 1) {
              out.push(list[idx]);
            } else {
              out.push(list[idx], separator);
            }
            idx += 1;
          }
          return out;
        }));
        var invert = _curry1(function invert(obj) {
          var props = keys(obj);
          var len = props.length;
          var idx = 0;
          var out = {};
          while (idx < len) {
            var key = props[idx];
            var val = obj[key];
            var list = _has(val, out) ? out[val] : out[val] = [];
            list[list.length] = key;
            idx += 1;
          }
          return out;
        });
        var invertObj = _curry1(function invertObj(obj) {
          var props = keys(obj);
          var len = props.length;
          var idx = 0;
          var out = {};
          while (idx < len) {
            var key = props[idx];
            out[obj[key]] = key;
            idx += 1;
          }
          return out;
        });
        var invoker = _curry2(function invoker(arity, method) {
          return curryN(arity + 1, function() {
            var target = arguments[arity];
            return target[method].apply(target, _slice(arguments, 0, arity));
          });
        });
        var join = invoker(1, 'join');
        var last = nth(-1);
        var lensIndex = _curry1(function lensIndex(n) {
          return lens(nth(n), update(n));
        });
        var lensProp = _curry1(function lensProp(k) {
          return lens(prop(k), assoc(k));
        });
        var map = _curry2(_dispatchable('map', _xmap, _map));
        var mapObj = _curry2(function mapObject(fn, obj) {
          return _reduce(function(acc, key) {
            acc[key] = fn(obj[key]);
            return acc;
          }, {}, keys(obj));
        });
        var mapObjIndexed = _curry2(function mapObjectIndexed(fn, obj) {
          return _reduce(function(acc, key) {
            acc[key] = fn(obj[key], key, obj);
            return acc;
          }, {}, keys(obj));
        });
        var match = invoker(1, 'match');
        var max = _createMaxMin(_gt, -Infinity);
        var merge = _curry2(function merge(a, b) {
          return _extend(_extend({}, a), b);
        });
        var min = _createMaxMin(_lt, Infinity);
        var none = _curry2(_complement(_dispatchable('any', _xany, _any)));
        var or = _curry2(function or(a, b) {
          return _hasMethod('or', a) ? a.or(b) : a || b;
        });
        var partition = _curry2(function partition(pred, list) {
          return _reduce(function(acc, elt) {
            var xs = acc[pred(elt) ? 0 : 1];
            xs[xs.length] = elt;
            return acc;
          }, [[], []], list);
        });
        var pathEq = _curry3(function pathEq(path, val, obj) {
          return equals(_path(path, obj), val);
        });
        var pipe = function pipe() {
          return compose.apply(this, reverse(arguments));
        };
        var pipeL = compose(apply(composeL), unapply(reverse));
        var pipeP = function pipeP() {
          return composeP.apply(this, reverse(arguments));
        };
        var propEq = _curry3(function propEq(name, val, obj) {
          return equals(obj[name], val);
        });
        var reduce = _curry3(_reduce);
        var reject = _curry2(function reject(fn, list) {
          return filter(_complement(fn), list);
        });
        var repeat = _curry2(function repeat(value, n) {
          return times(always(value), n);
        });
        var slice = _curry3(_checkForMethod('slice', function slice(fromIndex, toIndex, xs) {
          return Array.prototype.slice.call(xs, fromIndex, toIndex);
        }));
        var split = invoker(1, 'split');
        var substring = slice;
        var substringFrom = substring(__, Infinity);
        var substringTo = substring(0);
        var sum = reduce(_add, 0);
        var tail = _checkForMethod('tail', function(list) {
          return _slice(list, 1);
        });
        var take = _curry2(_dispatchable('take', _xtake, function take(n, xs) {
          return slice(0, n < 0 ? Infinity : n, xs);
        }));
        var takeWhile = _curry2(_dispatchable('takeWhile', _xtakeWhile, function takeWhile(fn, list) {
          var idx = 0,
              len = list.length;
          while (idx < len && fn(list[idx])) {
            idx += 1;
          }
          return _slice(list, 0, idx);
        }));
        var toLower = invoker(0, 'toLowerCase');
        var toUpper = invoker(0, 'toUpperCase');
        var transduce = curryN(4, function(xf, fn, acc, list) {
          return _reduce(xf(typeof fn === 'function' ? _xwrap(fn) : fn), acc, list);
        });
        var uncurryN = _curry2(function uncurryN(depth, fn) {
          return curryN(depth, function() {
            var currentDepth = 1;
            var value = fn;
            var idx = 0;
            var endIdx;
            while (currentDepth <= depth && typeof value === 'function') {
              endIdx = currentDepth === depth ? arguments.length : idx + value.length;
              value = value.apply(this, _slice(arguments, idx, endIdx));
              currentDepth += 1;
              idx = endIdx;
            }
            return value;
          });
        });
        var unionWith = _curry3(function unionWith(pred, list1, list2) {
          return uniqWith(pred, _concat(list1, list2));
        });
        var uniq = uniqWith(equals);
        var unnest = _curry1(_makeFlat(false));
        var whereEq = _curry2(function whereEq(spec, testObj) {
          return where(mapObj(equals, spec), testObj);
        });
        var wrap = _curry2(function wrap(fn, wrapper) {
          return curryN(fn.length, function() {
            return wrapper.apply(this, _concat([fn], arguments));
          });
        });
        var _chain = _curry2(function _chain(f, list) {
          return unnest(map(f, list));
        });
        var _flatCat = function() {
          var preservingReduced = function(xf) {
            return {
              '@@transducer/init': _xfBase.init,
              '@@transducer/result': function(result) {
                return xf['@@transducer/result'](result);
              },
              '@@transducer/step': function(result, input) {
                var ret = xf['@@transducer/step'](result, input);
                return ret['@@transducer/reduced'] ? _forceReduced(ret) : ret;
              }
            };
          };
          return function _xcat(xf) {
            var rxf = preservingReduced(xf);
            return {
              '@@transducer/init': _xfBase.init,
              '@@transducer/result': function(result) {
                return rxf['@@transducer/result'](result);
              },
              '@@transducer/step': function(result, input) {
                return !isArrayLike(input) ? _reduce(rxf, result, [input]) : _reduce(rxf, result, input);
              }
            };
          };
        }();
        var _indexOf = function _indexOf(list, item, from) {
          var idx = 0,
              len = list.length;
          if (typeof from === 'number') {
            idx = from < 0 ? Math.max(0, len + from) : from;
          }
          while (idx < len) {
            if (equals(list[idx], item)) {
              return idx;
            }
            idx += 1;
          }
          return -1;
        };
        var _lastIndexOf = function _lastIndexOf(list, item, from) {
          var idx;
          if (typeof from === 'number') {
            idx = from < 0 ? list.length + from : Math.min(list.length - 1, from);
          } else {
            idx = list.length - 1;
          }
          while (idx >= 0) {
            if (equals(list[idx], item)) {
              return idx;
            }
            idx -= 1;
          }
          return -1;
        };
        var _pluck = function _pluck(p, list) {
          return map(prop(p), list);
        };
        var _predicateWrap = function _predicateWrap(predPicker) {
          return function(preds) {
            var predIterator = function() {
              var args = arguments;
              return predPicker(function(predicate) {
                return predicate.apply(null, args);
              }, preds);
            };
            return arguments.length > 1 ? predIterator.apply(null, _slice(arguments, 1)) : arity(max(_pluck('length', preds)), predIterator);
          };
        };
        var _stepCat = function() {
          var _stepCatArray = {
            '@@transducer/init': Array,
            '@@transducer/step': function(xs, x) {
              return _concat(xs, [x]);
            },
            '@@transducer/result': _identity
          };
          var _stepCatString = {
            '@@transducer/init': String,
            '@@transducer/step': _add,
            '@@transducer/result': _identity
          };
          var _stepCatObject = {
            '@@transducer/init': Object,
            '@@transducer/step': function(result, input) {
              return merge(result, isArrayLike(input) ? _createMapEntry(input[0], input[1]) : input);
            },
            '@@transducer/result': _identity
          };
          return function _stepCat(obj) {
            if (_isTransformer(obj)) {
              return obj;
            }
            if (isArrayLike(obj)) {
              return _stepCatArray;
            }
            if (typeof obj === 'string') {
              return _stepCatString;
            }
            if (typeof obj === 'object') {
              return _stepCatObject;
            }
            throw new Error('Cannot create transformer for ' + obj);
          };
        }();
        var _toString = function _toString(x, seen) {
          var recur = function recur(y) {
            var xs = seen.concat([x]);
            return _indexOf(xs, y) >= 0 ? '<Circular>' : _toString(y, xs);
          };
          switch (Object.prototype.toString.call(x)) {
            case '[object Arguments]':
              return '(function() { return arguments; }(' + _map(recur, x).join(', ') + '))';
            case '[object Array]':
              return '[' + _map(recur, x).join(', ') + ']';
            case '[object Boolean]':
              return typeof x === 'object' ? 'new Boolean(' + recur(x.valueOf()) + ')' : x.toString();
            case '[object Date]':
              return 'new Date(' + _quote(_toISOString(x)) + ')';
            case '[object Null]':
              return 'null';
            case '[object Number]':
              return typeof x === 'object' ? 'new Number(' + recur(x.valueOf()) + ')' : 1 / x === -Infinity ? '-0' : x.toString(10);
            case '[object String]':
              return typeof x === 'object' ? 'new String(' + recur(x.valueOf()) + ')' : _quote(x);
            case '[object Undefined]':
              return 'undefined';
            default:
              return typeof x.constructor === 'function' && x.constructor.name !== 'Object' && typeof x.toString === 'function' && x.toString() !== '[object Object]' ? x.toString() : '{' + _map(function(k) {
                return _quote(k) + ': ' + recur(x[k]);
              }, keys(x).sort()).join(', ') + '}';
          }
        };
        var _xchain = _curry2(function _xchain(f, xf) {
          return map(f, _flatCat(xf));
        });
        var addIndex = _curry1(function(fn) {
          return curryN(fn.length, function() {
            var idx = 0;
            var origFn = arguments[0];
            var list = arguments[arguments.length - 1];
            var indexedFn = function() {
              var result = origFn.apply(this, _concat(arguments, [idx, list]));
              idx += 1;
              return result;
            };
            return fn.apply(this, _prepend(indexedFn, _slice(arguments, 1)));
          });
        });
        var ap = _curry2(function ap(fns, vs) {
          return _hasMethod('ap', fns) ? fns.ap(vs) : _reduce(function(acc, fn) {
            return _concat(acc, map(fn, vs));
          }, [], fns);
        });
        var chain = _curry2(_dispatchable('chain', _xchain, _chain));
        var commuteMap = _curry3(function commuteMap(fn, of, list) {
          function consF(acc, ftor) {
            return ap(map(append, fn(ftor)), acc);
          }
          return _reduce(consF, of([]), list);
        });
        var curry = _curry1(function curry(fn) {
          return curryN(fn.length, fn);
        });
        var drop = _curry2(_dispatchable('drop', _xdrop, function drop(n, xs) {
          return slice(Math.max(0, n), Infinity, xs);
        }));
        var dropRepeatsWith = _curry2(_dispatchable('dropRepeatsWith', _xdropRepeatsWith, function dropRepeatsWith(pred, list) {
          var result = [];
          var idx = 1;
          var len = list.length;
          if (len !== 0) {
            result[0] = list[0];
            while (idx < len) {
              if (!pred(last(result), list[idx])) {
                result[result.length] = list[idx];
              }
              idx += 1;
            }
          }
          return result;
        }));
        var eqDeep = equals;
        var eqProps = _curry3(function eqProps(prop, obj1, obj2) {
          return equals(obj1[prop], obj2[prop]);
        });
        var flip = _curry1(function flip(fn) {
          return curry(function(a, b) {
            var args = _slice(arguments);
            args[0] = b;
            args[1] = a;
            return fn.apply(this, args);
          });
        });
        var indexOf = _curry2(function indexOf(target, xs) {
          return _hasMethod('indexOf', xs) ? xs.indexOf(target) : _indexOf(xs, target);
        });
        var init = slice(0, -1);
        var into = _curry3(function into(acc, xf, list) {
          return _isTransformer(acc) ? _reduce(xf(acc), acc['@@transducer/init'](), list) : _reduce(xf(_stepCat(acc)), acc, list);
        });
        var invoke = curry(function invoke(methodName, args, obj) {
          return obj[methodName].apply(obj, args);
        });
        var isSet = _curry1(function isSet(list) {
          var len = list.length;
          var idx = 0;
          while (idx < len) {
            if (_indexOf(list, list[idx], idx + 1) >= 0) {
              return false;
            }
            idx += 1;
          }
          return true;
        });
        var lastIndexOf = _curry2(function lastIndexOf(target, xs) {
          return _hasMethod('lastIndexOf', xs) ? xs.lastIndexOf(target) : _lastIndexOf(xs, target);
        });
        var liftN = _curry2(function liftN(arity, fn) {
          var lifted = curryN(arity, fn);
          return curryN(arity, function() {
            return _reduce(ap, map(lifted, arguments[0]), _slice(arguments, 1));
          });
        });
        var mean = _curry1(function mean(list) {
          return sum(list) / list.length;
        });
        var median = _curry1(function median(list) {
          var len = list.length;
          if (len === 0) {
            return NaN;
          }
          var width = 2 - len % 2;
          var idx = (len - width) / 2;
          return mean(_slice(list).sort(function(a, b) {
            return a < b ? -1 : a > b ? 1 : 0;
          }).slice(idx, idx + width));
        });
        var mergeAll = _curry1(function mergeAll(list) {
          return reduce(merge, {}, list);
        });
        var omit = _curry2(function omit(names, obj) {
          var result = {};
          for (var prop in obj) {
            if (_indexOf(names, prop) < 0) {
              result[prop] = obj[prop];
            }
          }
          return result;
        });
        var partial = curry(_createPartialApplicator(_concat));
        var partialRight = curry(_createPartialApplicator(flip(_concat)));
        var pluck = _curry2(_pluck);
        var product = reduce(_multiply, 1);
        var toString = _curry1(function toString(val) {
          return _toString(val, []);
        });
        var union = _curry2(compose(uniq, _concat));
        var useWith = curry(function useWith(fn) {
          var transformers = _slice(arguments, 1);
          var tlen = transformers.length;
          return curry(arity(tlen, function() {
            var args = [],
                idx = 0;
            while (idx < tlen) {
              args[idx] = transformers[idx](arguments[idx]);
              idx += 1;
            }
            return fn.apply(this, args.concat(_slice(arguments, tlen)));
          }));
        });
        var _contains = function _contains(a, list) {
          return _indexOf(list, a) >= 0;
        };
        var allPass = curry(_predicateWrap(_all));
        var anyPass = curry(_predicateWrap(_any));
        var call = curry(function call(fn) {
          return fn.apply(this, _slice(arguments, 1));
        });
        var commute = commuteMap(map(identity));
        var constructN = _curry2(function constructN(n, Fn) {
          if (n > 10) {
            throw new Error('Constructor with greater than ten arguments');
          }
          if (n === 0) {
            return function() {
              return new Fn();
            };
          }
          return curry(nAry(n, function($0, $1, $2, $3, $4, $5, $6, $7, $8, $9) {
            switch (arguments.length) {
              case 1:
                return new Fn($0);
              case 2:
                return new Fn($0, $1);
              case 3:
                return new Fn($0, $1, $2);
              case 4:
                return new Fn($0, $1, $2, $3);
              case 5:
                return new Fn($0, $1, $2, $3, $4);
              case 6:
                return new Fn($0, $1, $2, $3, $4, $5);
              case 7:
                return new Fn($0, $1, $2, $3, $4, $5, $6);
              case 8:
                return new Fn($0, $1, $2, $3, $4, $5, $6, $7);
              case 9:
                return new Fn($0, $1, $2, $3, $4, $5, $6, $7, $8);
              case 10:
                return new Fn($0, $1, $2, $3, $4, $5, $6, $7, $8, $9);
            }
          }));
        });
        var contains = _curry2(_contains);
        var converge = curryN(3, function(after) {
          var fns = _slice(arguments, 1);
          return curryN(max(pluck('length', fns)), function() {
            var args = arguments;
            var context = this;
            return after.apply(context, _map(function(fn) {
              return fn.apply(context, args);
            }, fns));
          });
        });
        var difference = _curry2(function difference(first, second) {
          var out = [];
          var idx = 0;
          var firstLen = first.length;
          while (idx < firstLen) {
            if (!_contains(first[idx], second) && !_contains(first[idx], out)) {
              out[out.length] = first[idx];
            }
            idx += 1;
          }
          return out;
        });
        var dropRepeats = _curry1(_dispatchable('dropRepeats', _xdropRepeatsWith(equals), dropRepeatsWith(equals)));
        var intersection = _curry2(function intersection(list1, list2) {
          return uniq(_filter(flip(_contains)(list1), list2));
        });
        var lift = _curry1(function lift(fn) {
          return liftN(fn.length, fn);
        });
        var memoize = _curry1(function memoize(fn) {
          var cache = {};
          return function() {
            var key = toString(arguments);
            if (!_has(key, cache)) {
              cache[key] = fn.apply(this, arguments);
            }
            return cache[key];
          };
        });
        var project = useWith(_map, pickAll, identity);
        var construct = _curry1(function construct(Fn) {
          return constructN(Fn.length, Fn);
        });
        var R = {
          F: F,
          T: T,
          __: __,
          add: add,
          addIndex: addIndex,
          adjust: adjust,
          all: all,
          allPass: allPass,
          always: always,
          and: and,
          any: any,
          anyPass: anyPass,
          ap: ap,
          aperture: aperture,
          append: append,
          apply: apply,
          arity: arity,
          assoc: assoc,
          assocPath: assocPath,
          binary: binary,
          bind: bind,
          both: both,
          call: call,
          chain: chain,
          clone: clone,
          commute: commute,
          commuteMap: commuteMap,
          comparator: comparator,
          complement: complement,
          compose: compose,
          composeL: composeL,
          composeP: composeP,
          concat: concat,
          cond: cond,
          construct: construct,
          constructN: constructN,
          contains: contains,
          containsWith: containsWith,
          converge: converge,
          countBy: countBy,
          createMapEntry: createMapEntry,
          curry: curry,
          curryN: curryN,
          dec: dec,
          defaultTo: defaultTo,
          difference: difference,
          differenceWith: differenceWith,
          dissoc: dissoc,
          dissocPath: dissocPath,
          divide: divide,
          drop: drop,
          dropRepeats: dropRepeats,
          dropRepeatsWith: dropRepeatsWith,
          dropWhile: dropWhile,
          either: either,
          empty: empty,
          eq: eq,
          eqDeep: eqDeep,
          eqProps: eqProps,
          equals: equals,
          evolve: evolve,
          filter: filter,
          filterIndexed: filterIndexed,
          find: find,
          findIndex: findIndex,
          findLast: findLast,
          findLastIndex: findLastIndex,
          flatten: flatten,
          flip: flip,
          forEach: forEach,
          forEachIndexed: forEachIndexed,
          fromPairs: fromPairs,
          functions: functions,
          functionsIn: functionsIn,
          groupBy: groupBy,
          gt: gt,
          gte: gte,
          has: has,
          hasIn: hasIn,
          head: head,
          identical: identical,
          identity: identity,
          ifElse: ifElse,
          inc: inc,
          indexOf: indexOf,
          init: init,
          insert: insert,
          insertAll: insertAll,
          intersection: intersection,
          intersectionWith: intersectionWith,
          intersperse: intersperse,
          into: into,
          invert: invert,
          invertObj: invertObj,
          invoke: invoke,
          invoker: invoker,
          is: is,
          isArrayLike: isArrayLike,
          isEmpty: isEmpty,
          isNil: isNil,
          isSet: isSet,
          join: join,
          keys: keys,
          keysIn: keysIn,
          last: last,
          lastIndexOf: lastIndexOf,
          length: length,
          lens: lens,
          lensIndex: lensIndex,
          lensOn: lensOn,
          lensProp: lensProp,
          lift: lift,
          liftN: liftN,
          lt: lt,
          lte: lte,
          map: map,
          mapAccum: mapAccum,
          mapAccumRight: mapAccumRight,
          mapIndexed: mapIndexed,
          mapObj: mapObj,
          mapObjIndexed: mapObjIndexed,
          match: match,
          mathMod: mathMod,
          max: max,
          maxBy: maxBy,
          mean: mean,
          median: median,
          memoize: memoize,
          merge: merge,
          mergeAll: mergeAll,
          min: min,
          minBy: minBy,
          modulo: modulo,
          multiply: multiply,
          nAry: nAry,
          negate: negate,
          none: none,
          not: not,
          nth: nth,
          nthArg: nthArg,
          nthChar: nthChar,
          nthCharCode: nthCharCode,
          of: of,
          omit: omit,
          once: once,
          or: or,
          partial: partial,
          partialRight: partialRight,
          partition: partition,
          path: path,
          pathEq: pathEq,
          pick: pick,
          pickAll: pickAll,
          pickBy: pickBy,
          pipe: pipe,
          pipeL: pipeL,
          pipeP: pipeP,
          pluck: pluck,
          prepend: prepend,
          product: product,
          project: project,
          prop: prop,
          propEq: propEq,
          propOr: propOr,
          props: props,
          range: range,
          reduce: reduce,
          reduceIndexed: reduceIndexed,
          reduceRight: reduceRight,
          reduceRightIndexed: reduceRightIndexed,
          reduced: reduced,
          reject: reject,
          rejectIndexed: rejectIndexed,
          remove: remove,
          repeat: repeat,
          replace: replace,
          reverse: reverse,
          scan: scan,
          slice: slice,
          sort: sort,
          sortBy: sortBy,
          split: split,
          strIndexOf: strIndexOf,
          strLastIndexOf: strLastIndexOf,
          substring: substring,
          substringFrom: substringFrom,
          substringTo: substringTo,
          subtract: subtract,
          sum: sum,
          tail: tail,
          take: take,
          takeWhile: takeWhile,
          tap: tap,
          test: test,
          times: times,
          toLower: toLower,
          toPairs: toPairs,
          toPairsIn: toPairsIn,
          toString: toString,
          toUpper: toUpper,
          transduce: transduce,
          trim: trim,
          type: type,
          unapply: unapply,
          unary: unary,
          uncurryN: uncurryN,
          unfold: unfold,
          union: union,
          unionWith: unionWith,
          uniq: uniq,
          uniqWith: uniqWith,
          unnest: unnest,
          update: update,
          useWith: useWith,
          values: values,
          valuesIn: valuesIn,
          where: where,
          whereEq: whereEq,
          wrap: wrap,
          xprod: xprod,
          zip: zip,
          zipObj: zipObj,
          zipWith: zipWith
        };
        if (typeof exports === 'object') {
          module.exports = R;
        } else if (typeof define === 'function' && define.amd) {
          define(function() {
            return R;
          });
        } else {
          this.R = R;
        }
      }.call(this));
    }, {}],
    9: [function(require, module, exports) {
      "use strict";
      var VirtualAudioGraph = require("../src/index");
      var audioContext = new AudioContext();
      describe("VirtualAudioGraph", function() {
        it("optionally takes audioContext property", function() {
          expect(new VirtualAudioGraph({audioContext: audioContext}).audioContext).toBe(audioContext);
          expect(new VirtualAudioGraph().audioContext instanceof AudioContext).toBe(true);
        });
        it("optionally takes output parameter", function() {
          expect(new VirtualAudioGraph({output: audioContext.destination}).output).toBe(audioContext.destination);
          expect(new VirtualAudioGraph({audioContext: audioContext}).output).toBe(audioContext.destination);
        });
      });
    }, {"../src/index.js": 15}],
    10: [function(require, module, exports) {
      "use strict";
      WebAudioTestAPI.setState("AudioContext#createStereoPanner", "enabled");
      require("./VirtualAudioGraph");
      require("./virtualAudioGraph.defineNode");
      require("./virtualAudioGraph.update");
    }, {
      "./VirtualAudioGraph": 9,
      "./virtualAudioGraph.defineNode": 12,
      "./virtualAudioGraph.update": 13
    }],
    11: [function(require, module, exports) {
      'use strict';
      module.exports = function() {
        var params = arguments[0] === undefined ? {} : arguments[0];
        var decay = params.decay;
        var delayTime = params.delayTime;
        var maxDelayTime = params.maxDelayTime;
        decay = decay !== undefined ? decay : 1 / 3;
        delayTime = delayTime !== undefined ? delayTime : 1 / 3;
        maxDelayTime = maxDelayTime !== undefined ? maxDelayTime : 1 / 3;
        return [{
          id: 0,
          node: 'stereoPanner',
          output: 'output',
          params: {pan: -1}
        }, {
          id: 1,
          node: 'stereoPanner',
          output: 'output',
          params: {pan: 1}
        }, {
          id: 2,
          node: 'delay',
          output: [1, 5],
          params: {
            maxDelayTime: maxDelayTime,
            delayTime: delayTime
          }
        }, {
          id: 3,
          node: 'gain',
          output: 2,
          params: {gain: decay}
        }, {
          id: 4,
          node: 'delay',
          output: [0, 3],
          params: {
            maxDelayTime: maxDelayTime,
            delayTime: delayTime
          }
        }, {
          id: 5,
          input: 'input',
          node: 'gain',
          output: 4,
          params: {gain: decay}
        }];
      };
    }, {}],
    12: [function(require, module, exports) {
      'use strict';
      var _require = require("ramda");
      var equals = _require.equals;
      var VirtualAudioGraph = require("../src/index");
      var pingPongDelayParamsFactory = require("./tools/pingPongDelayParamsFactory");
      describe('virtualAudioGraph.defineNode', function() {
        var audioContext = undefined;
        var virtualAudioGraph = undefined;
        beforeEach(function() {
          audioContext = new AudioContext();
          virtualAudioGraph = new VirtualAudioGraph({
            audioContext: audioContext,
            output: audioContext.destination
          });
        });
        it('returns itself', function() {
          expect(virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay')).toBe(virtualAudioGraph);
        });
        it('throws if name provided is a standard node', function() {
          expect(function() {
            return virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'gain');
          }).toThrow();
        });
        it('creates a custom node internally', function() {
          virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay');
          expect(typeof virtualAudioGraph.customNodes.pingPongDelay).toBe('function');
        });
        it('creates a custom node which can be reused in virtualAudioGraph.update', function() {
          virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay');
          var virtualNodeParams = [{
            id: 0,
            node: 'gain',
            output: 'output',
            params: {gain: 0.5}
          }, {
            id: 1,
            node: 'pingPongDelay',
            output: 0,
            params: {
              decay: 0.5,
              delayTime: 0.5,
              maxDelayTime: 0.5
            }
          }, {
            id: 2,
            node: 'oscillator',
            output: 1
          }];
          expect(virtualAudioGraph.update(virtualNodeParams)).toBe(virtualAudioGraph);
          expect(equals(audioContext.toJSON(), {
            'name': 'AudioDestinationNode',
            'inputs': [{
              'name': 'GainNode',
              'gain': {
                'value': 0.5,
                'inputs': []
              },
              'inputs': [{
                'name': 'StereoPannerNode',
                'pan': {
                  'value': -1,
                  'inputs': []
                },
                'inputs': [{
                  'name': 'DelayNode',
                  'delayTime': {
                    'value': 0.5,
                    'inputs': []
                  },
                  'inputs': [{
                    'name': 'GainNode',
                    'gain': {
                      'value': 0.5,
                      'inputs': []
                    },
                    'inputs': [{
                      'name': 'DelayNode',
                      'delayTime': {
                        'value': 0.5,
                        'inputs': []
                      },
                      'inputs': [{
                        'name': 'GainNode',
                        'gain': {
                          'value': 0.5,
                          'inputs': []
                        },
                        'inputs': ['<circular:DelayNode>']
                      }]
                    }, {
                      'name': 'OscillatorNode',
                      'type': 'sine',
                      'frequency': {
                        'value': 440,
                        'inputs': []
                      },
                      'detune': {
                        'value': 0,
                        'inputs': []
                      },
                      'inputs': []
                    }]
                  }]
                }]
              }, {
                'name': 'StereoPannerNode',
                'pan': {
                  'value': 1,
                  'inputs': []
                },
                'inputs': [{
                  'name': 'DelayNode',
                  'delayTime': {
                    'value': 0.5,
                    'inputs': []
                  },
                  'inputs': [{
                    'name': 'GainNode',
                    'gain': {
                      'value': 0.5,
                      'inputs': []
                    },
                    'inputs': [{
                      'name': 'DelayNode',
                      'delayTime': {
                        'value': 0.5,
                        'inputs': []
                      },
                      'inputs': [{
                        'name': 'GainNode',
                        'gain': {
                          'value': 0.5,
                          'inputs': []
                        },
                        'inputs': ['<circular:DelayNode>', {
                          'name': 'OscillatorNode',
                          'type': 'sine',
                          'frequency': {
                            'value': 440,
                            'inputs': []
                          },
                          'detune': {
                            'value': 0,
                            'inputs': []
                          },
                          'inputs': []
                        }]
                      }]
                    }]
                  }]
                }]
              }]
            }]
          })).toBe(true);
        });
        it('can define a custom node built of other custom nodes', function() {
          virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay');
          var quietpingPongDelayParamsFactory = function quietpingPongDelayParamsFactory() {
            return [{
              id: 0,
              node: 'gain',
              output: 'output'
            }, {
              id: 1,
              node: 'pingPongDelay',
              output: 0
            }, {
              id: 2,
              node: 'oscillator',
              output: 1
            }];
          };
          virtualAudioGraph.defineNode(quietpingPongDelayParamsFactory, 'quietPingPongDelay');
          var virtualNodeParams = [{
            id: 0,
            node: 'gain',
            output: 'output',
            params: {gain: 0.5}
          }, {
            id: 1,
            node: 'quietPingPongDelay',
            output: 0
          }, {
            id: 2,
            node: 'pingPongDelay',
            output: 1
          }, {
            id: 3,
            node: 'oscillator',
            output: 2
          }];
          expect(virtualAudioGraph.update(virtualNodeParams)).toBe(virtualAudioGraph);
          expect(equals(audioContext.toJSON(), {
            'name': 'AudioDestinationNode',
            'inputs': [{
              'name': 'GainNode',
              'gain': {
                'value': 0.5,
                'inputs': []
              },
              'inputs': [{
                'name': 'GainNode',
                'gain': {
                  'value': 1,
                  'inputs': []
                },
                'inputs': [{
                  'name': 'StereoPannerNode',
                  'pan': {
                    'value': -1,
                    'inputs': []
                  },
                  'inputs': [{
                    'name': 'DelayNode',
                    'delayTime': {
                      'value': 0.3333333333333333,
                      'inputs': []
                    },
                    'inputs': [{
                      'name': 'GainNode',
                      'gain': {
                        'value': 0.3333333333333333,
                        'inputs': []
                      },
                      'inputs': [{
                        'name': 'DelayNode',
                        'delayTime': {
                          'value': 0.3333333333333333,
                          'inputs': []
                        },
                        'inputs': [{
                          'name': 'GainNode',
                          'gain': {
                            'value': 0.3333333333333333,
                            'inputs': []
                          },
                          'inputs': ['<circular:DelayNode>']
                        }]
                      }, {
                        'name': 'OscillatorNode',
                        'type': 'sine',
                        'frequency': {
                          'value': 440,
                          'inputs': []
                        },
                        'detune': {
                          'value': 0,
                          'inputs': []
                        },
                        'inputs': []
                      }]
                    }]
                  }]
                }, {
                  'name': 'StereoPannerNode',
                  'pan': {
                    'value': 1,
                    'inputs': []
                  },
                  'inputs': [{
                    'name': 'DelayNode',
                    'delayTime': {
                      'value': 0.3333333333333333,
                      'inputs': []
                    },
                    'inputs': [{
                      'name': 'GainNode',
                      'gain': {
                        'value': 0.3333333333333333,
                        'inputs': []
                      },
                      'inputs': [{
                        'name': 'DelayNode',
                        'delayTime': {
                          'value': 0.3333333333333333,
                          'inputs': []
                        },
                        'inputs': [{
                          'name': 'GainNode',
                          'gain': {
                            'value': 0.3333333333333333,
                            'inputs': []
                          },
                          'inputs': ['<circular:DelayNode>', {
                            'name': 'OscillatorNode',
                            'type': 'sine',
                            'frequency': {
                              'value': 440,
                              'inputs': []
                            },
                            'detune': {
                              'value': 0,
                              'inputs': []
                            },
                            'inputs': []
                          }]
                        }]
                      }]
                    }]
                  }]
                }]
              }]
            }]
          })).toBe(true);
        });
        it('can define a custom node which can be updated', function() {
          virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay');
          var virtualNodeParams = [{
            id: 0,
            node: 'gain',
            output: 'output',
            params: {gain: 0.5}
          }, {
            id: 1,
            node: 'pingPongDelay',
            output: 0,
            params: {
              decay: 0.5,
              delayTime: 0.5,
              maxDelayTime: 0.5
            }
          }, {
            id: 2,
            node: 'oscillator',
            output: 1
          }];
          virtualAudioGraph.update(virtualNodeParams);
          expect(equals(audioContext.toJSON(), {
            'name': 'AudioDestinationNode',
            'inputs': [{
              'name': 'GainNode',
              'gain': {
                'value': 0.5,
                'inputs': []
              },
              'inputs': [{
                'name': 'StereoPannerNode',
                'pan': {
                  'value': -1,
                  'inputs': []
                },
                'inputs': [{
                  'name': 'DelayNode',
                  'delayTime': {
                    'value': 0.5,
                    'inputs': []
                  },
                  'inputs': [{
                    'name': 'GainNode',
                    'gain': {
                      'value': 0.5,
                      'inputs': []
                    },
                    'inputs': [{
                      'name': 'DelayNode',
                      'delayTime': {
                        'value': 0.5,
                        'inputs': []
                      },
                      'inputs': [{
                        'name': 'GainNode',
                        'gain': {
                          'value': 0.5,
                          'inputs': []
                        },
                        'inputs': ['<circular:DelayNode>']
                      }]
                    }, {
                      'name': 'OscillatorNode',
                      'type': 'sine',
                      'frequency': {
                        'value': 440,
                        'inputs': []
                      },
                      'detune': {
                        'value': 0,
                        'inputs': []
                      },
                      'inputs': []
                    }]
                  }]
                }]
              }, {
                'name': 'StereoPannerNode',
                'pan': {
                  'value': 1,
                  'inputs': []
                },
                'inputs': [{
                  'name': 'DelayNode',
                  'delayTime': {
                    'value': 0.5,
                    'inputs': []
                  },
                  'inputs': [{
                    'name': 'GainNode',
                    'gain': {
                      'value': 0.5,
                      'inputs': []
                    },
                    'inputs': [{
                      'name': 'DelayNode',
                      'delayTime': {
                        'value': 0.5,
                        'inputs': []
                      },
                      'inputs': [{
                        'name': 'GainNode',
                        'gain': {
                          'value': 0.5,
                          'inputs': []
                        },
                        'inputs': ['<circular:DelayNode>', {
                          'name': 'OscillatorNode',
                          'type': 'sine',
                          'frequency': {
                            'value': 440,
                            'inputs': []
                          },
                          'detune': {
                            'value': 0,
                            'inputs': []
                          },
                          'inputs': []
                        }]
                      }]
                    }]
                  }]
                }]
              }]
            }]
          })).toBe(true);
          virtualNodeParams[1].params.decay = 0.6;
          virtualAudioGraph.update(virtualNodeParams);
          expect(equals(audioContext.toJSON(), {
            'name': 'AudioDestinationNode',
            'inputs': [{
              'name': 'GainNode',
              'gain': {
                'value': 0.5,
                'inputs': []
              },
              'inputs': [{
                'name': 'StereoPannerNode',
                'pan': {
                  'value': -1,
                  'inputs': []
                },
                'inputs': [{
                  'name': 'DelayNode',
                  'delayTime': {
                    'value': 0.5,
                    'inputs': []
                  },
                  'inputs': [{
                    'name': 'GainNode',
                    'gain': {
                      'value': 0.6,
                      'inputs': []
                    },
                    'inputs': [{
                      'name': 'DelayNode',
                      'delayTime': {
                        'value': 0.5,
                        'inputs': []
                      },
                      'inputs': [{
                        'name': 'GainNode',
                        'gain': {
                          'value': 0.6,
                          'inputs': []
                        },
                        'inputs': ['<circular:DelayNode>']
                      }]
                    }, {
                      'name': 'OscillatorNode',
                      'type': 'sine',
                      'frequency': {
                        'value': 440,
                        'inputs': []
                      },
                      'detune': {
                        'value': 0,
                        'inputs': []
                      },
                      'inputs': []
                    }]
                  }]
                }]
              }, {
                'name': 'StereoPannerNode',
                'pan': {
                  'value': 1,
                  'inputs': []
                },
                'inputs': [{
                  'name': 'DelayNode',
                  'delayTime': {
                    'value': 0.5,
                    'inputs': []
                  },
                  'inputs': [{
                    'name': 'GainNode',
                    'gain': {
                      'value': 0.6,
                      'inputs': []
                    },
                    'inputs': [{
                      'name': 'DelayNode',
                      'delayTime': {
                        'value': 0.5,
                        'inputs': []
                      },
                      'inputs': [{
                        'name': 'GainNode',
                        'gain': {
                          'value': 0.6,
                          'inputs': []
                        },
                        'inputs': ['<circular:DelayNode>', {
                          'name': 'OscillatorNode',
                          'type': 'sine',
                          'frequency': {
                            'value': 440,
                            'inputs': []
                          },
                          'detune': {
                            'value': 0,
                            'inputs': []
                          },
                          'inputs': []
                        }]
                      }]
                    }]
                  }]
                }]
              }]
            }]
          })).toBe(true);
        });
        it('can define a custom node which can be removed', function() {
          virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay');
          var virtualNodeParams = [{
            id: 0,
            node: 'gain',
            output: 'output',
            params: {gain: 0.5}
          }, {
            id: 1,
            node: 'pingPongDelay',
            output: 0,
            params: {
              decay: 0.5,
              delayTime: 0.5,
              maxDelayTime: 0.5
            }
          }, {
            id: 2,
            node: 'oscillator',
            output: 1
          }];
          virtualAudioGraph.update(virtualNodeParams);
          expect(equals(audioContext.toJSON(), {
            'name': 'AudioDestinationNode',
            'inputs': [{
              'name': 'GainNode',
              'gain': {
                'value': 0.5,
                'inputs': []
              },
              'inputs': [{
                'name': 'StereoPannerNode',
                'pan': {
                  'value': -1,
                  'inputs': []
                },
                'inputs': [{
                  'name': 'DelayNode',
                  'delayTime': {
                    'value': 0.5,
                    'inputs': []
                  },
                  'inputs': [{
                    'name': 'GainNode',
                    'gain': {
                      'value': 0.5,
                      'inputs': []
                    },
                    'inputs': [{
                      'name': 'DelayNode',
                      'delayTime': {
                        'value': 0.5,
                        'inputs': []
                      },
                      'inputs': [{
                        'name': 'GainNode',
                        'gain': {
                          'value': 0.5,
                          'inputs': []
                        },
                        'inputs': ['<circular:DelayNode>']
                      }]
                    }, {
                      'name': 'OscillatorNode',
                      'type': 'sine',
                      'frequency': {
                        'value': 440,
                        'inputs': []
                      },
                      'detune': {
                        'value': 0,
                        'inputs': []
                      },
                      'inputs': []
                    }]
                  }]
                }]
              }, {
                'name': 'StereoPannerNode',
                'pan': {
                  'value': 1,
                  'inputs': []
                },
                'inputs': [{
                  'name': 'DelayNode',
                  'delayTime': {
                    'value': 0.5,
                    'inputs': []
                  },
                  'inputs': [{
                    'name': 'GainNode',
                    'gain': {
                      'value': 0.5,
                      'inputs': []
                    },
                    'inputs': [{
                      'name': 'DelayNode',
                      'delayTime': {
                        'value': 0.5,
                        'inputs': []
                      },
                      'inputs': [{
                        'name': 'GainNode',
                        'gain': {
                          'value': 0.5,
                          'inputs': []
                        },
                        'inputs': ['<circular:DelayNode>', {
                          'name': 'OscillatorNode',
                          'type': 'sine',
                          'frequency': {
                            'value': 440,
                            'inputs': []
                          },
                          'detune': {
                            'value': 0,
                            'inputs': []
                          },
                          'inputs': []
                        }]
                      }]
                    }]
                  }]
                }]
              }]
            }]
          })).toBe(true);
          virtualNodeParams[1].params.decay = 0.6;
          virtualAudioGraph.update([{
            id: 0,
            node: 'gain',
            output: 'output',
            params: {gain: 0.5}
          }]);
          expect(equals(audioContext.toJSON(), {
            'name': 'AudioDestinationNode',
            'inputs': [{
              'name': 'GainNode',
              'gain': {
                'value': 0.5,
                'inputs': []
              },
              'inputs': []
            }]
          })).toBe(true);
        });
      });
    }, {
      "../src/index.js": 15,
      "./tools/pingPongDelayParamsFactory": 11,
      "ramda": 8
    }],
    13: [function(require, module, exports) {
      'use strict';
      var VirtualAudioGraph = require("../src/index");
      var pingPongDelayParamsFactory = require("./tools/pingPongDelayParamsFactory");
      describe('virtualAudioGraph.update', function() {
        var audioContext = undefined;
        var virtualAudioGraph = undefined;
        beforeEach(function() {
          audioContext = new AudioContext();
          virtualAudioGraph = new VirtualAudioGraph({
            audioContext: audioContext,
            output: audioContext.destination
          });
        });
        it('returns itself', function() {
          var virtualNodeParams = [{
            id: 0,
            node: 'oscillator',
            params: {type: 'square'},
            output: 'output'
          }];
          expect(virtualAudioGraph.update(virtualNodeParams)).toBe(virtualAudioGraph);
        });
        it('throws an error if no id is provided', function() {
          var virtualNodeParams = [{
            node: 'gain',
            output: 'output'
          }];
          expect(function() {
            return virtualAudioGraph.update(virtualNodeParams);
          }).toThrow();
        });
        it('throws an error if no output is provided', function() {
          var virtualNodeParams = [{
            node: 'gain',
            id: 1
          }];
          expect(function() {
            return virtualAudioGraph.update(virtualNodeParams);
          }).toThrow();
        });
        it('throws an error when virtual node name property is not recognised', function() {
          var virtualNodeParams = [{
            id: 0,
            node: 'foobar',
            output: 'output'
          }];
          expect(function() {
            return virtualAudioGraph.update(virtualNodeParams);
          }).toThrow();
        });
        it('changes the node if passed params with same id but different node property', function() {
          virtualAudioGraph.update([{
            id: 0,
            node: 'gain',
            output: 'output'
          }]);
          expect(audioContext.toJSON()).toEqual({
            name: 'AudioDestinationNode',
            inputs: [{
              name: 'GainNode',
              gain: {
                value: 1,
                inputs: []
              },
              inputs: []
            }]
          });
          virtualAudioGraph.update([{
            id: 0,
            node: 'oscillator',
            output: 'output'
          }]);
          expect(audioContext.toJSON()).toEqual({
            'name': 'AudioDestinationNode',
            'inputs': [{
              'name': 'OscillatorNode',
              'type': 'sine',
              'frequency': {
                'value': 440,
                'inputs': []
              },
              'detune': {
                'value': 0,
                'inputs': []
              },
              'inputs': []
            }]
          });
          virtualAudioGraph.defineNode(pingPongDelayParamsFactory, 'pingPongDelay');
          virtualAudioGraph.update([{
            id: 0,
            node: 'pingPongDelay',
            output: 'output'
          }]);
          expect(audioContext.toJSON()).toEqual({
            'name': 'AudioDestinationNode',
            'inputs': [{
              'name': 'StereoPannerNode',
              'pan': {
                'value': -1,
                'inputs': []
              },
              'inputs': [{
                'name': 'DelayNode',
                'delayTime': {
                  'value': 0.3333333333333333,
                  'inputs': []
                },
                'inputs': [{
                  'name': 'GainNode',
                  'gain': {
                    'value': 0.3333333333333333,
                    'inputs': []
                  },
                  'inputs': [{
                    'name': 'DelayNode',
                    'delayTime': {
                      'value': 0.3333333333333333,
                      'inputs': []
                    },
                    'inputs': [{
                      'name': 'GainNode',
                      'gain': {
                        'value': 0.3333333333333333,
                        'inputs': []
                      },
                      'inputs': ['<circular:DelayNode>']
                    }]
                  }]
                }]
              }]
            }, {
              'name': 'StereoPannerNode',
              'pan': {
                'value': 1,
                'inputs': []
              },
              'inputs': [{
                'name': 'DelayNode',
                'delayTime': {
                  'value': 0.3333333333333333,
                  'inputs': []
                },
                'inputs': [{
                  'name': 'GainNode',
                  'gain': {
                    'value': 0.3333333333333333,
                    'inputs': []
                  },
                  'inputs': [{
                    'name': 'DelayNode',
                    'delayTime': {
                      'value': 0.3333333333333333,
                      'inputs': []
                    },
                    'inputs': [{
                      'name': 'GainNode',
                      'gain': {
                        'value': 0.3333333333333333,
                        'inputs': []
                      },
                      'inputs': ['<circular:DelayNode>']
                    }]
                  }]
                }]
              }]
            }]
          });
        });
        it('creates specified virtual nodes and stores them in virtualAudioGraph property', function() {
          var virtualNodeParams = [{
            id: 1,
            node: 'gain',
            output: 'output'
          }, {
            id: 2,
            node: 'oscillator',
            output: 1
          }];
          virtualAudioGraph.update(virtualNodeParams);
          expect(Array.isArray(virtualAudioGraph.virtualNodes)).toBe(true);
          expect(virtualAudioGraph.virtualNodes.length).toBe(2);
        });
        it('creates OscillatorNode with all valid parameters', function() {
          var params = {
            type: 'square',
            frequency: 440,
            detune: 4
          };
          var type = params.type;
          var frequency = params.frequency;
          var detune = params.detune;
          var virtualNodeParams = [{
            id: 0,
            node: 'oscillator',
            params: params,
            output: 'output'
          }];
          virtualAudioGraph.update(virtualNodeParams);
          var audioNode = virtualAudioGraph.virtualNodes[0].audioNode;
          expect(audioNode.constructor).toBe(OscillatorNode);
          expect(audioNode.type).toBe(type);
          expect(audioNode.frequency.value).toBe(frequency);
          expect(audioNode.detune.value).toBe(detune);
        });
        it('creates GainNode with all valid parameters', function() {
          var gain = 0.5;
          var virtualNodeParams = [{
            id: 0,
            node: 'gain',
            params: {gain: gain},
            output: 'output'
          }];
          virtualAudioGraph.update(virtualNodeParams);
          var audioNode = virtualAudioGraph.virtualNodes[0].audioNode;
          expect(audioNode.constructor).toBe(GainNode);
          expect(audioNode.gain.value).toBe(gain);
        });
        it('creates BiquadFilterNode with all valid parameters', function() {
          var type = 'peaking';
          var frequency = 500;
          var detune = 6;
          var Q = 0.5;
          var virtualNodeParams = [{
            id: 0,
            node: 'biquadFilter',
            params: {
              type: type,
              frequency: frequency,
              detune: detune,
              Q: Q
            },
            output: 'output'
          }];
          virtualAudioGraph.update(virtualNodeParams);
          var audioNode = virtualAudioGraph.virtualNodes[0].audioNode;
          expect(audioNode.constructor).toBe(BiquadFilterNode);
          expect(audioNode.type).toBe(type);
          expect(audioNode.frequency.value).toBe(frequency);
          expect(audioNode.detune.value).toBe(detune);
          expect(audioNode.Q.value).toBe(Q);
        });
        it('creates DelayNode with all valid parameters', function() {
          var delayTime = 2;
          var maxDelayTime = 5;
          var virtualNodeParams = [{
            id: 0,
            node: 'delay',
            params: {
              delayTime: delayTime,
              maxDelayTime: maxDelayTime
            },
            output: 'output'
          }];
          virtualAudioGraph.update(virtualNodeParams);
          var audioNode = virtualAudioGraph.virtualNodes[0].audioNode;
          expect(audioNode.constructor).toBe(DelayNode);
          expect(audioNode.delayTime.value).toBe(delayTime);
        });
        it('creates StereoPannerNode with all valid parameters', function() {
          var pan = 1;
          var virtualNodeParams = [{
            id: 0,
            node: 'stereoPanner',
            params: {pan: pan},
            output: 'output'
          }];
          virtualAudioGraph.update(virtualNodeParams);
          var audioNode = virtualAudioGraph.virtualNodes[0].audioNode;
          expect(audioNode.constructor.name).toBe('StereoPannerNode');
          expect(audioNode.pan.value).toBe(pan);
        });
      });
    }, {
      "../src/index.js": 15,
      "./tools/pingPongDelayParamsFactory": 11
    }],
    14: [function(require, module, exports) {
      'use strict';
      var _createClass = require("babel-runtime/helpers/create-class")['default'];
      var _classCallCheck = require("babel-runtime/helpers/class-call-check")['default'];
      var _require = require("ramda");
      var any = _require.any;
      var assoc = _require.assoc;
      var concat = _require.concat;
      var compose = _require.compose;
      var differenceWith = _require.differenceWith;
      var eqProps = _require.eqProps;
      var find = _require.find;
      var findIndex = _require.findIndex;
      var forEach = _require.forEach;
      var intersectionWith = _require.intersectionWith;
      var isNil = _require.isNil;
      var map = _require.map;
      var partition = _require.partition;
      var propEq = _require.propEq;
      var remove = _require.remove;
      var capitalize = require("capitalize");
      var NativeVirtualAudioNode = require("./virtualNodeConstructors/NativeVirtualAudioNode");
      var CustomVirtualAudioNode = require("./virtualNodeConstructors/CustomVirtualAudioNode");
      var connectAudioNodes = require("./tools/connectAudioNodes");
      var disconnectAndRemoveVirtualAudioNode = function disconnectAndRemoveVirtualAudioNode(virtualNode) {
        virtualNode.disconnect();
        this.virtualNodes = remove(findIndex(propEq('id', virtualNode.id))(this.virtualNodes), 1, this.virtualNodes);
      };
      var createVirtualAudioNodesAndUpdateVirtualAudioGraph = function createVirtualAudioNodesAndUpdateVirtualAudioGraph(virtualAudioNodeParams) {
        var newVirtualAudioNodeParams = differenceWith(eqProps('id'), virtualAudioNodeParams, this.virtualNodes);
        this.virtualNodes = concat(this.virtualNodes, this.createVirtualAudioNodes(newVirtualAudioNodeParams));
        return virtualAudioNodeParams;
      };
      var removeAudioNodesAndUpdateVirtualAudioGraph = function removeAudioNodesAndUpdateVirtualAudioGraph(virtualAudioNodeParams) {
        var virtualNodesToBeRemoved = differenceWith(eqProps('id'), this.virtualNodes, virtualAudioNodeParams);
        forEach(disconnectAndRemoveVirtualAudioNode.bind(this), virtualNodesToBeRemoved);
        return virtualAudioNodeParams;
      };
      var updateAudioNodesAndUpdateVirtualAudioGraph = function updateAudioNodesAndUpdateVirtualAudioGraph(virtualAudioNodeParams) {
        var _this = this;
        var updateParams = intersectionWith(eqProps('id'), virtualAudioNodeParams, this.virtualNodes);
        forEach(function(virtualAudioNodeParam) {
          var virtualAudioNode = find(propEq('id', virtualAudioNodeParam.id))(_this.virtualNodes);
          if (virtualAudioNodeParam.node !== virtualAudioNode.node)
            disconnectAndRemoveVirtualAudioNode.call(_this, virtualAudioNode);
          virtualAudioNode.updateAudioNode(virtualAudioNodeParam.params);
        }, updateParams);
        return virtualAudioNodeParams;
      };
      var VirtualAudioGraph = (function() {
        function VirtualAudioGraph() {
          var params = arguments[0] === undefined ? {} : arguments[0];
          _classCallCheck(this, VirtualAudioGraph);
          this.audioContext = params.audioContext || new AudioContext();
          this.output = params.output || this.audioContext.destination;
          this.virtualNodes = [];
          this.customNodes = {};
          this._removeUpdateAndCreate = compose(createVirtualAudioNodesAndUpdateVirtualAudioGraph.bind(this), updateAudioNodesAndUpdateVirtualAudioGraph.bind(this), removeAudioNodesAndUpdateVirtualAudioGraph.bind(this));
        }
        _createClass(VirtualAudioGraph, [{
          key: 'createVirtualAudioNodes',
          value: function createVirtualAudioNodes(virtualAudioNodesParams) {
            var _this2 = this;
            var partitionedVirtualAudioNodeParams = partition(function(_ref) {
              var node = _ref.node;
              return isNil(_this2.customNodes[node]);
            }, virtualAudioNodesParams);
            var nativeVirtualAudioNodeParams = partitionedVirtualAudioNodeParams[0];
            var customVirtualAudioNodeParams = partitionedVirtualAudioNodeParams[1];
            var nativeVirtualAudioNodes = map(function(virtualAudioNodeParams) {
              return new NativeVirtualAudioNode(_this2, virtualAudioNodeParams);
            }, nativeVirtualAudioNodeParams);
            var customVirtualAudioNodes = map(function(virtualAudioNodeParams) {
              return new CustomVirtualAudioNode(_this2, virtualAudioNodeParams);
            }, customVirtualAudioNodeParams);
            return concat(nativeVirtualAudioNodes, customVirtualAudioNodes);
          }
        }, {
          key: 'defineNode',
          value: function defineNode(customNodeParamsFactory, name) {
            if (this.audioContext['create' + capitalize(name)])
              throw new Error(name + ' is a standard audio node name and cannot be overwritten');
            this.customNodes[name] = customNodeParamsFactory;
            return this;
          }
        }, {
          key: 'update',
          value: function update(virtualAudioNodeParams) {
            var _this3 = this;
            if (any(propEq('id', undefined), virtualAudioNodeParams))
              throw new Error('Every virtualAudioNode needs an id for efficient diffing and determining relationships between nodes');
            this._removeUpdateAndCreate(virtualAudioNodeParams);
            connectAudioNodes(CustomVirtualAudioNode, this.virtualNodes, function(virtualAudioNode) {
              return virtualAudioNode.connect(_this3.output);
            });
            return this;
          }
        }]);
        return VirtualAudioGraph;
      })();
      module.exports = VirtualAudioGraph;
    }, {
      "./tools/connectAudioNodes": 16,
      "./virtualNodeConstructors/CustomVirtualAudioNode": 18,
      "./virtualNodeConstructors/NativeVirtualAudioNode": 19,
      "babel-runtime/helpers/class-call-check": 2,
      "babel-runtime/helpers/create-class": 3,
      "capitalize": 7,
      "ramda": 8
    }],
    15: [function(require, module, exports) {
      'use strict';
      module.exports = require("./VirtualAudioGraph");
    }, {"./VirtualAudioGraph": 14}],
    16: [function(require, module, exports) {
      'use strict';
      var _require = require("ramda");
      var find = _require.find;
      var forEach = _require.forEach;
      var propEq = _require.propEq;
      module.exports = function(CustomVirtualAudioNode, virtualAudioNodes) {
        var handleConnectionToOutput = arguments[2] === undefined ? function() {} : arguments[2];
        return forEach(function(virtualAudioNode) {
          forEach(function(connection) {
            if (connection === 'output') {
              handleConnectionToOutput(virtualAudioNode);
            } else {
              var destinationVirtualAudioNode = find(propEq('id', connection))(virtualAudioNodes);
              if (destinationVirtualAudioNode instanceof CustomVirtualAudioNode) {
                forEach(virtualAudioNode.connect.bind(virtualAudioNode), destinationVirtualAudioNode.inputs);
              } else {
                virtualAudioNode.connect(destinationVirtualAudioNode.audioNode);
              }
            }
          }, virtualAudioNode.output);
        }, virtualAudioNodes);
      };
    }, {"ramda": 8}],
    17: [function(require, module, exports) {
      'use strict';
      var capitalize = require("capitalize");
      var namesToParamsKey = {delay: 'maxDelayTime'};
      module.exports = function(audioContext, name, constructorParams) {
        var constructorParamsKey = namesToParamsKey[name];
        var audioNode = constructorParamsKey ? audioContext['create' + capitalize(name)](constructorParams[constructorParamsKey]) : audioContext['create' + capitalize(name)]();
        if (name === 'oscillator') {
          audioNode.start();
        }
        return audioNode;
      };
    }, {"capitalize": 7}],
    18: [function(require, module, exports) {
      'use strict';
      var _createClass = require("babel-runtime/helpers/create-class")['default'];
      var _classCallCheck = require("babel-runtime/helpers/class-call-check")['default'];
      var _require = require("ramda");
      var contains = _require.contains;
      var filter = _require.filter;
      var forEach = _require.forEach;
      var keys = _require.keys;
      var pick = _require.pick;
      var pluck = _require.pluck;
      var propEq = _require.propEq;
      var omit = _require.omit;
      var zipWith = _require.zipWith;
      var connectAudioNodes = require("../tools/connectAudioNodes");
      module.exports = (function() {
        function CustomVirtualAudioNode(virtualAudioGraph, _ref) {
          var node = _ref.node;
          var id = _ref.id;
          var output = _ref.output;
          var params = _ref.params;
          _classCallCheck(this, CustomVirtualAudioNode);
          params = params || {};
          this.audioGraphParamsFactory = virtualAudioGraph.customNodes[node];
          this.node = node;
          this.virtualNodes = this.audioGraphParamsFactory(params);
          this.virtualNodes = virtualAudioGraph.createVirtualAudioNodes(this.virtualNodes);
          connectAudioNodes(CustomVirtualAudioNode, this.virtualNodes);
          this.id = id;
          this.output = Array.isArray(output) ? output : [output];
        }
        _createClass(CustomVirtualAudioNode, [{
          key: 'connect',
          value: function connect(destination) {
            var outputVirtualNodes = filter(function(_ref2) {
              var output = _ref2.output;
              return contains('output', output);
            }, this.virtualNodes);
            forEach(function(audioNode) {
              return audioNode.connect(destination);
            }, pluck('audioNode', outputVirtualNodes));
          }
        }, {
          key: 'disconnect',
          value: function disconnect() {
            forEach(function(virtualNode) {
              return virtualNode.disconnect();
            }, this.virtualNodes);
          }
        }, {
          key: 'updateAudioNode',
          value: function updateAudioNode(params) {
            zipWith(function(virtualNode, _ref3) {
              var params = _ref3.params;
              return virtualNode.updateAudioNode(params);
            }, this.virtualNodes, this.audioGraphParamsFactory(params));
          }
        }, {
          key: 'inputs',
          get: function get() {
            return pluck('audioNode', filter(propEq('input', 'input'), this.virtualNodes));
          }
        }]);
        return CustomVirtualAudioNode;
      })();
    }, {
      "../tools/connectAudioNodes": 16,
      "babel-runtime/helpers/class-call-check": 2,
      "babel-runtime/helpers/create-class": 3,
      "ramda": 8
    }],
    19: [function(require, module, exports) {
      'use strict';
      var _createClass = require("babel-runtime/helpers/create-class")['default'];
      var _classCallCheck = require("babel-runtime/helpers/class-call-check")['default'];
      var createAudioNode = require("../tools/createAudioNode");
      var _require = require("ramda");
      var forEach = _require.forEach;
      var keys = _require.keys;
      var pick = _require.pick;
      var omit = _require.omit;
      var constructorParamsKeys = ['maxDelayTime'];
      module.exports = (function() {
        function NativeVirtualAudioNode(virtualAudioGraph, virtualNodeParams) {
          _classCallCheck(this, NativeVirtualAudioNode);
          var node = virtualNodeParams.node;
          var id = virtualNodeParams.id;
          var input = virtualNodeParams.input;
          var output = virtualNodeParams.output;
          var params = virtualNodeParams.params;
          params = params || {};
          var constructorParams = pick(constructorParamsKeys, params);
          params = omit(constructorParamsKeys, params);
          this.audioNode = createAudioNode(virtualAudioGraph.audioContext, node, constructorParams);
          this.node = node;
          this.updateAudioNode(params);
          this.id = id;
          this.input = input;
          this.output = Array.isArray(output) ? output : [output];
          this.params = params;
        }
        _createClass(NativeVirtualAudioNode, [{
          key: 'connect',
          value: function connect(destination) {
            this.audioNode.connect(destination);
          }
        }, {
          key: 'disconnect',
          value: function disconnect() {
            this.audioNode.stop && this.audioNode.stop();
            this.audioNode.disconnect();
          }
        }, {
          key: 'updateAudioNode',
          value: function updateAudioNode(params) {
            var _this = this;
            params = omit(constructorParamsKeys, params);
            forEach(function(key) {
              switch (key) {
                case 'type':
                  _this.audioNode[key] = params[key];
                  return ;
                default:
                  _this.audioNode[key].value = params[key];
                  return ;
              }
            }, keys(params));
          }
        }]);
        return NativeVirtualAudioNode;
      })();
    }, {
      "../tools/createAudioNode": 17,
      "babel-runtime/helpers/class-call-check": 2,
      "babel-runtime/helpers/create-class": 3,
      "ramda": 8
    }]
  }, {}, [10]);
})(require("process"));
