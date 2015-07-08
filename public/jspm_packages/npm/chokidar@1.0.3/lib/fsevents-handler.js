/* */ 
(function(process) {
  'use strict';
  var fs = require("fs");
  var sysPath = require("path");
  var readdirp = require("readdirp");
  var fsevents;
  try {
    fsevents = require("fsevents");
  } catch (error) {}
  var FSEventsWatchers = Object.create(null);
  function createFSEventsInstance(path, callback) {
    return (new fsevents(path)).on('fsevent', callback).start();
  }
  function setFSEventsListener(path, realPath, listener, rawEmitter) {
    var watchPath = sysPath.extname(path) ? sysPath.dirname(path) : path;
    var watchContainer;
    var resolvedPath = sysPath.resolve(path);
    var hasSymlink = resolvedPath !== realPath;
    function filteredListener(fullPath, flags, info) {
      if (hasSymlink)
        fullPath = fullPath.replace(realPath, resolvedPath);
      if (fullPath === resolvedPath || !fullPath.indexOf(resolvedPath + sysPath.sep))
        listener(fullPath, flags, info);
    }
    function watchedParent() {
      return Object.keys(FSEventsWatchers).some(function(watchedPath) {
        if (!realPath.indexOf(sysPath.resolve(watchedPath) + sysPath.sep)) {
          watchPath = watchedPath;
          return true;
        }
      });
    }
    if (watchPath in FSEventsWatchers || watchedParent()) {
      watchContainer = FSEventsWatchers[watchPath];
      watchContainer.listeners.push(filteredListener);
    } else {
      watchContainer = FSEventsWatchers[watchPath] = {
        listeners: [filteredListener],
        rawEmitters: [rawEmitter],
        watcher: createFSEventsInstance(watchPath, function(fullPath, flags) {
          var info = fsevents.getInfo(fullPath, flags);
          watchContainer.listeners.forEach(function(listener) {
            listener(fullPath, flags, info);
          });
          watchContainer.rawEmitters.forEach(function(emitter) {
            emitter(info.event, fullPath, info);
          });
        })
      };
    }
    var listenerIndex = watchContainer.listeners.length - 1;
    return function close() {
      delete watchContainer.listeners[listenerIndex];
      delete watchContainer.rawEmitters[listenerIndex];
      if (!Object.keys(watchContainer.listeners).length) {
        watchContainer.watcher.stop();
        delete FSEventsWatchers[watchPath];
      }
    };
  }
  function canUse() {
    return fsevents && Object.keys(FSEventsWatchers).length < 128;
  }
  function depth(path, root) {
    var i = 0;
    while (!path.indexOf(root) && (path = sysPath.dirname(path)) !== root)
      i++;
    return i;
  }
  function FsEventsHandler() {}
  FsEventsHandler.prototype._watchWithFsEvents = function(watchPath, realPath, transform, globFilter) {
    if (this._isIgnored(watchPath))
      return ;
    var watchCallback = function(fullPath, flags, info) {
      if (this.options.depth !== undefined && depth(fullPath, realPath) > this.options.depth)
        return ;
      var path = transform(sysPath.join(watchPath, sysPath.relative(watchPath, fullPath)));
      if (globFilter && !globFilter(path))
        return ;
      var parent = sysPath.dirname(path);
      var item = sysPath.basename(path);
      var watchedDir = this._getWatchedDir(info.type === 'directory' ? path : parent);
      var checkIgnored = function(stats) {
        if (this._isIgnored(path, stats)) {
          this._ignoredPaths[path] = true;
          if (stats && stats.isDirectory()) {
            this._ignoredPaths[path + '/**/*'] = true;
          }
          return true;
        } else {
          delete this._ignoredPaths[path];
          delete this._ignoredPaths[path + '/**/*'];
        }
      }.bind(this);
      var handleEvent = function(event) {
        if (checkIgnored())
          return ;
        if (event === 'unlink') {
          if (info.type === 'directory' || watchedDir.has(item)) {
            this._remove(parent, item);
          }
        } else {
          if (event === 'add') {
            if (info.type === 'directory')
              this._getWatchedDir(path);
            if (info.type === 'symlink' && this.options.followSymlinks) {
              var curDepth = this.options.depth === undefined ? undefined : depth(fullPath, realPath) + 1;
              return this._addToFsEvents(path, false, true, curDepth);
            } else {
              this._getWatchedDir(parent).add(item);
            }
          }
          var eventName = info.type === 'directory' ? event + 'Dir' : event;
          this._emit(eventName, path);
        }
      }.bind(this);
      function addOrChange() {
        handleEvent(watchedDir.has(item) ? 'change' : 'add');
      }
      function checkFd() {
        fs.open(path, 'r', function(error, fd) {
          if (fd)
            fs.close(fd);
          error && error.code !== 'EACCES' ? handleEvent('unlink') : addOrChange();
        });
      }
      var wrongEventFlags = [69888, 70400, 71424, 72704, 73472, 131328, 131840, 262912];
      if (wrongEventFlags.indexOf(flags) !== -1 || info.event === 'unknown') {
        if (typeof this.options.ignored === 'function') {
          fs.stat(path, function(error, stats) {
            if (checkIgnored(stats))
              return ;
            stats ? addOrChange() : handleEvent('unlink');
          });
        } else {
          checkFd();
        }
      } else {
        switch (info.event) {
          case 'created':
          case 'modified':
            return addOrChange();
          case 'deleted':
          case 'moved':
            return checkFd();
        }
      }
    }.bind(this);
    var closer = setFSEventsListener(watchPath, realPath, watchCallback, this.emit.bind(this, 'raw'));
    this._emitReady();
    return closer;
  };
  FsEventsHandler.prototype._fsEventsSymlink = function(linkPath, fullPath, transform, curDepth) {
    if (this._symlinkPaths[fullPath])
      return ;
    else
      this._symlinkPaths[fullPath] = true;
    this._readyCount++;
    fs.realpath(linkPath, function(error, linkTarget) {
      if (this._handleError(error) || this._isIgnored(linkTarget)) {
        return this._emitReady();
      }
      this._readyCount++;
      this._addToFsEvents(linkTarget || linkPath, function(path) {
        var dotSlash = '.' + sysPath.sep;
        var aliasedPath = linkPath;
        if (linkTarget && linkTarget !== dotSlash) {
          aliasedPath = path.replace(linkTarget, linkPath);
        } else if (path !== dotSlash) {
          aliasedPath = sysPath.join(linkPath, path);
        }
        return transform(aliasedPath);
      }, false, curDepth);
    }.bind(this));
  };
  FsEventsHandler.prototype._addToFsEvents = function(path, transform, forceAdd, priorDepth) {
    var processPath = typeof transform === 'function' ? transform : function(val) {
      return val;
    };
    var emitAdd = function(newPath, stats) {
      var pp = processPath(newPath);
      var isDir = stats.isDirectory();
      var dirObj = this._getWatchedDir(sysPath.dirname(pp));
      var base = sysPath.basename(pp);
      if (isDir)
        this._getWatchedDir(pp);
      if (dirObj.has(base))
        return ;
      dirObj.add(base);
      if (!this.options.ignoreInitial || forceAdd === true) {
        this._emit(isDir ? 'addDir' : 'add', pp, stats);
      }
    }.bind(this);
    var wh = this._getWatchHelpers(path);
    fs[wh.statMethod](wh.watchPath, function(error, stats) {
      if (this._handleError(error) || this._isIgnored(wh.watchPath, stats)) {
        this._emitReady();
        return this._emitReady();
      }
      if (stats.isDirectory()) {
        if (!wh.globFilter)
          emitAdd(processPath(path), stats);
        if (priorDepth && priorDepth > this.options.depth)
          return ;
        readdirp({
          root: wh.watchPath,
          entryType: 'all',
          fileFilter: wh.filterPath,
          directoryFilter: wh.filterDir,
          lstat: true,
          depth: this.options.depth - (priorDepth || 0)
        }).on('data', function(entry) {
          if (entry.stat.isDirectory() && !wh.filterPath(entry))
            return ;
          var joinedPath = sysPath.join(wh.watchPath, entry.path);
          var fullPath = entry.fullPath;
          if (wh.followSymlinks && entry.stat.isSymbolicLink()) {
            var curDepth = this.options.depth === undefined ? undefined : depth(joinedPath, sysPath.resolve(wh.watchPath)) + 1;
            this._fsEventsSymlink(joinedPath, fullPath, processPath, curDepth);
          } else {
            emitAdd(joinedPath, entry.stat);
          }
        }.bind(this)).on('end', this._emitReady);
      } else {
        emitAdd(wh.watchPath, stats);
        this._emitReady();
      }
    }.bind(this));
    if (this.options.persistent) {
      var initWatch = function(error, realPath) {
        var closer = this._watchWithFsEvents(wh.watchPath, sysPath.resolve(realPath || wh.watchPath), processPath, wh.globFilter);
        if (closer)
          this._closers[path] = closer;
      }.bind(this);
      if (typeof transform === 'function') {
        initWatch();
      } else {
        fs.realpath(wh.watchPath, initWatch);
      }
    }
  };
  module.exports = FsEventsHandler;
  module.exports.canUse = canUse;
})(require("process"));
