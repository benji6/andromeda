/* */ 
(function(Buffer, process) {
  module.exports = Writable;
  var Buffer = require("buffer").Buffer;
  Writable.WritableState = WritableState;
  var util = require("core-util-is");
  util.inherits = require("inherits");
  var Stream = require('stream-browserify/index');
  util.inherits(Writable, Stream);
  function WriteReq(chunk, encoding, cb) {
    this.chunk = chunk;
    this.encoding = encoding;
    this.callback = cb;
  }
  function WritableState(options, stream) {
    options = options || {};
    var hwm = options.highWaterMark;
    this.highWaterMark = (hwm || hwm === 0) ? hwm : 16 * 1024;
    this.objectMode = !!options.objectMode;
    this.highWaterMark = ~~this.highWaterMark;
    this.needDrain = false;
    this.ending = false;
    this.ended = false;
    this.finished = false;
    var noDecode = options.decodeStrings === false;
    this.decodeStrings = !noDecode;
    this.defaultEncoding = options.defaultEncoding || 'utf8';
    this.length = 0;
    this.writing = false;
    this.sync = true;
    this.bufferProcessing = false;
    this.onwrite = function(er) {
      onwrite(stream, er);
    };
    this.writecb = null;
    this.writelen = 0;
    this.buffer = [];
    this.errorEmitted = false;
  }
  function Writable(options) {
    var Duplex = require("./_stream_duplex");
    if (!(this instanceof Writable) && !(this instanceof Duplex))
      return new Writable(options);
    this._writableState = new WritableState(options, this);
    this.writable = true;
    Stream.call(this);
  }
  Writable.prototype.pipe = function() {
    this.emit('error', new Error('Cannot pipe. Not readable.'));
  };
  function writeAfterEnd(stream, state, cb) {
    var er = new Error('write after end');
    stream.emit('error', er);
    process.nextTick(function() {
      cb(er);
    });
  }
  function validChunk(stream, state, chunk, cb) {
    var valid = true;
    if (!Buffer.isBuffer(chunk) && 'string' !== typeof chunk && chunk !== null && chunk !== undefined && !state.objectMode) {
      var er = new TypeError('Invalid non-string/buffer chunk');
      stream.emit('error', er);
      process.nextTick(function() {
        cb(er);
      });
      valid = false;
    }
    return valid;
  }
  Writable.prototype.write = function(chunk, encoding, cb) {
    var state = this._writableState;
    var ret = false;
    if (typeof encoding === 'function') {
      cb = encoding;
      encoding = null;
    }
    if (Buffer.isBuffer(chunk))
      encoding = 'buffer';
    else if (!encoding)
      encoding = state.defaultEncoding;
    if (typeof cb !== 'function')
      cb = function() {};
    if (state.ended)
      writeAfterEnd(this, state, cb);
    else if (validChunk(this, state, chunk, cb))
      ret = writeOrBuffer(this, state, chunk, encoding, cb);
    return ret;
  };
  function decodeChunk(state, chunk, encoding) {
    if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
      chunk = new Buffer(chunk, encoding);
    }
    return chunk;
  }
  function writeOrBuffer(stream, state, chunk, encoding, cb) {
    chunk = decodeChunk(state, chunk, encoding);
    if (Buffer.isBuffer(chunk))
      encoding = 'buffer';
    var len = state.objectMode ? 1 : chunk.length;
    state.length += len;
    var ret = state.length < state.highWaterMark;
    if (!ret)
      state.needDrain = true;
    if (state.writing)
      state.buffer.push(new WriteReq(chunk, encoding, cb));
    else
      doWrite(stream, state, len, chunk, encoding, cb);
    return ret;
  }
  function doWrite(stream, state, len, chunk, encoding, cb) {
    state.writelen = len;
    state.writecb = cb;
    state.writing = true;
    state.sync = true;
    stream._write(chunk, encoding, state.onwrite);
    state.sync = false;
  }
  function onwriteError(stream, state, sync, er, cb) {
    if (sync)
      process.nextTick(function() {
        cb(er);
      });
    else
      cb(er);
    stream._writableState.errorEmitted = true;
    stream.emit('error', er);
  }
  function onwriteStateUpdate(state) {
    state.writing = false;
    state.writecb = null;
    state.length -= state.writelen;
    state.writelen = 0;
  }
  function onwrite(stream, er) {
    var state = stream._writableState;
    var sync = state.sync;
    var cb = state.writecb;
    onwriteStateUpdate(state);
    if (er)
      onwriteError(stream, state, sync, er, cb);
    else {
      var finished = needFinish(stream, state);
      if (!finished && !state.bufferProcessing && state.buffer.length)
        clearBuffer(stream, state);
      if (sync) {
        process.nextTick(function() {
          afterWrite(stream, state, finished, cb);
        });
      } else {
        afterWrite(stream, state, finished, cb);
      }
    }
  }
  function afterWrite(stream, state, finished, cb) {
    if (!finished)
      onwriteDrain(stream, state);
    cb();
    if (finished)
      finishMaybe(stream, state);
  }
  function onwriteDrain(stream, state) {
    if (state.length === 0 && state.needDrain) {
      state.needDrain = false;
      stream.emit('drain');
    }
  }
  function clearBuffer(stream, state) {
    state.bufferProcessing = true;
    for (var c = 0; c < state.buffer.length; c++) {
      var entry = state.buffer[c];
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;
      doWrite(stream, state, len, chunk, encoding, cb);
      if (state.writing) {
        c++;
        break;
      }
    }
    state.bufferProcessing = false;
    if (c < state.buffer.length)
      state.buffer = state.buffer.slice(c);
    else
      state.buffer.length = 0;
  }
  Writable.prototype._write = function(chunk, encoding, cb) {
    cb(new Error('not implemented'));
  };
  Writable.prototype.end = function(chunk, encoding, cb) {
    var state = this._writableState;
    if (typeof chunk === 'function') {
      cb = chunk;
      chunk = null;
      encoding = null;
    } else if (typeof encoding === 'function') {
      cb = encoding;
      encoding = null;
    }
    if (typeof chunk !== 'undefined' && chunk !== null)
      this.write(chunk, encoding);
    if (!state.ending && !state.finished)
      endWritable(this, state, cb);
  };
  function needFinish(stream, state) {
    return (state.ending && state.length === 0 && !state.finished && !state.writing);
  }
  function finishMaybe(stream, state) {
    var need = needFinish(stream, state);
    if (need) {
      state.finished = true;
      stream.emit('finish');
    }
    return need;
  }
  function endWritable(stream, state, cb) {
    state.ending = true;
    finishMaybe(stream, state);
    if (cb) {
      if (state.finished)
        process.nextTick(cb);
      else
        stream.once('finish', cb);
    }
    state.ended = true;
  }
})(require("buffer").Buffer, require("process"));
