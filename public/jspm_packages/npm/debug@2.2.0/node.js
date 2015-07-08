/* */ 
(function(process) {
  var tty = require("tty");
  var util = require("util");
  exports = module.exports = require("./debug");
  exports.log = log;
  exports.formatArgs = formatArgs;
  exports.save = save;
  exports.load = load;
  exports.useColors = useColors;
  exports.colors = [6, 2, 3, 4, 5, 1];
  var fd = parseInt(process.env.DEBUG_FD, 10) || 2;
  var stream = 1 === fd ? process.stdout : 2 === fd ? process.stderr : createWritableStdioStream(fd);
  function useColors() {
    var debugColors = (process.env.DEBUG_COLORS || '').trim().toLowerCase();
    if (0 === debugColors.length) {
      return tty.isatty(fd);
    } else {
      return '0' !== debugColors && 'no' !== debugColors && 'false' !== debugColors && 'disabled' !== debugColors;
    }
  }
  var inspect = (4 === util.inspect.length ? function(v, colors) {
    return util.inspect(v, void 0, void 0, colors);
  } : function(v, colors) {
    return util.inspect(v, {colors: colors});
  });
  exports.formatters.o = function(v) {
    return inspect(v, this.useColors).replace(/\s*\n\s*/g, ' ');
  };
  function formatArgs() {
    var args = arguments;
    var useColors = this.useColors;
    var name = this.namespace;
    if (useColors) {
      var c = this.color;
      args[0] = '  \u001b[3' + c + ';1m' + name + ' ' + '\u001b[0m' + args[0] + '\u001b[3' + c + 'm' + ' +' + exports.humanize(this.diff) + '\u001b[0m';
    } else {
      args[0] = new Date().toUTCString() + ' ' + name + ' ' + args[0];
    }
    return args;
  }
  function log() {
    return stream.write(util.format.apply(this, arguments) + '\n');
  }
  function save(namespaces) {
    if (null == namespaces) {
      delete process.env.DEBUG;
    } else {
      process.env.DEBUG = namespaces;
    }
  }
  function load() {
    return process.env.DEBUG;
  }
  function createWritableStdioStream(fd) {
    var stream;
    var tty_wrap = process.binding('tty_wrap');
    switch (tty_wrap.guessHandleType(fd)) {
      case 'TTY':
        stream = new tty.WriteStream(fd);
        stream._type = 'tty';
        if (stream._handle && stream._handle.unref) {
          stream._handle.unref();
        }
        break;
      case 'FILE':
        var fs = require("fs");
        stream = new fs.SyncWriteStream(fd, {autoClose: false});
        stream._type = 'fs';
        break;
      case 'PIPE':
      case 'TCP':
        var net = require("net");
        stream = new net.Socket({
          fd: fd,
          readable: false,
          writable: true
        });
        stream.readable = false;
        stream.read = null;
        stream._type = 'pipe';
        if (stream._handle && stream._handle.unref) {
          stream._handle.unref();
        }
        break;
      default:
        throw new Error('Implement me. Unknown stream file type!');
    }
    stream.fd = fd;
    stream._isStdio = true;
    return stream;
  }
  exports.enable(load());
})(require("process"));
