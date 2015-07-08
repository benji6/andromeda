/* */ 
(function(process) {
  'use strict';
  var fs = require("graceful-fs"),
      path = require("path"),
      minimatch = require("minimatch"),
      toString = Object.prototype.toString;
  ;
  function isFunction(obj) {
    return toString.call(obj) === '[object Function]';
  }
  function isString(obj) {
    return toString.call(obj) === '[object String]';
  }
  function isRegExp(obj) {
    return toString.call(obj) === '[object RegExp]';
  }
  function isUndefined(obj) {
    return obj === void 0;
  }
  function readdir(opts, callback1, callback2) {
    var stream,
        handleError,
        handleFatalError,
        pending = 0,
        errors = [],
        readdirResult = {
          directories: [],
          files: []
        },
        fileProcessed,
        allProcessed,
        realRoot,
        aborted = false;
    ;
    if (isUndefined(callback1)) {
      var api = require("./stream-api")();
      stream = api.stream;
      callback1 = api.processEntry;
      callback2 = api.done;
      handleError = api.handleError;
      handleFatalError = api.handleFatalError;
      stream.on('close', function() {
        aborted = true;
      });
    } else {
      handleError = function(err) {
        errors.push(err);
      };
      handleFatalError = function(err) {
        handleError(err);
        allProcessed(errors, null);
      };
    }
    if (isUndefined(opts)) {
      handleFatalError(new Error('Need to pass at least one argument: opts! \n' + 'https://github.com/thlorenz/readdirp#options'));
      return stream;
    }
    opts.root = opts.root || '.';
    opts.fileFilter = opts.fileFilter || function() {
      return true;
    };
    opts.directoryFilter = opts.directoryFilter || function() {
      return true;
    };
    opts.depth = typeof opts.depth === 'undefined' ? 999999999 : opts.depth;
    opts.entryType = opts.entryType || 'files';
    var statfn = opts.lstat === true ? fs.lstat.bind(fs) : fs.stat.bind(fs);
    if (isUndefined(callback2)) {
      fileProcessed = function() {};
      allProcessed = callback1;
    } else {
      fileProcessed = callback1;
      allProcessed = callback2;
    }
    function normalizeFilter(filter) {
      if (isUndefined(filter))
        return undefined;
      function isNegated(filters) {
        function negated(f) {
          return f.indexOf('!') === 0;
        }
        var some = filters.some(negated);
        if (!some) {
          return false;
        } else {
          if (filters.every(negated)) {
            return true;
          } else {
            throw new Error('Cannot mix negated with non negated glob filters: ' + filters + '\n' + 'https://github.com/thlorenz/readdirp#filters');
          }
        }
      }
      if (isFunction(filter)) {
        return filter;
      } else if (isString(filter)) {
        return function(entryInfo) {
          return minimatch(entryInfo.name, filter.trim());
        };
      } else if (filter && Array.isArray(filter)) {
        if (filter)
          filter = filter.map(function(f) {
            return f.trim();
          });
        return isNegated(filter) ? function(entryInfo) {
          return filter.every(function(f) {
            return minimatch(entryInfo.name, f);
          });
        } : function(entryInfo) {
          return filter.some(function(f) {
            return minimatch(entryInfo.name, f);
          });
        };
      }
    }
    function processDir(currentDir, entries, callProcessed) {
      if (aborted)
        return ;
      var total = entries.length,
          processed = 0,
          entryInfos = [];
      ;
      fs.realpath(currentDir, function(err, realCurrentDir) {
        if (aborted)
          return ;
        if (err) {
          handleError(err);
          callProcessed(entryInfos);
          return ;
        }
        var relDir = path.relative(realRoot, realCurrentDir);
        if (entries.length === 0) {
          callProcessed([]);
        } else {
          entries.forEach(function(entry) {
            var fullPath = path.join(realCurrentDir, entry),
                relPath = path.join(relDir, entry);
            statfn(fullPath, function(err, stat) {
              if (err) {
                handleError(err);
              } else {
                entryInfos.push({
                  name: entry,
                  path: relPath,
                  fullPath: fullPath,
                  parentDir: relDir,
                  fullParentDir: realCurrentDir,
                  stat: stat
                });
              }
              processed++;
              if (processed === total)
                callProcessed(entryInfos);
            });
          });
        }
      });
    }
    function readdirRec(currentDir, depth, callCurrentDirProcessed) {
      if (aborted)
        return ;
      fs.readdir(currentDir, function(err, entries) {
        if (err) {
          handleError(err);
          callCurrentDirProcessed();
          return ;
        }
        processDir(currentDir, entries, function(entryInfos) {
          var subdirs = entryInfos.filter(function(ei) {
            return ei.stat.isDirectory() && opts.directoryFilter(ei);
          });
          subdirs.forEach(function(di) {
            if (opts.entryType === 'directories' || opts.entryType === 'both' || opts.entryType === 'all') {
              fileProcessed(di);
            }
            readdirResult.directories.push(di);
          });
          entryInfos.filter(function(ei) {
            var isCorrectType = opts.entryType === 'all' ? !ei.stat.isDirectory() : ei.stat.isFile() || ei.stat.isSymbolicLink();
            return isCorrectType && opts.fileFilter(ei);
          }).forEach(function(fi) {
            if (opts.entryType === 'files' || opts.entryType === 'both' || opts.entryType === 'all') {
              fileProcessed(fi);
            }
            readdirResult.files.push(fi);
          });
          var pendingSubdirs = subdirs.length;
          if (pendingSubdirs === 0 || depth === opts.depth) {
            callCurrentDirProcessed();
          } else {
            subdirs.forEach(function(subdir) {
              readdirRec(subdir.fullPath, depth + 1, function() {
                pendingSubdirs = pendingSubdirs - 1;
                if (pendingSubdirs === 0) {
                  callCurrentDirProcessed();
                }
              });
            });
          }
        });
      });
    }
    try {
      opts.fileFilter = normalizeFilter(opts.fileFilter);
      opts.directoryFilter = normalizeFilter(opts.directoryFilter);
    } catch (err) {
      handleFatalError(err);
      return stream;
    }
    fs.realpath(opts.root, function(err, res) {
      if (err) {
        handleFatalError(err);
        return stream;
      }
      realRoot = res;
      readdirRec(opts.root, 0, function() {
        if (errors.length > 0) {
          allProcessed(errors, readdirResult);
        } else {
          allProcessed(null, readdirResult);
        }
      });
    });
    return stream;
  }
  module.exports = readdir;
})(require("process"));
