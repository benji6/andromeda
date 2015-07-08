/* */ 
(function(process) {
  'use strict';
  var EventEmitter = require("events").EventEmitter;
  var fs = require("fs");
  var sysPath = require("path");
  var each = require("async-each");
  var anymatch = require("anymatch");
  var globparent = require("glob-parent");
  var isglob = require("is-glob");
  var arrify = require("arrify");
  var isAbsolute = require("path-is-absolute");
  var NodeFsHandler = require("./lib/nodefs-handler");
  var FsEventsHandler = require("./lib/fsevents-handler");
  function FSWatcher(_opts) {
    var opts = {};
    if (_opts)
      for (var opt in _opts)
        opts[opt] = _opts[opt];
    this._watched = Object.create(null);
    this._closers = Object.create(null);
    this._ignoredPaths = Object.create(null);
    Object.defineProperty(this, '_globIgnored', {get: function() {
        return Object.keys(this._ignoredPaths);
      }});
    this.closed = false;
    this._throttled = Object.create(null);
    this._symlinkPaths = Object.create(null);
    function undef(key) {
      return opts[key] === undefined;
    }
    if (undef('persistent'))
      opts.persistent = true;
    if (undef('ignoreInitial'))
      opts.ignoreInitial = false;
    if (undef('ignorePermissionErrors'))
      opts.ignorePermissionErrors = false;
    if (undef('interval'))
      opts.interval = 100;
    if (undef('binaryInterval'))
      opts.binaryInterval = 300;
    this.enableBinaryInterval = opts.binaryInterval !== opts.interval;
    if (undef('useFsEvents'))
      opts.useFsEvents = !opts.usePolling;
    if (!FsEventsHandler.canUse())
      opts.useFsEvents = false;
    if (undef('usePolling') && !opts.useFsEvents) {
      opts.usePolling = process.platform === 'darwin';
    }
    if (undef('atomic'))
      opts.atomic = !opts.usePolling && !opts.useFsEvents;
    if (opts.atomic)
      this._pendingUnlinks = Object.create(null);
    if (undef('followSymlinks'))
      opts.followSymlinks = true;
    this._isntIgnored = function(path, stat) {
      return !this._isIgnored(path, stat);
    }.bind(this);
    var readyCalls = 0;
    this._emitReady = function() {
      if (++readyCalls >= this._readyCount) {
        this._emitReady = Function.prototype;
        process.nextTick(this.emit.bind(this, 'ready'));
      }
    }.bind(this);
    this.options = opts;
    Object.freeze(opts);
  }
  FSWatcher.prototype = Object.create(EventEmitter.prototype);
  FSWatcher.prototype._emit = function(event, path, val1, val2, val3) {
    if (this.options.cwd)
      path = sysPath.relative(this.options.cwd, path);
    var args = [event, path];
    if (val3 !== undefined)
      args.push(val1, val2, val3);
    else if (val2 !== undefined)
      args.push(val1, val2);
    else if (val1 !== undefined)
      args.push(val1);
    if (this.options.atomic) {
      if (event === 'unlink') {
        this._pendingUnlinks[path] = args;
        setTimeout(function() {
          Object.keys(this._pendingUnlinks).forEach(function(path) {
            this.emit.apply(this, this._pendingUnlinks[path]);
            this.emit.apply(this, ['all'].concat(this._pendingUnlinks[path]));
            delete this._pendingUnlinks[path];
          }.bind(this));
        }.bind(this), 100);
        return this;
      } else if (event === 'add' && this._pendingUnlinks[path]) {
        event = args[0] = 'change';
        delete this._pendingUnlinks[path];
      }
    }
    if (event === 'change') {
      if (!this._throttle('change', path, 50))
        return this;
    }
    var emitEvent = function() {
      this.emit.apply(this, args);
      if (event !== 'error')
        this.emit.apply(this, ['all'].concat(args));
    }.bind(this);
    if (this.options.alwaysStat && val1 === undefined && (event === 'add' || event === 'addDir' || event === 'change')) {
      fs.stat(path, function(error, stats) {
        if (error || !stats)
          return ;
        args.push(stats);
        emitEvent();
      });
    } else {
      emitEvent();
    }
    return this;
  };
  FSWatcher.prototype._handleError = function(error) {
    var code = error && error.code;
    var ipe = this.options.ignorePermissionErrors;
    if (error && code !== 'ENOENT' && code !== 'ENOTDIR' && (!ipe || (code !== 'EPERM' && code !== 'EACCES')))
      this.emit('error', error);
    return error || this.closed;
  };
  FSWatcher.prototype._throttle = function(action, path, timeout) {
    if (!(action in this._throttled)) {
      this._throttled[action] = Object.create(null);
    }
    var throttled = this._throttled[action];
    if (path in throttled)
      return false;
    function clear() {
      delete throttled[path];
      clearTimeout(timeoutObject);
    }
    var timeoutObject = setTimeout(clear, timeout);
    throttled[path] = {
      timeoutObject: timeoutObject,
      clear: clear
    };
    return throttled[path];
  };
  FSWatcher.prototype._isIgnored = function(path, stats) {
    if (this.options.atomic && /\..*\.(sw[px])$|\~$|\.subl.*\.tmp/.test(path))
      return true;
    this._userIgnored = this._userIgnored || anymatch(this._globIgnored.concat(this.options.ignored).concat(arrify(this.options.ignored).filter(function(path) {
      return typeof path === 'string' && !isglob(path);
    }).map(function(path) {
      return path + '/**/*';
    })));
    return this._userIgnored([path, stats]);
  };
  FSWatcher.prototype._getWatchHelpers = function(path, depth) {
    path = path.replace(/^\.[\/\\]/, '');
    var watchPath = depth ? path : globparent(path);
    var hasGlob = watchPath !== path;
    var globFilter = hasGlob ? anymatch(path) : false;
    var entryPath = function(entry) {
      return sysPath.join(watchPath, sysPath.relative(watchPath, entry.fullPath));
    };
    var filterPath = function(entry) {
      return (!hasGlob || globFilter(entryPath(entry))) && this._isntIgnored(entryPath(entry), entry.stat) && (this.options.ignorePermissionErrors || this._hasReadPermissions(entry.stat));
    }.bind(this);
    var getDirParts = function(path) {
      if (!hasGlob)
        return false;
      var parts = sysPath.relative(watchPath, path).split(/[\/\\]/);
      return parts;
    };
    var dirParts = getDirParts(path);
    if (dirParts && dirParts.length > 1)
      dirParts.pop();
    var filterDir = function(entry) {
      if (hasGlob) {
        var entryParts = getDirParts(entry.fullPath);
        var globstar = false;
        var unmatchedGlob = !dirParts.every(function(part, i) {
          if (part === '**')
            globstar = true;
          return globstar || !entryParts[i] || anymatch(part, entryParts[i]);
        });
      }
      return !unmatchedGlob && this._isntIgnored(entryPath(entry), entry.stat);
    }.bind(this);
    return {
      followSymlinks: this.options.followSymlinks,
      statMethod: this.options.followSymlinks ? 'stat' : 'lstat',
      path: path,
      watchPath: watchPath,
      entryPath: entryPath,
      hasGlob: hasGlob,
      globFilter: globFilter,
      filterPath: filterPath,
      filterDir: filterDir
    };
  };
  FSWatcher.prototype._getWatchedDir = function(directory) {
    var dir = sysPath.resolve(directory);
    var watcherRemove = this._remove.bind(this);
    if (!(dir in this._watched))
      this._watched[dir] = {
        _items: Object.create(null),
        add: function(item) {
          this._items[item] = true;
        },
        remove: function(item) {
          delete this._items[item];
          if (!this.children().length) {
            fs.readdir(dir, function(err) {
              if (err)
                watcherRemove(sysPath.dirname(dir), sysPath.basename(dir));
            });
          }
        },
        has: function(item) {
          return item in this._items;
        },
        children: function() {
          return Object.keys(this._items);
        }
      };
    return this._watched[dir];
  };
  FSWatcher.prototype._hasReadPermissions = function(stats) {
    return Boolean(4 & parseInt(((stats && stats.mode) & 0x1ff).toString(8)[0], 10));
  };
  FSWatcher.prototype._remove = function(directory, item) {
    var path = sysPath.join(directory, item);
    var fullPath = sysPath.resolve(path);
    var isDirectory = this._watched[path] || this._watched[fullPath];
    if (!this._throttle('remove', path, 100))
      return ;
    var watchedDirs = Object.keys(this._watched);
    if (!isDirectory && !this.options.useFsEvents && watchedDirs.length === 1) {
      this.add(directory, item, true);
    }
    var nestedDirectoryChildren = this._getWatchedDir(path).children();
    nestedDirectoryChildren.forEach(function(nestedItem) {
      this._remove(path, nestedItem);
    }, this);
    var parent = this._getWatchedDir(directory);
    var wasTracked = parent.has(item);
    parent.remove(item);
    delete this._watched[path];
    delete this._watched[fullPath];
    var eventName = isDirectory ? 'unlinkDir' : 'unlink';
    if (wasTracked && !this._isIgnored(path))
      this._emit(eventName, path);
  };
  FSWatcher.prototype.add = function(paths, _origAdd, _internal) {
    var cwd = this.options.cwd;
    this.closed = false;
    paths = arrify(paths);
    if (cwd)
      paths = paths.map(function(path) {
        return isAbsolute(path) ? path : sysPath.join(cwd, path);
      });
    paths = paths.filter(function(path) {
      if (path[0] === '!')
        this._ignoredPaths[path.substring(1)] = true;
      else {
        delete this._ignoredPaths[path];
        delete this._ignoredPaths[path + '/**/*'];
        this._userIgnored = null;
        return true;
      }
    }, this);
    if (this.options.useFsEvents && FsEventsHandler.canUse()) {
      if (!this._readyCount)
        this._readyCount = paths.length;
      if (this.options.persistent)
        this._readyCount *= 2;
      paths.forEach(this._addToFsEvents, this);
    } else {
      if (!this._readyCount)
        this._readyCount = 0;
      this._readyCount += paths.length;
      each(paths, function(path, next) {
        this._addToNodeFs(path, !_internal, 0, 0, _origAdd, function(err, res) {
          if (res)
            this._emitReady();
          next(err, res);
        }.bind(this));
      }.bind(this), function(error, results) {
        results.forEach(function(item) {
          if (!item)
            return ;
          this.add(sysPath.dirname(item), sysPath.basename(_origAdd || item));
        }, this);
      }.bind(this));
    }
    return this;
  };
  FSWatcher.prototype.unwatch = function(paths) {
    if (this.closed)
      return this;
    paths = arrify(paths);
    paths.forEach(function(path) {
      if (this._closers[path]) {
        this._closers[path]();
      } else {
        this._ignoredPaths[path] = true;
        if (path in this._watched)
          this._ignoredPaths[path + '/**/*'] = true;
        this._userIgnored = null;
      }
    }, this);
    return this;
  };
  FSWatcher.prototype.close = function() {
    if (this.closed)
      return this;
    this.closed = true;
    Object.keys(this._closers).forEach(function(watchPath) {
      this._closers[watchPath]();
      delete this._closers[watchPath];
    }, this);
    this._watched = Object.create(null);
    this.removeAllListeners();
    return this;
  };
  function importHandler(handler) {
    Object.keys(handler.prototype).forEach(function(method) {
      FSWatcher.prototype[method] = handler.prototype[method];
    });
  }
  importHandler(NodeFsHandler);
  if (FsEventsHandler.canUse())
    importHandler(FsEventsHandler);
  exports.FSWatcher = FSWatcher;
  exports.watch = function(paths, options) {
    return new FSWatcher(options).add(paths);
  };
})(require("process"));
