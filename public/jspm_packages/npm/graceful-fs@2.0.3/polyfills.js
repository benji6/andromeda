/* */ 
(function(process) {
  var fs = require("fs");
  var constants = require("constants");
  var origCwd = process.cwd;
  var cwd = null;
  process.cwd = function() {
    if (!cwd)
      cwd = origCwd.call(process);
    return cwd;
  };
  var chdir = process.chdir;
  process.chdir = function(d) {
    cwd = null;
    chdir.call(process, d);
  };
  if (constants.hasOwnProperty('O_SYMLINK') && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) {
    fs.lchmod = function(path, mode, callback) {
      callback = callback || noop;
      fs.open(path, constants.O_WRONLY | constants.O_SYMLINK, mode, function(err, fd) {
        if (err) {
          callback(err);
          return ;
        }
        fs.fchmod(fd, mode, function(err) {
          fs.close(fd, function(err2) {
            callback(err || err2);
          });
        });
      });
    };
    fs.lchmodSync = function(path, mode) {
      var fd = fs.openSync(path, constants.O_WRONLY | constants.O_SYMLINK, mode);
      var err,
          err2;
      try {
        var ret = fs.fchmodSync(fd, mode);
      } catch (er) {
        err = er;
      }
      try {
        fs.closeSync(fd);
      } catch (er) {
        err2 = er;
      }
      if (err || err2)
        throw (err || err2);
      return ret;
    };
  }
  if (!fs.lutimes) {
    if (constants.hasOwnProperty("O_SYMLINK")) {
      fs.lutimes = function(path, at, mt, cb) {
        fs.open(path, constants.O_SYMLINK, function(er, fd) {
          cb = cb || noop;
          if (er)
            return cb(er);
          fs.futimes(fd, at, mt, function(er) {
            fs.close(fd, function(er2) {
              return cb(er || er2);
            });
          });
        });
      };
      fs.lutimesSync = function(path, at, mt) {
        var fd = fs.openSync(path, constants.O_SYMLINK),
            err,
            err2,
            ret;
        try {
          var ret = fs.futimesSync(fd, at, mt);
        } catch (er) {
          err = er;
        }
        try {
          fs.closeSync(fd);
        } catch (er) {
          err2 = er;
        }
        if (err || err2)
          throw (err || err2);
        return ret;
      };
    } else if (fs.utimensat && constants.hasOwnProperty("AT_SYMLINK_NOFOLLOW")) {
      fs.lutimes = function(path, at, mt, cb) {
        fs.utimensat(path, at, mt, constants.AT_SYMLINK_NOFOLLOW, cb);
      };
      fs.lutimesSync = function(path, at, mt) {
        return fs.utimensatSync(path, at, mt, constants.AT_SYMLINK_NOFOLLOW);
      };
    } else {
      fs.lutimes = function(_a, _b, _c, cb) {
        process.nextTick(cb);
      };
      fs.lutimesSync = function() {};
    }
  }
  fs.chown = chownFix(fs.chown);
  fs.fchown = chownFix(fs.fchown);
  fs.lchown = chownFix(fs.lchown);
  fs.chownSync = chownFixSync(fs.chownSync);
  fs.fchownSync = chownFixSync(fs.fchownSync);
  fs.lchownSync = chownFixSync(fs.lchownSync);
  function chownFix(orig) {
    if (!orig)
      return orig;
    return function(target, uid, gid, cb) {
      return orig.call(fs, target, uid, gid, function(er, res) {
        if (chownErOk(er))
          er = null;
        cb(er, res);
      });
    };
  }
  function chownFixSync(orig) {
    if (!orig)
      return orig;
    return function(target, uid, gid) {
      try {
        return orig.call(fs, target, uid, gid);
      } catch (er) {
        if (!chownErOk(er))
          throw er;
      }
    };
  }
  function chownErOk(er) {
    if (!er || (!process.getuid || process.getuid() !== 0) && (er.code === "EINVAL" || er.code === "EPERM"))
      return true;
  }
  if (!fs.lchmod) {
    fs.lchmod = function(path, mode, cb) {
      process.nextTick(cb);
    };
    fs.lchmodSync = function() {};
  }
  if (!fs.lchown) {
    fs.lchown = function(path, uid, gid, cb) {
      process.nextTick(cb);
    };
    fs.lchownSync = function() {};
  }
  if (process.platform === "win32") {
    var rename_ = fs.rename;
    fs.rename = function rename(from, to, cb) {
      var start = Date.now();
      rename_(from, to, function CB(er) {
        if (er && (er.code === "EACCES" || er.code === "EPERM") && Date.now() - start < 1000) {
          return rename_(from, to, CB);
        }
        cb(er);
      });
    };
  }
  var read = fs.read;
  fs.read = function(fd, buffer, offset, length, position, callback_) {
    var callback;
    if (callback_ && typeof callback_ === 'function') {
      var eagCounter = 0;
      callback = function(er, _, __) {
        if (er && er.code === 'EAGAIN' && eagCounter < 10) {
          eagCounter++;
          return read.call(fs, fd, buffer, offset, length, position, callback);
        }
        callback_.apply(this, arguments);
      };
    }
    return read.call(fs, fd, buffer, offset, length, position, callback);
  };
  var readSync = fs.readSync;
  fs.readSync = function(fd, buffer, offset, length, position) {
    var eagCounter = 0;
    while (true) {
      try {
        return readSync.call(fs, fd, buffer, offset, length, position);
      } catch (er) {
        if (er.code === 'EAGAIN' && eagCounter < 10) {
          eagCounter++;
          continue;
        }
        throw er;
      }
    }
  };
})(require("process"));
