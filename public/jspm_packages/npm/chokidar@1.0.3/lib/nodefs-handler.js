/* */ 
(function(process) {
  'use strict';
  var fs = require("fs");
  var sysPath = require("path");
  var readdirp = require("readdirp");
  var isBinaryPath = require("is-binary-path");
  var FsWatchInstances = Object.create(null);
  function createFsWatchInstance(path, options, listener, errHandler, emitRaw) {
    var handleEvent = function(rawEvent, evPath) {
      listener(path);
      emitRaw(rawEvent, evPath, {watchedPath: path});
      if (evPath && path !== evPath) {
        fsWatchBroadcast(sysPath.resolve(path, evPath), 'listeners', sysPath.join(path, evPath));
      }
    };
    try {
      return fs.watch(path, options, handleEvent);
    } catch (error) {
      errHandler(error);
    }
  }
  function fsWatchBroadcast(fullPath, type, val1, val2, val3) {
    if (!FsWatchInstances[fullPath])
      return ;
    FsWatchInstances[fullPath][type].forEach(function(listener) {
      listener(val1, val2, val3);
    });
  }
  function setFsWatchListener(path, fullPath, options, handlers) {
    var listener = handlers.listener;
    var errHandler = handlers.errHandler;
    var rawEmitter = handlers.rawEmitter;
    var container = FsWatchInstances[fullPath];
    var watcher;
    if (!options.persistent) {
      watcher = createFsWatchInstance(path, options, listener, errHandler, rawEmitter);
      return watcher.close.bind(watcher);
    }
    if (!container) {
      watcher = createFsWatchInstance(path, options, fsWatchBroadcast.bind(null, fullPath, 'listeners'), errHandler, fsWatchBroadcast.bind(null, fullPath, 'rawEmitters'));
      if (!watcher)
        return ;
      var broadcastErr = fsWatchBroadcast.bind(null, fullPath, 'errHandlers');
      watcher.on('error', function(error) {
        if (process.platform === 'win32' && error.code === 'EPERM') {
          fs.open(path, 'r', function(err, fd) {
            if (fd)
              fs.close(fd);
            if (!err)
              broadcastErr(error);
          });
        } else {
          broadcastErr(error);
        }
      });
      container = FsWatchInstances[fullPath] = {
        listeners: [listener],
        errHandlers: [errHandler],
        rawEmitters: [rawEmitter],
        watcher: watcher
      };
    } else {
      container.listeners.push(listener);
      container.errHandlers.push(errHandler);
      container.rawEmitters.push(rawEmitter);
    }
    var listenerIndex = container.listeners.length - 1;
    return function close() {
      delete container.listeners[listenerIndex];
      delete container.errHandlers[listenerIndex];
      delete container.rawEmitters[listenerIndex];
      if (!Object.keys(container.listeners).length) {
        container.watcher.close();
        delete FsWatchInstances[fullPath];
      }
    };
  }
  var FsWatchFileInstances = Object.create(null);
  function setFsWatchFileListener(path, fullPath, options, handlers) {
    var listener = handlers.listener;
    var rawEmitter = handlers.rawEmitter;
    var container = FsWatchFileInstances[fullPath];
    var listeners = [];
    var rawEmitters = [];
    if (container && (container.options.persistent < options.persistent || container.options.interval > options.interval)) {
      listeners = container.listeners;
      rawEmitters = container.rawEmitters;
      fs.unwatchFile(fullPath);
      container = false;
    }
    if (!container) {
      listeners.push(listener);
      rawEmitters.push(rawEmitter);
      container = FsWatchFileInstances[fullPath] = {
        listeners: listeners,
        rawEmitters: rawEmitters,
        options: options,
        watcher: fs.watchFile(fullPath, options, function(curr, prev) {
          container.rawEmitters.forEach(function(rawEmitter) {
            rawEmitter('change', fullPath, {
              curr: curr,
              prev: prev
            });
          });
          var currmtime = curr.mtime.getTime();
          if (curr.size !== prev.size || currmtime > prev.mtime.getTime() || currmtime === 0) {
            container.listeners.forEach(function(listener) {
              listener(path, curr);
            });
          }
        })
      };
    } else {
      container.listeners.push(listener);
      container.rawEmitters.push(rawEmitter);
    }
    var listenerIndex = container.listeners.length - 1;
    return function close() {
      delete container.listeners[listenerIndex];
      delete container.rawEmitters[listenerIndex];
      if (!Object.keys(container.listeners).length) {
        fs.unwatchFile(fullPath);
        delete FsWatchFileInstances[fullPath];
      }
    };
  }
  function NodeFsHandler() {}
  NodeFsHandler.prototype._watchWithNodeFs = function(path, listener) {
    var directory = sysPath.dirname(path);
    var basename = sysPath.basename(path);
    var parent = this._getWatchedDir(directory);
    parent.add(basename);
    var absolutePath = sysPath.resolve(path);
    var options = {persistent: this.options.persistent};
    if (!listener)
      listener = Function.prototype;
    var closer;
    if (this.options.usePolling) {
      options.interval = this.enableBinaryInterval && isBinaryPath(basename) ? this.options.binaryInterval : this.options.interval;
      closer = setFsWatchFileListener(path, absolutePath, options, {
        listener: listener,
        rawEmitter: this.emit.bind(this, 'raw')
      });
    } else {
      closer = setFsWatchListener(path, absolutePath, options, {
        listener: listener,
        errHandler: this._handleError.bind(this),
        rawEmitter: this.emit.bind(this, 'raw')
      });
    }
    return closer;
  };
  NodeFsHandler.prototype._handleFile = function(file, stats, initialAdd, callback) {
    var dirname = sysPath.dirname(file);
    var basename = sysPath.basename(file);
    var parent = this._getWatchedDir(dirname);
    if (parent.has(basename))
      return callback();
    var closer = this._watchWithNodeFs(file, function(path, newStats) {
      if (!this._throttle('watch', file, 5))
        return ;
      if (!newStats || newStats && newStats.mtime.getTime() === 0) {
        fs.stat(file, function(error, newStats) {
          if (error) {
            this._remove(dirname, basename);
          } else {
            this._emit('change', file, newStats);
          }
        }.bind(this));
      } else if (parent.has(basename)) {
        this._emit('change', file, newStats);
      }
    }.bind(this));
    if (!(initialAdd && this.options.ignoreInitial)) {
      if (!this._throttle('add', file, 0))
        return ;
      this._emit('add', file, stats);
    }
    if (callback)
      callback();
    return closer;
  };
  NodeFsHandler.prototype._handleSymlink = function(entry, directory, path, item) {
    var full = entry.fullPath;
    var dir = this._getWatchedDir(directory);
    if (!this.options.followSymlinks) {
      this._readyCount++;
      fs.realpath(path, function(error, linkPath) {
        if (dir.has(item)) {
          if (this._symlinkPaths[full] !== linkPath) {
            this._symlinkPaths[full] = linkPath;
            this._emit('change', path, entry.stat);
          }
        } else {
          dir.add(item);
          this._symlinkPaths[full] = linkPath;
          this._emit('add', path, entry.stat);
        }
        this._emitReady();
      }.bind(this));
      return true;
    }
    if (this._symlinkPaths[full])
      return true;
    else
      this._symlinkPaths[full] = true;
  };
  NodeFsHandler.prototype._handleDir = function(dir, stats, initialAdd, depth, target, wh, callback) {
    if (!(initialAdd && this.options.ignoreInitial) && !target && !wh.hasGlob) {
      this._emit('addDir', dir, stats);
    }
    this._getWatchedDir(sysPath.dirname(dir)).add(sysPath.basename(dir));
    this._getWatchedDir(dir);
    var read = function(directory, initialAdd, done) {
      directory = sysPath.join(directory, '');
      if (!wh.hasGlob) {
        var throttler = this._throttle('readdir', directory, 1000);
        if (!throttler)
          return ;
      }
      var previous = this._getWatchedDir(wh.path);
      var current = [];
      readdirp({
        root: directory,
        entryType: 'all',
        fileFilter: wh.filterPath,
        directoryFilter: wh.filterDir,
        depth: 0,
        lstat: true
      }).on('data', function(entry) {
        var item = entry.path;
        var path = sysPath.join(directory, item);
        current.push(item);
        if (entry.stat.isSymbolicLink() && this._handleSymlink(entry, directory, path, item))
          return ;
        if (item === target || !target && !previous.has(item)) {
          this._readyCount++;
          path = sysPath.join(dir, sysPath.relative(dir, path));
          this._addToNodeFs(path, initialAdd, wh, depth + 1);
        }
      }.bind(this)).on('end', function() {
        if (throttler)
          throttler.clear();
        if (done)
          done();
        previous.children().filter(function(item) {
          return item !== directory && current.indexOf(item) === -1 && (!wh.hasGlob || wh.filterPath({fullPath: sysPath.resolve(directory, item)}));
        }).forEach(function(item) {
          this._remove(directory, item);
        }, this);
      }.bind(this)).on('error', this._handleError.bind(this));
    }.bind(this);
    if (this.options.depth == null || depth <= this.options.depth) {
      if (!target)
        read(dir, initialAdd, callback);
      var closer = this._watchWithNodeFs(dir, function(dirPath, stats) {
        if (stats && stats.mtime.getTime() === 0)
          return ;
        read(dirPath, false);
      });
    } else {
      callback();
    }
    return closer;
  };
  NodeFsHandler.prototype._addToNodeFs = function(path, initialAdd, priorWh, depth, target, callback) {
    if (!callback)
      callback = Function.prototype;
    var ready = this._emitReady;
    if (this._isIgnored(path) || this.closed) {
      ready();
      return callback(null, false);
    }
    var wh = this._getWatchHelpers(path, depth);
    if (!wh.hasGlob && priorWh) {
      wh.hasGlob = priorWh.hasGlob;
      wh.filterPath = priorWh.filterPath;
      wh.filterDir = priorWh.filterDir;
    }
    fs[wh.statMethod](wh.watchPath, function(error, stats) {
      if (this._handleError(error))
        return callback(null, path);
      if (this._isIgnored(wh.watchPath, stats)) {
        ready();
        return callback(null, false);
      }
      var initDir = function(dir, target) {
        return this._handleDir(dir, stats, initialAdd, depth, target, wh, ready);
      }.bind(this);
      var closer;
      if (stats.isDirectory()) {
        closer = initDir(wh.watchPath, target);
      } else if (stats.isSymbolicLink()) {
        var parent = sysPath.dirname(wh.watchPath);
        this._getWatchedDir(parent).add(wh.watchPath);
        this._emit('add', wh.watchPath, stats);
        closer = initDir(parent, path);
        fs.realpath(path, function(error, targetPath) {
          this._symlinkPaths[sysPath.resolve(path)] = targetPath;
          ready();
        }.bind(this));
      } else {
        closer = this._handleFile(wh.watchPath, stats, initialAdd, ready);
      }
      if (closer)
        this._closers[path] = closer;
      callback(null, false);
    }.bind(this));
  };
  module.exports = NodeFsHandler;
})(require("process"));
