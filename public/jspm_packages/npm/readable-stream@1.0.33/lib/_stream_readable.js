/* */ 
(function(Buffer, process) {
  module.exports = Readable;
  var isArray = require("isarray");
  var Buffer = require("buffer").Buffer;
  Readable.ReadableState = ReadableState;
  var EE = require("events").EventEmitter;
  if (!EE.listenerCount)
    EE.listenerCount = function(emitter, type) {
      return emitter.listeners(type).length;
    };
  var Stream = require('stream-browserify/index');
  var util = require("core-util-is");
  util.inherits = require("inherits");
  var StringDecoder;
  util.inherits(Readable, Stream);
  function ReadableState(options, stream) {
    options = options || {};
    var hwm = options.highWaterMark;
    this.highWaterMark = (hwm || hwm === 0) ? hwm : 16 * 1024;
    this.highWaterMark = ~~this.highWaterMark;
    this.buffer = [];
    this.length = 0;
    this.pipes = null;
    this.pipesCount = 0;
    this.flowing = false;
    this.ended = false;
    this.endEmitted = false;
    this.reading = false;
    this.calledRead = false;
    this.sync = true;
    this.needReadable = false;
    this.emittedReadable = false;
    this.readableListening = false;
    this.objectMode = !!options.objectMode;
    this.defaultEncoding = options.defaultEncoding || 'utf8';
    this.ranOut = false;
    this.awaitDrain = 0;
    this.readingMore = false;
    this.decoder = null;
    this.encoding = null;
    if (options.encoding) {
      if (!StringDecoder)
        StringDecoder = require("string_decoder").StringDecoder;
      this.decoder = new StringDecoder(options.encoding);
      this.encoding = options.encoding;
    }
  }
  function Readable(options) {
    if (!(this instanceof Readable))
      return new Readable(options);
    this._readableState = new ReadableState(options, this);
    this.readable = true;
    Stream.call(this);
  }
  Readable.prototype.push = function(chunk, encoding) {
    var state = this._readableState;
    if (typeof chunk === 'string' && !state.objectMode) {
      encoding = encoding || state.defaultEncoding;
      if (encoding !== state.encoding) {
        chunk = new Buffer(chunk, encoding);
        encoding = '';
      }
    }
    return readableAddChunk(this, state, chunk, encoding, false);
  };
  Readable.prototype.unshift = function(chunk) {
    var state = this._readableState;
    return readableAddChunk(this, state, chunk, '', true);
  };
  function readableAddChunk(stream, state, chunk, encoding, addToFront) {
    var er = chunkInvalid(state, chunk);
    if (er) {
      stream.emit('error', er);
    } else if (chunk === null || chunk === undefined) {
      state.reading = false;
      if (!state.ended)
        onEofChunk(stream, state);
    } else if (state.objectMode || chunk && chunk.length > 0) {
      if (state.ended && !addToFront) {
        var e = new Error('stream.push() after EOF');
        stream.emit('error', e);
      } else if (state.endEmitted && addToFront) {
        var e = new Error('stream.unshift() after end event');
        stream.emit('error', e);
      } else {
        if (state.decoder && !addToFront && !encoding)
          chunk = state.decoder.write(chunk);
        state.length += state.objectMode ? 1 : chunk.length;
        if (addToFront) {
          state.buffer.unshift(chunk);
        } else {
          state.reading = false;
          state.buffer.push(chunk);
        }
        if (state.needReadable)
          emitReadable(stream);
        maybeReadMore(stream, state);
      }
    } else if (!addToFront) {
      state.reading = false;
    }
    return needMoreData(state);
  }
  function needMoreData(state) {
    return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
  }
  Readable.prototype.setEncoding = function(enc) {
    if (!StringDecoder)
      StringDecoder = require("string_decoder").StringDecoder;
    this._readableState.decoder = new StringDecoder(enc);
    this._readableState.encoding = enc;
  };
  var MAX_HWM = 0x800000;
  function roundUpToNextPowerOf2(n) {
    if (n >= MAX_HWM) {
      n = MAX_HWM;
    } else {
      n--;
      for (var p = 1; p < 32; p <<= 1)
        n |= n >> p;
      n++;
    }
    return n;
  }
  function howMuchToRead(n, state) {
    if (state.length === 0 && state.ended)
      return 0;
    if (state.objectMode)
      return n === 0 ? 0 : 1;
    if (n === null || isNaN(n)) {
      if (state.flowing && state.buffer.length)
        return state.buffer[0].length;
      else
        return state.length;
    }
    if (n <= 0)
      return 0;
    if (n > state.highWaterMark)
      state.highWaterMark = roundUpToNextPowerOf2(n);
    if (n > state.length) {
      if (!state.ended) {
        state.needReadable = true;
        return 0;
      } else
        return state.length;
    }
    return n;
  }
  Readable.prototype.read = function(n) {
    var state = this._readableState;
    state.calledRead = true;
    var nOrig = n;
    var ret;
    if (typeof n !== 'number' || n > 0)
      state.emittedReadable = false;
    if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
      emitReadable(this);
      return null;
    }
    n = howMuchToRead(n, state);
    if (n === 0 && state.ended) {
      ret = null;
      if (state.length > 0 && state.decoder) {
        ret = fromList(n, state);
        state.length -= ret.length;
      }
      if (state.length === 0)
        endReadable(this);
      return ret;
    }
    var doRead = state.needReadable;
    if (state.length - n <= state.highWaterMark)
      doRead = true;
    if (state.ended || state.reading)
      doRead = false;
    if (doRead) {
      state.reading = true;
      state.sync = true;
      if (state.length === 0)
        state.needReadable = true;
      this._read(state.highWaterMark);
      state.sync = false;
    }
    if (doRead && !state.reading)
      n = howMuchToRead(nOrig, state);
    if (n > 0)
      ret = fromList(n, state);
    else
      ret = null;
    if (ret === null) {
      state.needReadable = true;
      n = 0;
    }
    state.length -= n;
    if (state.length === 0 && !state.ended)
      state.needReadable = true;
    if (state.ended && !state.endEmitted && state.length === 0)
      endReadable(this);
    return ret;
  };
  function chunkInvalid(state, chunk) {
    var er = null;
    if (!Buffer.isBuffer(chunk) && 'string' !== typeof chunk && chunk !== null && chunk !== undefined && !state.objectMode) {
      er = new TypeError('Invalid non-string/buffer chunk');
    }
    return er;
  }
  function onEofChunk(stream, state) {
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) {
        state.buffer.push(chunk);
        state.length += state.objectMode ? 1 : chunk.length;
      }
    }
    state.ended = true;
    if (state.length > 0)
      emitReadable(stream);
    else
      endReadable(stream);
  }
  function emitReadable(stream) {
    var state = stream._readableState;
    state.needReadable = false;
    if (state.emittedReadable)
      return ;
    state.emittedReadable = true;
    if (state.sync)
      process.nextTick(function() {
        emitReadable_(stream);
      });
    else
      emitReadable_(stream);
  }
  function emitReadable_(stream) {
    stream.emit('readable');
  }
  function maybeReadMore(stream, state) {
    if (!state.readingMore) {
      state.readingMore = true;
      process.nextTick(function() {
        maybeReadMore_(stream, state);
      });
    }
  }
  function maybeReadMore_(stream, state) {
    var len = state.length;
    while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
      stream.read(0);
      if (len === state.length)
        break;
      else
        len = state.length;
    }
    state.readingMore = false;
  }
  Readable.prototype._read = function(n) {
    this.emit('error', new Error('not implemented'));
  };
  Readable.prototype.pipe = function(dest, pipeOpts) {
    var src = this;
    var state = this._readableState;
    switch (state.pipesCount) {
      case 0:
        state.pipes = dest;
        break;
      case 1:
        state.pipes = [state.pipes, dest];
        break;
      default:
        state.pipes.push(dest);
        break;
    }
    state.pipesCount += 1;
    var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
    var endFn = doEnd ? onend : cleanup;
    if (state.endEmitted)
      process.nextTick(endFn);
    else
      src.once('end', endFn);
    dest.on('unpipe', onunpipe);
    function onunpipe(readable) {
      if (readable !== src)
        return ;
      cleanup();
    }
    function onend() {
      dest.end();
    }
    var ondrain = pipeOnDrain(src);
    dest.on('drain', ondrain);
    function cleanup() {
      dest.removeListener('close', onclose);
      dest.removeListener('finish', onfinish);
      dest.removeListener('drain', ondrain);
      dest.removeListener('error', onerror);
      dest.removeListener('unpipe', onunpipe);
      src.removeListener('end', onend);
      src.removeListener('end', cleanup);
      if (!dest._writableState || dest._writableState.needDrain)
        ondrain();
    }
    function onerror(er) {
      unpipe();
      dest.removeListener('error', onerror);
      if (EE.listenerCount(dest, 'error') === 0)
        dest.emit('error', er);
    }
    if (!dest._events || !dest._events.error)
      dest.on('error', onerror);
    else if (isArray(dest._events.error))
      dest._events.error.unshift(onerror);
    else
      dest._events.error = [onerror, dest._events.error];
    function onclose() {
      dest.removeListener('finish', onfinish);
      unpipe();
    }
    dest.once('close', onclose);
    function onfinish() {
      dest.removeListener('close', onclose);
      unpipe();
    }
    dest.once('finish', onfinish);
    function unpipe() {
      src.unpipe(dest);
    }
    dest.emit('pipe', src);
    if (!state.flowing) {
      this.on('readable', pipeOnReadable);
      state.flowing = true;
      process.nextTick(function() {
        flow(src);
      });
    }
    return dest;
  };
  function pipeOnDrain(src) {
    return function() {
      var dest = this;
      var state = src._readableState;
      state.awaitDrain--;
      if (state.awaitDrain === 0)
        flow(src);
    };
  }
  function flow(src) {
    var state = src._readableState;
    var chunk;
    state.awaitDrain = 0;
    function write(dest, i, list) {
      var written = dest.write(chunk);
      if (false === written) {
        state.awaitDrain++;
      }
    }
    while (state.pipesCount && null !== (chunk = src.read())) {
      if (state.pipesCount === 1)
        write(state.pipes, 0, null);
      else
        forEach(state.pipes, write);
      src.emit('data', chunk);
      if (state.awaitDrain > 0)
        return ;
    }
    if (state.pipesCount === 0) {
      state.flowing = false;
      if (EE.listenerCount(src, 'data') > 0)
        emitDataEvents(src);
      return ;
    }
    state.ranOut = true;
  }
  function pipeOnReadable() {
    if (this._readableState.ranOut) {
      this._readableState.ranOut = false;
      flow(this);
    }
  }
  Readable.prototype.unpipe = function(dest) {
    var state = this._readableState;
    if (state.pipesCount === 0)
      return this;
    if (state.pipesCount === 1) {
      if (dest && dest !== state.pipes)
        return this;
      if (!dest)
        dest = state.pipes;
      state.pipes = null;
      state.pipesCount = 0;
      this.removeListener('readable', pipeOnReadable);
      state.flowing = false;
      if (dest)
        dest.emit('unpipe', this);
      return this;
    }
    if (!dest) {
      var dests = state.pipes;
      var len = state.pipesCount;
      state.pipes = null;
      state.pipesCount = 0;
      this.removeListener('readable', pipeOnReadable);
      state.flowing = false;
      for (var i = 0; i < len; i++)
        dests[i].emit('unpipe', this);
      return this;
    }
    var i = indexOf(state.pipes, dest);
    if (i === -1)
      return this;
    state.pipes.splice(i, 1);
    state.pipesCount -= 1;
    if (state.pipesCount === 1)
      state.pipes = state.pipes[0];
    dest.emit('unpipe', this);
    return this;
  };
  Readable.prototype.on = function(ev, fn) {
    var res = Stream.prototype.on.call(this, ev, fn);
    if (ev === 'data' && !this._readableState.flowing)
      emitDataEvents(this);
    if (ev === 'readable' && this.readable) {
      var state = this._readableState;
      if (!state.readableListening) {
        state.readableListening = true;
        state.emittedReadable = false;
        state.needReadable = true;
        if (!state.reading) {
          this.read(0);
        } else if (state.length) {
          emitReadable(this, state);
        }
      }
    }
    return res;
  };
  Readable.prototype.addListener = Readable.prototype.on;
  Readable.prototype.resume = function() {
    emitDataEvents(this);
    this.read(0);
    this.emit('resume');
  };
  Readable.prototype.pause = function() {
    emitDataEvents(this, true);
    this.emit('pause');
  };
  function emitDataEvents(stream, startPaused) {
    var state = stream._readableState;
    if (state.flowing) {
      throw new Error('Cannot switch to old mode now.');
    }
    var paused = startPaused || false;
    var readable = false;
    stream.readable = true;
    stream.pipe = Stream.prototype.pipe;
    stream.on = stream.addListener = Stream.prototype.on;
    stream.on('readable', function() {
      readable = true;
      var c;
      while (!paused && (null !== (c = stream.read())))
        stream.emit('data', c);
      if (c === null) {
        readable = false;
        stream._readableState.needReadable = true;
      }
    });
    stream.pause = function() {
      paused = true;
      this.emit('pause');
    };
    stream.resume = function() {
      paused = false;
      if (readable)
        process.nextTick(function() {
          stream.emit('readable');
        });
      else
        this.read(0);
      this.emit('resume');
    };
    stream.emit('readable');
  }
  Readable.prototype.wrap = function(stream) {
    var state = this._readableState;
    var paused = false;
    var self = this;
    stream.on('end', function() {
      if (state.decoder && !state.ended) {
        var chunk = state.decoder.end();
        if (chunk && chunk.length)
          self.push(chunk);
      }
      self.push(null);
    });
    stream.on('data', function(chunk) {
      if (state.decoder)
        chunk = state.decoder.write(chunk);
      if (state.objectMode && (chunk === null || chunk === undefined))
        return ;
      else if (!state.objectMode && (!chunk || !chunk.length))
        return ;
      var ret = self.push(chunk);
      if (!ret) {
        paused = true;
        stream.pause();
      }
    });
    for (var i in stream) {
      if (typeof stream[i] === 'function' && typeof this[i] === 'undefined') {
        this[i] = function(method) {
          return function() {
            return stream[method].apply(stream, arguments);
          };
        }(i);
      }
    }
    var events = ['error', 'close', 'destroy', 'pause', 'resume'];
    forEach(events, function(ev) {
      stream.on(ev, self.emit.bind(self, ev));
    });
    self._read = function(n) {
      if (paused) {
        paused = false;
        stream.resume();
      }
    };
    return self;
  };
  Readable._fromList = fromList;
  function fromList(n, state) {
    var list = state.buffer;
    var length = state.length;
    var stringMode = !!state.decoder;
    var objectMode = !!state.objectMode;
    var ret;
    if (list.length === 0)
      return null;
    if (length === 0)
      ret = null;
    else if (objectMode)
      ret = list.shift();
    else if (!n || n >= length) {
      if (stringMode)
        ret = list.join('');
      else
        ret = Buffer.concat(list, length);
      list.length = 0;
    } else {
      if (n < list[0].length) {
        var buf = list[0];
        ret = buf.slice(0, n);
        list[0] = buf.slice(n);
      } else if (n === list[0].length) {
        ret = list.shift();
      } else {
        if (stringMode)
          ret = '';
        else
          ret = new Buffer(n);
        var c = 0;
        for (var i = 0,
            l = list.length; i < l && c < n; i++) {
          var buf = list[0];
          var cpy = Math.min(n - c, buf.length);
          if (stringMode)
            ret += buf.slice(0, cpy);
          else
            buf.copy(ret, c, 0, cpy);
          if (cpy < buf.length)
            list[0] = buf.slice(cpy);
          else
            list.shift();
          c += cpy;
        }
      }
    }
    return ret;
  }
  function endReadable(stream) {
    var state = stream._readableState;
    if (state.length > 0)
      throw new Error('endReadable called on non-empty stream');
    if (!state.endEmitted && state.calledRead) {
      state.ended = true;
      process.nextTick(function() {
        if (!state.endEmitted && state.length === 0) {
          state.endEmitted = true;
          stream.readable = false;
          stream.emit('end');
        }
      });
    }
  }
  function forEach(xs, f) {
    for (var i = 0,
        l = xs.length; i < l; i++) {
      f(xs[i], i);
    }
  }
  function indexOf(xs, x) {
    for (var i = 0,
        l = xs.length; i < l; i++) {
      if (xs[i] === x)
        return i;
    }
    return -1;
  }
})(require("buffer").Buffer, require("process"));
