import { r as requireKeys, a as requireIsArray, b as require_getNative, c as requireEq, d as requireIsObject, e as require_isPrototype, f as require_arrayLikeKeys, h as requireIsArrayLike, i as require_root, j as require_getSymbols, k as require_overArg, l as require_arrayPush, m as requireStubArray, n as require_baseGetAllKeys, o as require_Uint8Array, p as require_Symbol, q as require_getTag, s as requireIsObjectLike, t as require_nodeUtil, u as require_baseUnary, v as require_Stack, w as require_getAllKeys, x as requireIsBuffer, y as isEqual$1, z as findStageAt, G as GLOBAL_ATTACK_SCENARIOS, T as TARGETED_ATTACKS, g as getSharedGameContext, A as envBool, B as getGameSummaryFilename, C as getGameSummary } from './index3-7e2fa931.js';
import { u as userControlsPlayerId, a as userIsAdmin, b as userControlsPlayer, g as getCharacter, i as isDefenseCharacter, c as isDefenderId, d as isAttackerId, e as getPlayerSide, f as isPlayerGameEvent, h as findUserIndex } from './user-fc27f200.js';
import { i as isDefenseItemId, a as isAttackItemId, b as isItemIdOfSide } from './items-4c987187.js';
import { X as XSTATE_STOP, c as createMachine, a as assign, G as GameState, s as sharedGuards, i as interpret } from './xstate.esm-82e04545.js';
import require$$0$3 from 'stream';
import require$$0$1 from 'zlib';
import require$$0$2 from 'buffer';
import require$$3 from 'net';
import require$$4 from 'tls';
import require$$5 from 'crypto';
import require$$0$4 from 'events';
import require$$1 from 'https';
import require$$2 from 'http';
import require$$0$5 from 'url';
import { g as getDefaultExportFromCjs } from './_commonjsHelpers-24198af3.js';
import require$$1$1 from 'util';
import require$$2$1 from 'fs';
import require$$4$1 from 'dns';
import require$$6 from 'os';
import require$$0$6 from 'path';
import require$$2$2 from 'punycode';
import require$$0$7 from 'child_process';
import { s as shortUuid } from './index-475ff67d.js';
import { a as addGame, g as getGame } from './global-09c6ed76.js';

var bufferUtil = {exports: {}};

var constants;
var hasRequiredConstants;

function requireConstants () {
	if (hasRequiredConstants) return constants;
	hasRequiredConstants = 1;

	constants = {
	  BINARY_TYPES: ['nodebuffer', 'arraybuffer', 'fragments'],
	  EMPTY_BUFFER: Buffer.alloc(0),
	  GUID: '258EAFA5-E914-47DA-95CA-C5AB0DC85B11',
	  kForOnEventAttribute: Symbol('kIsForOnEventAttribute'),
	  kListener: Symbol('kListener'),
	  kStatusCode: Symbol('status-code'),
	  kWebSocket: Symbol('websocket'),
	  NOOP: () => {}
	};
	return constants;
}

var hasRequiredBufferUtil;

function requireBufferUtil () {
	if (hasRequiredBufferUtil) return bufferUtil.exports;
	hasRequiredBufferUtil = 1;

	const { EMPTY_BUFFER } = requireConstants();

	const FastBuffer = Buffer[Symbol.species];

	/**
	 * Merges an array of buffers into a new buffer.
	 *
	 * @param {Buffer[]} list The array of buffers to concat
	 * @param {Number} totalLength The total length of buffers in the list
	 * @return {Buffer} The resulting buffer
	 * @public
	 */
	function concat(list, totalLength) {
	  if (list.length === 0) return EMPTY_BUFFER;
	  if (list.length === 1) return list[0];

	  const target = Buffer.allocUnsafe(totalLength);
	  let offset = 0;

	  for (let i = 0; i < list.length; i++) {
	    const buf = list[i];
	    target.set(buf, offset);
	    offset += buf.length;
	  }

	  if (offset < totalLength) {
	    return new FastBuffer(target.buffer, target.byteOffset, offset);
	  }

	  return target;
	}

	/**
	 * Masks a buffer using the given mask.
	 *
	 * @param {Buffer} source The buffer to mask
	 * @param {Buffer} mask The mask to use
	 * @param {Buffer} output The buffer where to store the result
	 * @param {Number} offset The offset at which to start writing
	 * @param {Number} length The number of bytes to mask.
	 * @public
	 */
	function _mask(source, mask, output, offset, length) {
	  for (let i = 0; i < length; i++) {
	    output[offset + i] = source[i] ^ mask[i & 3];
	  }
	}

	/**
	 * Unmasks a buffer using the given mask.
	 *
	 * @param {Buffer} buffer The buffer to unmask
	 * @param {Buffer} mask The mask to use
	 * @public
	 */
	function _unmask(buffer, mask) {
	  for (let i = 0; i < buffer.length; i++) {
	    buffer[i] ^= mask[i & 3];
	  }
	}

	/**
	 * Converts a buffer to an `ArrayBuffer`.
	 *
	 * @param {Buffer} buf The buffer to convert
	 * @return {ArrayBuffer} Converted buffer
	 * @public
	 */
	function toArrayBuffer(buf) {
	  if (buf.length === buf.buffer.byteLength) {
	    return buf.buffer;
	  }

	  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.length);
	}

	/**
	 * Converts `data` to a `Buffer`.
	 *
	 * @param {*} data The data to convert
	 * @return {Buffer} The buffer
	 * @throws {TypeError}
	 * @public
	 */
	function toBuffer(data) {
	  toBuffer.readOnly = true;

	  if (Buffer.isBuffer(data)) return data;

	  let buf;

	  if (data instanceof ArrayBuffer) {
	    buf = new FastBuffer(data);
	  } else if (ArrayBuffer.isView(data)) {
	    buf = new FastBuffer(data.buffer, data.byteOffset, data.byteLength);
	  } else {
	    buf = Buffer.from(data);
	    toBuffer.readOnly = false;
	  }

	  return buf;
	}

	bufferUtil.exports = {
	  concat,
	  mask: _mask,
	  toArrayBuffer,
	  toBuffer,
	  unmask: _unmask
	};

	/* istanbul ignore else  */
	if (!process.env.WS_NO_BUFFER_UTIL) {
	  try {
	    const bufferUtil$1 = require('bufferutil');

	    bufferUtil.exports.mask = function (source, mask, output, offset, length) {
	      if (length < 48) _mask(source, mask, output, offset, length);
	      else bufferUtil$1.mask(source, mask, output, offset, length);
	    };

	    bufferUtil.exports.unmask = function (buffer, mask) {
	      if (buffer.length < 32) _unmask(buffer, mask);
	      else bufferUtil$1.unmask(buffer, mask);
	    };
	  } catch (e) {
	    // Continue regardless of the error.
	  }
	}
	return bufferUtil.exports;
}

var limiter;
var hasRequiredLimiter;

function requireLimiter () {
	if (hasRequiredLimiter) return limiter;
	hasRequiredLimiter = 1;

	const kDone = Symbol('kDone');
	const kRun = Symbol('kRun');

	/**
	 * A very simple job queue with adjustable concurrency. Adapted from
	 * https://github.com/STRML/async-limiter
	 */
	class Limiter {
	  /**
	   * Creates a new `Limiter`.
	   *
	   * @param {Number} [concurrency=Infinity] The maximum number of jobs allowed
	   *     to run concurrently
	   */
	  constructor(concurrency) {
	    this[kDone] = () => {
	      this.pending--;
	      this[kRun]();
	    };
	    this.concurrency = concurrency || Infinity;
	    this.jobs = [];
	    this.pending = 0;
	  }

	  /**
	   * Adds a job to the queue.
	   *
	   * @param {Function} job The job to run
	   * @public
	   */
	  add(job) {
	    this.jobs.push(job);
	    this[kRun]();
	  }

	  /**
	   * Removes a job from the queue and runs it if possible.
	   *
	   * @private
	   */
	  [kRun]() {
	    if (this.pending === this.concurrency) return;

	    if (this.jobs.length) {
	      const job = this.jobs.shift();

	      this.pending++;
	      job(this[kDone]);
	    }
	  }
	}

	limiter = Limiter;
	return limiter;
}

var permessageDeflate;
var hasRequiredPermessageDeflate;

function requirePermessageDeflate () {
	if (hasRequiredPermessageDeflate) return permessageDeflate;
	hasRequiredPermessageDeflate = 1;

	const zlib = require$$0$1;

	const bufferUtil = requireBufferUtil();
	const Limiter = requireLimiter();
	const { kStatusCode } = requireConstants();

	const FastBuffer = Buffer[Symbol.species];
	const TRAILER = Buffer.from([0x00, 0x00, 0xff, 0xff]);
	const kPerMessageDeflate = Symbol('permessage-deflate');
	const kTotalLength = Symbol('total-length');
	const kCallback = Symbol('callback');
	const kBuffers = Symbol('buffers');
	const kError = Symbol('error');

	//
	// We limit zlib concurrency, which prevents severe memory fragmentation
	// as documented in https://github.com/nodejs/node/issues/8871#issuecomment-250915913
	// and https://github.com/websockets/ws/issues/1202
	//
	// Intentionally global; it's the global thread pool that's an issue.
	//
	let zlibLimiter;

	/**
	 * permessage-deflate implementation.
	 */
	class PerMessageDeflate {
	  /**
	   * Creates a PerMessageDeflate instance.
	   *
	   * @param {Object} [options] Configuration options
	   * @param {(Boolean|Number)} [options.clientMaxWindowBits] Advertise support
	   *     for, or request, a custom client window size
	   * @param {Boolean} [options.clientNoContextTakeover=false] Advertise/
	   *     acknowledge disabling of client context takeover
	   * @param {Number} [options.concurrencyLimit=10] The number of concurrent
	   *     calls to zlib
	   * @param {(Boolean|Number)} [options.serverMaxWindowBits] Request/confirm the
	   *     use of a custom server window size
	   * @param {Boolean} [options.serverNoContextTakeover=false] Request/accept
	   *     disabling of server context takeover
	   * @param {Number} [options.threshold=1024] Size (in bytes) below which
	   *     messages should not be compressed if context takeover is disabled
	   * @param {Object} [options.zlibDeflateOptions] Options to pass to zlib on
	   *     deflate
	   * @param {Object} [options.zlibInflateOptions] Options to pass to zlib on
	   *     inflate
	   * @param {Boolean} [isServer=false] Create the instance in either server or
	   *     client mode
	   * @param {Number} [maxPayload=0] The maximum allowed message length
	   */
	  constructor(options, isServer, maxPayload) {
	    this._maxPayload = maxPayload | 0;
	    this._options = options || {};
	    this._threshold =
	      this._options.threshold !== undefined ? this._options.threshold : 1024;
	    this._isServer = !!isServer;
	    this._deflate = null;
	    this._inflate = null;

	    this.params = null;

	    if (!zlibLimiter) {
	      const concurrency =
	        this._options.concurrencyLimit !== undefined
	          ? this._options.concurrencyLimit
	          : 10;
	      zlibLimiter = new Limiter(concurrency);
	    }
	  }

	  /**
	   * @type {String}
	   */
	  static get extensionName() {
	    return 'permessage-deflate';
	  }

	  /**
	   * Create an extension negotiation offer.
	   *
	   * @return {Object} Extension parameters
	   * @public
	   */
	  offer() {
	    const params = {};

	    if (this._options.serverNoContextTakeover) {
	      params.server_no_context_takeover = true;
	    }
	    if (this._options.clientNoContextTakeover) {
	      params.client_no_context_takeover = true;
	    }
	    if (this._options.serverMaxWindowBits) {
	      params.server_max_window_bits = this._options.serverMaxWindowBits;
	    }
	    if (this._options.clientMaxWindowBits) {
	      params.client_max_window_bits = this._options.clientMaxWindowBits;
	    } else if (this._options.clientMaxWindowBits == null) {
	      params.client_max_window_bits = true;
	    }

	    return params;
	  }

	  /**
	   * Accept an extension negotiation offer/response.
	   *
	   * @param {Array} configurations The extension negotiation offers/reponse
	   * @return {Object} Accepted configuration
	   * @public
	   */
	  accept(configurations) {
	    configurations = this.normalizeParams(configurations);

	    this.params = this._isServer
	      ? this.acceptAsServer(configurations)
	      : this.acceptAsClient(configurations);

	    return this.params;
	  }

	  /**
	   * Releases all resources used by the extension.
	   *
	   * @public
	   */
	  cleanup() {
	    if (this._inflate) {
	      this._inflate.close();
	      this._inflate = null;
	    }

	    if (this._deflate) {
	      const callback = this._deflate[kCallback];

	      this._deflate.close();
	      this._deflate = null;

	      if (callback) {
	        callback(
	          new Error(
	            'The deflate stream was closed while data was being processed'
	          )
	        );
	      }
	    }
	  }

	  /**
	   *  Accept an extension negotiation offer.
	   *
	   * @param {Array} offers The extension negotiation offers
	   * @return {Object} Accepted configuration
	   * @private
	   */
	  acceptAsServer(offers) {
	    const opts = this._options;
	    const accepted = offers.find((params) => {
	      if (
	        (opts.serverNoContextTakeover === false &&
	          params.server_no_context_takeover) ||
	        (params.server_max_window_bits &&
	          (opts.serverMaxWindowBits === false ||
	            (typeof opts.serverMaxWindowBits === 'number' &&
	              opts.serverMaxWindowBits > params.server_max_window_bits))) ||
	        (typeof opts.clientMaxWindowBits === 'number' &&
	          !params.client_max_window_bits)
	      ) {
	        return false;
	      }

	      return true;
	    });

	    if (!accepted) {
	      throw new Error('None of the extension offers can be accepted');
	    }

	    if (opts.serverNoContextTakeover) {
	      accepted.server_no_context_takeover = true;
	    }
	    if (opts.clientNoContextTakeover) {
	      accepted.client_no_context_takeover = true;
	    }
	    if (typeof opts.serverMaxWindowBits === 'number') {
	      accepted.server_max_window_bits = opts.serverMaxWindowBits;
	    }
	    if (typeof opts.clientMaxWindowBits === 'number') {
	      accepted.client_max_window_bits = opts.clientMaxWindowBits;
	    } else if (
	      accepted.client_max_window_bits === true ||
	      opts.clientMaxWindowBits === false
	    ) {
	      delete accepted.client_max_window_bits;
	    }

	    return accepted;
	  }

	  /**
	   * Accept the extension negotiation response.
	   *
	   * @param {Array} response The extension negotiation response
	   * @return {Object} Accepted configuration
	   * @private
	   */
	  acceptAsClient(response) {
	    const params = response[0];

	    if (
	      this._options.clientNoContextTakeover === false &&
	      params.client_no_context_takeover
	    ) {
	      throw new Error('Unexpected parameter "client_no_context_takeover"');
	    }

	    if (!params.client_max_window_bits) {
	      if (typeof this._options.clientMaxWindowBits === 'number') {
	        params.client_max_window_bits = this._options.clientMaxWindowBits;
	      }
	    } else if (
	      this._options.clientMaxWindowBits === false ||
	      (typeof this._options.clientMaxWindowBits === 'number' &&
	        params.client_max_window_bits > this._options.clientMaxWindowBits)
	    ) {
	      throw new Error(
	        'Unexpected or invalid parameter "client_max_window_bits"'
	      );
	    }

	    return params;
	  }

	  /**
	   * Normalize parameters.
	   *
	   * @param {Array} configurations The extension negotiation offers/reponse
	   * @return {Array} The offers/response with normalized parameters
	   * @private
	   */
	  normalizeParams(configurations) {
	    configurations.forEach((params) => {
	      Object.keys(params).forEach((key) => {
	        let value = params[key];

	        if (value.length > 1) {
	          throw new Error(`Parameter "${key}" must have only a single value`);
	        }

	        value = value[0];

	        if (key === 'client_max_window_bits') {
	          if (value !== true) {
	            const num = +value;
	            if (!Number.isInteger(num) || num < 8 || num > 15) {
	              throw new TypeError(
	                `Invalid value for parameter "${key}": ${value}`
	              );
	            }
	            value = num;
	          } else if (!this._isServer) {
	            throw new TypeError(
	              `Invalid value for parameter "${key}": ${value}`
	            );
	          }
	        } else if (key === 'server_max_window_bits') {
	          const num = +value;
	          if (!Number.isInteger(num) || num < 8 || num > 15) {
	            throw new TypeError(
	              `Invalid value for parameter "${key}": ${value}`
	            );
	          }
	          value = num;
	        } else if (
	          key === 'client_no_context_takeover' ||
	          key === 'server_no_context_takeover'
	        ) {
	          if (value !== true) {
	            throw new TypeError(
	              `Invalid value for parameter "${key}": ${value}`
	            );
	          }
	        } else {
	          throw new Error(`Unknown parameter "${key}"`);
	        }

	        params[key] = value;
	      });
	    });

	    return configurations;
	  }

	  /**
	   * Decompress data. Concurrency limited.
	   *
	   * @param {Buffer} data Compressed data
	   * @param {Boolean} fin Specifies whether or not this is the last fragment
	   * @param {Function} callback Callback
	   * @public
	   */
	  decompress(data, fin, callback) {
	    zlibLimiter.add((done) => {
	      this._decompress(data, fin, (err, result) => {
	        done();
	        callback(err, result);
	      });
	    });
	  }

	  /**
	   * Compress data. Concurrency limited.
	   *
	   * @param {(Buffer|String)} data Data to compress
	   * @param {Boolean} fin Specifies whether or not this is the last fragment
	   * @param {Function} callback Callback
	   * @public
	   */
	  compress(data, fin, callback) {
	    zlibLimiter.add((done) => {
	      this._compress(data, fin, (err, result) => {
	        done();
	        callback(err, result);
	      });
	    });
	  }

	  /**
	   * Decompress data.
	   *
	   * @param {Buffer} data Compressed data
	   * @param {Boolean} fin Specifies whether or not this is the last fragment
	   * @param {Function} callback Callback
	   * @private
	   */
	  _decompress(data, fin, callback) {
	    const endpoint = this._isServer ? 'client' : 'server';

	    if (!this._inflate) {
	      const key = `${endpoint}_max_window_bits`;
	      const windowBits =
	        typeof this.params[key] !== 'number'
	          ? zlib.Z_DEFAULT_WINDOWBITS
	          : this.params[key];

	      this._inflate = zlib.createInflateRaw({
	        ...this._options.zlibInflateOptions,
	        windowBits
	      });
	      this._inflate[kPerMessageDeflate] = this;
	      this._inflate[kTotalLength] = 0;
	      this._inflate[kBuffers] = [];
	      this._inflate.on('error', inflateOnError);
	      this._inflate.on('data', inflateOnData);
	    }

	    this._inflate[kCallback] = callback;

	    this._inflate.write(data);
	    if (fin) this._inflate.write(TRAILER);

	    this._inflate.flush(() => {
	      const err = this._inflate[kError];

	      if (err) {
	        this._inflate.close();
	        this._inflate = null;
	        callback(err);
	        return;
	      }

	      const data = bufferUtil.concat(
	        this._inflate[kBuffers],
	        this._inflate[kTotalLength]
	      );

	      if (this._inflate._readableState.endEmitted) {
	        this._inflate.close();
	        this._inflate = null;
	      } else {
	        this._inflate[kTotalLength] = 0;
	        this._inflate[kBuffers] = [];

	        if (fin && this.params[`${endpoint}_no_context_takeover`]) {
	          this._inflate.reset();
	        }
	      }

	      callback(null, data);
	    });
	  }

	  /**
	   * Compress data.
	   *
	   * @param {(Buffer|String)} data Data to compress
	   * @param {Boolean} fin Specifies whether or not this is the last fragment
	   * @param {Function} callback Callback
	   * @private
	   */
	  _compress(data, fin, callback) {
	    const endpoint = this._isServer ? 'server' : 'client';

	    if (!this._deflate) {
	      const key = `${endpoint}_max_window_bits`;
	      const windowBits =
	        typeof this.params[key] !== 'number'
	          ? zlib.Z_DEFAULT_WINDOWBITS
	          : this.params[key];

	      this._deflate = zlib.createDeflateRaw({
	        ...this._options.zlibDeflateOptions,
	        windowBits
	      });

	      this._deflate[kTotalLength] = 0;
	      this._deflate[kBuffers] = [];

	      this._deflate.on('data', deflateOnData);
	    }

	    this._deflate[kCallback] = callback;

	    this._deflate.write(data);
	    this._deflate.flush(zlib.Z_SYNC_FLUSH, () => {
	      if (!this._deflate) {
	        //
	        // The deflate stream was closed while data was being processed.
	        //
	        return;
	      }

	      let data = bufferUtil.concat(
	        this._deflate[kBuffers],
	        this._deflate[kTotalLength]
	      );

	      if (fin) {
	        data = new FastBuffer(data.buffer, data.byteOffset, data.length - 4);
	      }

	      //
	      // Ensure that the callback will not be called again in
	      // `PerMessageDeflate#cleanup()`.
	      //
	      this._deflate[kCallback] = null;

	      this._deflate[kTotalLength] = 0;
	      this._deflate[kBuffers] = [];

	      if (fin && this.params[`${endpoint}_no_context_takeover`]) {
	        this._deflate.reset();
	      }

	      callback(null, data);
	    });
	  }
	}

	permessageDeflate = PerMessageDeflate;

	/**
	 * The listener of the `zlib.DeflateRaw` stream `'data'` event.
	 *
	 * @param {Buffer} chunk A chunk of data
	 * @private
	 */
	function deflateOnData(chunk) {
	  this[kBuffers].push(chunk);
	  this[kTotalLength] += chunk.length;
	}

	/**
	 * The listener of the `zlib.InflateRaw` stream `'data'` event.
	 *
	 * @param {Buffer} chunk A chunk of data
	 * @private
	 */
	function inflateOnData(chunk) {
	  this[kTotalLength] += chunk.length;

	  if (
	    this[kPerMessageDeflate]._maxPayload < 1 ||
	    this[kTotalLength] <= this[kPerMessageDeflate]._maxPayload
	  ) {
	    this[kBuffers].push(chunk);
	    return;
	  }

	  this[kError] = new RangeError('Max payload size exceeded');
	  this[kError].code = 'WS_ERR_UNSUPPORTED_MESSAGE_LENGTH';
	  this[kError][kStatusCode] = 1009;
	  this.removeListener('data', inflateOnData);
	  this.reset();
	}

	/**
	 * The listener of the `zlib.InflateRaw` stream `'error'` event.
	 *
	 * @param {Error} err The emitted error
	 * @private
	 */
	function inflateOnError(err) {
	  //
	  // There is no need to call `Zlib#close()` as the handle is automatically
	  // closed when an error is emitted.
	  //
	  this[kPerMessageDeflate]._inflate = null;
	  err[kStatusCode] = 1007;
	  this[kCallback](err);
	}
	return permessageDeflate;
}

var validation = {exports: {}};

var hasRequiredValidation;

function requireValidation () {
	if (hasRequiredValidation) return validation.exports;
	hasRequiredValidation = 1;

	const { isUtf8 } = require$$0$2;

	//
	// Allowed token characters:
	//
	// '!', '#', '$', '%', '&', ''', '*', '+', '-',
	// '.', 0-9, A-Z, '^', '_', '`', a-z, '|', '~'
	//
	// tokenChars[32] === 0 // ' '
	// tokenChars[33] === 1 // '!'
	// tokenChars[34] === 0 // '"'
	// ...
	//
	// prettier-ignore
	const tokenChars = [
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 0 - 15
	  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, // 16 - 31
	  0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, // 32 - 47
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, // 48 - 63
	  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 64 - 79
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, // 80 - 95
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, // 96 - 111
	  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0 // 112 - 127
	];

	/**
	 * Checks if a status code is allowed in a close frame.
	 *
	 * @param {Number} code The status code
	 * @return {Boolean} `true` if the status code is valid, else `false`
	 * @public
	 */
	function isValidStatusCode(code) {
	  return (
	    (code >= 1000 &&
	      code <= 1014 &&
	      code !== 1004 &&
	      code !== 1005 &&
	      code !== 1006) ||
	    (code >= 3000 && code <= 4999)
	  );
	}

	/**
	 * Checks if a given buffer contains only correct UTF-8.
	 * Ported from https://www.cl.cam.ac.uk/%7Emgk25/ucs/utf8_check.c by
	 * Markus Kuhn.
	 *
	 * @param {Buffer} buf The buffer to check
	 * @return {Boolean} `true` if `buf` contains only correct UTF-8, else `false`
	 * @public
	 */
	function _isValidUTF8(buf) {
	  const len = buf.length;
	  let i = 0;

	  while (i < len) {
	    if ((buf[i] & 0x80) === 0) {
	      // 0xxxxxxx
	      i++;
	    } else if ((buf[i] & 0xe0) === 0xc0) {
	      // 110xxxxx 10xxxxxx
	      if (
	        i + 1 === len ||
	        (buf[i + 1] & 0xc0) !== 0x80 ||
	        (buf[i] & 0xfe) === 0xc0 // Overlong
	      ) {
	        return false;
	      }

	      i += 2;
	    } else if ((buf[i] & 0xf0) === 0xe0) {
	      // 1110xxxx 10xxxxxx 10xxxxxx
	      if (
	        i + 2 >= len ||
	        (buf[i + 1] & 0xc0) !== 0x80 ||
	        (buf[i + 2] & 0xc0) !== 0x80 ||
	        (buf[i] === 0xe0 && (buf[i + 1] & 0xe0) === 0x80) || // Overlong
	        (buf[i] === 0xed && (buf[i + 1] & 0xe0) === 0xa0) // Surrogate (U+D800 - U+DFFF)
	      ) {
	        return false;
	      }

	      i += 3;
	    } else if ((buf[i] & 0xf8) === 0xf0) {
	      // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
	      if (
	        i + 3 >= len ||
	        (buf[i + 1] & 0xc0) !== 0x80 ||
	        (buf[i + 2] & 0xc0) !== 0x80 ||
	        (buf[i + 3] & 0xc0) !== 0x80 ||
	        (buf[i] === 0xf0 && (buf[i + 1] & 0xf0) === 0x80) || // Overlong
	        (buf[i] === 0xf4 && buf[i + 1] > 0x8f) ||
	        buf[i] > 0xf4 // > U+10FFFF
	      ) {
	        return false;
	      }

	      i += 4;
	    } else {
	      return false;
	    }
	  }

	  return true;
	}

	validation.exports = {
	  isValidStatusCode,
	  isValidUTF8: _isValidUTF8,
	  tokenChars
	};

	if (isUtf8) {
	  validation.exports.isValidUTF8 = function (buf) {
	    return buf.length < 24 ? _isValidUTF8(buf) : isUtf8(buf);
	  };
	} /* istanbul ignore else  */ else if (!process.env.WS_NO_UTF_8_VALIDATE) {
	  try {
	    const isValidUTF8 = require('utf-8-validate');

	    validation.exports.isValidUTF8 = function (buf) {
	      return buf.length < 32 ? _isValidUTF8(buf) : isValidUTF8(buf);
	    };
	  } catch (e) {
	    // Continue regardless of the error.
	  }
	}
	return validation.exports;
}

var receiver;
var hasRequiredReceiver;

function requireReceiver () {
	if (hasRequiredReceiver) return receiver;
	hasRequiredReceiver = 1;

	const { Writable } = require$$0$3;

	const PerMessageDeflate = requirePermessageDeflate();
	const {
	  BINARY_TYPES,
	  EMPTY_BUFFER,
	  kStatusCode,
	  kWebSocket
	} = requireConstants();
	const { concat, toArrayBuffer, unmask } = requireBufferUtil();
	const { isValidStatusCode, isValidUTF8 } = requireValidation();

	const FastBuffer = Buffer[Symbol.species];
	const GET_INFO = 0;
	const GET_PAYLOAD_LENGTH_16 = 1;
	const GET_PAYLOAD_LENGTH_64 = 2;
	const GET_MASK = 3;
	const GET_DATA = 4;
	const INFLATING = 5;

	/**
	 * HyBi Receiver implementation.
	 *
	 * @extends Writable
	 */
	class Receiver extends Writable {
	  /**
	   * Creates a Receiver instance.
	   *
	   * @param {Object} [options] Options object
	   * @param {String} [options.binaryType=nodebuffer] The type for binary data
	   * @param {Object} [options.extensions] An object containing the negotiated
	   *     extensions
	   * @param {Boolean} [options.isServer=false] Specifies whether to operate in
	   *     client or server mode
	   * @param {Number} [options.maxPayload=0] The maximum allowed message length
	   * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
	   *     not to skip UTF-8 validation for text and close messages
	   */
	  constructor(options = {}) {
	    super();

	    this._binaryType = options.binaryType || BINARY_TYPES[0];
	    this._extensions = options.extensions || {};
	    this._isServer = !!options.isServer;
	    this._maxPayload = options.maxPayload | 0;
	    this._skipUTF8Validation = !!options.skipUTF8Validation;
	    this[kWebSocket] = undefined;

	    this._bufferedBytes = 0;
	    this._buffers = [];

	    this._compressed = false;
	    this._payloadLength = 0;
	    this._mask = undefined;
	    this._fragmented = 0;
	    this._masked = false;
	    this._fin = false;
	    this._opcode = 0;

	    this._totalPayloadLength = 0;
	    this._messageLength = 0;
	    this._fragments = [];

	    this._state = GET_INFO;
	    this._loop = false;
	  }

	  /**
	   * Implements `Writable.prototype._write()`.
	   *
	   * @param {Buffer} chunk The chunk of data to write
	   * @param {String} encoding The character encoding of `chunk`
	   * @param {Function} cb Callback
	   * @private
	   */
	  _write(chunk, encoding, cb) {
	    if (this._opcode === 0x08 && this._state == GET_INFO) return cb();

	    this._bufferedBytes += chunk.length;
	    this._buffers.push(chunk);
	    this.startLoop(cb);
	  }

	  /**
	   * Consumes `n` bytes from the buffered data.
	   *
	   * @param {Number} n The number of bytes to consume
	   * @return {Buffer} The consumed bytes
	   * @private
	   */
	  consume(n) {
	    this._bufferedBytes -= n;

	    if (n === this._buffers[0].length) return this._buffers.shift();

	    if (n < this._buffers[0].length) {
	      const buf = this._buffers[0];
	      this._buffers[0] = new FastBuffer(
	        buf.buffer,
	        buf.byteOffset + n,
	        buf.length - n
	      );

	      return new FastBuffer(buf.buffer, buf.byteOffset, n);
	    }

	    const dst = Buffer.allocUnsafe(n);

	    do {
	      const buf = this._buffers[0];
	      const offset = dst.length - n;

	      if (n >= buf.length) {
	        dst.set(this._buffers.shift(), offset);
	      } else {
	        dst.set(new Uint8Array(buf.buffer, buf.byteOffset, n), offset);
	        this._buffers[0] = new FastBuffer(
	          buf.buffer,
	          buf.byteOffset + n,
	          buf.length - n
	        );
	      }

	      n -= buf.length;
	    } while (n > 0);

	    return dst;
	  }

	  /**
	   * Starts the parsing loop.
	   *
	   * @param {Function} cb Callback
	   * @private
	   */
	  startLoop(cb) {
	    let err;
	    this._loop = true;

	    do {
	      switch (this._state) {
	        case GET_INFO:
	          err = this.getInfo();
	          break;
	        case GET_PAYLOAD_LENGTH_16:
	          err = this.getPayloadLength16();
	          break;
	        case GET_PAYLOAD_LENGTH_64:
	          err = this.getPayloadLength64();
	          break;
	        case GET_MASK:
	          this.getMask();
	          break;
	        case GET_DATA:
	          err = this.getData(cb);
	          break;
	        default:
	          // `INFLATING`
	          this._loop = false;
	          return;
	      }
	    } while (this._loop);

	    cb(err);
	  }

	  /**
	   * Reads the first two bytes of a frame.
	   *
	   * @return {(RangeError|undefined)} A possible error
	   * @private
	   */
	  getInfo() {
	    if (this._bufferedBytes < 2) {
	      this._loop = false;
	      return;
	    }

	    const buf = this.consume(2);

	    if ((buf[0] & 0x30) !== 0x00) {
	      this._loop = false;
	      return error(
	        RangeError,
	        'RSV2 and RSV3 must be clear',
	        true,
	        1002,
	        'WS_ERR_UNEXPECTED_RSV_2_3'
	      );
	    }

	    const compressed = (buf[0] & 0x40) === 0x40;

	    if (compressed && !this._extensions[PerMessageDeflate.extensionName]) {
	      this._loop = false;
	      return error(
	        RangeError,
	        'RSV1 must be clear',
	        true,
	        1002,
	        'WS_ERR_UNEXPECTED_RSV_1'
	      );
	    }

	    this._fin = (buf[0] & 0x80) === 0x80;
	    this._opcode = buf[0] & 0x0f;
	    this._payloadLength = buf[1] & 0x7f;

	    if (this._opcode === 0x00) {
	      if (compressed) {
	        this._loop = false;
	        return error(
	          RangeError,
	          'RSV1 must be clear',
	          true,
	          1002,
	          'WS_ERR_UNEXPECTED_RSV_1'
	        );
	      }

	      if (!this._fragmented) {
	        this._loop = false;
	        return error(
	          RangeError,
	          'invalid opcode 0',
	          true,
	          1002,
	          'WS_ERR_INVALID_OPCODE'
	        );
	      }

	      this._opcode = this._fragmented;
	    } else if (this._opcode === 0x01 || this._opcode === 0x02) {
	      if (this._fragmented) {
	        this._loop = false;
	        return error(
	          RangeError,
	          `invalid opcode ${this._opcode}`,
	          true,
	          1002,
	          'WS_ERR_INVALID_OPCODE'
	        );
	      }

	      this._compressed = compressed;
	    } else if (this._opcode > 0x07 && this._opcode < 0x0b) {
	      if (!this._fin) {
	        this._loop = false;
	        return error(
	          RangeError,
	          'FIN must be set',
	          true,
	          1002,
	          'WS_ERR_EXPECTED_FIN'
	        );
	      }

	      if (compressed) {
	        this._loop = false;
	        return error(
	          RangeError,
	          'RSV1 must be clear',
	          true,
	          1002,
	          'WS_ERR_UNEXPECTED_RSV_1'
	        );
	      }

	      if (
	        this._payloadLength > 0x7d ||
	        (this._opcode === 0x08 && this._payloadLength === 1)
	      ) {
	        this._loop = false;
	        return error(
	          RangeError,
	          `invalid payload length ${this._payloadLength}`,
	          true,
	          1002,
	          'WS_ERR_INVALID_CONTROL_PAYLOAD_LENGTH'
	        );
	      }
	    } else {
	      this._loop = false;
	      return error(
	        RangeError,
	        `invalid opcode ${this._opcode}`,
	        true,
	        1002,
	        'WS_ERR_INVALID_OPCODE'
	      );
	    }

	    if (!this._fin && !this._fragmented) this._fragmented = this._opcode;
	    this._masked = (buf[1] & 0x80) === 0x80;

	    if (this._isServer) {
	      if (!this._masked) {
	        this._loop = false;
	        return error(
	          RangeError,
	          'MASK must be set',
	          true,
	          1002,
	          'WS_ERR_EXPECTED_MASK'
	        );
	      }
	    } else if (this._masked) {
	      this._loop = false;
	      return error(
	        RangeError,
	        'MASK must be clear',
	        true,
	        1002,
	        'WS_ERR_UNEXPECTED_MASK'
	      );
	    }

	    if (this._payloadLength === 126) this._state = GET_PAYLOAD_LENGTH_16;
	    else if (this._payloadLength === 127) this._state = GET_PAYLOAD_LENGTH_64;
	    else return this.haveLength();
	  }

	  /**
	   * Gets extended payload length (7+16).
	   *
	   * @return {(RangeError|undefined)} A possible error
	   * @private
	   */
	  getPayloadLength16() {
	    if (this._bufferedBytes < 2) {
	      this._loop = false;
	      return;
	    }

	    this._payloadLength = this.consume(2).readUInt16BE(0);
	    return this.haveLength();
	  }

	  /**
	   * Gets extended payload length (7+64).
	   *
	   * @return {(RangeError|undefined)} A possible error
	   * @private
	   */
	  getPayloadLength64() {
	    if (this._bufferedBytes < 8) {
	      this._loop = false;
	      return;
	    }

	    const buf = this.consume(8);
	    const num = buf.readUInt32BE(0);

	    //
	    // The maximum safe integer in JavaScript is 2^53 - 1. An error is returned
	    // if payload length is greater than this number.
	    //
	    if (num > Math.pow(2, 53 - 32) - 1) {
	      this._loop = false;
	      return error(
	        RangeError,
	        'Unsupported WebSocket frame: payload length > 2^53 - 1',
	        false,
	        1009,
	        'WS_ERR_UNSUPPORTED_DATA_PAYLOAD_LENGTH'
	      );
	    }

	    this._payloadLength = num * Math.pow(2, 32) + buf.readUInt32BE(4);
	    return this.haveLength();
	  }

	  /**
	   * Payload length has been read.
	   *
	   * @return {(RangeError|undefined)} A possible error
	   * @private
	   */
	  haveLength() {
	    if (this._payloadLength && this._opcode < 0x08) {
	      this._totalPayloadLength += this._payloadLength;
	      if (this._totalPayloadLength > this._maxPayload && this._maxPayload > 0) {
	        this._loop = false;
	        return error(
	          RangeError,
	          'Max payload size exceeded',
	          false,
	          1009,
	          'WS_ERR_UNSUPPORTED_MESSAGE_LENGTH'
	        );
	      }
	    }

	    if (this._masked) this._state = GET_MASK;
	    else this._state = GET_DATA;
	  }

	  /**
	   * Reads mask bytes.
	   *
	   * @private
	   */
	  getMask() {
	    if (this._bufferedBytes < 4) {
	      this._loop = false;
	      return;
	    }

	    this._mask = this.consume(4);
	    this._state = GET_DATA;
	  }

	  /**
	   * Reads data bytes.
	   *
	   * @param {Function} cb Callback
	   * @return {(Error|RangeError|undefined)} A possible error
	   * @private
	   */
	  getData(cb) {
	    let data = EMPTY_BUFFER;

	    if (this._payloadLength) {
	      if (this._bufferedBytes < this._payloadLength) {
	        this._loop = false;
	        return;
	      }

	      data = this.consume(this._payloadLength);

	      if (
	        this._masked &&
	        (this._mask[0] | this._mask[1] | this._mask[2] | this._mask[3]) !== 0
	      ) {
	        unmask(data, this._mask);
	      }
	    }

	    if (this._opcode > 0x07) return this.controlMessage(data);

	    if (this._compressed) {
	      this._state = INFLATING;
	      this.decompress(data, cb);
	      return;
	    }

	    if (data.length) {
	      //
	      // This message is not compressed so its length is the sum of the payload
	      // length of all fragments.
	      //
	      this._messageLength = this._totalPayloadLength;
	      this._fragments.push(data);
	    }

	    return this.dataMessage();
	  }

	  /**
	   * Decompresses data.
	   *
	   * @param {Buffer} data Compressed data
	   * @param {Function} cb Callback
	   * @private
	   */
	  decompress(data, cb) {
	    const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];

	    perMessageDeflate.decompress(data, this._fin, (err, buf) => {
	      if (err) return cb(err);

	      if (buf.length) {
	        this._messageLength += buf.length;
	        if (this._messageLength > this._maxPayload && this._maxPayload > 0) {
	          return cb(
	            error(
	              RangeError,
	              'Max payload size exceeded',
	              false,
	              1009,
	              'WS_ERR_UNSUPPORTED_MESSAGE_LENGTH'
	            )
	          );
	        }

	        this._fragments.push(buf);
	      }

	      const er = this.dataMessage();
	      if (er) return cb(er);

	      this.startLoop(cb);
	    });
	  }

	  /**
	   * Handles a data message.
	   *
	   * @return {(Error|undefined)} A possible error
	   * @private
	   */
	  dataMessage() {
	    if (this._fin) {
	      const messageLength = this._messageLength;
	      const fragments = this._fragments;

	      this._totalPayloadLength = 0;
	      this._messageLength = 0;
	      this._fragmented = 0;
	      this._fragments = [];

	      if (this._opcode === 2) {
	        let data;

	        if (this._binaryType === 'nodebuffer') {
	          data = concat(fragments, messageLength);
	        } else if (this._binaryType === 'arraybuffer') {
	          data = toArrayBuffer(concat(fragments, messageLength));
	        } else {
	          data = fragments;
	        }

	        this.emit('message', data, true);
	      } else {
	        const buf = concat(fragments, messageLength);

	        if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
	          this._loop = false;
	          return error(
	            Error,
	            'invalid UTF-8 sequence',
	            true,
	            1007,
	            'WS_ERR_INVALID_UTF8'
	          );
	        }

	        this.emit('message', buf, false);
	      }
	    }

	    this._state = GET_INFO;
	  }

	  /**
	   * Handles a control message.
	   *
	   * @param {Buffer} data Data to handle
	   * @return {(Error|RangeError|undefined)} A possible error
	   * @private
	   */
	  controlMessage(data) {
	    if (this._opcode === 0x08) {
	      this._loop = false;

	      if (data.length === 0) {
	        this.emit('conclude', 1005, EMPTY_BUFFER);
	        this.end();
	      } else {
	        const code = data.readUInt16BE(0);

	        if (!isValidStatusCode(code)) {
	          return error(
	            RangeError,
	            `invalid status code ${code}`,
	            true,
	            1002,
	            'WS_ERR_INVALID_CLOSE_CODE'
	          );
	        }

	        const buf = new FastBuffer(
	          data.buffer,
	          data.byteOffset + 2,
	          data.length - 2
	        );

	        if (!this._skipUTF8Validation && !isValidUTF8(buf)) {
	          return error(
	            Error,
	            'invalid UTF-8 sequence',
	            true,
	            1007,
	            'WS_ERR_INVALID_UTF8'
	          );
	        }

	        this.emit('conclude', code, buf);
	        this.end();
	      }
	    } else if (this._opcode === 0x09) {
	      this.emit('ping', data);
	    } else {
	      this.emit('pong', data);
	    }

	    this._state = GET_INFO;
	  }
	}

	receiver = Receiver;

	/**
	 * Builds an error object.
	 *
	 * @param {function(new:Error|RangeError)} ErrorCtor The error constructor
	 * @param {String} message The error message
	 * @param {Boolean} prefix Specifies whether or not to add a default prefix to
	 *     `message`
	 * @param {Number} statusCode The status code
	 * @param {String} errorCode The exposed error code
	 * @return {(Error|RangeError)} The error
	 * @private
	 */
	function error(ErrorCtor, message, prefix, statusCode, errorCode) {
	  const err = new ErrorCtor(
	    prefix ? `Invalid WebSocket frame: ${message}` : message
	  );

	  Error.captureStackTrace(err, error);
	  err.code = errorCode;
	  err[kStatusCode] = statusCode;
	  return err;
	}
	return receiver;
}

requireReceiver();

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^net|tls$" }] */

var sender;
var hasRequiredSender;

function requireSender () {
	if (hasRequiredSender) return sender;
	hasRequiredSender = 1;
	const { randomFillSync } = require$$5;

	const PerMessageDeflate = requirePermessageDeflate();
	const { EMPTY_BUFFER } = requireConstants();
	const { isValidStatusCode } = requireValidation();
	const { mask: applyMask, toBuffer } = requireBufferUtil();

	const kByteLength = Symbol('kByteLength');
	const maskBuffer = Buffer.alloc(4);

	/**
	 * HyBi Sender implementation.
	 */
	class Sender {
	  /**
	   * Creates a Sender instance.
	   *
	   * @param {(net.Socket|tls.Socket)} socket The connection socket
	   * @param {Object} [extensions] An object containing the negotiated extensions
	   * @param {Function} [generateMask] The function used to generate the masking
	   *     key
	   */
	  constructor(socket, extensions, generateMask) {
	    this._extensions = extensions || {};

	    if (generateMask) {
	      this._generateMask = generateMask;
	      this._maskBuffer = Buffer.alloc(4);
	    }

	    this._socket = socket;

	    this._firstFragment = true;
	    this._compress = false;

	    this._bufferedBytes = 0;
	    this._deflating = false;
	    this._queue = [];
	  }

	  /**
	   * Frames a piece of data according to the HyBi WebSocket protocol.
	   *
	   * @param {(Buffer|String)} data The data to frame
	   * @param {Object} options Options object
	   * @param {Boolean} [options.fin=false] Specifies whether or not to set the
	   *     FIN bit
	   * @param {Function} [options.generateMask] The function used to generate the
	   *     masking key
	   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
	   *     `data`
	   * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
	   *     key
	   * @param {Number} options.opcode The opcode
	   * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
	   *     modified
	   * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
	   *     RSV1 bit
	   * @return {(Buffer|String)[]} The framed data
	   * @public
	   */
	  static frame(data, options) {
	    let mask;
	    let merge = false;
	    let offset = 2;
	    let skipMasking = false;

	    if (options.mask) {
	      mask = options.maskBuffer || maskBuffer;

	      if (options.generateMask) {
	        options.generateMask(mask);
	      } else {
	        randomFillSync(mask, 0, 4);
	      }

	      skipMasking = (mask[0] | mask[1] | mask[2] | mask[3]) === 0;
	      offset = 6;
	    }

	    let dataLength;

	    if (typeof data === 'string') {
	      if (
	        (!options.mask || skipMasking) &&
	        options[kByteLength] !== undefined
	      ) {
	        dataLength = options[kByteLength];
	      } else {
	        data = Buffer.from(data);
	        dataLength = data.length;
	      }
	    } else {
	      dataLength = data.length;
	      merge = options.mask && options.readOnly && !skipMasking;
	    }

	    let payloadLength = dataLength;

	    if (dataLength >= 65536) {
	      offset += 8;
	      payloadLength = 127;
	    } else if (dataLength > 125) {
	      offset += 2;
	      payloadLength = 126;
	    }

	    const target = Buffer.allocUnsafe(merge ? dataLength + offset : offset);

	    target[0] = options.fin ? options.opcode | 0x80 : options.opcode;
	    if (options.rsv1) target[0] |= 0x40;

	    target[1] = payloadLength;

	    if (payloadLength === 126) {
	      target.writeUInt16BE(dataLength, 2);
	    } else if (payloadLength === 127) {
	      target[2] = target[3] = 0;
	      target.writeUIntBE(dataLength, 4, 6);
	    }

	    if (!options.mask) return [target, data];

	    target[1] |= 0x80;
	    target[offset - 4] = mask[0];
	    target[offset - 3] = mask[1];
	    target[offset - 2] = mask[2];
	    target[offset - 1] = mask[3];

	    if (skipMasking) return [target, data];

	    if (merge) {
	      applyMask(data, mask, target, offset, dataLength);
	      return [target];
	    }

	    applyMask(data, mask, data, 0, dataLength);
	    return [target, data];
	  }

	  /**
	   * Sends a close message to the other peer.
	   *
	   * @param {Number} [code] The status code component of the body
	   * @param {(String|Buffer)} [data] The message component of the body
	   * @param {Boolean} [mask=false] Specifies whether or not to mask the message
	   * @param {Function} [cb] Callback
	   * @public
	   */
	  close(code, data, mask, cb) {
	    let buf;

	    if (code === undefined) {
	      buf = EMPTY_BUFFER;
	    } else if (typeof code !== 'number' || !isValidStatusCode(code)) {
	      throw new TypeError('First argument must be a valid error code number');
	    } else if (data === undefined || !data.length) {
	      buf = Buffer.allocUnsafe(2);
	      buf.writeUInt16BE(code, 0);
	    } else {
	      const length = Buffer.byteLength(data);

	      if (length > 123) {
	        throw new RangeError('The message must not be greater than 123 bytes');
	      }

	      buf = Buffer.allocUnsafe(2 + length);
	      buf.writeUInt16BE(code, 0);

	      if (typeof data === 'string') {
	        buf.write(data, 2);
	      } else {
	        buf.set(data, 2);
	      }
	    }

	    const options = {
	      [kByteLength]: buf.length,
	      fin: true,
	      generateMask: this._generateMask,
	      mask,
	      maskBuffer: this._maskBuffer,
	      opcode: 0x08,
	      readOnly: false,
	      rsv1: false
	    };

	    if (this._deflating) {
	      this.enqueue([this.dispatch, buf, false, options, cb]);
	    } else {
	      this.sendFrame(Sender.frame(buf, options), cb);
	    }
	  }

	  /**
	   * Sends a ping message to the other peer.
	   *
	   * @param {*} data The message to send
	   * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
	   * @param {Function} [cb] Callback
	   * @public
	   */
	  ping(data, mask, cb) {
	    let byteLength;
	    let readOnly;

	    if (typeof data === 'string') {
	      byteLength = Buffer.byteLength(data);
	      readOnly = false;
	    } else {
	      data = toBuffer(data);
	      byteLength = data.length;
	      readOnly = toBuffer.readOnly;
	    }

	    if (byteLength > 125) {
	      throw new RangeError('The data size must not be greater than 125 bytes');
	    }

	    const options = {
	      [kByteLength]: byteLength,
	      fin: true,
	      generateMask: this._generateMask,
	      mask,
	      maskBuffer: this._maskBuffer,
	      opcode: 0x09,
	      readOnly,
	      rsv1: false
	    };

	    if (this._deflating) {
	      this.enqueue([this.dispatch, data, false, options, cb]);
	    } else {
	      this.sendFrame(Sender.frame(data, options), cb);
	    }
	  }

	  /**
	   * Sends a pong message to the other peer.
	   *
	   * @param {*} data The message to send
	   * @param {Boolean} [mask=false] Specifies whether or not to mask `data`
	   * @param {Function} [cb] Callback
	   * @public
	   */
	  pong(data, mask, cb) {
	    let byteLength;
	    let readOnly;

	    if (typeof data === 'string') {
	      byteLength = Buffer.byteLength(data);
	      readOnly = false;
	    } else {
	      data = toBuffer(data);
	      byteLength = data.length;
	      readOnly = toBuffer.readOnly;
	    }

	    if (byteLength > 125) {
	      throw new RangeError('The data size must not be greater than 125 bytes');
	    }

	    const options = {
	      [kByteLength]: byteLength,
	      fin: true,
	      generateMask: this._generateMask,
	      mask,
	      maskBuffer: this._maskBuffer,
	      opcode: 0x0a,
	      readOnly,
	      rsv1: false
	    };

	    if (this._deflating) {
	      this.enqueue([this.dispatch, data, false, options, cb]);
	    } else {
	      this.sendFrame(Sender.frame(data, options), cb);
	    }
	  }

	  /**
	   * Sends a data message to the other peer.
	   *
	   * @param {*} data The message to send
	   * @param {Object} options Options object
	   * @param {Boolean} [options.binary=false] Specifies whether `data` is binary
	   *     or text
	   * @param {Boolean} [options.compress=false] Specifies whether or not to
	   *     compress `data`
	   * @param {Boolean} [options.fin=false] Specifies whether the fragment is the
	   *     last one
	   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
	   *     `data`
	   * @param {Function} [cb] Callback
	   * @public
	   */
	  send(data, options, cb) {
	    const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];
	    let opcode = options.binary ? 2 : 1;
	    let rsv1 = options.compress;

	    let byteLength;
	    let readOnly;

	    if (typeof data === 'string') {
	      byteLength = Buffer.byteLength(data);
	      readOnly = false;
	    } else {
	      data = toBuffer(data);
	      byteLength = data.length;
	      readOnly = toBuffer.readOnly;
	    }

	    if (this._firstFragment) {
	      this._firstFragment = false;
	      if (
	        rsv1 &&
	        perMessageDeflate &&
	        perMessageDeflate.params[
	          perMessageDeflate._isServer
	            ? 'server_no_context_takeover'
	            : 'client_no_context_takeover'
	        ]
	      ) {
	        rsv1 = byteLength >= perMessageDeflate._threshold;
	      }
	      this._compress = rsv1;
	    } else {
	      rsv1 = false;
	      opcode = 0;
	    }

	    if (options.fin) this._firstFragment = true;

	    if (perMessageDeflate) {
	      const opts = {
	        [kByteLength]: byteLength,
	        fin: options.fin,
	        generateMask: this._generateMask,
	        mask: options.mask,
	        maskBuffer: this._maskBuffer,
	        opcode,
	        readOnly,
	        rsv1
	      };

	      if (this._deflating) {
	        this.enqueue([this.dispatch, data, this._compress, opts, cb]);
	      } else {
	        this.dispatch(data, this._compress, opts, cb);
	      }
	    } else {
	      this.sendFrame(
	        Sender.frame(data, {
	          [kByteLength]: byteLength,
	          fin: options.fin,
	          generateMask: this._generateMask,
	          mask: options.mask,
	          maskBuffer: this._maskBuffer,
	          opcode,
	          readOnly,
	          rsv1: false
	        }),
	        cb
	      );
	    }
	  }

	  /**
	   * Dispatches a message.
	   *
	   * @param {(Buffer|String)} data The message to send
	   * @param {Boolean} [compress=false] Specifies whether or not to compress
	   *     `data`
	   * @param {Object} options Options object
	   * @param {Boolean} [options.fin=false] Specifies whether or not to set the
	   *     FIN bit
	   * @param {Function} [options.generateMask] The function used to generate the
	   *     masking key
	   * @param {Boolean} [options.mask=false] Specifies whether or not to mask
	   *     `data`
	   * @param {Buffer} [options.maskBuffer] The buffer used to store the masking
	   *     key
	   * @param {Number} options.opcode The opcode
	   * @param {Boolean} [options.readOnly=false] Specifies whether `data` can be
	   *     modified
	   * @param {Boolean} [options.rsv1=false] Specifies whether or not to set the
	   *     RSV1 bit
	   * @param {Function} [cb] Callback
	   * @private
	   */
	  dispatch(data, compress, options, cb) {
	    if (!compress) {
	      this.sendFrame(Sender.frame(data, options), cb);
	      return;
	    }

	    const perMessageDeflate = this._extensions[PerMessageDeflate.extensionName];

	    this._bufferedBytes += options[kByteLength];
	    this._deflating = true;
	    perMessageDeflate.compress(data, options.fin, (_, buf) => {
	      if (this._socket.destroyed) {
	        const err = new Error(
	          'The socket was closed while data was being compressed'
	        );

	        if (typeof cb === 'function') cb(err);

	        for (let i = 0; i < this._queue.length; i++) {
	          const params = this._queue[i];
	          const callback = params[params.length - 1];

	          if (typeof callback === 'function') callback(err);
	        }

	        return;
	      }

	      this._bufferedBytes -= options[kByteLength];
	      this._deflating = false;
	      options.readOnly = false;
	      this.sendFrame(Sender.frame(buf, options), cb);
	      this.dequeue();
	    });
	  }

	  /**
	   * Executes queued send operations.
	   *
	   * @private
	   */
	  dequeue() {
	    while (!this._deflating && this._queue.length) {
	      const params = this._queue.shift();

	      this._bufferedBytes -= params[3][kByteLength];
	      Reflect.apply(params[0], this, params.slice(1));
	    }
	  }

	  /**
	   * Enqueues a send operation.
	   *
	   * @param {Array} params Send operation parameters.
	   * @private
	   */
	  enqueue(params) {
	    this._bufferedBytes += params[3][kByteLength];
	    this._queue.push(params);
	  }

	  /**
	   * Sends a frame.
	   *
	   * @param {Buffer[]} list The frame to send
	   * @param {Function} [cb] Callback
	   * @private
	   */
	  sendFrame(list, cb) {
	    if (list.length === 2) {
	      this._socket.cork();
	      this._socket.write(list[0]);
	      this._socket.write(list[1], cb);
	      this._socket.uncork();
	    } else {
	      this._socket.write(list[0], cb);
	    }
	  }
	}

	sender = Sender;
	return sender;
}

requireSender();

var eventTarget;
var hasRequiredEventTarget;

function requireEventTarget () {
	if (hasRequiredEventTarget) return eventTarget;
	hasRequiredEventTarget = 1;

	const { kForOnEventAttribute, kListener } = requireConstants();

	const kCode = Symbol('kCode');
	const kData = Symbol('kData');
	const kError = Symbol('kError');
	const kMessage = Symbol('kMessage');
	const kReason = Symbol('kReason');
	const kTarget = Symbol('kTarget');
	const kType = Symbol('kType');
	const kWasClean = Symbol('kWasClean');

	/**
	 * Class representing an event.
	 */
	class Event {
	  /**
	   * Create a new `Event`.
	   *
	   * @param {String} type The name of the event
	   * @throws {TypeError} If the `type` argument is not specified
	   */
	  constructor(type) {
	    this[kTarget] = null;
	    this[kType] = type;
	  }

	  /**
	   * @type {*}
	   */
	  get target() {
	    return this[kTarget];
	  }

	  /**
	   * @type {String}
	   */
	  get type() {
	    return this[kType];
	  }
	}

	Object.defineProperty(Event.prototype, 'target', { enumerable: true });
	Object.defineProperty(Event.prototype, 'type', { enumerable: true });

	/**
	 * Class representing a close event.
	 *
	 * @extends Event
	 */
	class CloseEvent extends Event {
	  /**
	   * Create a new `CloseEvent`.
	   *
	   * @param {String} type The name of the event
	   * @param {Object} [options] A dictionary object that allows for setting
	   *     attributes via object members of the same name
	   * @param {Number} [options.code=0] The status code explaining why the
	   *     connection was closed
	   * @param {String} [options.reason=''] A human-readable string explaining why
	   *     the connection was closed
	   * @param {Boolean} [options.wasClean=false] Indicates whether or not the
	   *     connection was cleanly closed
	   */
	  constructor(type, options = {}) {
	    super(type);

	    this[kCode] = options.code === undefined ? 0 : options.code;
	    this[kReason] = options.reason === undefined ? '' : options.reason;
	    this[kWasClean] = options.wasClean === undefined ? false : options.wasClean;
	  }

	  /**
	   * @type {Number}
	   */
	  get code() {
	    return this[kCode];
	  }

	  /**
	   * @type {String}
	   */
	  get reason() {
	    return this[kReason];
	  }

	  /**
	   * @type {Boolean}
	   */
	  get wasClean() {
	    return this[kWasClean];
	  }
	}

	Object.defineProperty(CloseEvent.prototype, 'code', { enumerable: true });
	Object.defineProperty(CloseEvent.prototype, 'reason', { enumerable: true });
	Object.defineProperty(CloseEvent.prototype, 'wasClean', { enumerable: true });

	/**
	 * Class representing an error event.
	 *
	 * @extends Event
	 */
	class ErrorEvent extends Event {
	  /**
	   * Create a new `ErrorEvent`.
	   *
	   * @param {String} type The name of the event
	   * @param {Object} [options] A dictionary object that allows for setting
	   *     attributes via object members of the same name
	   * @param {*} [options.error=null] The error that generated this event
	   * @param {String} [options.message=''] The error message
	   */
	  constructor(type, options = {}) {
	    super(type);

	    this[kError] = options.error === undefined ? null : options.error;
	    this[kMessage] = options.message === undefined ? '' : options.message;
	  }

	  /**
	   * @type {*}
	   */
	  get error() {
	    return this[kError];
	  }

	  /**
	   * @type {String}
	   */
	  get message() {
	    return this[kMessage];
	  }
	}

	Object.defineProperty(ErrorEvent.prototype, 'error', { enumerable: true });
	Object.defineProperty(ErrorEvent.prototype, 'message', { enumerable: true });

	/**
	 * Class representing a message event.
	 *
	 * @extends Event
	 */
	class MessageEvent extends Event {
	  /**
	   * Create a new `MessageEvent`.
	   *
	   * @param {String} type The name of the event
	   * @param {Object} [options] A dictionary object that allows for setting
	   *     attributes via object members of the same name
	   * @param {*} [options.data=null] The message content
	   */
	  constructor(type, options = {}) {
	    super(type);

	    this[kData] = options.data === undefined ? null : options.data;
	  }

	  /**
	   * @type {*}
	   */
	  get data() {
	    return this[kData];
	  }
	}

	Object.defineProperty(MessageEvent.prototype, 'data', { enumerable: true });

	/**
	 * This provides methods for emulating the `EventTarget` interface. It's not
	 * meant to be used directly.
	 *
	 * @mixin
	 */
	const EventTarget = {
	  /**
	   * Register an event listener.
	   *
	   * @param {String} type A string representing the event type to listen for
	   * @param {(Function|Object)} handler The listener to add
	   * @param {Object} [options] An options object specifies characteristics about
	   *     the event listener
	   * @param {Boolean} [options.once=false] A `Boolean` indicating that the
	   *     listener should be invoked at most once after being added. If `true`,
	   *     the listener would be automatically removed when invoked.
	   * @public
	   */
	  addEventListener(type, handler, options = {}) {
	    for (const listener of this.listeners(type)) {
	      if (
	        !options[kForOnEventAttribute] &&
	        listener[kListener] === handler &&
	        !listener[kForOnEventAttribute]
	      ) {
	        return;
	      }
	    }

	    let wrapper;

	    if (type === 'message') {
	      wrapper = function onMessage(data, isBinary) {
	        const event = new MessageEvent('message', {
	          data: isBinary ? data : data.toString()
	        });

	        event[kTarget] = this;
	        callListener(handler, this, event);
	      };
	    } else if (type === 'close') {
	      wrapper = function onClose(code, message) {
	        const event = new CloseEvent('close', {
	          code,
	          reason: message.toString(),
	          wasClean: this._closeFrameReceived && this._closeFrameSent
	        });

	        event[kTarget] = this;
	        callListener(handler, this, event);
	      };
	    } else if (type === 'error') {
	      wrapper = function onError(error) {
	        const event = new ErrorEvent('error', {
	          error,
	          message: error.message
	        });

	        event[kTarget] = this;
	        callListener(handler, this, event);
	      };
	    } else if (type === 'open') {
	      wrapper = function onOpen() {
	        const event = new Event('open');

	        event[kTarget] = this;
	        callListener(handler, this, event);
	      };
	    } else {
	      return;
	    }

	    wrapper[kForOnEventAttribute] = !!options[kForOnEventAttribute];
	    wrapper[kListener] = handler;

	    if (options.once) {
	      this.once(type, wrapper);
	    } else {
	      this.on(type, wrapper);
	    }
	  },

	  /**
	   * Remove an event listener.
	   *
	   * @param {String} type A string representing the event type to remove
	   * @param {(Function|Object)} handler The listener to remove
	   * @public
	   */
	  removeEventListener(type, handler) {
	    for (const listener of this.listeners(type)) {
	      if (listener[kListener] === handler && !listener[kForOnEventAttribute]) {
	        this.removeListener(type, listener);
	        break;
	      }
	    }
	  }
	};

	eventTarget = {
	  CloseEvent,
	  ErrorEvent,
	  Event,
	  EventTarget,
	  MessageEvent
	};

	/**
	 * Call an event listener
	 *
	 * @param {(Function|Object)} listener The listener to call
	 * @param {*} thisArg The value to use as `this`` when calling the listener
	 * @param {Event} event The event to pass to the listener
	 * @private
	 */
	function callListener(listener, thisArg, event) {
	  if (typeof listener === 'object' && listener.handleEvent) {
	    listener.handleEvent.call(listener, event);
	  } else {
	    listener.call(thisArg, event);
	  }
	}
	return eventTarget;
}

var extension;
var hasRequiredExtension;

function requireExtension () {
	if (hasRequiredExtension) return extension;
	hasRequiredExtension = 1;

	const { tokenChars } = requireValidation();

	/**
	 * Adds an offer to the map of extension offers or a parameter to the map of
	 * parameters.
	 *
	 * @param {Object} dest The map of extension offers or parameters
	 * @param {String} name The extension or parameter name
	 * @param {(Object|Boolean|String)} elem The extension parameters or the
	 *     parameter value
	 * @private
	 */
	function push(dest, name, elem) {
	  if (dest[name] === undefined) dest[name] = [elem];
	  else dest[name].push(elem);
	}

	/**
	 * Parses the `Sec-WebSocket-Extensions` header into an object.
	 *
	 * @param {String} header The field value of the header
	 * @return {Object} The parsed object
	 * @public
	 */
	function parse(header) {
	  const offers = Object.create(null);
	  let params = Object.create(null);
	  let mustUnescape = false;
	  let isEscaping = false;
	  let inQuotes = false;
	  let extensionName;
	  let paramName;
	  let start = -1;
	  let code = -1;
	  let end = -1;
	  let i = 0;

	  for (; i < header.length; i++) {
	    code = header.charCodeAt(i);

	    if (extensionName === undefined) {
	      if (end === -1 && tokenChars[code] === 1) {
	        if (start === -1) start = i;
	      } else if (
	        i !== 0 &&
	        (code === 0x20 /* ' ' */ || code === 0x09) /* '\t' */
	      ) {
	        if (end === -1 && start !== -1) end = i;
	      } else if (code === 0x3b /* ';' */ || code === 0x2c /* ',' */) {
	        if (start === -1) {
	          throw new SyntaxError(`Unexpected character at index ${i}`);
	        }

	        if (end === -1) end = i;
	        const name = header.slice(start, end);
	        if (code === 0x2c) {
	          push(offers, name, params);
	          params = Object.create(null);
	        } else {
	          extensionName = name;
	        }

	        start = end = -1;
	      } else {
	        throw new SyntaxError(`Unexpected character at index ${i}`);
	      }
	    } else if (paramName === undefined) {
	      if (end === -1 && tokenChars[code] === 1) {
	        if (start === -1) start = i;
	      } else if (code === 0x20 || code === 0x09) {
	        if (end === -1 && start !== -1) end = i;
	      } else if (code === 0x3b || code === 0x2c) {
	        if (start === -1) {
	          throw new SyntaxError(`Unexpected character at index ${i}`);
	        }

	        if (end === -1) end = i;
	        push(params, header.slice(start, end), true);
	        if (code === 0x2c) {
	          push(offers, extensionName, params);
	          params = Object.create(null);
	          extensionName = undefined;
	        }

	        start = end = -1;
	      } else if (code === 0x3d /* '=' */ && start !== -1 && end === -1) {
	        paramName = header.slice(start, i);
	        start = end = -1;
	      } else {
	        throw new SyntaxError(`Unexpected character at index ${i}`);
	      }
	    } else {
	      //
	      // The value of a quoted-string after unescaping must conform to the
	      // token ABNF, so only token characters are valid.
	      // Ref: https://tools.ietf.org/html/rfc6455#section-9.1
	      //
	      if (isEscaping) {
	        if (tokenChars[code] !== 1) {
	          throw new SyntaxError(`Unexpected character at index ${i}`);
	        }
	        if (start === -1) start = i;
	        else if (!mustUnescape) mustUnescape = true;
	        isEscaping = false;
	      } else if (inQuotes) {
	        if (tokenChars[code] === 1) {
	          if (start === -1) start = i;
	        } else if (code === 0x22 /* '"' */ && start !== -1) {
	          inQuotes = false;
	          end = i;
	        } else if (code === 0x5c /* '\' */) {
	          isEscaping = true;
	        } else {
	          throw new SyntaxError(`Unexpected character at index ${i}`);
	        }
	      } else if (code === 0x22 && header.charCodeAt(i - 1) === 0x3d) {
	        inQuotes = true;
	      } else if (end === -1 && tokenChars[code] === 1) {
	        if (start === -1) start = i;
	      } else if (start !== -1 && (code === 0x20 || code === 0x09)) {
	        if (end === -1) end = i;
	      } else if (code === 0x3b || code === 0x2c) {
	        if (start === -1) {
	          throw new SyntaxError(`Unexpected character at index ${i}`);
	        }

	        if (end === -1) end = i;
	        let value = header.slice(start, end);
	        if (mustUnescape) {
	          value = value.replace(/\\/g, '');
	          mustUnescape = false;
	        }
	        push(params, paramName, value);
	        if (code === 0x2c) {
	          push(offers, extensionName, params);
	          params = Object.create(null);
	          extensionName = undefined;
	        }

	        paramName = undefined;
	        start = end = -1;
	      } else {
	        throw new SyntaxError(`Unexpected character at index ${i}`);
	      }
	    }
	  }

	  if (start === -1 || inQuotes || code === 0x20 || code === 0x09) {
	    throw new SyntaxError('Unexpected end of input');
	  }

	  if (end === -1) end = i;
	  const token = header.slice(start, end);
	  if (extensionName === undefined) {
	    push(offers, token, params);
	  } else {
	    if (paramName === undefined) {
	      push(params, token, true);
	    } else if (mustUnescape) {
	      push(params, paramName, token.replace(/\\/g, ''));
	    } else {
	      push(params, paramName, token);
	    }
	    push(offers, extensionName, params);
	  }

	  return offers;
	}

	/**
	 * Builds the `Sec-WebSocket-Extensions` header field value.
	 *
	 * @param {Object} extensions The map of extensions and parameters to format
	 * @return {String} A string representing the given object
	 * @public
	 */
	function format(extensions) {
	  return Object.keys(extensions)
	    .map((extension) => {
	      let configurations = extensions[extension];
	      if (!Array.isArray(configurations)) configurations = [configurations];
	      return configurations
	        .map((params) => {
	          return [extension]
	            .concat(
	              Object.keys(params).map((k) => {
	                let values = params[k];
	                if (!Array.isArray(values)) values = [values];
	                return values
	                  .map((v) => (v === true ? k : `${k}=${v}`))
	                  .join('; ');
	              })
	            )
	            .join('; ');
	        })
	        .join(', ');
	    })
	    .join(', ');
	}

	extension = { format, parse };
	return extension;
}

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^Readable$" }] */

var websocket;
var hasRequiredWebsocket;

function requireWebsocket () {
	if (hasRequiredWebsocket) return websocket;
	hasRequiredWebsocket = 1;

	const EventEmitter = require$$0$4;
	const https = require$$1;
	const http = require$$2;
	const net = require$$3;
	const tls = require$$4;
	const { randomBytes, createHash } = require$$5;
	const { URL } = require$$0$5;

	const PerMessageDeflate = requirePermessageDeflate();
	const Receiver = requireReceiver();
	const Sender = requireSender();
	const {
	  BINARY_TYPES,
	  EMPTY_BUFFER,
	  GUID,
	  kForOnEventAttribute,
	  kListener,
	  kStatusCode,
	  kWebSocket,
	  NOOP
	} = requireConstants();
	const {
	  EventTarget: { addEventListener, removeEventListener }
	} = requireEventTarget();
	const { format, parse } = requireExtension();
	const { toBuffer } = requireBufferUtil();

	const closeTimeout = 30 * 1000;
	const kAborted = Symbol('kAborted');
	const protocolVersions = [8, 13];
	const readyStates = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];
	const subprotocolRegex = /^[!#$%&'*+\-.0-9A-Z^_`|a-z~]+$/;

	/**
	 * Class representing a WebSocket.
	 *
	 * @extends EventEmitter
	 */
	class WebSocket extends EventEmitter {
	  /**
	   * Create a new `WebSocket`.
	   *
	   * @param {(String|URL)} address The URL to which to connect
	   * @param {(String|String[])} [protocols] The subprotocols
	   * @param {Object} [options] Connection options
	   */
	  constructor(address, protocols, options) {
	    super();

	    this._binaryType = BINARY_TYPES[0];
	    this._closeCode = 1006;
	    this._closeFrameReceived = false;
	    this._closeFrameSent = false;
	    this._closeMessage = EMPTY_BUFFER;
	    this._closeTimer = null;
	    this._extensions = {};
	    this._paused = false;
	    this._protocol = '';
	    this._readyState = WebSocket.CONNECTING;
	    this._receiver = null;
	    this._sender = null;
	    this._socket = null;

	    if (address !== null) {
	      this._bufferedAmount = 0;
	      this._isServer = false;
	      this._redirects = 0;

	      if (protocols === undefined) {
	        protocols = [];
	      } else if (!Array.isArray(protocols)) {
	        if (typeof protocols === 'object' && protocols !== null) {
	          options = protocols;
	          protocols = [];
	        } else {
	          protocols = [protocols];
	        }
	      }

	      initAsClient(this, address, protocols, options);
	    } else {
	      this._isServer = true;
	    }
	  }

	  /**
	   * This deviates from the WHATWG interface since ws doesn't support the
	   * required default "blob" type (instead we define a custom "nodebuffer"
	   * type).
	   *
	   * @type {String}
	   */
	  get binaryType() {
	    return this._binaryType;
	  }

	  set binaryType(type) {
	    if (!BINARY_TYPES.includes(type)) return;

	    this._binaryType = type;

	    //
	    // Allow to change `binaryType` on the fly.
	    //
	    if (this._receiver) this._receiver._binaryType = type;
	  }

	  /**
	   * @type {Number}
	   */
	  get bufferedAmount() {
	    if (!this._socket) return this._bufferedAmount;

	    return this._socket._writableState.length + this._sender._bufferedBytes;
	  }

	  /**
	   * @type {String}
	   */
	  get extensions() {
	    return Object.keys(this._extensions).join();
	  }

	  /**
	   * @type {Boolean}
	   */
	  get isPaused() {
	    return this._paused;
	  }

	  /**
	   * @type {Function}
	   */
	  /* istanbul ignore next */
	  get onclose() {
	    return null;
	  }

	  /**
	   * @type {Function}
	   */
	  /* istanbul ignore next */
	  get onerror() {
	    return null;
	  }

	  /**
	   * @type {Function}
	   */
	  /* istanbul ignore next */
	  get onopen() {
	    return null;
	  }

	  /**
	   * @type {Function}
	   */
	  /* istanbul ignore next */
	  get onmessage() {
	    return null;
	  }

	  /**
	   * @type {String}
	   */
	  get protocol() {
	    return this._protocol;
	  }

	  /**
	   * @type {Number}
	   */
	  get readyState() {
	    return this._readyState;
	  }

	  /**
	   * @type {String}
	   */
	  get url() {
	    return this._url;
	  }

	  /**
	   * Set up the socket and the internal resources.
	   *
	   * @param {(net.Socket|tls.Socket)} socket The network socket between the
	   *     server and client
	   * @param {Buffer} head The first packet of the upgraded stream
	   * @param {Object} options Options object
	   * @param {Function} [options.generateMask] The function used to generate the
	   *     masking key
	   * @param {Number} [options.maxPayload=0] The maximum allowed message size
	   * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
	   *     not to skip UTF-8 validation for text and close messages
	   * @private
	   */
	  setSocket(socket, head, options) {
	    const receiver = new Receiver({
	      binaryType: this.binaryType,
	      extensions: this._extensions,
	      isServer: this._isServer,
	      maxPayload: options.maxPayload,
	      skipUTF8Validation: options.skipUTF8Validation
	    });

	    this._sender = new Sender(socket, this._extensions, options.generateMask);
	    this._receiver = receiver;
	    this._socket = socket;

	    receiver[kWebSocket] = this;
	    socket[kWebSocket] = this;

	    receiver.on('conclude', receiverOnConclude);
	    receiver.on('drain', receiverOnDrain);
	    receiver.on('error', receiverOnError);
	    receiver.on('message', receiverOnMessage);
	    receiver.on('ping', receiverOnPing);
	    receiver.on('pong', receiverOnPong);

	    socket.setTimeout(0);
	    socket.setNoDelay();

	    if (head.length > 0) socket.unshift(head);

	    socket.on('close', socketOnClose);
	    socket.on('data', socketOnData);
	    socket.on('end', socketOnEnd);
	    socket.on('error', socketOnError);

	    this._readyState = WebSocket.OPEN;
	    this.emit('open');
	  }

	  /**
	   * Emit the `'close'` event.
	   *
	   * @private
	   */
	  emitClose() {
	    if (!this._socket) {
	      this._readyState = WebSocket.CLOSED;
	      this.emit('close', this._closeCode, this._closeMessage);
	      return;
	    }

	    if (this._extensions[PerMessageDeflate.extensionName]) {
	      this._extensions[PerMessageDeflate.extensionName].cleanup();
	    }

	    this._receiver.removeAllListeners();
	    this._readyState = WebSocket.CLOSED;
	    this.emit('close', this._closeCode, this._closeMessage);
	  }

	  /**
	   * Start a closing handshake.
	   *
	   *          +----------+   +-----------+   +----------+
	   *     - - -|ws.close()|-->|close frame|-->|ws.close()|- - -
	   *    |     +----------+   +-----------+   +----------+     |
	   *          +----------+   +-----------+         |
	   * CLOSING  |ws.close()|<--|close frame|<--+-----+       CLOSING
	   *          +----------+   +-----------+   |
	   *    |           |                        |   +---+        |
	   *                +------------------------+-->|fin| - - - -
	   *    |         +---+                      |   +---+
	   *     - - - - -|fin|<---------------------+
	   *              +---+
	   *
	   * @param {Number} [code] Status code explaining why the connection is closing
	   * @param {(String|Buffer)} [data] The reason why the connection is
	   *     closing
	   * @public
	   */
	  close(code, data) {
	    if (this.readyState === WebSocket.CLOSED) return;
	    if (this.readyState === WebSocket.CONNECTING) {
	      const msg = 'WebSocket was closed before the connection was established';
	      abortHandshake(this, this._req, msg);
	      return;
	    }

	    if (this.readyState === WebSocket.CLOSING) {
	      if (
	        this._closeFrameSent &&
	        (this._closeFrameReceived || this._receiver._writableState.errorEmitted)
	      ) {
	        this._socket.end();
	      }

	      return;
	    }

	    this._readyState = WebSocket.CLOSING;
	    this._sender.close(code, data, !this._isServer, (err) => {
	      //
	      // This error is handled by the `'error'` listener on the socket. We only
	      // want to know if the close frame has been sent here.
	      //
	      if (err) return;

	      this._closeFrameSent = true;

	      if (
	        this._closeFrameReceived ||
	        this._receiver._writableState.errorEmitted
	      ) {
	        this._socket.end();
	      }
	    });

	    //
	    // Specify a timeout for the closing handshake to complete.
	    //
	    this._closeTimer = setTimeout(
	      this._socket.destroy.bind(this._socket),
	      closeTimeout
	    );
	  }

	  /**
	   * Pause the socket.
	   *
	   * @public
	   */
	  pause() {
	    if (
	      this.readyState === WebSocket.CONNECTING ||
	      this.readyState === WebSocket.CLOSED
	    ) {
	      return;
	    }

	    this._paused = true;
	    this._socket.pause();
	  }

	  /**
	   * Send a ping.
	   *
	   * @param {*} [data] The data to send
	   * @param {Boolean} [mask] Indicates whether or not to mask `data`
	   * @param {Function} [cb] Callback which is executed when the ping is sent
	   * @public
	   */
	  ping(data, mask, cb) {
	    if (this.readyState === WebSocket.CONNECTING) {
	      throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
	    }

	    if (typeof data === 'function') {
	      cb = data;
	      data = mask = undefined;
	    } else if (typeof mask === 'function') {
	      cb = mask;
	      mask = undefined;
	    }

	    if (typeof data === 'number') data = data.toString();

	    if (this.readyState !== WebSocket.OPEN) {
	      sendAfterClose(this, data, cb);
	      return;
	    }

	    if (mask === undefined) mask = !this._isServer;
	    this._sender.ping(data || EMPTY_BUFFER, mask, cb);
	  }

	  /**
	   * Send a pong.
	   *
	   * @param {*} [data] The data to send
	   * @param {Boolean} [mask] Indicates whether or not to mask `data`
	   * @param {Function} [cb] Callback which is executed when the pong is sent
	   * @public
	   */
	  pong(data, mask, cb) {
	    if (this.readyState === WebSocket.CONNECTING) {
	      throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
	    }

	    if (typeof data === 'function') {
	      cb = data;
	      data = mask = undefined;
	    } else if (typeof mask === 'function') {
	      cb = mask;
	      mask = undefined;
	    }

	    if (typeof data === 'number') data = data.toString();

	    if (this.readyState !== WebSocket.OPEN) {
	      sendAfterClose(this, data, cb);
	      return;
	    }

	    if (mask === undefined) mask = !this._isServer;
	    this._sender.pong(data || EMPTY_BUFFER, mask, cb);
	  }

	  /**
	   * Resume the socket.
	   *
	   * @public
	   */
	  resume() {
	    if (
	      this.readyState === WebSocket.CONNECTING ||
	      this.readyState === WebSocket.CLOSED
	    ) {
	      return;
	    }

	    this._paused = false;
	    if (!this._receiver._writableState.needDrain) this._socket.resume();
	  }

	  /**
	   * Send a data message.
	   *
	   * @param {*} data The message to send
	   * @param {Object} [options] Options object
	   * @param {Boolean} [options.binary] Specifies whether `data` is binary or
	   *     text
	   * @param {Boolean} [options.compress] Specifies whether or not to compress
	   *     `data`
	   * @param {Boolean} [options.fin=true] Specifies whether the fragment is the
	   *     last one
	   * @param {Boolean} [options.mask] Specifies whether or not to mask `data`
	   * @param {Function} [cb] Callback which is executed when data is written out
	   * @public
	   */
	  send(data, options, cb) {
	    if (this.readyState === WebSocket.CONNECTING) {
	      throw new Error('WebSocket is not open: readyState 0 (CONNECTING)');
	    }

	    if (typeof options === 'function') {
	      cb = options;
	      options = {};
	    }

	    if (typeof data === 'number') data = data.toString();

	    if (this.readyState !== WebSocket.OPEN) {
	      sendAfterClose(this, data, cb);
	      return;
	    }

	    const opts = {
	      binary: typeof data !== 'string',
	      mask: !this._isServer,
	      compress: true,
	      fin: true,
	      ...options
	    };

	    if (!this._extensions[PerMessageDeflate.extensionName]) {
	      opts.compress = false;
	    }

	    this._sender.send(data || EMPTY_BUFFER, opts, cb);
	  }

	  /**
	   * Forcibly close the connection.
	   *
	   * @public
	   */
	  terminate() {
	    if (this.readyState === WebSocket.CLOSED) return;
	    if (this.readyState === WebSocket.CONNECTING) {
	      const msg = 'WebSocket was closed before the connection was established';
	      abortHandshake(this, this._req, msg);
	      return;
	    }

	    if (this._socket) {
	      this._readyState = WebSocket.CLOSING;
	      this._socket.destroy();
	    }
	  }
	}

	/**
	 * @constant {Number} CONNECTING
	 * @memberof WebSocket
	 */
	Object.defineProperty(WebSocket, 'CONNECTING', {
	  enumerable: true,
	  value: readyStates.indexOf('CONNECTING')
	});

	/**
	 * @constant {Number} CONNECTING
	 * @memberof WebSocket.prototype
	 */
	Object.defineProperty(WebSocket.prototype, 'CONNECTING', {
	  enumerable: true,
	  value: readyStates.indexOf('CONNECTING')
	});

	/**
	 * @constant {Number} OPEN
	 * @memberof WebSocket
	 */
	Object.defineProperty(WebSocket, 'OPEN', {
	  enumerable: true,
	  value: readyStates.indexOf('OPEN')
	});

	/**
	 * @constant {Number} OPEN
	 * @memberof WebSocket.prototype
	 */
	Object.defineProperty(WebSocket.prototype, 'OPEN', {
	  enumerable: true,
	  value: readyStates.indexOf('OPEN')
	});

	/**
	 * @constant {Number} CLOSING
	 * @memberof WebSocket
	 */
	Object.defineProperty(WebSocket, 'CLOSING', {
	  enumerable: true,
	  value: readyStates.indexOf('CLOSING')
	});

	/**
	 * @constant {Number} CLOSING
	 * @memberof WebSocket.prototype
	 */
	Object.defineProperty(WebSocket.prototype, 'CLOSING', {
	  enumerable: true,
	  value: readyStates.indexOf('CLOSING')
	});

	/**
	 * @constant {Number} CLOSED
	 * @memberof WebSocket
	 */
	Object.defineProperty(WebSocket, 'CLOSED', {
	  enumerable: true,
	  value: readyStates.indexOf('CLOSED')
	});

	/**
	 * @constant {Number} CLOSED
	 * @memberof WebSocket.prototype
	 */
	Object.defineProperty(WebSocket.prototype, 'CLOSED', {
	  enumerable: true,
	  value: readyStates.indexOf('CLOSED')
	});

	[
	  'binaryType',
	  'bufferedAmount',
	  'extensions',
	  'isPaused',
	  'protocol',
	  'readyState',
	  'url'
	].forEach((property) => {
	  Object.defineProperty(WebSocket.prototype, property, { enumerable: true });
	});

	//
	// Add the `onopen`, `onerror`, `onclose`, and `onmessage` attributes.
	// See https://html.spec.whatwg.org/multipage/comms.html#the-websocket-interface
	//
	['open', 'error', 'close', 'message'].forEach((method) => {
	  Object.defineProperty(WebSocket.prototype, `on${method}`, {
	    enumerable: true,
	    get() {
	      for (const listener of this.listeners(method)) {
	        if (listener[kForOnEventAttribute]) return listener[kListener];
	      }

	      return null;
	    },
	    set(handler) {
	      for (const listener of this.listeners(method)) {
	        if (listener[kForOnEventAttribute]) {
	          this.removeListener(method, listener);
	          break;
	        }
	      }

	      if (typeof handler !== 'function') return;

	      this.addEventListener(method, handler, {
	        [kForOnEventAttribute]: true
	      });
	    }
	  });
	});

	WebSocket.prototype.addEventListener = addEventListener;
	WebSocket.prototype.removeEventListener = removeEventListener;

	websocket = WebSocket;

	/**
	 * Initialize a WebSocket client.
	 *
	 * @param {WebSocket} websocket The client to initialize
	 * @param {(String|URL)} address The URL to which to connect
	 * @param {Array} protocols The subprotocols
	 * @param {Object} [options] Connection options
	 * @param {Boolean} [options.followRedirects=false] Whether or not to follow
	 *     redirects
	 * @param {Function} [options.generateMask] The function used to generate the
	 *     masking key
	 * @param {Number} [options.handshakeTimeout] Timeout in milliseconds for the
	 *     handshake request
	 * @param {Number} [options.maxPayload=104857600] The maximum allowed message
	 *     size
	 * @param {Number} [options.maxRedirects=10] The maximum number of redirects
	 *     allowed
	 * @param {String} [options.origin] Value of the `Origin` or
	 *     `Sec-WebSocket-Origin` header
	 * @param {(Boolean|Object)} [options.perMessageDeflate=true] Enable/disable
	 *     permessage-deflate
	 * @param {Number} [options.protocolVersion=13] Value of the
	 *     `Sec-WebSocket-Version` header
	 * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
	 *     not to skip UTF-8 validation for text and close messages
	 * @private
	 */
	function initAsClient(websocket, address, protocols, options) {
	  const opts = {
	    protocolVersion: protocolVersions[1],
	    maxPayload: 100 * 1024 * 1024,
	    skipUTF8Validation: false,
	    perMessageDeflate: true,
	    followRedirects: false,
	    maxRedirects: 10,
	    ...options,
	    createConnection: undefined,
	    socketPath: undefined,
	    hostname: undefined,
	    protocol: undefined,
	    timeout: undefined,
	    method: 'GET',
	    host: undefined,
	    path: undefined,
	    port: undefined
	  };

	  if (!protocolVersions.includes(opts.protocolVersion)) {
	    throw new RangeError(
	      `Unsupported protocol version: ${opts.protocolVersion} ` +
	        `(supported versions: ${protocolVersions.join(', ')})`
	    );
	  }

	  let parsedUrl;

	  if (address instanceof URL) {
	    parsedUrl = address;
	    websocket._url = address.href;
	  } else {
	    try {
	      parsedUrl = new URL(address);
	    } catch (e) {
	      throw new SyntaxError(`Invalid URL: ${address}`);
	    }

	    websocket._url = address;
	  }

	  const isSecure = parsedUrl.protocol === 'wss:';
	  const isIpcUrl = parsedUrl.protocol === 'ws+unix:';
	  let invalidUrlMessage;

	  if (parsedUrl.protocol !== 'ws:' && !isSecure && !isIpcUrl) {
	    invalidUrlMessage =
	      'The URL\'s protocol must be one of "ws:", "wss:", or "ws+unix:"';
	  } else if (isIpcUrl && !parsedUrl.pathname) {
	    invalidUrlMessage = "The URL's pathname is empty";
	  } else if (parsedUrl.hash) {
	    invalidUrlMessage = 'The URL contains a fragment identifier';
	  }

	  if (invalidUrlMessage) {
	    const err = new SyntaxError(invalidUrlMessage);

	    if (websocket._redirects === 0) {
	      throw err;
	    } else {
	      emitErrorAndClose(websocket, err);
	      return;
	    }
	  }

	  const defaultPort = isSecure ? 443 : 80;
	  const key = randomBytes(16).toString('base64');
	  const request = isSecure ? https.request : http.request;
	  const protocolSet = new Set();
	  let perMessageDeflate;

	  opts.createConnection = isSecure ? tlsConnect : netConnect;
	  opts.defaultPort = opts.defaultPort || defaultPort;
	  opts.port = parsedUrl.port || defaultPort;
	  opts.host = parsedUrl.hostname.startsWith('[')
	    ? parsedUrl.hostname.slice(1, -1)
	    : parsedUrl.hostname;
	  opts.headers = {
	    ...opts.headers,
	    'Sec-WebSocket-Version': opts.protocolVersion,
	    'Sec-WebSocket-Key': key,
	    Connection: 'Upgrade',
	    Upgrade: 'websocket'
	  };
	  opts.path = parsedUrl.pathname + parsedUrl.search;
	  opts.timeout = opts.handshakeTimeout;

	  if (opts.perMessageDeflate) {
	    perMessageDeflate = new PerMessageDeflate(
	      opts.perMessageDeflate !== true ? opts.perMessageDeflate : {},
	      false,
	      opts.maxPayload
	    );
	    opts.headers['Sec-WebSocket-Extensions'] = format({
	      [PerMessageDeflate.extensionName]: perMessageDeflate.offer()
	    });
	  }
	  if (protocols.length) {
	    for (const protocol of protocols) {
	      if (
	        typeof protocol !== 'string' ||
	        !subprotocolRegex.test(protocol) ||
	        protocolSet.has(protocol)
	      ) {
	        throw new SyntaxError(
	          'An invalid or duplicated subprotocol was specified'
	        );
	      }

	      protocolSet.add(protocol);
	    }

	    opts.headers['Sec-WebSocket-Protocol'] = protocols.join(',');
	  }
	  if (opts.origin) {
	    if (opts.protocolVersion < 13) {
	      opts.headers['Sec-WebSocket-Origin'] = opts.origin;
	    } else {
	      opts.headers.Origin = opts.origin;
	    }
	  }
	  if (parsedUrl.username || parsedUrl.password) {
	    opts.auth = `${parsedUrl.username}:${parsedUrl.password}`;
	  }

	  if (isIpcUrl) {
	    const parts = opts.path.split(':');

	    opts.socketPath = parts[0];
	    opts.path = parts[1];
	  }

	  let req;

	  if (opts.followRedirects) {
	    if (websocket._redirects === 0) {
	      websocket._originalIpc = isIpcUrl;
	      websocket._originalSecure = isSecure;
	      websocket._originalHostOrSocketPath = isIpcUrl
	        ? opts.socketPath
	        : parsedUrl.host;

	      const headers = options && options.headers;

	      //
	      // Shallow copy the user provided options so that headers can be changed
	      // without mutating the original object.
	      //
	      options = { ...options, headers: {} };

	      if (headers) {
	        for (const [key, value] of Object.entries(headers)) {
	          options.headers[key.toLowerCase()] = value;
	        }
	      }
	    } else if (websocket.listenerCount('redirect') === 0) {
	      const isSameHost = isIpcUrl
	        ? websocket._originalIpc
	          ? opts.socketPath === websocket._originalHostOrSocketPath
	          : false
	        : websocket._originalIpc
	        ? false
	        : parsedUrl.host === websocket._originalHostOrSocketPath;

	      if (!isSameHost || (websocket._originalSecure && !isSecure)) {
	        //
	        // Match curl 7.77.0 behavior and drop the following headers. These
	        // headers are also dropped when following a redirect to a subdomain.
	        //
	        delete opts.headers.authorization;
	        delete opts.headers.cookie;

	        if (!isSameHost) delete opts.headers.host;

	        opts.auth = undefined;
	      }
	    }

	    //
	    // Match curl 7.77.0 behavior and make the first `Authorization` header win.
	    // If the `Authorization` header is set, then there is nothing to do as it
	    // will take precedence.
	    //
	    if (opts.auth && !options.headers.authorization) {
	      options.headers.authorization =
	        'Basic ' + Buffer.from(opts.auth).toString('base64');
	    }

	    req = websocket._req = request(opts);

	    if (websocket._redirects) {
	      //
	      // Unlike what is done for the `'upgrade'` event, no early exit is
	      // triggered here if the user calls `websocket.close()` or
	      // `websocket.terminate()` from a listener of the `'redirect'` event. This
	      // is because the user can also call `request.destroy()` with an error
	      // before calling `websocket.close()` or `websocket.terminate()` and this
	      // would result in an error being emitted on the `request` object with no
	      // `'error'` event listeners attached.
	      //
	      websocket.emit('redirect', websocket.url, req);
	    }
	  } else {
	    req = websocket._req = request(opts);
	  }

	  if (opts.timeout) {
	    req.on('timeout', () => {
	      abortHandshake(websocket, req, 'Opening handshake has timed out');
	    });
	  }

	  req.on('error', (err) => {
	    if (req === null || req[kAborted]) return;

	    req = websocket._req = null;
	    emitErrorAndClose(websocket, err);
	  });

	  req.on('response', (res) => {
	    const location = res.headers.location;
	    const statusCode = res.statusCode;

	    if (
	      location &&
	      opts.followRedirects &&
	      statusCode >= 300 &&
	      statusCode < 400
	    ) {
	      if (++websocket._redirects > opts.maxRedirects) {
	        abortHandshake(websocket, req, 'Maximum redirects exceeded');
	        return;
	      }

	      req.abort();

	      let addr;

	      try {
	        addr = new URL(location, address);
	      } catch (e) {
	        const err = new SyntaxError(`Invalid URL: ${location}`);
	        emitErrorAndClose(websocket, err);
	        return;
	      }

	      initAsClient(websocket, addr, protocols, options);
	    } else if (!websocket.emit('unexpected-response', req, res)) {
	      abortHandshake(
	        websocket,
	        req,
	        `Unexpected server response: ${res.statusCode}`
	      );
	    }
	  });

	  req.on('upgrade', (res, socket, head) => {
	    websocket.emit('upgrade', res);

	    //
	    // The user may have closed the connection from a listener of the
	    // `'upgrade'` event.
	    //
	    if (websocket.readyState !== WebSocket.CONNECTING) return;

	    req = websocket._req = null;

	    if (res.headers.upgrade.toLowerCase() !== 'websocket') {
	      abortHandshake(websocket, socket, 'Invalid Upgrade header');
	      return;
	    }

	    const digest = createHash('sha1')
	      .update(key + GUID)
	      .digest('base64');

	    if (res.headers['sec-websocket-accept'] !== digest) {
	      abortHandshake(websocket, socket, 'Invalid Sec-WebSocket-Accept header');
	      return;
	    }

	    const serverProt = res.headers['sec-websocket-protocol'];
	    let protError;

	    if (serverProt !== undefined) {
	      if (!protocolSet.size) {
	        protError = 'Server sent a subprotocol but none was requested';
	      } else if (!protocolSet.has(serverProt)) {
	        protError = 'Server sent an invalid subprotocol';
	      }
	    } else if (protocolSet.size) {
	      protError = 'Server sent no subprotocol';
	    }

	    if (protError) {
	      abortHandshake(websocket, socket, protError);
	      return;
	    }

	    if (serverProt) websocket._protocol = serverProt;

	    const secWebSocketExtensions = res.headers['sec-websocket-extensions'];

	    if (secWebSocketExtensions !== undefined) {
	      if (!perMessageDeflate) {
	        const message =
	          'Server sent a Sec-WebSocket-Extensions header but no extension ' +
	          'was requested';
	        abortHandshake(websocket, socket, message);
	        return;
	      }

	      let extensions;

	      try {
	        extensions = parse(secWebSocketExtensions);
	      } catch (err) {
	        const message = 'Invalid Sec-WebSocket-Extensions header';
	        abortHandshake(websocket, socket, message);
	        return;
	      }

	      const extensionNames = Object.keys(extensions);

	      if (
	        extensionNames.length !== 1 ||
	        extensionNames[0] !== PerMessageDeflate.extensionName
	      ) {
	        const message = 'Server indicated an extension that was not requested';
	        abortHandshake(websocket, socket, message);
	        return;
	      }

	      try {
	        perMessageDeflate.accept(extensions[PerMessageDeflate.extensionName]);
	      } catch (err) {
	        const message = 'Invalid Sec-WebSocket-Extensions header';
	        abortHandshake(websocket, socket, message);
	        return;
	      }

	      websocket._extensions[PerMessageDeflate.extensionName] =
	        perMessageDeflate;
	    }

	    websocket.setSocket(socket, head, {
	      generateMask: opts.generateMask,
	      maxPayload: opts.maxPayload,
	      skipUTF8Validation: opts.skipUTF8Validation
	    });
	  });

	  if (opts.finishRequest) {
	    opts.finishRequest(req, websocket);
	  } else {
	    req.end();
	  }
	}

	/**
	 * Emit the `'error'` and `'close'` events.
	 *
	 * @param {WebSocket} websocket The WebSocket instance
	 * @param {Error} The error to emit
	 * @private
	 */
	function emitErrorAndClose(websocket, err) {
	  websocket._readyState = WebSocket.CLOSING;
	  websocket.emit('error', err);
	  websocket.emitClose();
	}

	/**
	 * Create a `net.Socket` and initiate a connection.
	 *
	 * @param {Object} options Connection options
	 * @return {net.Socket} The newly created socket used to start the connection
	 * @private
	 */
	function netConnect(options) {
	  options.path = options.socketPath;
	  return net.connect(options);
	}

	/**
	 * Create a `tls.TLSSocket` and initiate a connection.
	 *
	 * @param {Object} options Connection options
	 * @return {tls.TLSSocket} The newly created socket used to start the connection
	 * @private
	 */
	function tlsConnect(options) {
	  options.path = undefined;

	  if (!options.servername && options.servername !== '') {
	    options.servername = net.isIP(options.host) ? '' : options.host;
	  }

	  return tls.connect(options);
	}

	/**
	 * Abort the handshake and emit an error.
	 *
	 * @param {WebSocket} websocket The WebSocket instance
	 * @param {(http.ClientRequest|net.Socket|tls.Socket)} stream The request to
	 *     abort or the socket to destroy
	 * @param {String} message The error message
	 * @private
	 */
	function abortHandshake(websocket, stream, message) {
	  websocket._readyState = WebSocket.CLOSING;

	  const err = new Error(message);
	  Error.captureStackTrace(err, abortHandshake);

	  if (stream.setHeader) {
	    stream[kAborted] = true;
	    stream.abort();

	    if (stream.socket && !stream.socket.destroyed) {
	      //
	      // On Node.js >= 14.3.0 `request.abort()` does not destroy the socket if
	      // called after the request completed. See
	      // https://github.com/websockets/ws/issues/1869.
	      //
	      stream.socket.destroy();
	    }

	    process.nextTick(emitErrorAndClose, websocket, err);
	  } else {
	    stream.destroy(err);
	    stream.once('error', websocket.emit.bind(websocket, 'error'));
	    stream.once('close', websocket.emitClose.bind(websocket));
	  }
	}

	/**
	 * Handle cases where the `ping()`, `pong()`, or `send()` methods are called
	 * when the `readyState` attribute is `CLOSING` or `CLOSED`.
	 *
	 * @param {WebSocket} websocket The WebSocket instance
	 * @param {*} [data] The data to send
	 * @param {Function} [cb] Callback
	 * @private
	 */
	function sendAfterClose(websocket, data, cb) {
	  if (data) {
	    const length = toBuffer(data).length;

	    //
	    // The `_bufferedAmount` property is used only when the peer is a client and
	    // the opening handshake fails. Under these circumstances, in fact, the
	    // `setSocket()` method is not called, so the `_socket` and `_sender`
	    // properties are set to `null`.
	    //
	    if (websocket._socket) websocket._sender._bufferedBytes += length;
	    else websocket._bufferedAmount += length;
	  }

	  if (cb) {
	    const err = new Error(
	      `WebSocket is not open: readyState ${websocket.readyState} ` +
	        `(${readyStates[websocket.readyState]})`
	    );
	    process.nextTick(cb, err);
	  }
	}

	/**
	 * The listener of the `Receiver` `'conclude'` event.
	 *
	 * @param {Number} code The status code
	 * @param {Buffer} reason The reason for closing
	 * @private
	 */
	function receiverOnConclude(code, reason) {
	  const websocket = this[kWebSocket];

	  websocket._closeFrameReceived = true;
	  websocket._closeMessage = reason;
	  websocket._closeCode = code;

	  if (websocket._socket[kWebSocket] === undefined) return;

	  websocket._socket.removeListener('data', socketOnData);
	  process.nextTick(resume, websocket._socket);

	  if (code === 1005) websocket.close();
	  else websocket.close(code, reason);
	}

	/**
	 * The listener of the `Receiver` `'drain'` event.
	 *
	 * @private
	 */
	function receiverOnDrain() {
	  const websocket = this[kWebSocket];

	  if (!websocket.isPaused) websocket._socket.resume();
	}

	/**
	 * The listener of the `Receiver` `'error'` event.
	 *
	 * @param {(RangeError|Error)} err The emitted error
	 * @private
	 */
	function receiverOnError(err) {
	  const websocket = this[kWebSocket];

	  if (websocket._socket[kWebSocket] !== undefined) {
	    websocket._socket.removeListener('data', socketOnData);

	    //
	    // On Node.js < 14.0.0 the `'error'` event is emitted synchronously. See
	    // https://github.com/websockets/ws/issues/1940.
	    //
	    process.nextTick(resume, websocket._socket);

	    websocket.close(err[kStatusCode]);
	  }

	  websocket.emit('error', err);
	}

	/**
	 * The listener of the `Receiver` `'finish'` event.
	 *
	 * @private
	 */
	function receiverOnFinish() {
	  this[kWebSocket].emitClose();
	}

	/**
	 * The listener of the `Receiver` `'message'` event.
	 *
	 * @param {Buffer|ArrayBuffer|Buffer[])} data The message
	 * @param {Boolean} isBinary Specifies whether the message is binary or not
	 * @private
	 */
	function receiverOnMessage(data, isBinary) {
	  this[kWebSocket].emit('message', data, isBinary);
	}

	/**
	 * The listener of the `Receiver` `'ping'` event.
	 *
	 * @param {Buffer} data The data included in the ping frame
	 * @private
	 */
	function receiverOnPing(data) {
	  const websocket = this[kWebSocket];

	  websocket.pong(data, !websocket._isServer, NOOP);
	  websocket.emit('ping', data);
	}

	/**
	 * The listener of the `Receiver` `'pong'` event.
	 *
	 * @param {Buffer} data The data included in the pong frame
	 * @private
	 */
	function receiverOnPong(data) {
	  this[kWebSocket].emit('pong', data);
	}

	/**
	 * Resume a readable stream
	 *
	 * @param {Readable} stream The readable stream
	 * @private
	 */
	function resume(stream) {
	  stream.resume();
	}

	/**
	 * The listener of the `net.Socket` `'close'` event.
	 *
	 * @private
	 */
	function socketOnClose() {
	  const websocket = this[kWebSocket];

	  this.removeListener('close', socketOnClose);
	  this.removeListener('data', socketOnData);
	  this.removeListener('end', socketOnEnd);

	  websocket._readyState = WebSocket.CLOSING;

	  let chunk;

	  //
	  // The close frame might not have been received or the `'end'` event emitted,
	  // for example, if the socket was destroyed due to an error. Ensure that the
	  // `receiver` stream is closed after writing any remaining buffered data to
	  // it. If the readable side of the socket is in flowing mode then there is no
	  // buffered data as everything has been already written and `readable.read()`
	  // will return `null`. If instead, the socket is paused, any possible buffered
	  // data will be read as a single chunk.
	  //
	  if (
	    !this._readableState.endEmitted &&
	    !websocket._closeFrameReceived &&
	    !websocket._receiver._writableState.errorEmitted &&
	    (chunk = websocket._socket.read()) !== null
	  ) {
	    websocket._receiver.write(chunk);
	  }

	  websocket._receiver.end();

	  this[kWebSocket] = undefined;

	  clearTimeout(websocket._closeTimer);

	  if (
	    websocket._receiver._writableState.finished ||
	    websocket._receiver._writableState.errorEmitted
	  ) {
	    websocket.emitClose();
	  } else {
	    websocket._receiver.on('error', receiverOnFinish);
	    websocket._receiver.on('finish', receiverOnFinish);
	  }
	}

	/**
	 * The listener of the `net.Socket` `'data'` event.
	 *
	 * @param {Buffer} chunk A chunk of data
	 * @private
	 */
	function socketOnData(chunk) {
	  if (!this[kWebSocket]._receiver.write(chunk)) {
	    this.pause();
	  }
	}

	/**
	 * The listener of the `net.Socket` `'end'` event.
	 *
	 * @private
	 */
	function socketOnEnd() {
	  const websocket = this[kWebSocket];

	  websocket._readyState = WebSocket.CLOSING;
	  websocket._receiver.end();
	  this.end();
	}

	/**
	 * The listener of the `net.Socket` `'error'` event.
	 *
	 * @private
	 */
	function socketOnError() {
	  const websocket = this[kWebSocket];

	  this.removeListener('error', socketOnError);
	  this.on('error', NOOP);

	  if (websocket) {
	    websocket._readyState = WebSocket.CLOSING;
	    this.destroy();
	  }
	}
	return websocket;
}

requireWebsocket();

var subprotocol;
var hasRequiredSubprotocol;

function requireSubprotocol () {
	if (hasRequiredSubprotocol) return subprotocol;
	hasRequiredSubprotocol = 1;

	const { tokenChars } = requireValidation();

	/**
	 * Parses the `Sec-WebSocket-Protocol` header into a set of subprotocol names.
	 *
	 * @param {String} header The field value of the header
	 * @return {Set} The subprotocol names
	 * @public
	 */
	function parse(header) {
	  const protocols = new Set();
	  let start = -1;
	  let end = -1;
	  let i = 0;

	  for (i; i < header.length; i++) {
	    const code = header.charCodeAt(i);

	    if (end === -1 && tokenChars[code] === 1) {
	      if (start === -1) start = i;
	    } else if (
	      i !== 0 &&
	      (code === 0x20 /* ' ' */ || code === 0x09) /* '\t' */
	    ) {
	      if (end === -1 && start !== -1) end = i;
	    } else if (code === 0x2c /* ',' */) {
	      if (start === -1) {
	        throw new SyntaxError(`Unexpected character at index ${i}`);
	      }

	      if (end === -1) end = i;

	      const protocol = header.slice(start, end);

	      if (protocols.has(protocol)) {
	        throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
	      }

	      protocols.add(protocol);
	      start = end = -1;
	    } else {
	      throw new SyntaxError(`Unexpected character at index ${i}`);
	    }
	  }

	  if (start === -1 || end !== -1) {
	    throw new SyntaxError('Unexpected end of input');
	  }

	  const protocol = header.slice(start, i);

	  if (protocols.has(protocol)) {
	    throw new SyntaxError(`The "${protocol}" subprotocol is duplicated`);
	  }

	  protocols.add(protocol);
	  return protocols;
	}

	subprotocol = { parse };
	return subprotocol;
}

/* eslint no-unused-vars: ["error", { "varsIgnorePattern": "^net|tls|https$" }] */

var websocketServer;
var hasRequiredWebsocketServer;

function requireWebsocketServer () {
	if (hasRequiredWebsocketServer) return websocketServer;
	hasRequiredWebsocketServer = 1;

	const EventEmitter = require$$0$4;
	const http = require$$2;
	const { createHash } = require$$5;

	const extension = requireExtension();
	const PerMessageDeflate = requirePermessageDeflate();
	const subprotocol = requireSubprotocol();
	const WebSocket = requireWebsocket();
	const { GUID, kWebSocket } = requireConstants();

	const keyRegex = /^[+/0-9A-Za-z]{22}==$/;

	const RUNNING = 0;
	const CLOSING = 1;
	const CLOSED = 2;

	/**
	 * Class representing a WebSocket server.
	 *
	 * @extends EventEmitter
	 */
	class WebSocketServer extends EventEmitter {
	  /**
	   * Create a `WebSocketServer` instance.
	   *
	   * @param {Object} options Configuration options
	   * @param {Number} [options.backlog=511] The maximum length of the queue of
	   *     pending connections
	   * @param {Boolean} [options.clientTracking=true] Specifies whether or not to
	   *     track clients
	   * @param {Function} [options.handleProtocols] A hook to handle protocols
	   * @param {String} [options.host] The hostname where to bind the server
	   * @param {Number} [options.maxPayload=104857600] The maximum allowed message
	   *     size
	   * @param {Boolean} [options.noServer=false] Enable no server mode
	   * @param {String} [options.path] Accept only connections matching this path
	   * @param {(Boolean|Object)} [options.perMessageDeflate=false] Enable/disable
	   *     permessage-deflate
	   * @param {Number} [options.port] The port where to bind the server
	   * @param {(http.Server|https.Server)} [options.server] A pre-created HTTP/S
	   *     server to use
	   * @param {Boolean} [options.skipUTF8Validation=false] Specifies whether or
	   *     not to skip UTF-8 validation for text and close messages
	   * @param {Function} [options.verifyClient] A hook to reject connections
	   * @param {Function} [options.WebSocket=WebSocket] Specifies the `WebSocket`
	   *     class to use. It must be the `WebSocket` class or class that extends it
	   * @param {Function} [callback] A listener for the `listening` event
	   */
	  constructor(options, callback) {
	    super();

	    options = {
	      maxPayload: 100 * 1024 * 1024,
	      skipUTF8Validation: false,
	      perMessageDeflate: false,
	      handleProtocols: null,
	      clientTracking: true,
	      verifyClient: null,
	      noServer: false,
	      backlog: null, // use default (511 as implemented in net.js)
	      server: null,
	      host: null,
	      path: null,
	      port: null,
	      WebSocket,
	      ...options
	    };

	    if (
	      (options.port == null && !options.server && !options.noServer) ||
	      (options.port != null && (options.server || options.noServer)) ||
	      (options.server && options.noServer)
	    ) {
	      throw new TypeError(
	        'One and only one of the "port", "server", or "noServer" options ' +
	          'must be specified'
	      );
	    }

	    if (options.port != null) {
	      this._server = http.createServer((req, res) => {
	        const body = http.STATUS_CODES[426];

	        res.writeHead(426, {
	          'Content-Length': body.length,
	          'Content-Type': 'text/plain'
	        });
	        res.end(body);
	      });
	      this._server.listen(
	        options.port,
	        options.host,
	        options.backlog,
	        callback
	      );
	    } else if (options.server) {
	      this._server = options.server;
	    }

	    if (this._server) {
	      const emitConnection = this.emit.bind(this, 'connection');

	      this._removeListeners = addListeners(this._server, {
	        listening: this.emit.bind(this, 'listening'),
	        error: this.emit.bind(this, 'error'),
	        upgrade: (req, socket, head) => {
	          this.handleUpgrade(req, socket, head, emitConnection);
	        }
	      });
	    }

	    if (options.perMessageDeflate === true) options.perMessageDeflate = {};
	    if (options.clientTracking) {
	      this.clients = new Set();
	      this._shouldEmitClose = false;
	    }

	    this.options = options;
	    this._state = RUNNING;
	  }

	  /**
	   * Returns the bound address, the address family name, and port of the server
	   * as reported by the operating system if listening on an IP socket.
	   * If the server is listening on a pipe or UNIX domain socket, the name is
	   * returned as a string.
	   *
	   * @return {(Object|String|null)} The address of the server
	   * @public
	   */
	  address() {
	    if (this.options.noServer) {
	      throw new Error('The server is operating in "noServer" mode');
	    }

	    if (!this._server) return null;
	    return this._server.address();
	  }

	  /**
	   * Stop the server from accepting new connections and emit the `'close'` event
	   * when all existing connections are closed.
	   *
	   * @param {Function} [cb] A one-time listener for the `'close'` event
	   * @public
	   */
	  close(cb) {
	    if (this._state === CLOSED) {
	      if (cb) {
	        this.once('close', () => {
	          cb(new Error('The server is not running'));
	        });
	      }

	      process.nextTick(emitClose, this);
	      return;
	    }

	    if (cb) this.once('close', cb);

	    if (this._state === CLOSING) return;
	    this._state = CLOSING;

	    if (this.options.noServer || this.options.server) {
	      if (this._server) {
	        this._removeListeners();
	        this._removeListeners = this._server = null;
	      }

	      if (this.clients) {
	        if (!this.clients.size) {
	          process.nextTick(emitClose, this);
	        } else {
	          this._shouldEmitClose = true;
	        }
	      } else {
	        process.nextTick(emitClose, this);
	      }
	    } else {
	      const server = this._server;

	      this._removeListeners();
	      this._removeListeners = this._server = null;

	      //
	      // The HTTP/S server was created internally. Close it, and rely on its
	      // `'close'` event.
	      //
	      server.close(() => {
	        emitClose(this);
	      });
	    }
	  }

	  /**
	   * See if a given request should be handled by this server instance.
	   *
	   * @param {http.IncomingMessage} req Request object to inspect
	   * @return {Boolean} `true` if the request is valid, else `false`
	   * @public
	   */
	  shouldHandle(req) {
	    if (this.options.path) {
	      const index = req.url.indexOf('?');
	      const pathname = index !== -1 ? req.url.slice(0, index) : req.url;

	      if (pathname !== this.options.path) return false;
	    }

	    return true;
	  }

	  /**
	   * Handle a HTTP Upgrade request.
	   *
	   * @param {http.IncomingMessage} req The request object
	   * @param {(net.Socket|tls.Socket)} socket The network socket between the
	   *     server and client
	   * @param {Buffer} head The first packet of the upgraded stream
	   * @param {Function} cb Callback
	   * @public
	   */
	  handleUpgrade(req, socket, head, cb) {
	    socket.on('error', socketOnError);

	    const key = req.headers['sec-websocket-key'];
	    const version = +req.headers['sec-websocket-version'];

	    if (req.method !== 'GET') {
	      const message = 'Invalid HTTP method';
	      abortHandshakeOrEmitwsClientError(this, req, socket, 405, message);
	      return;
	    }

	    if (req.headers.upgrade.toLowerCase() !== 'websocket') {
	      const message = 'Invalid Upgrade header';
	      abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
	      return;
	    }

	    if (!key || !keyRegex.test(key)) {
	      const message = 'Missing or invalid Sec-WebSocket-Key header';
	      abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
	      return;
	    }

	    if (version !== 8 && version !== 13) {
	      const message = 'Missing or invalid Sec-WebSocket-Version header';
	      abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
	      return;
	    }

	    if (!this.shouldHandle(req)) {
	      abortHandshake(socket, 400);
	      return;
	    }

	    const secWebSocketProtocol = req.headers['sec-websocket-protocol'];
	    let protocols = new Set();

	    if (secWebSocketProtocol !== undefined) {
	      try {
	        protocols = subprotocol.parse(secWebSocketProtocol);
	      } catch (err) {
	        const message = 'Invalid Sec-WebSocket-Protocol header';
	        abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
	        return;
	      }
	    }

	    const secWebSocketExtensions = req.headers['sec-websocket-extensions'];
	    const extensions = {};

	    if (
	      this.options.perMessageDeflate &&
	      secWebSocketExtensions !== undefined
	    ) {
	      const perMessageDeflate = new PerMessageDeflate(
	        this.options.perMessageDeflate,
	        true,
	        this.options.maxPayload
	      );

	      try {
	        const offers = extension.parse(secWebSocketExtensions);

	        if (offers[PerMessageDeflate.extensionName]) {
	          perMessageDeflate.accept(offers[PerMessageDeflate.extensionName]);
	          extensions[PerMessageDeflate.extensionName] = perMessageDeflate;
	        }
	      } catch (err) {
	        const message =
	          'Invalid or unacceptable Sec-WebSocket-Extensions header';
	        abortHandshakeOrEmitwsClientError(this, req, socket, 400, message);
	        return;
	      }
	    }

	    //
	    // Optionally call external client verification handler.
	    //
	    if (this.options.verifyClient) {
	      const info = {
	        origin:
	          req.headers[`${version === 8 ? 'sec-websocket-origin' : 'origin'}`],
	        secure: !!(req.socket.authorized || req.socket.encrypted),
	        req
	      };

	      if (this.options.verifyClient.length === 2) {
	        this.options.verifyClient(info, (verified, code, message, headers) => {
	          if (!verified) {
	            return abortHandshake(socket, code || 401, message, headers);
	          }

	          this.completeUpgrade(
	            extensions,
	            key,
	            protocols,
	            req,
	            socket,
	            head,
	            cb
	          );
	        });
	        return;
	      }

	      if (!this.options.verifyClient(info)) return abortHandshake(socket, 401);
	    }

	    this.completeUpgrade(extensions, key, protocols, req, socket, head, cb);
	  }

	  /**
	   * Upgrade the connection to WebSocket.
	   *
	   * @param {Object} extensions The accepted extensions
	   * @param {String} key The value of the `Sec-WebSocket-Key` header
	   * @param {Set} protocols The subprotocols
	   * @param {http.IncomingMessage} req The request object
	   * @param {(net.Socket|tls.Socket)} socket The network socket between the
	   *     server and client
	   * @param {Buffer} head The first packet of the upgraded stream
	   * @param {Function} cb Callback
	   * @throws {Error} If called more than once with the same socket
	   * @private
	   */
	  completeUpgrade(extensions, key, protocols, req, socket, head, cb) {
	    //
	    // Destroy the socket if the client has already sent a FIN packet.
	    //
	    if (!socket.readable || !socket.writable) return socket.destroy();

	    if (socket[kWebSocket]) {
	      throw new Error(
	        'server.handleUpgrade() was called more than once with the same ' +
	          'socket, possibly due to a misconfiguration'
	      );
	    }

	    if (this._state > RUNNING) return abortHandshake(socket, 503);

	    const digest = createHash('sha1')
	      .update(key + GUID)
	      .digest('base64');

	    const headers = [
	      'HTTP/1.1 101 Switching Protocols',
	      'Upgrade: websocket',
	      'Connection: Upgrade',
	      `Sec-WebSocket-Accept: ${digest}`
	    ];

	    const ws = new this.options.WebSocket(null);

	    if (protocols.size) {
	      //
	      // Optionally call external protocol selection handler.
	      //
	      const protocol = this.options.handleProtocols
	        ? this.options.handleProtocols(protocols, req)
	        : protocols.values().next().value;

	      if (protocol) {
	        headers.push(`Sec-WebSocket-Protocol: ${protocol}`);
	        ws._protocol = protocol;
	      }
	    }

	    if (extensions[PerMessageDeflate.extensionName]) {
	      const params = extensions[PerMessageDeflate.extensionName].params;
	      const value = extension.format({
	        [PerMessageDeflate.extensionName]: [params]
	      });
	      headers.push(`Sec-WebSocket-Extensions: ${value}`);
	      ws._extensions = extensions;
	    }

	    //
	    // Allow external modification/inspection of handshake headers.
	    //
	    this.emit('headers', headers, req);

	    socket.write(headers.concat('\r\n').join('\r\n'));
	    socket.removeListener('error', socketOnError);

	    ws.setSocket(socket, head, {
	      maxPayload: this.options.maxPayload,
	      skipUTF8Validation: this.options.skipUTF8Validation
	    });

	    if (this.clients) {
	      this.clients.add(ws);
	      ws.on('close', () => {
	        this.clients.delete(ws);

	        if (this._shouldEmitClose && !this.clients.size) {
	          process.nextTick(emitClose, this);
	        }
	      });
	    }

	    cb(ws, req);
	  }
	}

	websocketServer = WebSocketServer;

	/**
	 * Add event listeners on an `EventEmitter` using a map of <event, listener>
	 * pairs.
	 *
	 * @param {EventEmitter} server The event emitter
	 * @param {Object.<String, Function>} map The listeners to add
	 * @return {Function} A function that will remove the added listeners when
	 *     called
	 * @private
	 */
	function addListeners(server, map) {
	  for (const event of Object.keys(map)) server.on(event, map[event]);

	  return function removeListeners() {
	    for (const event of Object.keys(map)) {
	      server.removeListener(event, map[event]);
	    }
	  };
	}

	/**
	 * Emit a `'close'` event on an `EventEmitter`.
	 *
	 * @param {EventEmitter} server The event emitter
	 * @private
	 */
	function emitClose(server) {
	  server._state = CLOSED;
	  server.emit('close');
	}

	/**
	 * Handle socket errors.
	 *
	 * @private
	 */
	function socketOnError() {
	  this.destroy();
	}

	/**
	 * Close the connection when preconditions are not fulfilled.
	 *
	 * @param {(net.Socket|tls.Socket)} socket The socket of the upgrade request
	 * @param {Number} code The HTTP response status code
	 * @param {String} [message] The HTTP response body
	 * @param {Object} [headers] Additional HTTP response headers
	 * @private
	 */
	function abortHandshake(socket, code, message, headers) {
	  //
	  // The socket is writable unless the user destroyed or ended it before calling
	  // `server.handleUpgrade()` or in the `verifyClient` function, which is a user
	  // error. Handling this does not make much sense as the worst that can happen
	  // is that some of the data written by the user might be discarded due to the
	  // call to `socket.end()` below, which triggers an `'error'` event that in
	  // turn causes the socket to be destroyed.
	  //
	  message = message || http.STATUS_CODES[code];
	  headers = {
	    Connection: 'close',
	    'Content-Type': 'text/html',
	    'Content-Length': Buffer.byteLength(message),
	    ...headers
	  };

	  socket.once('finish', socket.destroy);

	  socket.end(
	    `HTTP/1.1 ${code} ${http.STATUS_CODES[code]}\r\n` +
	      Object.keys(headers)
	        .map((h) => `${h}: ${headers[h]}`)
	        .join('\r\n') +
	      '\r\n\r\n' +
	      message
	  );
	}

	/**
	 * Emit a `'wsClientError'` event on a `WebSocketServer` if there is at least
	 * one listener for it, otherwise call `abortHandshake()`.
	 *
	 * @param {WebSocketServer} server The WebSocket server
	 * @param {http.IncomingMessage} req The request object
	 * @param {(net.Socket|tls.Socket)} socket The socket of the upgrade request
	 * @param {Number} code The HTTP response status code
	 * @param {String} message The HTTP response body
	 * @private
	 */
	function abortHandshakeOrEmitwsClientError(server, req, socket, code, message) {
	  if (server.listenerCount('wsClientError')) {
	    const err = new Error(message);
	    Error.captureStackTrace(err, abortHandshakeOrEmitwsClientError);

	    server.emit('wsClientError', err, socket, req);
	  } else {
	    abortHandshake(socket, code, message);
	  }
	}
	return websocketServer;
}

requireWebsocketServer();

// src/utils/env.ts
var NOTHING = Symbol.for("immer-nothing");
var DRAFTABLE = Symbol.for("immer-draftable");
var DRAFT_STATE = Symbol.for("immer-state");

// src/utils/errors.ts
var errors = process.env.NODE_ENV !== "production" ? [
  // All error codes, starting by 0:
  function(plugin) {
    return `The plugin for '${plugin}' has not been loaded into Immer. To enable the plugin, import and call \`enable${plugin}()\` when initializing your application.`;
  },
  function(thing) {
    return `produce can only be called on things that are draftable: plain objects, arrays, Map, Set or classes that are marked with '[immerable]: true'. Got '${thing}'`;
  },
  "This object has been frozen and should not be mutated",
  function(data) {
    return "Cannot use a proxy that has been revoked. Did you pass an object from inside an immer function to an async process? " + data;
  },
  "An immer producer returned a new value *and* modified its draft. Either return a new value *or* modify the draft.",
  "Immer forbids circular references",
  "The first or second argument to `produce` must be a function",
  "The third argument to `produce` must be a function or undefined",
  "First argument to `createDraft` must be a plain object, an array, or an immerable object",
  "First argument to `finishDraft` must be a draft returned by `createDraft`",
  function(thing) {
    return `'current' expects a draft, got: ${thing}`;
  },
  "Object.defineProperty() cannot be used on an Immer draft",
  "Object.setPrototypeOf() cannot be used on an Immer draft",
  "Immer only supports deleting array indices",
  "Immer only supports setting array indices and the 'length' property",
  function(thing) {
    return `'original' expects a draft, got: ${thing}`;
  }
  // Note: if more errors are added, the errorOffset in Patches.ts should be increased
  // See Patches.ts for additional errors
] : [];
function die(error, ...args) {
  if (process.env.NODE_ENV !== "production") {
    const e = errors[error];
    const msg = typeof e === "function" ? e.apply(null, args) : e;
    throw new Error(`[Immer] ${msg}`);
  }
  throw new Error(
    `[Immer] minified error nr: ${error}. Full error at: https://bit.ly/3cXEKWf`
  );
}

// src/utils/common.ts
var getPrototypeOf = Object.getPrototypeOf;
function isDraft(value) {
  return !!value && !!value[DRAFT_STATE];
}
function isDraftable(value) {
  if (!value)
    return false;
  return isPlainObject(value) || Array.isArray(value) || !!value[DRAFTABLE] || !!value.constructor?.[DRAFTABLE] || isMap(value) || isSet(value);
}
var objectCtorString = Object.prototype.constructor.toString();
function isPlainObject(value) {
  if (!value || typeof value !== "object")
    return false;
  const proto = getPrototypeOf(value);
  if (proto === null) {
    return true;
  }
  const Ctor = Object.hasOwnProperty.call(proto, "constructor") && proto.constructor;
  if (Ctor === Object)
    return true;
  return typeof Ctor == "function" && Function.toString.call(Ctor) === objectCtorString;
}
function each(obj, iter) {
  if (getArchtype(obj) === 0 /* Object */) {
    Object.entries(obj).forEach(([key, value]) => {
      iter(key, value, obj);
    });
  } else {
    obj.forEach((entry, index) => iter(index, entry, obj));
  }
}
function getArchtype(thing) {
  const state = thing[DRAFT_STATE];
  return state ? state.type_ : Array.isArray(thing) ? 1 /* Array */ : isMap(thing) ? 2 /* Map */ : isSet(thing) ? 3 /* Set */ : 0 /* Object */;
}
function has(thing, prop) {
  return getArchtype(thing) === 2 /* Map */ ? thing.has(prop) : Object.prototype.hasOwnProperty.call(thing, prop);
}
function set(thing, propOrOldValue, value) {
  const t = getArchtype(thing);
  if (t === 2 /* Map */)
    thing.set(propOrOldValue, value);
  else if (t === 3 /* Set */) {
    thing.add(value);
  } else
    thing[propOrOldValue] = value;
}
function is(x, y) {
  if (x === y) {
    return x !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}
function isMap(target) {
  return target instanceof Map;
}
function isSet(target) {
  return target instanceof Set;
}
function latest(state) {
  return state.copy_ || state.base_;
}
function shallowCopy(base, strict) {
  if (isMap(base)) {
    return new Map(base);
  }
  if (isSet(base)) {
    return new Set(base);
  }
  if (Array.isArray(base))
    return Array.prototype.slice.call(base);
  if (!strict && isPlainObject(base)) {
    if (!getPrototypeOf(base)) {
      const obj = /* @__PURE__ */ Object.create(null);
      return Object.assign(obj, base);
    }
    return { ...base };
  }
  const descriptors = Object.getOwnPropertyDescriptors(base);
  delete descriptors[DRAFT_STATE];
  let keys = Reflect.ownKeys(descriptors);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const desc = descriptors[key];
    if (desc.writable === false) {
      desc.writable = true;
      desc.configurable = true;
    }
    if (desc.get || desc.set)
      descriptors[key] = {
        configurable: true,
        writable: true,
        // could live with !!desc.set as well here...
        enumerable: desc.enumerable,
        value: base[key]
      };
  }
  return Object.create(getPrototypeOf(base), descriptors);
}
function freeze(obj, deep = false) {
  if (isFrozen(obj) || isDraft(obj) || !isDraftable(obj))
    return obj;
  if (getArchtype(obj) > 1) {
    obj.set = obj.add = obj.clear = obj.delete = dontMutateFrozenCollections;
  }
  Object.freeze(obj);
  if (deep)
    each(obj, (_key, value) => freeze(value, true));
  return obj;
}
function dontMutateFrozenCollections() {
  die(2);
}
function isFrozen(obj) {
  return Object.isFrozen(obj);
}

// src/utils/plugins.ts
var plugins = {};
function getPlugin(pluginKey) {
  const plugin = plugins[pluginKey];
  if (!plugin) {
    die(0, pluginKey);
  }
  return plugin;
}

// src/core/scope.ts
var currentScope;
function getCurrentScope() {
  return currentScope;
}
function createScope(parent_, immer_) {
  return {
    drafts_: [],
    parent_,
    immer_,
    // Whenever the modified draft contains a draft from another scope, we
    // need to prevent auto-freezing so the unowned draft can be finalized.
    canAutoFreeze_: true,
    unfinalizedDrafts_: 0
  };
}
function usePatchesInScope(scope, patchListener) {
  if (patchListener) {
    getPlugin("Patches");
    scope.patches_ = [];
    scope.inversePatches_ = [];
    scope.patchListener_ = patchListener;
  }
}
function revokeScope(scope) {
  leaveScope(scope);
  scope.drafts_.forEach(revokeDraft);
  scope.drafts_ = null;
}
function leaveScope(scope) {
  if (scope === currentScope) {
    currentScope = scope.parent_;
  }
}
function enterScope(immer2) {
  return currentScope = createScope(currentScope, immer2);
}
function revokeDraft(draft) {
  const state = draft[DRAFT_STATE];
  if (state.type_ === 0 /* Object */ || state.type_ === 1 /* Array */)
    state.revoke_();
  else
    state.revoked_ = true;
}

// src/core/finalize.ts
function processResult(result, scope) {
  scope.unfinalizedDrafts_ = scope.drafts_.length;
  const baseDraft = scope.drafts_[0];
  const isReplaced = result !== void 0 && result !== baseDraft;
  if (isReplaced) {
    if (baseDraft[DRAFT_STATE].modified_) {
      revokeScope(scope);
      die(4);
    }
    if (isDraftable(result)) {
      result = finalize(scope, result);
      if (!scope.parent_)
        maybeFreeze(scope, result);
    }
    if (scope.patches_) {
      getPlugin("Patches").generateReplacementPatches_(
        baseDraft[DRAFT_STATE].base_,
        result,
        scope.patches_,
        scope.inversePatches_
      );
    }
  } else {
    result = finalize(scope, baseDraft, []);
  }
  revokeScope(scope);
  if (scope.patches_) {
    scope.patchListener_(scope.patches_, scope.inversePatches_);
  }
  return result !== NOTHING ? result : void 0;
}
function finalize(rootScope, value, path) {
  if (isFrozen(value))
    return value;
  const state = value[DRAFT_STATE];
  if (!state) {
    each(
      value,
      (key, childValue) => finalizeProperty(rootScope, state, value, key, childValue, path));
    return value;
  }
  if (state.scope_ !== rootScope)
    return value;
  if (!state.modified_) {
    maybeFreeze(rootScope, state.base_, true);
    return state.base_;
  }
  if (!state.finalized_) {
    state.finalized_ = true;
    state.scope_.unfinalizedDrafts_--;
    const result = state.copy_;
    let resultEach = result;
    let isSet2 = false;
    if (state.type_ === 3 /* Set */) {
      resultEach = new Set(result);
      result.clear();
      isSet2 = true;
    }
    each(
      resultEach,
      (key, childValue) => finalizeProperty(rootScope, state, result, key, childValue, path, isSet2)
    );
    maybeFreeze(rootScope, result, false);
    if (path && rootScope.patches_) {
      getPlugin("Patches").generatePatches_(
        state,
        path,
        rootScope.patches_,
        rootScope.inversePatches_
      );
    }
  }
  return state.copy_;
}
function finalizeProperty(rootScope, parentState, targetObject, prop, childValue, rootPath, targetIsSet) {
  if (process.env.NODE_ENV !== "production" && childValue === targetObject)
    die(5);
  if (isDraft(childValue)) {
    const path = rootPath && parentState && parentState.type_ !== 3 /* Set */ && // Set objects are atomic since they have no keys.
    !has(parentState.assigned_, prop) ? rootPath.concat(prop) : void 0;
    const res = finalize(rootScope, childValue, path);
    set(targetObject, prop, res);
    if (isDraft(res)) {
      rootScope.canAutoFreeze_ = false;
    } else
      return;
  } else if (targetIsSet) {
    targetObject.add(childValue);
  }
  if (isDraftable(childValue) && !isFrozen(childValue)) {
    if (!rootScope.immer_.autoFreeze_ && rootScope.unfinalizedDrafts_ < 1) {
      return;
    }
    finalize(rootScope, childValue);
    if (!parentState || !parentState.scope_.parent_)
      maybeFreeze(rootScope, childValue);
  }
}
function maybeFreeze(scope, value, deep = false) {
  if (!scope.parent_ && scope.immer_.autoFreeze_ && scope.canAutoFreeze_) {
    freeze(value, deep);
  }
}

// src/core/proxy.ts
function createProxyProxy(base, parent) {
  const isArray = Array.isArray(base);
  const state = {
    type_: isArray ? 1 /* Array */ : 0 /* Object */,
    // Track which produce call this is associated with.
    scope_: parent ? parent.scope_ : getCurrentScope(),
    // True for both shallow and deep changes.
    modified_: false,
    // Used during finalization.
    finalized_: false,
    // Track which properties have been assigned (true) or deleted (false).
    assigned_: {},
    // The parent draft state.
    parent_: parent,
    // The base state.
    base_: base,
    // The base proxy.
    draft_: null,
    // set below
    // The base copy with any updated values.
    copy_: null,
    // Called by the `produce` function.
    revoke_: null,
    isManual_: false
  };
  let target = state;
  let traps = objectTraps;
  if (isArray) {
    target = [state];
    traps = arrayTraps;
  }
  const { revoke, proxy } = Proxy.revocable(target, traps);
  state.draft_ = proxy;
  state.revoke_ = revoke;
  return proxy;
}
var objectTraps = {
  get(state, prop) {
    if (prop === DRAFT_STATE)
      return state;
    const source = latest(state);
    if (!has(source, prop)) {
      return readPropFromProto(state, source, prop);
    }
    const value = source[prop];
    if (state.finalized_ || !isDraftable(value)) {
      return value;
    }
    if (value === peek(state.base_, prop)) {
      prepareCopy(state);
      return state.copy_[prop] = createProxy(value, state);
    }
    return value;
  },
  has(state, prop) {
    return prop in latest(state);
  },
  ownKeys(state) {
    return Reflect.ownKeys(latest(state));
  },
  set(state, prop, value) {
    const desc = getDescriptorFromProto(latest(state), prop);
    if (desc?.set) {
      desc.set.call(state.draft_, value);
      return true;
    }
    if (!state.modified_) {
      const current2 = peek(latest(state), prop);
      const currentState = current2?.[DRAFT_STATE];
      if (currentState && currentState.base_ === value) {
        state.copy_[prop] = value;
        state.assigned_[prop] = false;
        return true;
      }
      if (is(value, current2) && (value !== void 0 || has(state.base_, prop)))
        return true;
      prepareCopy(state);
      markChanged(state);
    }
    if (state.copy_[prop] === value && // special case: handle new props with value 'undefined'
    (value !== void 0 || prop in state.copy_) || // special case: NaN
    Number.isNaN(value) && Number.isNaN(state.copy_[prop]))
      return true;
    state.copy_[prop] = value;
    state.assigned_[prop] = true;
    return true;
  },
  deleteProperty(state, prop) {
    if (peek(state.base_, prop) !== void 0 || prop in state.base_) {
      state.assigned_[prop] = false;
      prepareCopy(state);
      markChanged(state);
    } else {
      delete state.assigned_[prop];
    }
    if (state.copy_) {
      delete state.copy_[prop];
    }
    return true;
  },
  // Note: We never coerce `desc.value` into an Immer draft, because we can't make
  // the same guarantee in ES5 mode.
  getOwnPropertyDescriptor(state, prop) {
    const owner = latest(state);
    const desc = Reflect.getOwnPropertyDescriptor(owner, prop);
    if (!desc)
      return desc;
    return {
      writable: true,
      configurable: state.type_ !== 1 /* Array */ || prop !== "length",
      enumerable: desc.enumerable,
      value: owner[prop]
    };
  },
  defineProperty() {
    die(11);
  },
  getPrototypeOf(state) {
    return getPrototypeOf(state.base_);
  },
  setPrototypeOf() {
    die(12);
  }
};
var arrayTraps = {};
each(objectTraps, (key, fn) => {
  arrayTraps[key] = function() {
    arguments[0] = arguments[0][0];
    return fn.apply(this, arguments);
  };
});
arrayTraps.deleteProperty = function(state, prop) {
  if (process.env.NODE_ENV !== "production" && isNaN(parseInt(prop)))
    die(13);
  return arrayTraps.set.call(this, state, prop, void 0);
};
arrayTraps.set = function(state, prop, value) {
  if (process.env.NODE_ENV !== "production" && prop !== "length" && isNaN(parseInt(prop)))
    die(14);
  return objectTraps.set.call(this, state[0], prop, value, state[0]);
};
function peek(draft, prop) {
  const state = draft[DRAFT_STATE];
  const source = state ? latest(state) : draft;
  return source[prop];
}
function readPropFromProto(state, source, prop) {
  const desc = getDescriptorFromProto(source, prop);
  return desc ? `value` in desc ? desc.value : (
    // This is a very special case, if the prop is a getter defined by the
    // prototype, we should invoke it with the draft as context!
    desc.get?.call(state.draft_)
  ) : void 0;
}
function getDescriptorFromProto(source, prop) {
  if (!(prop in source))
    return void 0;
  let proto = getPrototypeOf(source);
  while (proto) {
    const desc = Object.getOwnPropertyDescriptor(proto, prop);
    if (desc)
      return desc;
    proto = getPrototypeOf(proto);
  }
  return void 0;
}
function markChanged(state) {
  if (!state.modified_) {
    state.modified_ = true;
    if (state.parent_) {
      markChanged(state.parent_);
    }
  }
}
function prepareCopy(state) {
  if (!state.copy_) {
    state.copy_ = shallowCopy(
      state.base_,
      state.scope_.immer_.useStrictShallowCopy_
    );
  }
}

// src/core/immerClass.ts
var Immer2 = class {
  constructor(config) {
    this.autoFreeze_ = true;
    this.useStrictShallowCopy_ = false;
    /**
     * The `produce` function takes a value and a "recipe function" (whose
     * return value often depends on the base state). The recipe function is
     * free to mutate its first argument however it wants. All mutations are
     * only ever applied to a __copy__ of the base state.
     *
     * Pass only a function to create a "curried producer" which relieves you
     * from passing the recipe function every time.
     *
     * Only plain objects and arrays are made mutable. All other objects are
     * considered uncopyable.
     *
     * Note: This function is __bound__ to its `Immer` instance.
     *
     * @param {any} base - the initial state
     * @param {Function} recipe - function that receives a proxy of the base state as first argument and which can be freely modified
     * @param {Function} patchListener - optional function that will be called with all the patches produced here
     * @returns {any} a new state, or the initial state if nothing was modified
     */
    this.produce = (base, recipe, patchListener) => {
      if (typeof base === "function" && typeof recipe !== "function") {
        const defaultBase = recipe;
        recipe = base;
        const self = this;
        return function curriedProduce(base2 = defaultBase, ...args) {
          return self.produce(base2, (draft) => recipe.call(this, draft, ...args));
        };
      }
      if (typeof recipe !== "function")
        die(6);
      if (patchListener !== void 0 && typeof patchListener !== "function")
        die(7);
      let result;
      if (isDraftable(base)) {
        const scope = enterScope(this);
        const proxy = createProxy(base, void 0);
        let hasError = true;
        try {
          result = recipe(proxy);
          hasError = false;
        } finally {
          if (hasError)
            revokeScope(scope);
          else
            leaveScope(scope);
        }
        usePatchesInScope(scope, patchListener);
        return processResult(result, scope);
      } else if (!base || typeof base !== "object") {
        result = recipe(base);
        if (result === void 0)
          result = base;
        if (result === NOTHING)
          result = void 0;
        if (this.autoFreeze_)
          freeze(result, true);
        if (patchListener) {
          const p = [];
          const ip = [];
          getPlugin("Patches").generateReplacementPatches_(base, result, p, ip);
          patchListener(p, ip);
        }
        return result;
      } else
        die(1, base);
    };
    this.produceWithPatches = (base, recipe) => {
      if (typeof base === "function") {
        return (state, ...args) => this.produceWithPatches(state, (draft) => base(draft, ...args));
      }
      let patches, inversePatches;
      const result = this.produce(base, recipe, (p, ip) => {
        patches = p;
        inversePatches = ip;
      });
      return [result, patches, inversePatches];
    };
    if (typeof config?.autoFreeze === "boolean")
      this.setAutoFreeze(config.autoFreeze);
    if (typeof config?.useStrictShallowCopy === "boolean")
      this.setUseStrictShallowCopy(config.useStrictShallowCopy);
  }
  createDraft(base) {
    if (!isDraftable(base))
      die(8);
    if (isDraft(base))
      base = current(base);
    const scope = enterScope(this);
    const proxy = createProxy(base, void 0);
    proxy[DRAFT_STATE].isManual_ = true;
    leaveScope(scope);
    return proxy;
  }
  finishDraft(draft, patchListener) {
    const state = draft && draft[DRAFT_STATE];
    if (!state || !state.isManual_)
      die(9);
    const { scope_: scope } = state;
    usePatchesInScope(scope, patchListener);
    return processResult(void 0, scope);
  }
  /**
   * Pass true to automatically freeze all copies created by Immer.
   *
   * By default, auto-freezing is enabled.
   */
  setAutoFreeze(value) {
    this.autoFreeze_ = value;
  }
  /**
   * Pass true to enable strict shallow copy.
   *
   * By default, immer does not copy the object descriptors such as getter, setter and non-enumrable properties.
   */
  setUseStrictShallowCopy(value) {
    this.useStrictShallowCopy_ = value;
  }
  applyPatches(base, patches) {
    let i;
    for (i = patches.length - 1; i >= 0; i--) {
      const patch = patches[i];
      if (patch.path.length === 0 && patch.op === "replace") {
        base = patch.value;
        break;
      }
    }
    if (i > -1) {
      patches = patches.slice(i + 1);
    }
    const applyPatchesImpl = getPlugin("Patches").applyPatches_;
    if (isDraft(base)) {
      return applyPatchesImpl(base, patches);
    }
    return this.produce(
      base,
      (draft) => applyPatchesImpl(draft, patches)
    );
  }
};
function createProxy(value, parent) {
  const draft = isMap(value) ? getPlugin("MapSet").proxyMap_(value, parent) : isSet(value) ? getPlugin("MapSet").proxySet_(value, parent) : createProxyProxy(value, parent);
  const scope = parent ? parent.scope_ : getCurrentScope();
  scope.drafts_.push(draft);
  return draft;
}

// src/core/current.ts
function current(value) {
  if (!isDraft(value))
    die(10, value);
  return currentImpl(value);
}
function currentImpl(value) {
  if (!isDraftable(value) || isFrozen(value))
    return value;
  const state = value[DRAFT_STATE];
  let copy;
  if (state) {
    if (!state.modified_)
      return state.base_;
    state.finalized_ = true;
    copy = shallowCopy(value, state.scope_.immer_.useStrictShallowCopy_);
  } else {
    copy = shallowCopy(value, true);
  }
  each(copy, (key, childValue) => {
    set(copy, key, currentImpl(childValue));
  });
  if (state) {
    state.finalized_ = false;
  }
  return copy;
}

// src/immer.ts
var immer = new Immer2();
var produce = immer.produce;
immer.produceWithPatches.bind(
  immer
);
var setAutoFreeze = immer.setAutoFreeze.bind(immer);
immer.setUseStrictShallowCopy.bind(immer);
immer.applyPatches.bind(immer);
immer.createDraft.bind(immer);
immer.finishDraft.bind(immer);

const resolveEventType = '$$xstate.resolve';
const rejectEventType = '$$xstate.reject';
function fromPromise(
// TODO: add types
promiseCreator) {
  // TODO: add event types
  const logic = {
    config: promiseCreator,
    transition: (state, event) => {
      if (state.status !== 'active') {
        return state;
      }
      switch (event.type) {
        case resolveEventType:
          {
            const resolvedValue = event.data;
            return {
              ...state,
              status: 'done',
              output: resolvedValue,
              input: undefined
            };
          }
        case rejectEventType:
          return {
            ...state,
            status: 'error',
            error: event.data,
            input: undefined
          };
        case XSTATE_STOP:
          return {
            ...state,
            status: 'stopped',
            input: undefined
          };
        default:
          return state;
      }
    },
    start: (state, {
      self,
      system
    }) => {
      // TODO: determine how to allow customizing this so that promises
      // can be restarted if necessary
      if (state.status !== 'active') {
        return;
      }
      const resolvedPromise = Promise.resolve(promiseCreator({
        input: state.input,
        system,
        self
      }));
      resolvedPromise.then(response => {
        if (self.getSnapshot().status !== 'active') {
          return;
        }
        system._relay(self, self, {
          type: resolveEventType,
          data: response
        });
      }, errorData => {
        if (self.getSnapshot().status !== 'active') {
          return;
        }
        system._relay(self, self, {
          type: rejectEventType,
          data: errorData
        });
      });
    },
    getInitialState: (_, input) => {
      return {
        status: 'active',
        output: undefined,
        error: undefined,
        input
      };
    },
    getPersistedState: state => state,
    restoreState: state => state
  };
  return logic;
}

/**
 * Copies the values of `source` to `array`.
 *
 * @private
 * @param {Array} source The array to copy values from.
 * @param {Array} [array=[]] The array to copy values to.
 * @returns {Array} Returns `array`.
 */

var _copyArray;
var hasRequired_copyArray;

function require_copyArray () {
	if (hasRequired_copyArray) return _copyArray;
	hasRequired_copyArray = 1;
	function copyArray(source, array) {
	  var index = -1,
	      length = source.length;

	  array || (array = Array(length));
	  while (++index < length) {
	    array[index] = source[index];
	  }
	  return array;
	}

	_copyArray = copyArray;
	return _copyArray;
}

/* Built-in method references for those with the same name as other `lodash` methods. */

var _baseRandom;
var hasRequired_baseRandom;

function require_baseRandom () {
	if (hasRequired_baseRandom) return _baseRandom;
	hasRequired_baseRandom = 1;
	var nativeFloor = Math.floor,
	    nativeRandom = Math.random;

	/**
	 * The base implementation of `_.random` without support for returning
	 * floating-point numbers.
	 *
	 * @private
	 * @param {number} lower The lower bound.
	 * @param {number} upper The upper bound.
	 * @returns {number} Returns the random number.
	 */
	function baseRandom(lower, upper) {
	  return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
	}

	_baseRandom = baseRandom;
	return _baseRandom;
}

var _shuffleSelf;
var hasRequired_shuffleSelf;

function require_shuffleSelf () {
	if (hasRequired_shuffleSelf) return _shuffleSelf;
	hasRequired_shuffleSelf = 1;
	var baseRandom = require_baseRandom();

	/**
	 * A specialized version of `_.shuffle` which mutates and sets the size of `array`.
	 *
	 * @private
	 * @param {Array} array The array to shuffle.
	 * @param {number} [size=array.length] The size of `array`.
	 * @returns {Array} Returns `array`.
	 */
	function shuffleSelf(array, size) {
	  var index = -1,
	      length = array.length,
	      lastIndex = length - 1;

	  size = size === undefined ? length : size;
	  while (++index < size) {
	    var rand = baseRandom(index, lastIndex),
	        value = array[rand];

	    array[rand] = array[index];
	    array[index] = value;
	  }
	  array.length = size;
	  return array;
	}

	_shuffleSelf = shuffleSelf;
	return _shuffleSelf;
}

var _arrayShuffle;
var hasRequired_arrayShuffle;

function require_arrayShuffle () {
	if (hasRequired_arrayShuffle) return _arrayShuffle;
	hasRequired_arrayShuffle = 1;
	var copyArray = require_copyArray(),
	    shuffleSelf = require_shuffleSelf();

	/**
	 * A specialized version of `_.shuffle` for arrays.
	 *
	 * @private
	 * @param {Array} array The array to shuffle.
	 * @returns {Array} Returns the new shuffled array.
	 */
	function arrayShuffle(array) {
	  return shuffleSelf(copyArray(array));
	}

	_arrayShuffle = arrayShuffle;
	return _arrayShuffle;
}

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */

var _arrayMap;
var hasRequired_arrayMap;

function require_arrayMap () {
	if (hasRequired_arrayMap) return _arrayMap;
	hasRequired_arrayMap = 1;
	function arrayMap(array, iteratee) {
	  var index = -1,
	      length = array == null ? 0 : array.length,
	      result = Array(length);

	  while (++index < length) {
	    result[index] = iteratee(array[index], index, array);
	  }
	  return result;
	}

	_arrayMap = arrayMap;
	return _arrayMap;
}

var _baseValues;
var hasRequired_baseValues;

function require_baseValues () {
	if (hasRequired_baseValues) return _baseValues;
	hasRequired_baseValues = 1;
	var arrayMap = require_arrayMap();

	/**
	 * The base implementation of `_.values` and `_.valuesIn` which creates an
	 * array of `object` property values corresponding to the property names
	 * of `props`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array} props The property names to get values for.
	 * @returns {Object} Returns the array of property values.
	 */
	function baseValues(object, props) {
	  return arrayMap(props, function(key) {
	    return object[key];
	  });
	}

	_baseValues = baseValues;
	return _baseValues;
}

var values_1;
var hasRequiredValues;

function requireValues () {
	if (hasRequiredValues) return values_1;
	hasRequiredValues = 1;
	var baseValues = require_baseValues(),
	    keys = requireKeys();

	/**
	 * Creates an array of the own enumerable string keyed property values of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property values.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.values(new Foo);
	 * // => [1, 2] (iteration order is not guaranteed)
	 *
	 * _.values('hi');
	 * // => ['h', 'i']
	 */
	function values(object) {
	  return object == null ? [] : baseValues(object, keys(object));
	}

	values_1 = values;
	return values_1;
}

var _baseShuffle;
var hasRequired_baseShuffle;

function require_baseShuffle () {
	if (hasRequired_baseShuffle) return _baseShuffle;
	hasRequired_baseShuffle = 1;
	var shuffleSelf = require_shuffleSelf(),
	    values = requireValues();

	/**
	 * The base implementation of `_.shuffle`.
	 *
	 * @private
	 * @param {Array|Object} collection The collection to shuffle.
	 * @returns {Array} Returns the new shuffled array.
	 */
	function baseShuffle(collection) {
	  return shuffleSelf(values(collection));
	}

	_baseShuffle = baseShuffle;
	return _baseShuffle;
}

var shuffle_1;
var hasRequiredShuffle;

function requireShuffle () {
	if (hasRequiredShuffle) return shuffle_1;
	hasRequiredShuffle = 1;
	var arrayShuffle = require_arrayShuffle(),
	    baseShuffle = require_baseShuffle(),
	    isArray = requireIsArray();

	/**
	 * Creates an array of shuffled values, using a version of the
	 * [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher-Yates_shuffle).
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Collection
	 * @param {Array|Object} collection The collection to shuffle.
	 * @returns {Array} Returns the new shuffled array.
	 * @example
	 *
	 * _.shuffle([1, 2, 3, 4]);
	 * // => [4, 1, 3, 2]
	 */
	function shuffle(collection) {
	  var func = isArray(collection) ? arrayShuffle : baseShuffle;
	  return func(collection);
	}

	shuffle_1 = shuffle;
	return shuffle_1;
}

var shuffleExports = requireShuffle();
var shuffle = /*@__PURE__*/getDefaultExportFromCjs(shuffleExports);

var nodemailer$1 = {};

var shared = {exports: {}};

var fetch = {exports: {}};

var cookies;
var hasRequiredCookies;

function requireCookies () {
	if (hasRequiredCookies) return cookies;
	hasRequiredCookies = 1;

	// module to handle cookies

	const urllib = require$$0$5;

	const SESSION_TIMEOUT = 1800; // 30 min

	/**
	 * Creates a biskviit cookie jar for managing cookie values in memory
	 *
	 * @constructor
	 * @param {Object} [options] Optional options object
	 */
	class Cookies {
	    constructor(options) {
	        this.options = options || {};
	        this.cookies = [];
	    }

	    /**
	     * Stores a cookie string to the cookie storage
	     *
	     * @param {String} cookieStr Value from the 'Set-Cookie:' header
	     * @param {String} url Current URL
	     */
	    set(cookieStr, url) {
	        let urlparts = urllib.parse(url || '');
	        let cookie = this.parse(cookieStr);
	        let domain;

	        if (cookie.domain) {
	            domain = cookie.domain.replace(/^\./, '');

	            // do not allow cross origin cookies
	            if (
	                // can't be valid if the requested domain is shorter than current hostname
	                urlparts.hostname.length < domain.length ||
	                // prefix domains with dot to be sure that partial matches are not used
	                ('.' + urlparts.hostname).substr(-domain.length + 1) !== '.' + domain
	            ) {
	                cookie.domain = urlparts.hostname;
	            }
	        } else {
	            cookie.domain = urlparts.hostname;
	        }

	        if (!cookie.path) {
	            cookie.path = this.getPath(urlparts.pathname);
	        }

	        // if no expire date, then use sessionTimeout value
	        if (!cookie.expires) {
	            cookie.expires = new Date(Date.now() + (Number(this.options.sessionTimeout || SESSION_TIMEOUT) || SESSION_TIMEOUT) * 1000);
	        }

	        return this.add(cookie);
	    }

	    /**
	     * Returns cookie string for the 'Cookie:' header.
	     *
	     * @param {String} url URL to check for
	     * @returns {String} Cookie header or empty string if no matches were found
	     */
	    get(url) {
	        return this.list(url)
	            .map(cookie => cookie.name + '=' + cookie.value)
	            .join('; ');
	    }

	    /**
	     * Lists all valied cookie objects for the specified URL
	     *
	     * @param {String} url URL to check for
	     * @returns {Array} An array of cookie objects
	     */
	    list(url) {
	        let result = [];
	        let i;
	        let cookie;

	        for (i = this.cookies.length - 1; i >= 0; i--) {
	            cookie = this.cookies[i];

	            if (this.isExpired(cookie)) {
	                this.cookies.splice(i, i);
	                continue;
	            }

	            if (this.match(cookie, url)) {
	                result.unshift(cookie);
	            }
	        }

	        return result;
	    }

	    /**
	     * Parses cookie string from the 'Set-Cookie:' header
	     *
	     * @param {String} cookieStr String from the 'Set-Cookie:' header
	     * @returns {Object} Cookie object
	     */
	    parse(cookieStr) {
	        let cookie = {};

	        (cookieStr || '')
	            .toString()
	            .split(';')
	            .forEach(cookiePart => {
	                let valueParts = cookiePart.split('=');
	                let key = valueParts.shift().trim().toLowerCase();
	                let value = valueParts.join('=').trim();
	                let domain;

	                if (!key) {
	                    // skip empty parts
	                    return;
	                }

	                switch (key) {
	                    case 'expires':
	                        value = new Date(value);
	                        // ignore date if can not parse it
	                        if (value.toString() !== 'Invalid Date') {
	                            cookie.expires = value;
	                        }
	                        break;

	                    case 'path':
	                        cookie.path = value;
	                        break;

	                    case 'domain':
	                        domain = value.toLowerCase();
	                        if (domain.length && domain.charAt(0) !== '.') {
	                            domain = '.' + domain; // ensure preceeding dot for user set domains
	                        }
	                        cookie.domain = domain;
	                        break;

	                    case 'max-age':
	                        cookie.expires = new Date(Date.now() + (Number(value) || 0) * 1000);
	                        break;

	                    case 'secure':
	                        cookie.secure = true;
	                        break;

	                    case 'httponly':
	                        cookie.httponly = true;
	                        break;

	                    default:
	                        if (!cookie.name) {
	                            cookie.name = key;
	                            cookie.value = value;
	                        }
	                }
	            });

	        return cookie;
	    }

	    /**
	     * Checks if a cookie object is valid for a specified URL
	     *
	     * @param {Object} cookie Cookie object
	     * @param {String} url URL to check for
	     * @returns {Boolean} true if cookie is valid for specifiec URL
	     */
	    match(cookie, url) {
	        let urlparts = urllib.parse(url || '');

	        // check if hostname matches
	        // .foo.com also matches subdomains, foo.com does not
	        if (
	            urlparts.hostname !== cookie.domain &&
	            (cookie.domain.charAt(0) !== '.' || ('.' + urlparts.hostname).substr(-cookie.domain.length) !== cookie.domain)
	        ) {
	            return false;
	        }

	        // check if path matches
	        let path = this.getPath(urlparts.pathname);
	        if (path.substr(0, cookie.path.length) !== cookie.path) {
	            return false;
	        }

	        // check secure argument
	        if (cookie.secure && urlparts.protocol !== 'https:') {
	            return false;
	        }

	        return true;
	    }

	    /**
	     * Adds (or updates/removes if needed) a cookie object to the cookie storage
	     *
	     * @param {Object} cookie Cookie value to be stored
	     */
	    add(cookie) {
	        let i;
	        let len;

	        // nothing to do here
	        if (!cookie || !cookie.name) {
	            return false;
	        }

	        // overwrite if has same params
	        for (i = 0, len = this.cookies.length; i < len; i++) {
	            if (this.compare(this.cookies[i], cookie)) {
	                // check if the cookie needs to be removed instead
	                if (this.isExpired(cookie)) {
	                    this.cookies.splice(i, 1); // remove expired/unset cookie
	                    return false;
	                }

	                this.cookies[i] = cookie;
	                return true;
	            }
	        }

	        // add as new if not already expired
	        if (!this.isExpired(cookie)) {
	            this.cookies.push(cookie);
	        }

	        return true;
	    }

	    /**
	     * Checks if two cookie objects are the same
	     *
	     * @param {Object} a Cookie to check against
	     * @param {Object} b Cookie to check against
	     * @returns {Boolean} True, if the cookies are the same
	     */
	    compare(a, b) {
	        return a.name === b.name && a.path === b.path && a.domain === b.domain && a.secure === b.secure && a.httponly === a.httponly;
	    }

	    /**
	     * Checks if a cookie is expired
	     *
	     * @param {Object} cookie Cookie object to check against
	     * @returns {Boolean} True, if the cookie is expired
	     */
	    isExpired(cookie) {
	        return (cookie.expires && cookie.expires < new Date()) || !cookie.value;
	    }

	    /**
	     * Returns normalized cookie path for an URL path argument
	     *
	     * @param {String} pathname
	     * @returns {String} Normalized path
	     */
	    getPath(pathname) {
	        let path = (pathname || '/').split('/');
	        path.pop(); // remove filename part
	        path = path.join('/').trim();

	        // ensure path prefix /
	        if (path.charAt(0) !== '/') {
	            path = '/' + path;
	        }

	        // ensure path suffix /
	        if (path.substr(-1) !== '/') {
	            path += '/';
	        }

	        return path;
	    }
	}

	cookies = Cookies;
	return cookies;
}

var name = "nodemailer";
var version = "6.9.7";
var description = "Easy as cake e-mail sending from your Node.js applications";
var main = "lib/nodemailer.js";
var scripts = {
	test: "grunt --trace-warnings",
	update: "rm -rf node_modules/ package-lock.json && ncu -u && npm install"
};
var repository = {
	type: "git",
	url: "https://github.com/nodemailer/nodemailer.git"
};
var keywords = [
	"Nodemailer"
];
var author = "Andris Reinman";
var license = "MIT-0";
var bugs = {
	url: "https://github.com/nodemailer/nodemailer/issues"
};
var homepage = "https://nodemailer.com/";
var devDependencies = {
	"@aws-sdk/client-ses": "3.433.0",
	"aws-sdk": "2.1478.0",
	bunyan: "1.8.15",
	chai: "4.3.10",
	"eslint-config-nodemailer": "1.2.0",
	"eslint-config-prettier": "9.0.0",
	grunt: "1.6.1",
	"grunt-cli": "1.4.3",
	"grunt-eslint": "24.3.0",
	"grunt-mocha-test": "0.13.3",
	libbase64: "1.2.1",
	libmime: "5.2.1",
	libqp: "2.0.1",
	mocha: "10.2.0",
	"nodemailer-ntlm-auth": "1.0.4",
	proxy: "1.0.2",
	"proxy-test-server": "1.0.0",
	sinon: "17.0.0",
	"smtp-server": "3.13.0"
};
var engines = {
	node: ">=6.0.0"
};
var require$$9 = {
	name: name,
	version: version,
	description: description,
	main: main,
	scripts: scripts,
	repository: repository,
	keywords: keywords,
	author: author,
	license: license,
	bugs: bugs,
	homepage: homepage,
	devDependencies: devDependencies,
	engines: engines
};

var hasRequiredFetch;

function requireFetch () {
	if (hasRequiredFetch) return fetch.exports;
	hasRequiredFetch = 1;

	const http = require$$2;
	const https = require$$1;
	const urllib = require$$0$5;
	const zlib = require$$0$1;
	const PassThrough = require$$0$3.PassThrough;
	const Cookies = requireCookies();
	const packageData = require$$9;
	const net = require$$3;

	const MAX_REDIRECTS = 5;

	fetch.exports = function (url, options) {
	    return nmfetch(url, options);
	};

	fetch.exports.Cookies = Cookies;

	function nmfetch(url, options) {
	    options = options || {};

	    options.fetchRes = options.fetchRes || new PassThrough();
	    options.cookies = options.cookies || new Cookies();
	    options.redirects = options.redirects || 0;
	    options.maxRedirects = isNaN(options.maxRedirects) ? MAX_REDIRECTS : options.maxRedirects;

	    if (options.cookie) {
	        [].concat(options.cookie || []).forEach(cookie => {
	            options.cookies.set(cookie, url);
	        });
	        options.cookie = false;
	    }

	    let fetchRes = options.fetchRes;
	    let parsed = urllib.parse(url);
	    let method = (options.method || '').toString().trim().toUpperCase() || 'GET';
	    let finished = false;
	    let cookies;
	    let body;

	    let handler = parsed.protocol === 'https:' ? https : http;

	    let headers = {
	        'accept-encoding': 'gzip,deflate',
	        'user-agent': 'nodemailer/' + packageData.version
	    };

	    Object.keys(options.headers || {}).forEach(key => {
	        headers[key.toLowerCase().trim()] = options.headers[key];
	    });

	    if (options.userAgent) {
	        headers['user-agent'] = options.userAgent;
	    }

	    if (parsed.auth) {
	        headers.Authorization = 'Basic ' + Buffer.from(parsed.auth).toString('base64');
	    }

	    if ((cookies = options.cookies.get(url))) {
	        headers.cookie = cookies;
	    }

	    if (options.body) {
	        if (options.contentType !== false) {
	            headers['Content-Type'] = options.contentType || 'application/x-www-form-urlencoded';
	        }

	        if (typeof options.body.pipe === 'function') {
	            // it's a stream
	            headers['Transfer-Encoding'] = 'chunked';
	            body = options.body;
	            body.on('error', err => {
	                if (finished) {
	                    return;
	                }
	                finished = true;
	                err.type = 'FETCH';
	                err.sourceUrl = url;
	                fetchRes.emit('error', err);
	            });
	        } else {
	            if (options.body instanceof Buffer) {
	                body = options.body;
	            } else if (typeof options.body === 'object') {
	                try {
	                    // encodeURIComponent can fail on invalid input (partial emoji etc.)
	                    body = Buffer.from(
	                        Object.keys(options.body)
	                            .map(key => {
	                                let value = options.body[key].toString().trim();
	                                return encodeURIComponent(key) + '=' + encodeURIComponent(value);
	                            })
	                            .join('&')
	                    );
	                } catch (E) {
	                    if (finished) {
	                        return;
	                    }
	                    finished = true;
	                    E.type = 'FETCH';
	                    E.sourceUrl = url;
	                    fetchRes.emit('error', E);
	                    return;
	                }
	            } else {
	                body = Buffer.from(options.body.toString().trim());
	            }

	            headers['Content-Type'] = options.contentType || 'application/x-www-form-urlencoded';
	            headers['Content-Length'] = body.length;
	        }
	        // if method is not provided, use POST instead of GET
	        method = (options.method || '').toString().trim().toUpperCase() || 'POST';
	    }

	    let req;
	    let reqOptions = {
	        method,
	        host: parsed.hostname,
	        path: parsed.path,
	        port: parsed.port ? parsed.port : parsed.protocol === 'https:' ? 443 : 80,
	        headers,
	        rejectUnauthorized: false,
	        agent: false
	    };

	    if (options.tls) {
	        Object.keys(options.tls).forEach(key => {
	            reqOptions[key] = options.tls[key];
	        });
	    }

	    if (parsed.protocol === 'https:' && parsed.hostname && parsed.hostname !== reqOptions.host && !net.isIP(parsed.hostname) && !reqOptions.servername) {
	        reqOptions.servername = parsed.hostname;
	    }

	    try {
	        req = handler.request(reqOptions);
	    } catch (E) {
	        finished = true;
	        setImmediate(() => {
	            E.type = 'FETCH';
	            E.sourceUrl = url;
	            fetchRes.emit('error', E);
	        });
	        return fetchRes;
	    }

	    if (options.timeout) {
	        req.setTimeout(options.timeout, () => {
	            if (finished) {
	                return;
	            }
	            finished = true;
	            req.abort();
	            let err = new Error('Request Timeout');
	            err.type = 'FETCH';
	            err.sourceUrl = url;
	            fetchRes.emit('error', err);
	        });
	    }

	    req.on('error', err => {
	        if (finished) {
	            return;
	        }
	        finished = true;
	        err.type = 'FETCH';
	        err.sourceUrl = url;
	        fetchRes.emit('error', err);
	    });

	    req.on('response', res => {
	        let inflate;

	        if (finished) {
	            return;
	        }

	        switch (res.headers['content-encoding']) {
	            case 'gzip':
	            case 'deflate':
	                inflate = zlib.createUnzip();
	                break;
	        }

	        if (res.headers['set-cookie']) {
	            [].concat(res.headers['set-cookie'] || []).forEach(cookie => {
	                options.cookies.set(cookie, url);
	            });
	        }

	        if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
	            // redirect
	            options.redirects++;
	            if (options.redirects > options.maxRedirects) {
	                finished = true;
	                let err = new Error('Maximum redirect count exceeded');
	                err.type = 'FETCH';
	                err.sourceUrl = url;
	                fetchRes.emit('error', err);
	                req.abort();
	                return;
	            }
	            // redirect does not include POST body
	            options.method = 'GET';
	            options.body = false;
	            return nmfetch(urllib.resolve(url, res.headers.location), options);
	        }

	        fetchRes.statusCode = res.statusCode;
	        fetchRes.headers = res.headers;

	        if (res.statusCode >= 300 && !options.allowErrorResponse) {
	            finished = true;
	            let err = new Error('Invalid status code ' + res.statusCode);
	            err.type = 'FETCH';
	            err.sourceUrl = url;
	            fetchRes.emit('error', err);
	            req.abort();
	            return;
	        }

	        res.on('error', err => {
	            if (finished) {
	                return;
	            }
	            finished = true;
	            err.type = 'FETCH';
	            err.sourceUrl = url;
	            fetchRes.emit('error', err);
	            req.abort();
	        });

	        if (inflate) {
	            res.pipe(inflate).pipe(fetchRes);
	            inflate.on('error', err => {
	                if (finished) {
	                    return;
	                }
	                finished = true;
	                err.type = 'FETCH';
	                err.sourceUrl = url;
	                fetchRes.emit('error', err);
	                req.abort();
	            });
	        } else {
	            res.pipe(fetchRes);
	        }
	    });

	    setImmediate(() => {
	        if (body) {
	            try {
	                if (typeof body.pipe === 'function') {
	                    return body.pipe(req);
	                } else {
	                    req.write(body);
	                }
	            } catch (err) {
	                finished = true;
	                err.type = 'FETCH';
	                err.sourceUrl = url;
	                fetchRes.emit('error', err);
	                return;
	            }
	        }
	        req.end();
	    });

	    return fetchRes;
	}
	return fetch.exports;
}

/* eslint no-console: 0 */

var hasRequiredShared;

function requireShared () {
	if (hasRequiredShared) return shared.exports;
	hasRequiredShared = 1;
	(function (module) {

		const urllib = require$$0$5;
		const util = require$$1$1;
		const fs = require$$2$1;
		const nmfetch = requireFetch();
		const dns = require$$4$1;
		const net = require$$3;
		const os = require$$6;

		const DNS_TTL = 5 * 60 * 1000;

		let networkInterfaces;
		try {
		    networkInterfaces = os.networkInterfaces();
		} catch (err) {
		    // fails on some systems
		}

		module.exports.networkInterfaces = networkInterfaces;

		const isFamilySupported = (family, allowInternal) => {
		    let networkInterfaces = module.exports.networkInterfaces;
		    if (!networkInterfaces) {
		        // hope for the best
		        return true;
		    }

		    const familySupported =
		        // crux that replaces Object.values(networkInterfaces) as Object.values is not supported in nodejs v6
		        Object.keys(networkInterfaces)
		            .map(key => networkInterfaces[key])
		            // crux that replaces .flat() as it is not supported in older Node versions (v10 and older)
		            .reduce((acc, val) => acc.concat(val), [])
		            .filter(i => !i.internal || allowInternal)
		            .filter(i => i.family === 'IPv' + family || i.family === family).length > 0;

		    return familySupported;
		};

		const resolver = (family, hostname, options, callback) => {
		    options = options || {};
		    const familySupported = isFamilySupported(family, options.allowInternalNetworkInterfaces);

		    if (!familySupported) {
		        return callback(null, []);
		    }

		    const resolver = dns.Resolver ? new dns.Resolver(options) : dns;
		    resolver['resolve' + family](hostname, (err, addresses) => {
		        if (err) {
		            switch (err.code) {
		                case dns.NODATA:
		                case dns.NOTFOUND:
		                case dns.NOTIMP:
		                case dns.SERVFAIL:
		                case dns.CONNREFUSED:
		                case dns.REFUSED:
		                case 'EAI_AGAIN':
		                    return callback(null, []);
		            }
		            return callback(err);
		        }
		        return callback(null, Array.isArray(addresses) ? addresses : [].concat(addresses || []));
		    });
		};

		const dnsCache = (module.exports.dnsCache = new Map());

		const formatDNSValue = (value, extra) => {
		    if (!value) {
		        return Object.assign({}, extra || {});
		    }

		    return Object.assign(
		        {
		            servername: value.servername,
		            host:
		                !value.addresses || !value.addresses.length
		                    ? null
		                    : value.addresses.length === 1
		                    ? value.addresses[0]
		                    : value.addresses[Math.floor(Math.random() * value.addresses.length)]
		        },
		        extra || {}
		    );
		};

		module.exports.resolveHostname = (options, callback) => {
		    options = options || {};

		    if (!options.host && options.servername) {
		        options.host = options.servername;
		    }

		    if (!options.host || net.isIP(options.host)) {
		        // nothing to do here
		        let value = {
		            addresses: [options.host],
		            servername: options.servername || false
		        };
		        return callback(
		            null,
		            formatDNSValue(value, {
		                cached: false
		            })
		        );
		    }

		    let cached;
		    if (dnsCache.has(options.host)) {
		        cached = dnsCache.get(options.host);

		        if (!cached.expires || cached.expires >= Date.now()) {
		            return callback(
		                null,
		                formatDNSValue(cached.value, {
		                    cached: true
		                })
		            );
		        }
		    }

		    resolver(4, options.host, options, (err, addresses) => {
		        if (err) {
		            if (cached) {
		                // ignore error, use expired value
		                return callback(
		                    null,
		                    formatDNSValue(cached.value, {
		                        cached: true,
		                        error: err
		                    })
		                );
		            }
		            return callback(err);
		        }

		        if (addresses && addresses.length) {
		            let value = {
		                addresses,
		                servername: options.servername || options.host
		            };

		            dnsCache.set(options.host, {
		                value,
		                expires: Date.now() + (options.dnsTtl || DNS_TTL)
		            });

		            return callback(
		                null,
		                formatDNSValue(value, {
		                    cached: false
		                })
		            );
		        }

		        resolver(6, options.host, options, (err, addresses) => {
		            if (err) {
		                if (cached) {
		                    // ignore error, use expired value
		                    return callback(
		                        null,
		                        formatDNSValue(cached.value, {
		                            cached: true,
		                            error: err
		                        })
		                    );
		                }
		                return callback(err);
		            }

		            if (addresses && addresses.length) {
		                let value = {
		                    addresses,
		                    servername: options.servername || options.host
		                };

		                dnsCache.set(options.host, {
		                    value,
		                    expires: Date.now() + (options.dnsTtl || DNS_TTL)
		                });

		                return callback(
		                    null,
		                    formatDNSValue(value, {
		                        cached: false
		                    })
		                );
		            }

		            try {
		                dns.lookup(options.host, { all: true }, (err, addresses) => {
		                    if (err) {
		                        if (cached) {
		                            // ignore error, use expired value
		                            return callback(
		                                null,
		                                formatDNSValue(cached.value, {
		                                    cached: true,
		                                    error: err
		                                })
		                            );
		                        }
		                        return callback(err);
		                    }

		                    let address = addresses
		                        ? addresses
		                              .filter(addr => isFamilySupported(addr.family))
		                              .map(addr => addr.address)
		                              .shift()
		                        : false;

		                    if (addresses && addresses.length && !address) {
		                        // there are addresses but none can be used
		                        console.warn(`Failed to resolve IPv${addresses[0].family} addresses with current network`);
		                    }

		                    if (!address && cached) {
		                        // nothing was found, fallback to cached value
		                        return callback(
		                            null,
		                            formatDNSValue(cached.value, {
		                                cached: true
		                            })
		                        );
		                    }

		                    let value = {
		                        addresses: address ? [address] : [options.host],
		                        servername: options.servername || options.host
		                    };

		                    dnsCache.set(options.host, {
		                        value,
		                        expires: Date.now() + (options.dnsTtl || DNS_TTL)
		                    });

		                    return callback(
		                        null,
		                        formatDNSValue(value, {
		                            cached: false
		                        })
		                    );
		                });
		            } catch (err) {
		                if (cached) {
		                    // ignore error, use expired value
		                    return callback(
		                        null,
		                        formatDNSValue(cached.value, {
		                            cached: true,
		                            error: err
		                        })
		                    );
		                }
		                return callback(err);
		            }
		        });
		    });
		};
		/**
		 * Parses connection url to a structured configuration object
		 *
		 * @param {String} str Connection url
		 * @return {Object} Configuration object
		 */
		module.exports.parseConnectionUrl = str => {
		    str = str || '';
		    let options = {};

		    [urllib.parse(str, true)].forEach(url => {
		        let auth;

		        switch (url.protocol) {
		            case 'smtp:':
		                options.secure = false;
		                break;
		            case 'smtps:':
		                options.secure = true;
		                break;
		            case 'direct:':
		                options.direct = true;
		                break;
		        }

		        if (!isNaN(url.port) && Number(url.port)) {
		            options.port = Number(url.port);
		        }

		        if (url.hostname) {
		            options.host = url.hostname;
		        }

		        if (url.auth) {
		            auth = url.auth.split(':');

		            if (!options.auth) {
		                options.auth = {};
		            }

		            options.auth.user = auth.shift();
		            options.auth.pass = auth.join(':');
		        }

		        Object.keys(url.query || {}).forEach(key => {
		            let obj = options;
		            let lKey = key;
		            let value = url.query[key];

		            if (!isNaN(value)) {
		                value = Number(value);
		            }

		            switch (value) {
		                case 'true':
		                    value = true;
		                    break;
		                case 'false':
		                    value = false;
		                    break;
		            }

		            // tls is nested object
		            if (key.indexOf('tls.') === 0) {
		                lKey = key.substr(4);
		                if (!options.tls) {
		                    options.tls = {};
		                }
		                obj = options.tls;
		            } else if (key.indexOf('.') >= 0) {
		                // ignore nested properties besides tls
		                return;
		            }

		            if (!(lKey in obj)) {
		                obj[lKey] = value;
		            }
		        });
		    });

		    return options;
		};

		module.exports._logFunc = (logger, level, defaults, data, message, ...args) => {
		    let entry = {};

		    Object.keys(defaults || {}).forEach(key => {
		        if (key !== 'level') {
		            entry[key] = defaults[key];
		        }
		    });

		    Object.keys(data || {}).forEach(key => {
		        if (key !== 'level') {
		            entry[key] = data[key];
		        }
		    });

		    logger[level](entry, message, ...args);
		};

		/**
		 * Returns a bunyan-compatible logger interface. Uses either provided logger or
		 * creates a default console logger
		 *
		 * @param {Object} [options] Options object that might include 'logger' value
		 * @return {Object} bunyan compatible logger
		 */
		module.exports.getLogger = (options, defaults) => {
		    options = options || {};

		    let response = {};
		    let levels = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];

		    if (!options.logger) {
		        // use vanity logger
		        levels.forEach(level => {
		            response[level] = () => false;
		        });
		        return response;
		    }

		    let logger = options.logger;

		    if (options.logger === true) {
		        // create console logger
		        logger = createDefaultLogger(levels);
		    }

		    levels.forEach(level => {
		        response[level] = (data, message, ...args) => {
		            module.exports._logFunc(logger, level, defaults, data, message, ...args);
		        };
		    });

		    return response;
		};

		/**
		 * Wrapper for creating a callback that either resolves or rejects a promise
		 * based on input
		 *
		 * @param {Function} resolve Function to run if callback is called
		 * @param {Function} reject Function to run if callback ends with an error
		 */
		module.exports.callbackPromise = (resolve, reject) =>
		    function () {
		        let args = Array.from(arguments);
		        let err = args.shift();
		        if (err) {
		            reject(err);
		        } else {
		            resolve(...args);
		        }
		    };

		/**
		 * Resolves a String or a Buffer value for content value. Useful if the value
		 * is a Stream or a file or an URL. If the value is a Stream, overwrites
		 * the stream object with the resolved value (you can't stream a value twice).
		 *
		 * This is useful when you want to create a plugin that needs a content value,
		 * for example the `html` or `text` value as a String or a Buffer but not as
		 * a file path or an URL.
		 *
		 * @param {Object} data An object or an Array you want to resolve an element for
		 * @param {String|Number} key Property name or an Array index
		 * @param {Function} callback Callback function with (err, value)
		 */
		module.exports.resolveContent = (data, key, callback) => {
		    let promise;

		    if (!callback) {
		        promise = new Promise((resolve, reject) => {
		            callback = module.exports.callbackPromise(resolve, reject);
		        });
		    }

		    let content = (data && data[key] && data[key].content) || data[key];
		    let contentStream;
		    let encoding = ((typeof data[key] === 'object' && data[key].encoding) || 'utf8')
		        .toString()
		        .toLowerCase()
		        .replace(/[-_\s]/g, '');

		    if (!content) {
		        return callback(null, content);
		    }

		    if (typeof content === 'object') {
		        if (typeof content.pipe === 'function') {
		            return resolveStream(content, (err, value) => {
		                if (err) {
		                    return callback(err);
		                }
		                // we can't stream twice the same content, so we need
		                // to replace the stream object with the streaming result
		                if (data[key].content) {
		                    data[key].content = value;
		                } else {
		                    data[key] = value;
		                }
		                callback(null, value);
		            });
		        } else if (/^https?:\/\//i.test(content.path || content.href)) {
		            contentStream = nmfetch(content.path || content.href);
		            return resolveStream(contentStream, callback);
		        } else if (/^data:/i.test(content.path || content.href)) {
		            let parts = (content.path || content.href).match(/^data:((?:[^;]*;)*(?:[^,]*)),(.*)$/i);
		            if (!parts) {
		                return callback(null, Buffer.from(0));
		            }
		            return callback(null, /\bbase64$/i.test(parts[1]) ? Buffer.from(parts[2], 'base64') : Buffer.from(decodeURIComponent(parts[2])));
		        } else if (content.path) {
		            return resolveStream(fs.createReadStream(content.path), callback);
		        }
		    }

		    if (typeof data[key].content === 'string' && !['utf8', 'usascii', 'ascii'].includes(encoding)) {
		        content = Buffer.from(data[key].content, encoding);
		    }

		    // default action, return as is
		    setImmediate(() => callback(null, content));

		    return promise;
		};

		/**
		 * Copies properties from source objects to target objects
		 */
		module.exports.assign = function (/* target, ... sources */) {
		    let args = Array.from(arguments);
		    let target = args.shift() || {};

		    args.forEach(source => {
		        Object.keys(source || {}).forEach(key => {
		            if (['tls', 'auth'].includes(key) && source[key] && typeof source[key] === 'object') {
		                // tls and auth are special keys that need to be enumerated separately
		                // other objects are passed as is
		                if (!target[key]) {
		                    // ensure that target has this key
		                    target[key] = {};
		                }
		                Object.keys(source[key]).forEach(subKey => {
		                    target[key][subKey] = source[key][subKey];
		                });
		            } else {
		                target[key] = source[key];
		            }
		        });
		    });
		    return target;
		};

		module.exports.encodeXText = str => {
		    // ! 0x21
		    // + 0x2B
		    // = 0x3D
		    // ~ 0x7E
		    if (!/[^\x21-\x2A\x2C-\x3C\x3E-\x7E]/.test(str)) {
		        return str;
		    }
		    let buf = Buffer.from(str);
		    let result = '';
		    for (let i = 0, len = buf.length; i < len; i++) {
		        let c = buf[i];
		        if (c < 0x21 || c > 0x7e || c === 0x2b || c === 0x3d) {
		            result += '+' + (c < 0x10 ? '0' : '') + c.toString(16).toUpperCase();
		        } else {
		            result += String.fromCharCode(c);
		        }
		    }
		    return result;
		};

		/**
		 * Streams a stream value into a Buffer
		 *
		 * @param {Object} stream Readable stream
		 * @param {Function} callback Callback function with (err, value)
		 */
		function resolveStream(stream, callback) {
		    let responded = false;
		    let chunks = [];
		    let chunklen = 0;

		    stream.on('error', err => {
		        if (responded) {
		            return;
		        }

		        responded = true;
		        callback(err);
		    });

		    stream.on('readable', () => {
		        let chunk;
		        while ((chunk = stream.read()) !== null) {
		            chunks.push(chunk);
		            chunklen += chunk.length;
		        }
		    });

		    stream.on('end', () => {
		        if (responded) {
		            return;
		        }
		        responded = true;

		        let value;

		        try {
		            value = Buffer.concat(chunks, chunklen);
		        } catch (E) {
		            return callback(E);
		        }
		        callback(null, value);
		    });
		}

		/**
		 * Generates a bunyan-like logger that prints to console
		 *
		 * @returns {Object} Bunyan logger instance
		 */
		function createDefaultLogger(levels) {
		    let levelMaxLen = 0;
		    let levelNames = new Map();
		    levels.forEach(level => {
		        if (level.length > levelMaxLen) {
		            levelMaxLen = level.length;
		        }
		    });

		    levels.forEach(level => {
		        let levelName = level.toUpperCase();
		        if (levelName.length < levelMaxLen) {
		            levelName += ' '.repeat(levelMaxLen - levelName.length);
		        }
		        levelNames.set(level, levelName);
		    });

		    let print = (level, entry, message, ...args) => {
		        let prefix = '';
		        if (entry) {
		            if (entry.tnx === 'server') {
		                prefix = 'S: ';
		            } else if (entry.tnx === 'client') {
		                prefix = 'C: ';
		            }

		            if (entry.sid) {
		                prefix = '[' + entry.sid + '] ' + prefix;
		            }

		            if (entry.cid) {
		                prefix = '[#' + entry.cid + '] ' + prefix;
		            }
		        }

		        message = util.format(message, ...args);
		        message.split(/\r?\n/).forEach(line => {
		            console.log('[%s] %s %s', new Date().toISOString().substr(0, 19).replace(/T/, ' '), levelNames.get(level), prefix + line);
		        });
		    };

		    let logger = {};
		    levels.forEach(level => {
		        logger[level] = print.bind(null, level);
		    });

		    return logger;
		} 
	} (shared));
	return shared.exports;
}

/* eslint quote-props: 0 */

var mimeTypes_1;
var hasRequiredMimeTypes;

function requireMimeTypes () {
	if (hasRequiredMimeTypes) return mimeTypes_1;
	hasRequiredMimeTypes = 1;

	const path = require$$0$6;

	const defaultMimeType = 'application/octet-stream';
	const defaultExtension = 'bin';

	const mimeTypes = new Map([
	    ['application/acad', 'dwg'],
	    ['application/applixware', 'aw'],
	    ['application/arj', 'arj'],
	    ['application/atom+xml', 'xml'],
	    ['application/atomcat+xml', 'atomcat'],
	    ['application/atomsvc+xml', 'atomsvc'],
	    ['application/base64', ['mm', 'mme']],
	    ['application/binhex', 'hqx'],
	    ['application/binhex4', 'hqx'],
	    ['application/book', ['book', 'boo']],
	    ['application/ccxml+xml,', 'ccxml'],
	    ['application/cdf', 'cdf'],
	    ['application/cdmi-capability', 'cdmia'],
	    ['application/cdmi-container', 'cdmic'],
	    ['application/cdmi-domain', 'cdmid'],
	    ['application/cdmi-object', 'cdmio'],
	    ['application/cdmi-queue', 'cdmiq'],
	    ['application/clariscad', 'ccad'],
	    ['application/commonground', 'dp'],
	    ['application/cu-seeme', 'cu'],
	    ['application/davmount+xml', 'davmount'],
	    ['application/drafting', 'drw'],
	    ['application/dsptype', 'tsp'],
	    ['application/dssc+der', 'dssc'],
	    ['application/dssc+xml', 'xdssc'],
	    ['application/dxf', 'dxf'],
	    ['application/ecmascript', ['js', 'es']],
	    ['application/emma+xml', 'emma'],
	    ['application/envoy', 'evy'],
	    ['application/epub+zip', 'epub'],
	    ['application/excel', ['xls', 'xl', 'xla', 'xlb', 'xlc', 'xld', 'xlk', 'xll', 'xlm', 'xlt', 'xlv', 'xlw']],
	    ['application/exi', 'exi'],
	    ['application/font-tdpfr', 'pfr'],
	    ['application/fractals', 'fif'],
	    ['application/freeloader', 'frl'],
	    ['application/futuresplash', 'spl'],
	    ['application/gnutar', 'tgz'],
	    ['application/groupwise', 'vew'],
	    ['application/hlp', 'hlp'],
	    ['application/hta', 'hta'],
	    ['application/hyperstudio', 'stk'],
	    ['application/i-deas', 'unv'],
	    ['application/iges', ['iges', 'igs']],
	    ['application/inf', 'inf'],
	    ['application/internet-property-stream', 'acx'],
	    ['application/ipfix', 'ipfix'],
	    ['application/java', 'class'],
	    ['application/java-archive', 'jar'],
	    ['application/java-byte-code', 'class'],
	    ['application/java-serialized-object', 'ser'],
	    ['application/java-vm', 'class'],
	    ['application/javascript', 'js'],
	    ['application/json', 'json'],
	    ['application/lha', 'lha'],
	    ['application/lzx', 'lzx'],
	    ['application/mac-binary', 'bin'],
	    ['application/mac-binhex', 'hqx'],
	    ['application/mac-binhex40', 'hqx'],
	    ['application/mac-compactpro', 'cpt'],
	    ['application/macbinary', 'bin'],
	    ['application/mads+xml', 'mads'],
	    ['application/marc', 'mrc'],
	    ['application/marcxml+xml', 'mrcx'],
	    ['application/mathematica', 'ma'],
	    ['application/mathml+xml', 'mathml'],
	    ['application/mbedlet', 'mbd'],
	    ['application/mbox', 'mbox'],
	    ['application/mcad', 'mcd'],
	    ['application/mediaservercontrol+xml', 'mscml'],
	    ['application/metalink4+xml', 'meta4'],
	    ['application/mets+xml', 'mets'],
	    ['application/mime', 'aps'],
	    ['application/mods+xml', 'mods'],
	    ['application/mp21', 'm21'],
	    ['application/mp4', 'mp4'],
	    ['application/mspowerpoint', ['ppt', 'pot', 'pps', 'ppz']],
	    ['application/msword', ['doc', 'dot', 'w6w', 'wiz', 'word']],
	    ['application/mswrite', 'wri'],
	    ['application/mxf', 'mxf'],
	    ['application/netmc', 'mcp'],
	    ['application/octet-stream', ['*']],
	    ['application/oda', 'oda'],
	    ['application/oebps-package+xml', 'opf'],
	    ['application/ogg', 'ogx'],
	    ['application/olescript', 'axs'],
	    ['application/onenote', 'onetoc'],
	    ['application/patch-ops-error+xml', 'xer'],
	    ['application/pdf', 'pdf'],
	    ['application/pgp-encrypted', 'asc'],
	    ['application/pgp-signature', 'pgp'],
	    ['application/pics-rules', 'prf'],
	    ['application/pkcs-12', 'p12'],
	    ['application/pkcs-crl', 'crl'],
	    ['application/pkcs10', 'p10'],
	    ['application/pkcs7-mime', ['p7c', 'p7m']],
	    ['application/pkcs7-signature', 'p7s'],
	    ['application/pkcs8', 'p8'],
	    ['application/pkix-attr-cert', 'ac'],
	    ['application/pkix-cert', ['cer', 'crt']],
	    ['application/pkix-crl', 'crl'],
	    ['application/pkix-pkipath', 'pkipath'],
	    ['application/pkixcmp', 'pki'],
	    ['application/plain', 'text'],
	    ['application/pls+xml', 'pls'],
	    ['application/postscript', ['ps', 'ai', 'eps']],
	    ['application/powerpoint', 'ppt'],
	    ['application/pro_eng', ['part', 'prt']],
	    ['application/prs.cww', 'cww'],
	    ['application/pskc+xml', 'pskcxml'],
	    ['application/rdf+xml', 'rdf'],
	    ['application/reginfo+xml', 'rif'],
	    ['application/relax-ng-compact-syntax', 'rnc'],
	    ['application/resource-lists+xml', 'rl'],
	    ['application/resource-lists-diff+xml', 'rld'],
	    ['application/ringing-tones', 'rng'],
	    ['application/rls-services+xml', 'rs'],
	    ['application/rsd+xml', 'rsd'],
	    ['application/rss+xml', 'xml'],
	    ['application/rtf', ['rtf', 'rtx']],
	    ['application/sbml+xml', 'sbml'],
	    ['application/scvp-cv-request', 'scq'],
	    ['application/scvp-cv-response', 'scs'],
	    ['application/scvp-vp-request', 'spq'],
	    ['application/scvp-vp-response', 'spp'],
	    ['application/sdp', 'sdp'],
	    ['application/sea', 'sea'],
	    ['application/set', 'set'],
	    ['application/set-payment-initiation', 'setpay'],
	    ['application/set-registration-initiation', 'setreg'],
	    ['application/shf+xml', 'shf'],
	    ['application/sla', 'stl'],
	    ['application/smil', ['smi', 'smil']],
	    ['application/smil+xml', 'smi'],
	    ['application/solids', 'sol'],
	    ['application/sounder', 'sdr'],
	    ['application/sparql-query', 'rq'],
	    ['application/sparql-results+xml', 'srx'],
	    ['application/srgs', 'gram'],
	    ['application/srgs+xml', 'grxml'],
	    ['application/sru+xml', 'sru'],
	    ['application/ssml+xml', 'ssml'],
	    ['application/step', ['step', 'stp']],
	    ['application/streamingmedia', 'ssm'],
	    ['application/tei+xml', 'tei'],
	    ['application/thraud+xml', 'tfi'],
	    ['application/timestamped-data', 'tsd'],
	    ['application/toolbook', 'tbk'],
	    ['application/vda', 'vda'],
	    ['application/vnd.3gpp.pic-bw-large', 'plb'],
	    ['application/vnd.3gpp.pic-bw-small', 'psb'],
	    ['application/vnd.3gpp.pic-bw-var', 'pvb'],
	    ['application/vnd.3gpp2.tcap', 'tcap'],
	    ['application/vnd.3m.post-it-notes', 'pwn'],
	    ['application/vnd.accpac.simply.aso', 'aso'],
	    ['application/vnd.accpac.simply.imp', 'imp'],
	    ['application/vnd.acucobol', 'acu'],
	    ['application/vnd.acucorp', 'atc'],
	    ['application/vnd.adobe.air-application-installer-package+zip', 'air'],
	    ['application/vnd.adobe.fxp', 'fxp'],
	    ['application/vnd.adobe.xdp+xml', 'xdp'],
	    ['application/vnd.adobe.xfdf', 'xfdf'],
	    ['application/vnd.ahead.space', 'ahead'],
	    ['application/vnd.airzip.filesecure.azf', 'azf'],
	    ['application/vnd.airzip.filesecure.azs', 'azs'],
	    ['application/vnd.amazon.ebook', 'azw'],
	    ['application/vnd.americandynamics.acc', 'acc'],
	    ['application/vnd.amiga.ami', 'ami'],
	    ['application/vnd.android.package-archive', 'apk'],
	    ['application/vnd.anser-web-certificate-issue-initiation', 'cii'],
	    ['application/vnd.anser-web-funds-transfer-initiation', 'fti'],
	    ['application/vnd.antix.game-component', 'atx'],
	    ['application/vnd.apple.installer+xml', 'mpkg'],
	    ['application/vnd.apple.mpegurl', 'm3u8'],
	    ['application/vnd.aristanetworks.swi', 'swi'],
	    ['application/vnd.audiograph', 'aep'],
	    ['application/vnd.blueice.multipass', 'mpm'],
	    ['application/vnd.bmi', 'bmi'],
	    ['application/vnd.businessobjects', 'rep'],
	    ['application/vnd.chemdraw+xml', 'cdxml'],
	    ['application/vnd.chipnuts.karaoke-mmd', 'mmd'],
	    ['application/vnd.cinderella', 'cdy'],
	    ['application/vnd.claymore', 'cla'],
	    ['application/vnd.cloanto.rp9', 'rp9'],
	    ['application/vnd.clonk.c4group', 'c4g'],
	    ['application/vnd.cluetrust.cartomobile-config', 'c11amc'],
	    ['application/vnd.cluetrust.cartomobile-config-pkg', 'c11amz'],
	    ['application/vnd.commonspace', 'csp'],
	    ['application/vnd.contact.cmsg', 'cdbcmsg'],
	    ['application/vnd.cosmocaller', 'cmc'],
	    ['application/vnd.crick.clicker', 'clkx'],
	    ['application/vnd.crick.clicker.keyboard', 'clkk'],
	    ['application/vnd.crick.clicker.palette', 'clkp'],
	    ['application/vnd.crick.clicker.template', 'clkt'],
	    ['application/vnd.crick.clicker.wordbank', 'clkw'],
	    ['application/vnd.criticaltools.wbs+xml', 'wbs'],
	    ['application/vnd.ctc-posml', 'pml'],
	    ['application/vnd.cups-ppd', 'ppd'],
	    ['application/vnd.curl.car', 'car'],
	    ['application/vnd.curl.pcurl', 'pcurl'],
	    ['application/vnd.data-vision.rdz', 'rdz'],
	    ['application/vnd.denovo.fcselayout-link', 'fe_launch'],
	    ['application/vnd.dna', 'dna'],
	    ['application/vnd.dolby.mlp', 'mlp'],
	    ['application/vnd.dpgraph', 'dpg'],
	    ['application/vnd.dreamfactory', 'dfac'],
	    ['application/vnd.dvb.ait', 'ait'],
	    ['application/vnd.dvb.service', 'svc'],
	    ['application/vnd.dynageo', 'geo'],
	    ['application/vnd.ecowin.chart', 'mag'],
	    ['application/vnd.enliven', 'nml'],
	    ['application/vnd.epson.esf', 'esf'],
	    ['application/vnd.epson.msf', 'msf'],
	    ['application/vnd.epson.quickanime', 'qam'],
	    ['application/vnd.epson.salt', 'slt'],
	    ['application/vnd.epson.ssf', 'ssf'],
	    ['application/vnd.eszigno3+xml', 'es3'],
	    ['application/vnd.ezpix-album', 'ez2'],
	    ['application/vnd.ezpix-package', 'ez3'],
	    ['application/vnd.fdf', 'fdf'],
	    ['application/vnd.fdsn.seed', 'seed'],
	    ['application/vnd.flographit', 'gph'],
	    ['application/vnd.fluxtime.clip', 'ftc'],
	    ['application/vnd.framemaker', 'fm'],
	    ['application/vnd.frogans.fnc', 'fnc'],
	    ['application/vnd.frogans.ltf', 'ltf'],
	    ['application/vnd.fsc.weblaunch', 'fsc'],
	    ['application/vnd.fujitsu.oasys', 'oas'],
	    ['application/vnd.fujitsu.oasys2', 'oa2'],
	    ['application/vnd.fujitsu.oasys3', 'oa3'],
	    ['application/vnd.fujitsu.oasysgp', 'fg5'],
	    ['application/vnd.fujitsu.oasysprs', 'bh2'],
	    ['application/vnd.fujixerox.ddd', 'ddd'],
	    ['application/vnd.fujixerox.docuworks', 'xdw'],
	    ['application/vnd.fujixerox.docuworks.binder', 'xbd'],
	    ['application/vnd.fuzzysheet', 'fzs'],
	    ['application/vnd.genomatix.tuxedo', 'txd'],
	    ['application/vnd.geogebra.file', 'ggb'],
	    ['application/vnd.geogebra.tool', 'ggt'],
	    ['application/vnd.geometry-explorer', 'gex'],
	    ['application/vnd.geonext', 'gxt'],
	    ['application/vnd.geoplan', 'g2w'],
	    ['application/vnd.geospace', 'g3w'],
	    ['application/vnd.gmx', 'gmx'],
	    ['application/vnd.google-earth.kml+xml', 'kml'],
	    ['application/vnd.google-earth.kmz', 'kmz'],
	    ['application/vnd.grafeq', 'gqf'],
	    ['application/vnd.groove-account', 'gac'],
	    ['application/vnd.groove-help', 'ghf'],
	    ['application/vnd.groove-identity-message', 'gim'],
	    ['application/vnd.groove-injector', 'grv'],
	    ['application/vnd.groove-tool-message', 'gtm'],
	    ['application/vnd.groove-tool-template', 'tpl'],
	    ['application/vnd.groove-vcard', 'vcg'],
	    ['application/vnd.hal+xml', 'hal'],
	    ['application/vnd.handheld-entertainment+xml', 'zmm'],
	    ['application/vnd.hbci', 'hbci'],
	    ['application/vnd.hhe.lesson-player', 'les'],
	    ['application/vnd.hp-hpgl', ['hgl', 'hpg', 'hpgl']],
	    ['application/vnd.hp-hpid', 'hpid'],
	    ['application/vnd.hp-hps', 'hps'],
	    ['application/vnd.hp-jlyt', 'jlt'],
	    ['application/vnd.hp-pcl', 'pcl'],
	    ['application/vnd.hp-pclxl', 'pclxl'],
	    ['application/vnd.hydrostatix.sof-data', 'sfd-hdstx'],
	    ['application/vnd.hzn-3d-crossword', 'x3d'],
	    ['application/vnd.ibm.minipay', 'mpy'],
	    ['application/vnd.ibm.modcap', 'afp'],
	    ['application/vnd.ibm.rights-management', 'irm'],
	    ['application/vnd.ibm.secure-container', 'sc'],
	    ['application/vnd.iccprofile', 'icc'],
	    ['application/vnd.igloader', 'igl'],
	    ['application/vnd.immervision-ivp', 'ivp'],
	    ['application/vnd.immervision-ivu', 'ivu'],
	    ['application/vnd.insors.igm', 'igm'],
	    ['application/vnd.intercon.formnet', 'xpw'],
	    ['application/vnd.intergeo', 'i2g'],
	    ['application/vnd.intu.qbo', 'qbo'],
	    ['application/vnd.intu.qfx', 'qfx'],
	    ['application/vnd.ipunplugged.rcprofile', 'rcprofile'],
	    ['application/vnd.irepository.package+xml', 'irp'],
	    ['application/vnd.is-xpr', 'xpr'],
	    ['application/vnd.isac.fcs', 'fcs'],
	    ['application/vnd.jam', 'jam'],
	    ['application/vnd.jcp.javame.midlet-rms', 'rms'],
	    ['application/vnd.jisp', 'jisp'],
	    ['application/vnd.joost.joda-archive', 'joda'],
	    ['application/vnd.kahootz', 'ktz'],
	    ['application/vnd.kde.karbon', 'karbon'],
	    ['application/vnd.kde.kchart', 'chrt'],
	    ['application/vnd.kde.kformula', 'kfo'],
	    ['application/vnd.kde.kivio', 'flw'],
	    ['application/vnd.kde.kontour', 'kon'],
	    ['application/vnd.kde.kpresenter', 'kpr'],
	    ['application/vnd.kde.kspread', 'ksp'],
	    ['application/vnd.kde.kword', 'kwd'],
	    ['application/vnd.kenameaapp', 'htke'],
	    ['application/vnd.kidspiration', 'kia'],
	    ['application/vnd.kinar', 'kne'],
	    ['application/vnd.koan', 'skp'],
	    ['application/vnd.kodak-descriptor', 'sse'],
	    ['application/vnd.las.las+xml', 'lasxml'],
	    ['application/vnd.llamagraphics.life-balance.desktop', 'lbd'],
	    ['application/vnd.llamagraphics.life-balance.exchange+xml', 'lbe'],
	    ['application/vnd.lotus-1-2-3', '123'],
	    ['application/vnd.lotus-approach', 'apr'],
	    ['application/vnd.lotus-freelance', 'pre'],
	    ['application/vnd.lotus-notes', 'nsf'],
	    ['application/vnd.lotus-organizer', 'org'],
	    ['application/vnd.lotus-screencam', 'scm'],
	    ['application/vnd.lotus-wordpro', 'lwp'],
	    ['application/vnd.macports.portpkg', 'portpkg'],
	    ['application/vnd.mcd', 'mcd'],
	    ['application/vnd.medcalcdata', 'mc1'],
	    ['application/vnd.mediastation.cdkey', 'cdkey'],
	    ['application/vnd.mfer', 'mwf'],
	    ['application/vnd.mfmp', 'mfm'],
	    ['application/vnd.micrografx.flo', 'flo'],
	    ['application/vnd.micrografx.igx', 'igx'],
	    ['application/vnd.mif', 'mif'],
	    ['application/vnd.mobius.daf', 'daf'],
	    ['application/vnd.mobius.dis', 'dis'],
	    ['application/vnd.mobius.mbk', 'mbk'],
	    ['application/vnd.mobius.mqy', 'mqy'],
	    ['application/vnd.mobius.msl', 'msl'],
	    ['application/vnd.mobius.plc', 'plc'],
	    ['application/vnd.mobius.txf', 'txf'],
	    ['application/vnd.mophun.application', 'mpn'],
	    ['application/vnd.mophun.certificate', 'mpc'],
	    ['application/vnd.mozilla.xul+xml', 'xul'],
	    ['application/vnd.ms-artgalry', 'cil'],
	    ['application/vnd.ms-cab-compressed', 'cab'],
	    ['application/vnd.ms-excel', ['xls', 'xla', 'xlc', 'xlm', 'xlt', 'xlw', 'xlb', 'xll']],
	    ['application/vnd.ms-excel.addin.macroenabled.12', 'xlam'],
	    ['application/vnd.ms-excel.sheet.binary.macroenabled.12', 'xlsb'],
	    ['application/vnd.ms-excel.sheet.macroenabled.12', 'xlsm'],
	    ['application/vnd.ms-excel.template.macroenabled.12', 'xltm'],
	    ['application/vnd.ms-fontobject', 'eot'],
	    ['application/vnd.ms-htmlhelp', 'chm'],
	    ['application/vnd.ms-ims', 'ims'],
	    ['application/vnd.ms-lrm', 'lrm'],
	    ['application/vnd.ms-officetheme', 'thmx'],
	    ['application/vnd.ms-outlook', 'msg'],
	    ['application/vnd.ms-pki.certstore', 'sst'],
	    ['application/vnd.ms-pki.pko', 'pko'],
	    ['application/vnd.ms-pki.seccat', 'cat'],
	    ['application/vnd.ms-pki.stl', 'stl'],
	    ['application/vnd.ms-pkicertstore', 'sst'],
	    ['application/vnd.ms-pkiseccat', 'cat'],
	    ['application/vnd.ms-pkistl', 'stl'],
	    ['application/vnd.ms-powerpoint', ['ppt', 'pot', 'pps', 'ppa', 'pwz']],
	    ['application/vnd.ms-powerpoint.addin.macroenabled.12', 'ppam'],
	    ['application/vnd.ms-powerpoint.presentation.macroenabled.12', 'pptm'],
	    ['application/vnd.ms-powerpoint.slide.macroenabled.12', 'sldm'],
	    ['application/vnd.ms-powerpoint.slideshow.macroenabled.12', 'ppsm'],
	    ['application/vnd.ms-powerpoint.template.macroenabled.12', 'potm'],
	    ['application/vnd.ms-project', 'mpp'],
	    ['application/vnd.ms-word.document.macroenabled.12', 'docm'],
	    ['application/vnd.ms-word.template.macroenabled.12', 'dotm'],
	    ['application/vnd.ms-works', ['wks', 'wcm', 'wdb', 'wps']],
	    ['application/vnd.ms-wpl', 'wpl'],
	    ['application/vnd.ms-xpsdocument', 'xps'],
	    ['application/vnd.mseq', 'mseq'],
	    ['application/vnd.musician', 'mus'],
	    ['application/vnd.muvee.style', 'msty'],
	    ['application/vnd.neurolanguage.nlu', 'nlu'],
	    ['application/vnd.noblenet-directory', 'nnd'],
	    ['application/vnd.noblenet-sealer', 'nns'],
	    ['application/vnd.noblenet-web', 'nnw'],
	    ['application/vnd.nokia.configuration-message', 'ncm'],
	    ['application/vnd.nokia.n-gage.data', 'ngdat'],
	    ['application/vnd.nokia.n-gage.symbian.install', 'n-gage'],
	    ['application/vnd.nokia.radio-preset', 'rpst'],
	    ['application/vnd.nokia.radio-presets', 'rpss'],
	    ['application/vnd.nokia.ringing-tone', 'rng'],
	    ['application/vnd.novadigm.edm', 'edm'],
	    ['application/vnd.novadigm.edx', 'edx'],
	    ['application/vnd.novadigm.ext', 'ext'],
	    ['application/vnd.oasis.opendocument.chart', 'odc'],
	    ['application/vnd.oasis.opendocument.chart-template', 'otc'],
	    ['application/vnd.oasis.opendocument.database', 'odb'],
	    ['application/vnd.oasis.opendocument.formula', 'odf'],
	    ['application/vnd.oasis.opendocument.formula-template', 'odft'],
	    ['application/vnd.oasis.opendocument.graphics', 'odg'],
	    ['application/vnd.oasis.opendocument.graphics-template', 'otg'],
	    ['application/vnd.oasis.opendocument.image', 'odi'],
	    ['application/vnd.oasis.opendocument.image-template', 'oti'],
	    ['application/vnd.oasis.opendocument.presentation', 'odp'],
	    ['application/vnd.oasis.opendocument.presentation-template', 'otp'],
	    ['application/vnd.oasis.opendocument.spreadsheet', 'ods'],
	    ['application/vnd.oasis.opendocument.spreadsheet-template', 'ots'],
	    ['application/vnd.oasis.opendocument.text', 'odt'],
	    ['application/vnd.oasis.opendocument.text-master', 'odm'],
	    ['application/vnd.oasis.opendocument.text-template', 'ott'],
	    ['application/vnd.oasis.opendocument.text-web', 'oth'],
	    ['application/vnd.olpc-sugar', 'xo'],
	    ['application/vnd.oma.dd2+xml', 'dd2'],
	    ['application/vnd.openofficeorg.extension', 'oxt'],
	    ['application/vnd.openxmlformats-officedocument.presentationml.presentation', 'pptx'],
	    ['application/vnd.openxmlformats-officedocument.presentationml.slide', 'sldx'],
	    ['application/vnd.openxmlformats-officedocument.presentationml.slideshow', 'ppsx'],
	    ['application/vnd.openxmlformats-officedocument.presentationml.template', 'potx'],
	    ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'xlsx'],
	    ['application/vnd.openxmlformats-officedocument.spreadsheetml.template', 'xltx'],
	    ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'docx'],
	    ['application/vnd.openxmlformats-officedocument.wordprocessingml.template', 'dotx'],
	    ['application/vnd.osgeo.mapguide.package', 'mgp'],
	    ['application/vnd.osgi.dp', 'dp'],
	    ['application/vnd.palm', 'pdb'],
	    ['application/vnd.pawaafile', 'paw'],
	    ['application/vnd.pg.format', 'str'],
	    ['application/vnd.pg.osasli', 'ei6'],
	    ['application/vnd.picsel', 'efif'],
	    ['application/vnd.pmi.widget', 'wg'],
	    ['application/vnd.pocketlearn', 'plf'],
	    ['application/vnd.powerbuilder6', 'pbd'],
	    ['application/vnd.previewsystems.box', 'box'],
	    ['application/vnd.proteus.magazine', 'mgz'],
	    ['application/vnd.publishare-delta-tree', 'qps'],
	    ['application/vnd.pvi.ptid1', 'ptid'],
	    ['application/vnd.quark.quarkxpress', 'qxd'],
	    ['application/vnd.realvnc.bed', 'bed'],
	    ['application/vnd.recordare.musicxml', 'mxl'],
	    ['application/vnd.recordare.musicxml+xml', 'musicxml'],
	    ['application/vnd.rig.cryptonote', 'cryptonote'],
	    ['application/vnd.rim.cod', 'cod'],
	    ['application/vnd.rn-realmedia', 'rm'],
	    ['application/vnd.rn-realplayer', 'rnx'],
	    ['application/vnd.route66.link66+xml', 'link66'],
	    ['application/vnd.sailingtracker.track', 'st'],
	    ['application/vnd.seemail', 'see'],
	    ['application/vnd.sema', 'sema'],
	    ['application/vnd.semd', 'semd'],
	    ['application/vnd.semf', 'semf'],
	    ['application/vnd.shana.informed.formdata', 'ifm'],
	    ['application/vnd.shana.informed.formtemplate', 'itp'],
	    ['application/vnd.shana.informed.interchange', 'iif'],
	    ['application/vnd.shana.informed.package', 'ipk'],
	    ['application/vnd.simtech-mindmapper', 'twd'],
	    ['application/vnd.smaf', 'mmf'],
	    ['application/vnd.smart.teacher', 'teacher'],
	    ['application/vnd.solent.sdkm+xml', 'sdkm'],
	    ['application/vnd.spotfire.dxp', 'dxp'],
	    ['application/vnd.spotfire.sfs', 'sfs'],
	    ['application/vnd.stardivision.calc', 'sdc'],
	    ['application/vnd.stardivision.draw', 'sda'],
	    ['application/vnd.stardivision.impress', 'sdd'],
	    ['application/vnd.stardivision.math', 'smf'],
	    ['application/vnd.stardivision.writer', 'sdw'],
	    ['application/vnd.stardivision.writer-global', 'sgl'],
	    ['application/vnd.stepmania.stepchart', 'sm'],
	    ['application/vnd.sun.xml.calc', 'sxc'],
	    ['application/vnd.sun.xml.calc.template', 'stc'],
	    ['application/vnd.sun.xml.draw', 'sxd'],
	    ['application/vnd.sun.xml.draw.template', 'std'],
	    ['application/vnd.sun.xml.impress', 'sxi'],
	    ['application/vnd.sun.xml.impress.template', 'sti'],
	    ['application/vnd.sun.xml.math', 'sxm'],
	    ['application/vnd.sun.xml.writer', 'sxw'],
	    ['application/vnd.sun.xml.writer.global', 'sxg'],
	    ['application/vnd.sun.xml.writer.template', 'stw'],
	    ['application/vnd.sus-calendar', 'sus'],
	    ['application/vnd.svd', 'svd'],
	    ['application/vnd.symbian.install', 'sis'],
	    ['application/vnd.syncml+xml', 'xsm'],
	    ['application/vnd.syncml.dm+wbxml', 'bdm'],
	    ['application/vnd.syncml.dm+xml', 'xdm'],
	    ['application/vnd.tao.intent-module-archive', 'tao'],
	    ['application/vnd.tmobile-livetv', 'tmo'],
	    ['application/vnd.trid.tpt', 'tpt'],
	    ['application/vnd.triscape.mxs', 'mxs'],
	    ['application/vnd.trueapp', 'tra'],
	    ['application/vnd.ufdl', 'ufd'],
	    ['application/vnd.uiq.theme', 'utz'],
	    ['application/vnd.umajin', 'umj'],
	    ['application/vnd.unity', 'unityweb'],
	    ['application/vnd.uoml+xml', 'uoml'],
	    ['application/vnd.vcx', 'vcx'],
	    ['application/vnd.visio', 'vsd'],
	    ['application/vnd.visionary', 'vis'],
	    ['application/vnd.vsf', 'vsf'],
	    ['application/vnd.wap.wbxml', 'wbxml'],
	    ['application/vnd.wap.wmlc', 'wmlc'],
	    ['application/vnd.wap.wmlscriptc', 'wmlsc'],
	    ['application/vnd.webturbo', 'wtb'],
	    ['application/vnd.wolfram.player', 'nbp'],
	    ['application/vnd.wordperfect', 'wpd'],
	    ['application/vnd.wqd', 'wqd'],
	    ['application/vnd.wt.stf', 'stf'],
	    ['application/vnd.xara', ['web', 'xar']],
	    ['application/vnd.xfdl', 'xfdl'],
	    ['application/vnd.yamaha.hv-dic', 'hvd'],
	    ['application/vnd.yamaha.hv-script', 'hvs'],
	    ['application/vnd.yamaha.hv-voice', 'hvp'],
	    ['application/vnd.yamaha.openscoreformat', 'osf'],
	    ['application/vnd.yamaha.openscoreformat.osfpvg+xml', 'osfpvg'],
	    ['application/vnd.yamaha.smaf-audio', 'saf'],
	    ['application/vnd.yamaha.smaf-phrase', 'spf'],
	    ['application/vnd.yellowriver-custom-menu', 'cmp'],
	    ['application/vnd.zul', 'zir'],
	    ['application/vnd.zzazz.deck+xml', 'zaz'],
	    ['application/vocaltec-media-desc', 'vmd'],
	    ['application/vocaltec-media-file', 'vmf'],
	    ['application/voicexml+xml', 'vxml'],
	    ['application/widget', 'wgt'],
	    ['application/winhlp', 'hlp'],
	    ['application/wordperfect', ['wp', 'wp5', 'wp6', 'wpd']],
	    ['application/wordperfect6.0', ['w60', 'wp5']],
	    ['application/wordperfect6.1', 'w61'],
	    ['application/wsdl+xml', 'wsdl'],
	    ['application/wspolicy+xml', 'wspolicy'],
	    ['application/x-123', 'wk1'],
	    ['application/x-7z-compressed', '7z'],
	    ['application/x-abiword', 'abw'],
	    ['application/x-ace-compressed', 'ace'],
	    ['application/x-aim', 'aim'],
	    ['application/x-authorware-bin', 'aab'],
	    ['application/x-authorware-map', 'aam'],
	    ['application/x-authorware-seg', 'aas'],
	    ['application/x-bcpio', 'bcpio'],
	    ['application/x-binary', 'bin'],
	    ['application/x-binhex40', 'hqx'],
	    ['application/x-bittorrent', 'torrent'],
	    ['application/x-bsh', ['bsh', 'sh', 'shar']],
	    ['application/x-bytecode.elisp', 'elc'],
	    ['application/x-bytecode.python', 'pyc'],
	    ['application/x-bzip', 'bz'],
	    ['application/x-bzip2', ['boz', 'bz2']],
	    ['application/x-cdf', 'cdf'],
	    ['application/x-cdlink', 'vcd'],
	    ['application/x-chat', ['cha', 'chat']],
	    ['application/x-chess-pgn', 'pgn'],
	    ['application/x-cmu-raster', 'ras'],
	    ['application/x-cocoa', 'cco'],
	    ['application/x-compactpro', 'cpt'],
	    ['application/x-compress', 'z'],
	    ['application/x-compressed', ['tgz', 'gz', 'z', 'zip']],
	    ['application/x-conference', 'nsc'],
	    ['application/x-cpio', 'cpio'],
	    ['application/x-cpt', 'cpt'],
	    ['application/x-csh', 'csh'],
	    ['application/x-debian-package', 'deb'],
	    ['application/x-deepv', 'deepv'],
	    ['application/x-director', ['dir', 'dcr', 'dxr']],
	    ['application/x-doom', 'wad'],
	    ['application/x-dtbncx+xml', 'ncx'],
	    ['application/x-dtbook+xml', 'dtb'],
	    ['application/x-dtbresource+xml', 'res'],
	    ['application/x-dvi', 'dvi'],
	    ['application/x-elc', 'elc'],
	    ['application/x-envoy', ['env', 'evy']],
	    ['application/x-esrehber', 'es'],
	    ['application/x-excel', ['xls', 'xla', 'xlb', 'xlc', 'xld', 'xlk', 'xll', 'xlm', 'xlt', 'xlv', 'xlw']],
	    ['application/x-font-bdf', 'bdf'],
	    ['application/x-font-ghostscript', 'gsf'],
	    ['application/x-font-linux-psf', 'psf'],
	    ['application/x-font-otf', 'otf'],
	    ['application/x-font-pcf', 'pcf'],
	    ['application/x-font-snf', 'snf'],
	    ['application/x-font-ttf', 'ttf'],
	    ['application/x-font-type1', 'pfa'],
	    ['application/x-font-woff', 'woff'],
	    ['application/x-frame', 'mif'],
	    ['application/x-freelance', 'pre'],
	    ['application/x-futuresplash', 'spl'],
	    ['application/x-gnumeric', 'gnumeric'],
	    ['application/x-gsp', 'gsp'],
	    ['application/x-gss', 'gss'],
	    ['application/x-gtar', 'gtar'],
	    ['application/x-gzip', ['gz', 'gzip']],
	    ['application/x-hdf', 'hdf'],
	    ['application/x-helpfile', ['help', 'hlp']],
	    ['application/x-httpd-imap', 'imap'],
	    ['application/x-ima', 'ima'],
	    ['application/x-internet-signup', ['ins', 'isp']],
	    ['application/x-internett-signup', 'ins'],
	    ['application/x-inventor', 'iv'],
	    ['application/x-ip2', 'ip'],
	    ['application/x-iphone', 'iii'],
	    ['application/x-java-class', 'class'],
	    ['application/x-java-commerce', 'jcm'],
	    ['application/x-java-jnlp-file', 'jnlp'],
	    ['application/x-javascript', 'js'],
	    ['application/x-koan', ['skd', 'skm', 'skp', 'skt']],
	    ['application/x-ksh', 'ksh'],
	    ['application/x-latex', ['latex', 'ltx']],
	    ['application/x-lha', 'lha'],
	    ['application/x-lisp', 'lsp'],
	    ['application/x-livescreen', 'ivy'],
	    ['application/x-lotus', 'wq1'],
	    ['application/x-lotusscreencam', 'scm'],
	    ['application/x-lzh', 'lzh'],
	    ['application/x-lzx', 'lzx'],
	    ['application/x-mac-binhex40', 'hqx'],
	    ['application/x-macbinary', 'bin'],
	    ['application/x-magic-cap-package-1.0', 'mc$'],
	    ['application/x-mathcad', 'mcd'],
	    ['application/x-meme', 'mm'],
	    ['application/x-midi', ['mid', 'midi']],
	    ['application/x-mif', 'mif'],
	    ['application/x-mix-transfer', 'nix'],
	    ['application/x-mobipocket-ebook', 'prc'],
	    ['application/x-mplayer2', 'asx'],
	    ['application/x-ms-application', 'application'],
	    ['application/x-ms-wmd', 'wmd'],
	    ['application/x-ms-wmz', 'wmz'],
	    ['application/x-ms-xbap', 'xbap'],
	    ['application/x-msaccess', 'mdb'],
	    ['application/x-msbinder', 'obd'],
	    ['application/x-mscardfile', 'crd'],
	    ['application/x-msclip', 'clp'],
	    ['application/x-msdownload', ['exe', 'dll']],
	    ['application/x-msexcel', ['xls', 'xla', 'xlw']],
	    ['application/x-msmediaview', ['mvb', 'm13', 'm14']],
	    ['application/x-msmetafile', 'wmf'],
	    ['application/x-msmoney', 'mny'],
	    ['application/x-mspowerpoint', 'ppt'],
	    ['application/x-mspublisher', 'pub'],
	    ['application/x-msschedule', 'scd'],
	    ['application/x-msterminal', 'trm'],
	    ['application/x-mswrite', 'wri'],
	    ['application/x-navi-animation', 'ani'],
	    ['application/x-navidoc', 'nvd'],
	    ['application/x-navimap', 'map'],
	    ['application/x-navistyle', 'stl'],
	    ['application/x-netcdf', ['cdf', 'nc']],
	    ['application/x-newton-compatible-pkg', 'pkg'],
	    ['application/x-nokia-9000-communicator-add-on-software', 'aos'],
	    ['application/x-omc', 'omc'],
	    ['application/x-omcdatamaker', 'omcd'],
	    ['application/x-omcregerator', 'omcr'],
	    ['application/x-pagemaker', ['pm4', 'pm5']],
	    ['application/x-pcl', 'pcl'],
	    ['application/x-perfmon', ['pma', 'pmc', 'pml', 'pmr', 'pmw']],
	    ['application/x-pixclscript', 'plx'],
	    ['application/x-pkcs10', 'p10'],
	    ['application/x-pkcs12', ['p12', 'pfx']],
	    ['application/x-pkcs7-certificates', ['p7b', 'spc']],
	    ['application/x-pkcs7-certreqresp', 'p7r'],
	    ['application/x-pkcs7-mime', ['p7m', 'p7c']],
	    ['application/x-pkcs7-signature', ['p7s', 'p7a']],
	    ['application/x-pointplus', 'css'],
	    ['application/x-portable-anymap', 'pnm'],
	    ['application/x-project', ['mpc', 'mpt', 'mpv', 'mpx']],
	    ['application/x-qpro', 'wb1'],
	    ['application/x-rar-compressed', 'rar'],
	    ['application/x-rtf', 'rtf'],
	    ['application/x-sdp', 'sdp'],
	    ['application/x-sea', 'sea'],
	    ['application/x-seelogo', 'sl'],
	    ['application/x-sh', 'sh'],
	    ['application/x-shar', ['shar', 'sh']],
	    ['application/x-shockwave-flash', 'swf'],
	    ['application/x-silverlight-app', 'xap'],
	    ['application/x-sit', 'sit'],
	    ['application/x-sprite', ['spr', 'sprite']],
	    ['application/x-stuffit', 'sit'],
	    ['application/x-stuffitx', 'sitx'],
	    ['application/x-sv4cpio', 'sv4cpio'],
	    ['application/x-sv4crc', 'sv4crc'],
	    ['application/x-tar', 'tar'],
	    ['application/x-tbook', ['sbk', 'tbk']],
	    ['application/x-tcl', 'tcl'],
	    ['application/x-tex', 'tex'],
	    ['application/x-tex-tfm', 'tfm'],
	    ['application/x-texinfo', ['texi', 'texinfo']],
	    ['application/x-troff', ['roff', 't', 'tr']],
	    ['application/x-troff-man', 'man'],
	    ['application/x-troff-me', 'me'],
	    ['application/x-troff-ms', 'ms'],
	    ['application/x-troff-msvideo', 'avi'],
	    ['application/x-ustar', 'ustar'],
	    ['application/x-visio', ['vsd', 'vst', 'vsw']],
	    ['application/x-vnd.audioexplosion.mzz', 'mzz'],
	    ['application/x-vnd.ls-xpix', 'xpix'],
	    ['application/x-vrml', 'vrml'],
	    ['application/x-wais-source', ['src', 'wsrc']],
	    ['application/x-winhelp', 'hlp'],
	    ['application/x-wintalk', 'wtk'],
	    ['application/x-world', ['wrl', 'svr']],
	    ['application/x-wpwin', 'wpd'],
	    ['application/x-wri', 'wri'],
	    ['application/x-x509-ca-cert', ['cer', 'crt', 'der']],
	    ['application/x-x509-user-cert', 'crt'],
	    ['application/x-xfig', 'fig'],
	    ['application/x-xpinstall', 'xpi'],
	    ['application/x-zip-compressed', 'zip'],
	    ['application/xcap-diff+xml', 'xdf'],
	    ['application/xenc+xml', 'xenc'],
	    ['application/xhtml+xml', 'xhtml'],
	    ['application/xml', 'xml'],
	    ['application/xml-dtd', 'dtd'],
	    ['application/xop+xml', 'xop'],
	    ['application/xslt+xml', 'xslt'],
	    ['application/xspf+xml', 'xspf'],
	    ['application/xv+xml', 'mxml'],
	    ['application/yang', 'yang'],
	    ['application/yin+xml', 'yin'],
	    ['application/ynd.ms-pkipko', 'pko'],
	    ['application/zip', 'zip'],
	    ['audio/adpcm', 'adp'],
	    ['audio/aiff', ['aiff', 'aif', 'aifc']],
	    ['audio/basic', ['snd', 'au']],
	    ['audio/it', 'it'],
	    ['audio/make', ['funk', 'my', 'pfunk']],
	    ['audio/make.my.funk', 'pfunk'],
	    ['audio/mid', ['mid', 'rmi']],
	    ['audio/midi', ['midi', 'kar', 'mid']],
	    ['audio/mod', 'mod'],
	    ['audio/mp4', 'mp4a'],
	    ['audio/mpeg', ['mpga', 'mp3', 'm2a', 'mp2', 'mpa', 'mpg']],
	    ['audio/mpeg3', 'mp3'],
	    ['audio/nspaudio', ['la', 'lma']],
	    ['audio/ogg', 'oga'],
	    ['audio/s3m', 's3m'],
	    ['audio/tsp-audio', 'tsi'],
	    ['audio/tsplayer', 'tsp'],
	    ['audio/vnd.dece.audio', 'uva'],
	    ['audio/vnd.digital-winds', 'eol'],
	    ['audio/vnd.dra', 'dra'],
	    ['audio/vnd.dts', 'dts'],
	    ['audio/vnd.dts.hd', 'dtshd'],
	    ['audio/vnd.lucent.voice', 'lvp'],
	    ['audio/vnd.ms-playready.media.pya', 'pya'],
	    ['audio/vnd.nuera.ecelp4800', 'ecelp4800'],
	    ['audio/vnd.nuera.ecelp7470', 'ecelp7470'],
	    ['audio/vnd.nuera.ecelp9600', 'ecelp9600'],
	    ['audio/vnd.qcelp', 'qcp'],
	    ['audio/vnd.rip', 'rip'],
	    ['audio/voc', 'voc'],
	    ['audio/voxware', 'vox'],
	    ['audio/wav', 'wav'],
	    ['audio/webm', 'weba'],
	    ['audio/x-aac', 'aac'],
	    ['audio/x-adpcm', 'snd'],
	    ['audio/x-aiff', ['aiff', 'aif', 'aifc']],
	    ['audio/x-au', 'au'],
	    ['audio/x-gsm', ['gsd', 'gsm']],
	    ['audio/x-jam', 'jam'],
	    ['audio/x-liveaudio', 'lam'],
	    ['audio/x-mid', ['mid', 'midi']],
	    ['audio/x-midi', ['midi', 'mid']],
	    ['audio/x-mod', 'mod'],
	    ['audio/x-mpeg', 'mp2'],
	    ['audio/x-mpeg-3', 'mp3'],
	    ['audio/x-mpegurl', 'm3u'],
	    ['audio/x-mpequrl', 'm3u'],
	    ['audio/x-ms-wax', 'wax'],
	    ['audio/x-ms-wma', 'wma'],
	    ['audio/x-nspaudio', ['la', 'lma']],
	    ['audio/x-pn-realaudio', ['ra', 'ram', 'rm', 'rmm', 'rmp']],
	    ['audio/x-pn-realaudio-plugin', ['ra', 'rmp', 'rpm']],
	    ['audio/x-psid', 'sid'],
	    ['audio/x-realaudio', 'ra'],
	    ['audio/x-twinvq', 'vqf'],
	    ['audio/x-twinvq-plugin', ['vqe', 'vql']],
	    ['audio/x-vnd.audioexplosion.mjuicemediafile', 'mjf'],
	    ['audio/x-voc', 'voc'],
	    ['audio/x-wav', 'wav'],
	    ['audio/xm', 'xm'],
	    ['chemical/x-cdx', 'cdx'],
	    ['chemical/x-cif', 'cif'],
	    ['chemical/x-cmdf', 'cmdf'],
	    ['chemical/x-cml', 'cml'],
	    ['chemical/x-csml', 'csml'],
	    ['chemical/x-pdb', ['pdb', 'xyz']],
	    ['chemical/x-xyz', 'xyz'],
	    ['drawing/x-dwf', 'dwf'],
	    ['i-world/i-vrml', 'ivr'],
	    ['image/bmp', ['bmp', 'bm']],
	    ['image/cgm', 'cgm'],
	    ['image/cis-cod', 'cod'],
	    ['image/cmu-raster', ['ras', 'rast']],
	    ['image/fif', 'fif'],
	    ['image/florian', ['flo', 'turbot']],
	    ['image/g3fax', 'g3'],
	    ['image/gif', 'gif'],
	    ['image/ief', ['ief', 'iefs']],
	    ['image/jpeg', ['jpeg', 'jpe', 'jpg', 'jfif', 'jfif-tbnl']],
	    ['image/jutvision', 'jut'],
	    ['image/ktx', 'ktx'],
	    ['image/naplps', ['nap', 'naplps']],
	    ['image/pict', ['pic', 'pict']],
	    ['image/pipeg', 'jfif'],
	    ['image/pjpeg', ['jfif', 'jpe', 'jpeg', 'jpg']],
	    ['image/png', ['png', 'x-png']],
	    ['image/prs.btif', 'btif'],
	    ['image/svg+xml', 'svg'],
	    ['image/tiff', ['tif', 'tiff']],
	    ['image/vasa', 'mcf'],
	    ['image/vnd.adobe.photoshop', 'psd'],
	    ['image/vnd.dece.graphic', 'uvi'],
	    ['image/vnd.djvu', 'djvu'],
	    ['image/vnd.dvb.subtitle', 'sub'],
	    ['image/vnd.dwg', ['dwg', 'dxf', 'svf']],
	    ['image/vnd.dxf', 'dxf'],
	    ['image/vnd.fastbidsheet', 'fbs'],
	    ['image/vnd.fpx', 'fpx'],
	    ['image/vnd.fst', 'fst'],
	    ['image/vnd.fujixerox.edmics-mmr', 'mmr'],
	    ['image/vnd.fujixerox.edmics-rlc', 'rlc'],
	    ['image/vnd.ms-modi', 'mdi'],
	    ['image/vnd.net-fpx', ['fpx', 'npx']],
	    ['image/vnd.rn-realflash', 'rf'],
	    ['image/vnd.rn-realpix', 'rp'],
	    ['image/vnd.wap.wbmp', 'wbmp'],
	    ['image/vnd.xiff', 'xif'],
	    ['image/webp', 'webp'],
	    ['image/x-cmu-raster', 'ras'],
	    ['image/x-cmx', 'cmx'],
	    ['image/x-dwg', ['dwg', 'dxf', 'svf']],
	    ['image/x-freehand', 'fh'],
	    ['image/x-icon', 'ico'],
	    ['image/x-jg', 'art'],
	    ['image/x-jps', 'jps'],
	    ['image/x-niff', ['niff', 'nif']],
	    ['image/x-pcx', 'pcx'],
	    ['image/x-pict', ['pct', 'pic']],
	    ['image/x-portable-anymap', 'pnm'],
	    ['image/x-portable-bitmap', 'pbm'],
	    ['image/x-portable-graymap', 'pgm'],
	    ['image/x-portable-greymap', 'pgm'],
	    ['image/x-portable-pixmap', 'ppm'],
	    ['image/x-quicktime', ['qif', 'qti', 'qtif']],
	    ['image/x-rgb', 'rgb'],
	    ['image/x-tiff', ['tif', 'tiff']],
	    ['image/x-windows-bmp', 'bmp'],
	    ['image/x-xbitmap', 'xbm'],
	    ['image/x-xbm', 'xbm'],
	    ['image/x-xpixmap', ['xpm', 'pm']],
	    ['image/x-xwd', 'xwd'],
	    ['image/x-xwindowdump', 'xwd'],
	    ['image/xbm', 'xbm'],
	    ['image/xpm', 'xpm'],
	    ['message/rfc822', ['eml', 'mht', 'mhtml', 'nws', 'mime']],
	    ['model/iges', ['iges', 'igs']],
	    ['model/mesh', 'msh'],
	    ['model/vnd.collada+xml', 'dae'],
	    ['model/vnd.dwf', 'dwf'],
	    ['model/vnd.gdl', 'gdl'],
	    ['model/vnd.gtw', 'gtw'],
	    ['model/vnd.mts', 'mts'],
	    ['model/vnd.vtu', 'vtu'],
	    ['model/vrml', ['vrml', 'wrl', 'wrz']],
	    ['model/x-pov', 'pov'],
	    ['multipart/x-gzip', 'gzip'],
	    ['multipart/x-ustar', 'ustar'],
	    ['multipart/x-zip', 'zip'],
	    ['music/crescendo', ['mid', 'midi']],
	    ['music/x-karaoke', 'kar'],
	    ['paleovu/x-pv', 'pvu'],
	    ['text/asp', 'asp'],
	    ['text/calendar', 'ics'],
	    ['text/css', 'css'],
	    ['text/csv', 'csv'],
	    ['text/ecmascript', 'js'],
	    ['text/h323', '323'],
	    ['text/html', ['html', 'htm', 'stm', 'acgi', 'htmls', 'htx', 'shtml']],
	    ['text/iuls', 'uls'],
	    ['text/javascript', 'js'],
	    ['text/mcf', 'mcf'],
	    ['text/n3', 'n3'],
	    ['text/pascal', 'pas'],
	    [
	        'text/plain',
	        [
	            'txt',
	            'bas',
	            'c',
	            'h',
	            'c++',
	            'cc',
	            'com',
	            'conf',
	            'cxx',
	            'def',
	            'f',
	            'f90',
	            'for',
	            'g',
	            'hh',
	            'idc',
	            'jav',
	            'java',
	            'list',
	            'log',
	            'lst',
	            'm',
	            'mar',
	            'pl',
	            'sdml',
	            'text'
	        ]
	    ],
	    ['text/plain-bas', 'par'],
	    ['text/prs.lines.tag', 'dsc'],
	    ['text/richtext', ['rtx', 'rt', 'rtf']],
	    ['text/scriplet', 'wsc'],
	    ['text/scriptlet', 'sct'],
	    ['text/sgml', ['sgm', 'sgml']],
	    ['text/tab-separated-values', 'tsv'],
	    ['text/troff', 't'],
	    ['text/turtle', 'ttl'],
	    ['text/uri-list', ['uni', 'unis', 'uri', 'uris']],
	    ['text/vnd.abc', 'abc'],
	    ['text/vnd.curl', 'curl'],
	    ['text/vnd.curl.dcurl', 'dcurl'],
	    ['text/vnd.curl.mcurl', 'mcurl'],
	    ['text/vnd.curl.scurl', 'scurl'],
	    ['text/vnd.fly', 'fly'],
	    ['text/vnd.fmi.flexstor', 'flx'],
	    ['text/vnd.graphviz', 'gv'],
	    ['text/vnd.in3d.3dml', '3dml'],
	    ['text/vnd.in3d.spot', 'spot'],
	    ['text/vnd.rn-realtext', 'rt'],
	    ['text/vnd.sun.j2me.app-descriptor', 'jad'],
	    ['text/vnd.wap.wml', 'wml'],
	    ['text/vnd.wap.wmlscript', 'wmls'],
	    ['text/webviewhtml', 'htt'],
	    ['text/x-asm', ['asm', 's']],
	    ['text/x-audiosoft-intra', 'aip'],
	    ['text/x-c', ['c', 'cc', 'cpp']],
	    ['text/x-component', 'htc'],
	    ['text/x-fortran', ['for', 'f', 'f77', 'f90']],
	    ['text/x-h', ['h', 'hh']],
	    ['text/x-java-source', ['java', 'jav']],
	    ['text/x-java-source,java', 'java'],
	    ['text/x-la-asf', 'lsx'],
	    ['text/x-m', 'm'],
	    ['text/x-pascal', 'p'],
	    ['text/x-script', 'hlb'],
	    ['text/x-script.csh', 'csh'],
	    ['text/x-script.elisp', 'el'],
	    ['text/x-script.guile', 'scm'],
	    ['text/x-script.ksh', 'ksh'],
	    ['text/x-script.lisp', 'lsp'],
	    ['text/x-script.perl', 'pl'],
	    ['text/x-script.perl-module', 'pm'],
	    ['text/x-script.phyton', 'py'],
	    ['text/x-script.rexx', 'rexx'],
	    ['text/x-script.scheme', 'scm'],
	    ['text/x-script.sh', 'sh'],
	    ['text/x-script.tcl', 'tcl'],
	    ['text/x-script.tcsh', 'tcsh'],
	    ['text/x-script.zsh', 'zsh'],
	    ['text/x-server-parsed-html', ['shtml', 'ssi']],
	    ['text/x-setext', 'etx'],
	    ['text/x-sgml', ['sgm', 'sgml']],
	    ['text/x-speech', ['spc', 'talk']],
	    ['text/x-uil', 'uil'],
	    ['text/x-uuencode', ['uu', 'uue']],
	    ['text/x-vcalendar', 'vcs'],
	    ['text/x-vcard', 'vcf'],
	    ['text/xml', 'xml'],
	    ['video/3gpp', '3gp'],
	    ['video/3gpp2', '3g2'],
	    ['video/animaflex', 'afl'],
	    ['video/avi', 'avi'],
	    ['video/avs-video', 'avs'],
	    ['video/dl', 'dl'],
	    ['video/fli', 'fli'],
	    ['video/gl', 'gl'],
	    ['video/h261', 'h261'],
	    ['video/h263', 'h263'],
	    ['video/h264', 'h264'],
	    ['video/jpeg', 'jpgv'],
	    ['video/jpm', 'jpm'],
	    ['video/mj2', 'mj2'],
	    ['video/mp4', 'mp4'],
	    ['video/mpeg', ['mpeg', 'mp2', 'mpa', 'mpe', 'mpg', 'mpv2', 'm1v', 'm2v', 'mp3']],
	    ['video/msvideo', 'avi'],
	    ['video/ogg', 'ogv'],
	    ['video/quicktime', ['mov', 'qt', 'moov']],
	    ['video/vdo', 'vdo'],
	    ['video/vivo', ['viv', 'vivo']],
	    ['video/vnd.dece.hd', 'uvh'],
	    ['video/vnd.dece.mobile', 'uvm'],
	    ['video/vnd.dece.pd', 'uvp'],
	    ['video/vnd.dece.sd', 'uvs'],
	    ['video/vnd.dece.video', 'uvv'],
	    ['video/vnd.fvt', 'fvt'],
	    ['video/vnd.mpegurl', 'mxu'],
	    ['video/vnd.ms-playready.media.pyv', 'pyv'],
	    ['video/vnd.rn-realvideo', 'rv'],
	    ['video/vnd.uvvu.mp4', 'uvu'],
	    ['video/vnd.vivo', ['viv', 'vivo']],
	    ['video/vosaic', 'vos'],
	    ['video/webm', 'webm'],
	    ['video/x-amt-demorun', 'xdr'],
	    ['video/x-amt-showrun', 'xsr'],
	    ['video/x-atomic3d-feature', 'fmf'],
	    ['video/x-dl', 'dl'],
	    ['video/x-dv', ['dif', 'dv']],
	    ['video/x-f4v', 'f4v'],
	    ['video/x-fli', 'fli'],
	    ['video/x-flv', 'flv'],
	    ['video/x-gl', 'gl'],
	    ['video/x-isvideo', 'isu'],
	    ['video/x-la-asf', ['lsf', 'lsx']],
	    ['video/x-m4v', 'm4v'],
	    ['video/x-motion-jpeg', 'mjpg'],
	    ['video/x-mpeg', ['mp3', 'mp2']],
	    ['video/x-mpeq2a', 'mp2'],
	    ['video/x-ms-asf', ['asf', 'asr', 'asx']],
	    ['video/x-ms-asf-plugin', 'asx'],
	    ['video/x-ms-wm', 'wm'],
	    ['video/x-ms-wmv', 'wmv'],
	    ['video/x-ms-wmx', 'wmx'],
	    ['video/x-ms-wvx', 'wvx'],
	    ['video/x-msvideo', 'avi'],
	    ['video/x-qtc', 'qtc'],
	    ['video/x-scm', 'scm'],
	    ['video/x-sgi-movie', ['movie', 'mv']],
	    ['windows/metafile', 'wmf'],
	    ['www/mime', 'mime'],
	    ['x-conference/x-cooltalk', 'ice'],
	    ['x-music/x-midi', ['mid', 'midi']],
	    ['x-world/x-3dmf', ['3dm', '3dmf', 'qd3', 'qd3d']],
	    ['x-world/x-svr', 'svr'],
	    ['x-world/x-vrml', ['flr', 'vrml', 'wrl', 'wrz', 'xaf', 'xof']],
	    ['x-world/x-vrt', 'vrt'],
	    ['xgl/drawing', 'xgz'],
	    ['xgl/movie', 'xmz']
	]);
	const extensions = new Map([
	    ['123', 'application/vnd.lotus-1-2-3'],
	    ['323', 'text/h323'],
	    ['*', 'application/octet-stream'],
	    ['3dm', 'x-world/x-3dmf'],
	    ['3dmf', 'x-world/x-3dmf'],
	    ['3dml', 'text/vnd.in3d.3dml'],
	    ['3g2', 'video/3gpp2'],
	    ['3gp', 'video/3gpp'],
	    ['7z', 'application/x-7z-compressed'],
	    ['a', 'application/octet-stream'],
	    ['aab', 'application/x-authorware-bin'],
	    ['aac', 'audio/x-aac'],
	    ['aam', 'application/x-authorware-map'],
	    ['aas', 'application/x-authorware-seg'],
	    ['abc', 'text/vnd.abc'],
	    ['abw', 'application/x-abiword'],
	    ['ac', 'application/pkix-attr-cert'],
	    ['acc', 'application/vnd.americandynamics.acc'],
	    ['ace', 'application/x-ace-compressed'],
	    ['acgi', 'text/html'],
	    ['acu', 'application/vnd.acucobol'],
	    ['acx', 'application/internet-property-stream'],
	    ['adp', 'audio/adpcm'],
	    ['aep', 'application/vnd.audiograph'],
	    ['afl', 'video/animaflex'],
	    ['afp', 'application/vnd.ibm.modcap'],
	    ['ahead', 'application/vnd.ahead.space'],
	    ['ai', 'application/postscript'],
	    ['aif', ['audio/aiff', 'audio/x-aiff']],
	    ['aifc', ['audio/aiff', 'audio/x-aiff']],
	    ['aiff', ['audio/aiff', 'audio/x-aiff']],
	    ['aim', 'application/x-aim'],
	    ['aip', 'text/x-audiosoft-intra'],
	    ['air', 'application/vnd.adobe.air-application-installer-package+zip'],
	    ['ait', 'application/vnd.dvb.ait'],
	    ['ami', 'application/vnd.amiga.ami'],
	    ['ani', 'application/x-navi-animation'],
	    ['aos', 'application/x-nokia-9000-communicator-add-on-software'],
	    ['apk', 'application/vnd.android.package-archive'],
	    ['application', 'application/x-ms-application'],
	    ['apr', 'application/vnd.lotus-approach'],
	    ['aps', 'application/mime'],
	    ['arc', 'application/octet-stream'],
	    ['arj', ['application/arj', 'application/octet-stream']],
	    ['art', 'image/x-jg'],
	    ['asf', 'video/x-ms-asf'],
	    ['asm', 'text/x-asm'],
	    ['aso', 'application/vnd.accpac.simply.aso'],
	    ['asp', 'text/asp'],
	    ['asr', 'video/x-ms-asf'],
	    ['asx', ['video/x-ms-asf', 'application/x-mplayer2', 'video/x-ms-asf-plugin']],
	    ['atc', 'application/vnd.acucorp'],
	    ['atomcat', 'application/atomcat+xml'],
	    ['atomsvc', 'application/atomsvc+xml'],
	    ['atx', 'application/vnd.antix.game-component'],
	    ['au', ['audio/basic', 'audio/x-au']],
	    ['avi', ['video/avi', 'video/msvideo', 'application/x-troff-msvideo', 'video/x-msvideo']],
	    ['avs', 'video/avs-video'],
	    ['aw', 'application/applixware'],
	    ['axs', 'application/olescript'],
	    ['azf', 'application/vnd.airzip.filesecure.azf'],
	    ['azs', 'application/vnd.airzip.filesecure.azs'],
	    ['azw', 'application/vnd.amazon.ebook'],
	    ['bas', 'text/plain'],
	    ['bcpio', 'application/x-bcpio'],
	    ['bdf', 'application/x-font-bdf'],
	    ['bdm', 'application/vnd.syncml.dm+wbxml'],
	    ['bed', 'application/vnd.realvnc.bed'],
	    ['bh2', 'application/vnd.fujitsu.oasysprs'],
	    ['bin', ['application/octet-stream', 'application/mac-binary', 'application/macbinary', 'application/x-macbinary', 'application/x-binary']],
	    ['bm', 'image/bmp'],
	    ['bmi', 'application/vnd.bmi'],
	    ['bmp', ['image/bmp', 'image/x-windows-bmp']],
	    ['boo', 'application/book'],
	    ['book', 'application/book'],
	    ['box', 'application/vnd.previewsystems.box'],
	    ['boz', 'application/x-bzip2'],
	    ['bsh', 'application/x-bsh'],
	    ['btif', 'image/prs.btif'],
	    ['bz', 'application/x-bzip'],
	    ['bz2', 'application/x-bzip2'],
	    ['c', ['text/plain', 'text/x-c']],
	    ['c++', 'text/plain'],
	    ['c11amc', 'application/vnd.cluetrust.cartomobile-config'],
	    ['c11amz', 'application/vnd.cluetrust.cartomobile-config-pkg'],
	    ['c4g', 'application/vnd.clonk.c4group'],
	    ['cab', 'application/vnd.ms-cab-compressed'],
	    ['car', 'application/vnd.curl.car'],
	    ['cat', ['application/vnd.ms-pkiseccat', 'application/vnd.ms-pki.seccat']],
	    ['cc', ['text/plain', 'text/x-c']],
	    ['ccad', 'application/clariscad'],
	    ['cco', 'application/x-cocoa'],
	    ['ccxml', 'application/ccxml+xml,'],
	    ['cdbcmsg', 'application/vnd.contact.cmsg'],
	    ['cdf', ['application/cdf', 'application/x-cdf', 'application/x-netcdf']],
	    ['cdkey', 'application/vnd.mediastation.cdkey'],
	    ['cdmia', 'application/cdmi-capability'],
	    ['cdmic', 'application/cdmi-container'],
	    ['cdmid', 'application/cdmi-domain'],
	    ['cdmio', 'application/cdmi-object'],
	    ['cdmiq', 'application/cdmi-queue'],
	    ['cdx', 'chemical/x-cdx'],
	    ['cdxml', 'application/vnd.chemdraw+xml'],
	    ['cdy', 'application/vnd.cinderella'],
	    ['cer', ['application/pkix-cert', 'application/x-x509-ca-cert']],
	    ['cgm', 'image/cgm'],
	    ['cha', 'application/x-chat'],
	    ['chat', 'application/x-chat'],
	    ['chm', 'application/vnd.ms-htmlhelp'],
	    ['chrt', 'application/vnd.kde.kchart'],
	    ['cif', 'chemical/x-cif'],
	    ['cii', 'application/vnd.anser-web-certificate-issue-initiation'],
	    ['cil', 'application/vnd.ms-artgalry'],
	    ['cla', 'application/vnd.claymore'],
	    ['class', ['application/octet-stream', 'application/java', 'application/java-byte-code', 'application/java-vm', 'application/x-java-class']],
	    ['clkk', 'application/vnd.crick.clicker.keyboard'],
	    ['clkp', 'application/vnd.crick.clicker.palette'],
	    ['clkt', 'application/vnd.crick.clicker.template'],
	    ['clkw', 'application/vnd.crick.clicker.wordbank'],
	    ['clkx', 'application/vnd.crick.clicker'],
	    ['clp', 'application/x-msclip'],
	    ['cmc', 'application/vnd.cosmocaller'],
	    ['cmdf', 'chemical/x-cmdf'],
	    ['cml', 'chemical/x-cml'],
	    ['cmp', 'application/vnd.yellowriver-custom-menu'],
	    ['cmx', 'image/x-cmx'],
	    ['cod', ['image/cis-cod', 'application/vnd.rim.cod']],
	    ['com', ['application/octet-stream', 'text/plain']],
	    ['conf', 'text/plain'],
	    ['cpio', 'application/x-cpio'],
	    ['cpp', 'text/x-c'],
	    ['cpt', ['application/mac-compactpro', 'application/x-compactpro', 'application/x-cpt']],
	    ['crd', 'application/x-mscardfile'],
	    ['crl', ['application/pkix-crl', 'application/pkcs-crl']],
	    ['crt', ['application/pkix-cert', 'application/x-x509-user-cert', 'application/x-x509-ca-cert']],
	    ['cryptonote', 'application/vnd.rig.cryptonote'],
	    ['csh', ['text/x-script.csh', 'application/x-csh']],
	    ['csml', 'chemical/x-csml'],
	    ['csp', 'application/vnd.commonspace'],
	    ['css', ['text/css', 'application/x-pointplus']],
	    ['csv', 'text/csv'],
	    ['cu', 'application/cu-seeme'],
	    ['curl', 'text/vnd.curl'],
	    ['cww', 'application/prs.cww'],
	    ['cxx', 'text/plain'],
	    ['dae', 'model/vnd.collada+xml'],
	    ['daf', 'application/vnd.mobius.daf'],
	    ['davmount', 'application/davmount+xml'],
	    ['dcr', 'application/x-director'],
	    ['dcurl', 'text/vnd.curl.dcurl'],
	    ['dd2', 'application/vnd.oma.dd2+xml'],
	    ['ddd', 'application/vnd.fujixerox.ddd'],
	    ['deb', 'application/x-debian-package'],
	    ['deepv', 'application/x-deepv'],
	    ['def', 'text/plain'],
	    ['der', 'application/x-x509-ca-cert'],
	    ['dfac', 'application/vnd.dreamfactory'],
	    ['dif', 'video/x-dv'],
	    ['dir', 'application/x-director'],
	    ['dis', 'application/vnd.mobius.dis'],
	    ['djvu', 'image/vnd.djvu'],
	    ['dl', ['video/dl', 'video/x-dl']],
	    ['dll', 'application/x-msdownload'],
	    ['dms', 'application/octet-stream'],
	    ['dna', 'application/vnd.dna'],
	    ['doc', 'application/msword'],
	    ['docm', 'application/vnd.ms-word.document.macroenabled.12'],
	    ['docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
	    ['dot', 'application/msword'],
	    ['dotm', 'application/vnd.ms-word.template.macroenabled.12'],
	    ['dotx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.template'],
	    ['dp', ['application/commonground', 'application/vnd.osgi.dp']],
	    ['dpg', 'application/vnd.dpgraph'],
	    ['dra', 'audio/vnd.dra'],
	    ['drw', 'application/drafting'],
	    ['dsc', 'text/prs.lines.tag'],
	    ['dssc', 'application/dssc+der'],
	    ['dtb', 'application/x-dtbook+xml'],
	    ['dtd', 'application/xml-dtd'],
	    ['dts', 'audio/vnd.dts'],
	    ['dtshd', 'audio/vnd.dts.hd'],
	    ['dump', 'application/octet-stream'],
	    ['dv', 'video/x-dv'],
	    ['dvi', 'application/x-dvi'],
	    ['dwf', ['model/vnd.dwf', 'drawing/x-dwf']],
	    ['dwg', ['application/acad', 'image/vnd.dwg', 'image/x-dwg']],
	    ['dxf', ['application/dxf', 'image/vnd.dwg', 'image/vnd.dxf', 'image/x-dwg']],
	    ['dxp', 'application/vnd.spotfire.dxp'],
	    ['dxr', 'application/x-director'],
	    ['ecelp4800', 'audio/vnd.nuera.ecelp4800'],
	    ['ecelp7470', 'audio/vnd.nuera.ecelp7470'],
	    ['ecelp9600', 'audio/vnd.nuera.ecelp9600'],
	    ['edm', 'application/vnd.novadigm.edm'],
	    ['edx', 'application/vnd.novadigm.edx'],
	    ['efif', 'application/vnd.picsel'],
	    ['ei6', 'application/vnd.pg.osasli'],
	    ['el', 'text/x-script.elisp'],
	    ['elc', ['application/x-elc', 'application/x-bytecode.elisp']],
	    ['eml', 'message/rfc822'],
	    ['emma', 'application/emma+xml'],
	    ['env', 'application/x-envoy'],
	    ['eol', 'audio/vnd.digital-winds'],
	    ['eot', 'application/vnd.ms-fontobject'],
	    ['eps', 'application/postscript'],
	    ['epub', 'application/epub+zip'],
	    ['es', ['application/ecmascript', 'application/x-esrehber']],
	    ['es3', 'application/vnd.eszigno3+xml'],
	    ['esf', 'application/vnd.epson.esf'],
	    ['etx', 'text/x-setext'],
	    ['evy', ['application/envoy', 'application/x-envoy']],
	    ['exe', ['application/octet-stream', 'application/x-msdownload']],
	    ['exi', 'application/exi'],
	    ['ext', 'application/vnd.novadigm.ext'],
	    ['ez2', 'application/vnd.ezpix-album'],
	    ['ez3', 'application/vnd.ezpix-package'],
	    ['f', ['text/plain', 'text/x-fortran']],
	    ['f4v', 'video/x-f4v'],
	    ['f77', 'text/x-fortran'],
	    ['f90', ['text/plain', 'text/x-fortran']],
	    ['fbs', 'image/vnd.fastbidsheet'],
	    ['fcs', 'application/vnd.isac.fcs'],
	    ['fdf', 'application/vnd.fdf'],
	    ['fe_launch', 'application/vnd.denovo.fcselayout-link'],
	    ['fg5', 'application/vnd.fujitsu.oasysgp'],
	    ['fh', 'image/x-freehand'],
	    ['fif', ['application/fractals', 'image/fif']],
	    ['fig', 'application/x-xfig'],
	    ['fli', ['video/fli', 'video/x-fli']],
	    ['flo', ['image/florian', 'application/vnd.micrografx.flo']],
	    ['flr', 'x-world/x-vrml'],
	    ['flv', 'video/x-flv'],
	    ['flw', 'application/vnd.kde.kivio'],
	    ['flx', 'text/vnd.fmi.flexstor'],
	    ['fly', 'text/vnd.fly'],
	    ['fm', 'application/vnd.framemaker'],
	    ['fmf', 'video/x-atomic3d-feature'],
	    ['fnc', 'application/vnd.frogans.fnc'],
	    ['for', ['text/plain', 'text/x-fortran']],
	    ['fpx', ['image/vnd.fpx', 'image/vnd.net-fpx']],
	    ['frl', 'application/freeloader'],
	    ['fsc', 'application/vnd.fsc.weblaunch'],
	    ['fst', 'image/vnd.fst'],
	    ['ftc', 'application/vnd.fluxtime.clip'],
	    ['fti', 'application/vnd.anser-web-funds-transfer-initiation'],
	    ['funk', 'audio/make'],
	    ['fvt', 'video/vnd.fvt'],
	    ['fxp', 'application/vnd.adobe.fxp'],
	    ['fzs', 'application/vnd.fuzzysheet'],
	    ['g', 'text/plain'],
	    ['g2w', 'application/vnd.geoplan'],
	    ['g3', 'image/g3fax'],
	    ['g3w', 'application/vnd.geospace'],
	    ['gac', 'application/vnd.groove-account'],
	    ['gdl', 'model/vnd.gdl'],
	    ['geo', 'application/vnd.dynageo'],
	    ['gex', 'application/vnd.geometry-explorer'],
	    ['ggb', 'application/vnd.geogebra.file'],
	    ['ggt', 'application/vnd.geogebra.tool'],
	    ['ghf', 'application/vnd.groove-help'],
	    ['gif', 'image/gif'],
	    ['gim', 'application/vnd.groove-identity-message'],
	    ['gl', ['video/gl', 'video/x-gl']],
	    ['gmx', 'application/vnd.gmx'],
	    ['gnumeric', 'application/x-gnumeric'],
	    ['gph', 'application/vnd.flographit'],
	    ['gqf', 'application/vnd.grafeq'],
	    ['gram', 'application/srgs'],
	    ['grv', 'application/vnd.groove-injector'],
	    ['grxml', 'application/srgs+xml'],
	    ['gsd', 'audio/x-gsm'],
	    ['gsf', 'application/x-font-ghostscript'],
	    ['gsm', 'audio/x-gsm'],
	    ['gsp', 'application/x-gsp'],
	    ['gss', 'application/x-gss'],
	    ['gtar', 'application/x-gtar'],
	    ['gtm', 'application/vnd.groove-tool-message'],
	    ['gtw', 'model/vnd.gtw'],
	    ['gv', 'text/vnd.graphviz'],
	    ['gxt', 'application/vnd.geonext'],
	    ['gz', ['application/x-gzip', 'application/x-compressed']],
	    ['gzip', ['multipart/x-gzip', 'application/x-gzip']],
	    ['h', ['text/plain', 'text/x-h']],
	    ['h261', 'video/h261'],
	    ['h263', 'video/h263'],
	    ['h264', 'video/h264'],
	    ['hal', 'application/vnd.hal+xml'],
	    ['hbci', 'application/vnd.hbci'],
	    ['hdf', 'application/x-hdf'],
	    ['help', 'application/x-helpfile'],
	    ['hgl', 'application/vnd.hp-hpgl'],
	    ['hh', ['text/plain', 'text/x-h']],
	    ['hlb', 'text/x-script'],
	    ['hlp', ['application/winhlp', 'application/hlp', 'application/x-helpfile', 'application/x-winhelp']],
	    ['hpg', 'application/vnd.hp-hpgl'],
	    ['hpgl', 'application/vnd.hp-hpgl'],
	    ['hpid', 'application/vnd.hp-hpid'],
	    ['hps', 'application/vnd.hp-hps'],
	    [
	        'hqx',
	        [
	            'application/mac-binhex40',
	            'application/binhex',
	            'application/binhex4',
	            'application/mac-binhex',
	            'application/x-binhex40',
	            'application/x-mac-binhex40'
	        ]
	    ],
	    ['hta', 'application/hta'],
	    ['htc', 'text/x-component'],
	    ['htke', 'application/vnd.kenameaapp'],
	    ['htm', 'text/html'],
	    ['html', 'text/html'],
	    ['htmls', 'text/html'],
	    ['htt', 'text/webviewhtml'],
	    ['htx', 'text/html'],
	    ['hvd', 'application/vnd.yamaha.hv-dic'],
	    ['hvp', 'application/vnd.yamaha.hv-voice'],
	    ['hvs', 'application/vnd.yamaha.hv-script'],
	    ['i2g', 'application/vnd.intergeo'],
	    ['icc', 'application/vnd.iccprofile'],
	    ['ice', 'x-conference/x-cooltalk'],
	    ['ico', 'image/x-icon'],
	    ['ics', 'text/calendar'],
	    ['idc', 'text/plain'],
	    ['ief', 'image/ief'],
	    ['iefs', 'image/ief'],
	    ['ifm', 'application/vnd.shana.informed.formdata'],
	    ['iges', ['application/iges', 'model/iges']],
	    ['igl', 'application/vnd.igloader'],
	    ['igm', 'application/vnd.insors.igm'],
	    ['igs', ['application/iges', 'model/iges']],
	    ['igx', 'application/vnd.micrografx.igx'],
	    ['iif', 'application/vnd.shana.informed.interchange'],
	    ['iii', 'application/x-iphone'],
	    ['ima', 'application/x-ima'],
	    ['imap', 'application/x-httpd-imap'],
	    ['imp', 'application/vnd.accpac.simply.imp'],
	    ['ims', 'application/vnd.ms-ims'],
	    ['inf', 'application/inf'],
	    ['ins', ['application/x-internet-signup', 'application/x-internett-signup']],
	    ['ip', 'application/x-ip2'],
	    ['ipfix', 'application/ipfix'],
	    ['ipk', 'application/vnd.shana.informed.package'],
	    ['irm', 'application/vnd.ibm.rights-management'],
	    ['irp', 'application/vnd.irepository.package+xml'],
	    ['isp', 'application/x-internet-signup'],
	    ['isu', 'video/x-isvideo'],
	    ['it', 'audio/it'],
	    ['itp', 'application/vnd.shana.informed.formtemplate'],
	    ['iv', 'application/x-inventor'],
	    ['ivp', 'application/vnd.immervision-ivp'],
	    ['ivr', 'i-world/i-vrml'],
	    ['ivu', 'application/vnd.immervision-ivu'],
	    ['ivy', 'application/x-livescreen'],
	    ['jad', 'text/vnd.sun.j2me.app-descriptor'],
	    ['jam', ['application/vnd.jam', 'audio/x-jam']],
	    ['jar', 'application/java-archive'],
	    ['jav', ['text/plain', 'text/x-java-source']],
	    ['java', ['text/plain', 'text/x-java-source,java', 'text/x-java-source']],
	    ['jcm', 'application/x-java-commerce'],
	    ['jfif', ['image/pipeg', 'image/jpeg', 'image/pjpeg']],
	    ['jfif-tbnl', 'image/jpeg'],
	    ['jisp', 'application/vnd.jisp'],
	    ['jlt', 'application/vnd.hp-jlyt'],
	    ['jnlp', 'application/x-java-jnlp-file'],
	    ['joda', 'application/vnd.joost.joda-archive'],
	    ['jpe', ['image/jpeg', 'image/pjpeg']],
	    ['jpeg', ['image/jpeg', 'image/pjpeg']],
	    ['jpg', ['image/jpeg', 'image/pjpeg']],
	    ['jpgv', 'video/jpeg'],
	    ['jpm', 'video/jpm'],
	    ['jps', 'image/x-jps'],
	    ['js', ['application/javascript', 'application/ecmascript', 'text/javascript', 'text/ecmascript', 'application/x-javascript']],
	    ['json', 'application/json'],
	    ['jut', 'image/jutvision'],
	    ['kar', ['audio/midi', 'music/x-karaoke']],
	    ['karbon', 'application/vnd.kde.karbon'],
	    ['kfo', 'application/vnd.kde.kformula'],
	    ['kia', 'application/vnd.kidspiration'],
	    ['kml', 'application/vnd.google-earth.kml+xml'],
	    ['kmz', 'application/vnd.google-earth.kmz'],
	    ['kne', 'application/vnd.kinar'],
	    ['kon', 'application/vnd.kde.kontour'],
	    ['kpr', 'application/vnd.kde.kpresenter'],
	    ['ksh', ['application/x-ksh', 'text/x-script.ksh']],
	    ['ksp', 'application/vnd.kde.kspread'],
	    ['ktx', 'image/ktx'],
	    ['ktz', 'application/vnd.kahootz'],
	    ['kwd', 'application/vnd.kde.kword'],
	    ['la', ['audio/nspaudio', 'audio/x-nspaudio']],
	    ['lam', 'audio/x-liveaudio'],
	    ['lasxml', 'application/vnd.las.las+xml'],
	    ['latex', 'application/x-latex'],
	    ['lbd', 'application/vnd.llamagraphics.life-balance.desktop'],
	    ['lbe', 'application/vnd.llamagraphics.life-balance.exchange+xml'],
	    ['les', 'application/vnd.hhe.lesson-player'],
	    ['lha', ['application/octet-stream', 'application/lha', 'application/x-lha']],
	    ['lhx', 'application/octet-stream'],
	    ['link66', 'application/vnd.route66.link66+xml'],
	    ['list', 'text/plain'],
	    ['lma', ['audio/nspaudio', 'audio/x-nspaudio']],
	    ['log', 'text/plain'],
	    ['lrm', 'application/vnd.ms-lrm'],
	    ['lsf', 'video/x-la-asf'],
	    ['lsp', ['application/x-lisp', 'text/x-script.lisp']],
	    ['lst', 'text/plain'],
	    ['lsx', ['video/x-la-asf', 'text/x-la-asf']],
	    ['ltf', 'application/vnd.frogans.ltf'],
	    ['ltx', 'application/x-latex'],
	    ['lvp', 'audio/vnd.lucent.voice'],
	    ['lwp', 'application/vnd.lotus-wordpro'],
	    ['lzh', ['application/octet-stream', 'application/x-lzh']],
	    ['lzx', ['application/lzx', 'application/octet-stream', 'application/x-lzx']],
	    ['m', ['text/plain', 'text/x-m']],
	    ['m13', 'application/x-msmediaview'],
	    ['m14', 'application/x-msmediaview'],
	    ['m1v', 'video/mpeg'],
	    ['m21', 'application/mp21'],
	    ['m2a', 'audio/mpeg'],
	    ['m2v', 'video/mpeg'],
	    ['m3u', ['audio/x-mpegurl', 'audio/x-mpequrl']],
	    ['m3u8', 'application/vnd.apple.mpegurl'],
	    ['m4v', 'video/x-m4v'],
	    ['ma', 'application/mathematica'],
	    ['mads', 'application/mads+xml'],
	    ['mag', 'application/vnd.ecowin.chart'],
	    ['man', 'application/x-troff-man'],
	    ['map', 'application/x-navimap'],
	    ['mar', 'text/plain'],
	    ['mathml', 'application/mathml+xml'],
	    ['mbd', 'application/mbedlet'],
	    ['mbk', 'application/vnd.mobius.mbk'],
	    ['mbox', 'application/mbox'],
	    ['mc$', 'application/x-magic-cap-package-1.0'],
	    ['mc1', 'application/vnd.medcalcdata'],
	    ['mcd', ['application/mcad', 'application/vnd.mcd', 'application/x-mathcad']],
	    ['mcf', ['image/vasa', 'text/mcf']],
	    ['mcp', 'application/netmc'],
	    ['mcurl', 'text/vnd.curl.mcurl'],
	    ['mdb', 'application/x-msaccess'],
	    ['mdi', 'image/vnd.ms-modi'],
	    ['me', 'application/x-troff-me'],
	    ['meta4', 'application/metalink4+xml'],
	    ['mets', 'application/mets+xml'],
	    ['mfm', 'application/vnd.mfmp'],
	    ['mgp', 'application/vnd.osgeo.mapguide.package'],
	    ['mgz', 'application/vnd.proteus.magazine'],
	    ['mht', 'message/rfc822'],
	    ['mhtml', 'message/rfc822'],
	    ['mid', ['audio/mid', 'audio/midi', 'music/crescendo', 'x-music/x-midi', 'audio/x-midi', 'application/x-midi', 'audio/x-mid']],
	    ['midi', ['audio/midi', 'music/crescendo', 'x-music/x-midi', 'audio/x-midi', 'application/x-midi', 'audio/x-mid']],
	    ['mif', ['application/vnd.mif', 'application/x-mif', 'application/x-frame']],
	    ['mime', ['message/rfc822', 'www/mime']],
	    ['mj2', 'video/mj2'],
	    ['mjf', 'audio/x-vnd.audioexplosion.mjuicemediafile'],
	    ['mjpg', 'video/x-motion-jpeg'],
	    ['mlp', 'application/vnd.dolby.mlp'],
	    ['mm', ['application/base64', 'application/x-meme']],
	    ['mmd', 'application/vnd.chipnuts.karaoke-mmd'],
	    ['mme', 'application/base64'],
	    ['mmf', 'application/vnd.smaf'],
	    ['mmr', 'image/vnd.fujixerox.edmics-mmr'],
	    ['mny', 'application/x-msmoney'],
	    ['mod', ['audio/mod', 'audio/x-mod']],
	    ['mods', 'application/mods+xml'],
	    ['moov', 'video/quicktime'],
	    ['mov', 'video/quicktime'],
	    ['movie', 'video/x-sgi-movie'],
	    ['mp2', ['video/mpeg', 'audio/mpeg', 'video/x-mpeg', 'audio/x-mpeg', 'video/x-mpeq2a']],
	    ['mp3', ['audio/mpeg', 'audio/mpeg3', 'video/mpeg', 'audio/x-mpeg-3', 'video/x-mpeg']],
	    ['mp4', ['video/mp4', 'application/mp4']],
	    ['mp4a', 'audio/mp4'],
	    ['mpa', ['video/mpeg', 'audio/mpeg']],
	    ['mpc', ['application/vnd.mophun.certificate', 'application/x-project']],
	    ['mpe', 'video/mpeg'],
	    ['mpeg', 'video/mpeg'],
	    ['mpg', ['video/mpeg', 'audio/mpeg']],
	    ['mpga', 'audio/mpeg'],
	    ['mpkg', 'application/vnd.apple.installer+xml'],
	    ['mpm', 'application/vnd.blueice.multipass'],
	    ['mpn', 'application/vnd.mophun.application'],
	    ['mpp', 'application/vnd.ms-project'],
	    ['mpt', 'application/x-project'],
	    ['mpv', 'application/x-project'],
	    ['mpv2', 'video/mpeg'],
	    ['mpx', 'application/x-project'],
	    ['mpy', 'application/vnd.ibm.minipay'],
	    ['mqy', 'application/vnd.mobius.mqy'],
	    ['mrc', 'application/marc'],
	    ['mrcx', 'application/marcxml+xml'],
	    ['ms', 'application/x-troff-ms'],
	    ['mscml', 'application/mediaservercontrol+xml'],
	    ['mseq', 'application/vnd.mseq'],
	    ['msf', 'application/vnd.epson.msf'],
	    ['msg', 'application/vnd.ms-outlook'],
	    ['msh', 'model/mesh'],
	    ['msl', 'application/vnd.mobius.msl'],
	    ['msty', 'application/vnd.muvee.style'],
	    ['mts', 'model/vnd.mts'],
	    ['mus', 'application/vnd.musician'],
	    ['musicxml', 'application/vnd.recordare.musicxml+xml'],
	    ['mv', 'video/x-sgi-movie'],
	    ['mvb', 'application/x-msmediaview'],
	    ['mwf', 'application/vnd.mfer'],
	    ['mxf', 'application/mxf'],
	    ['mxl', 'application/vnd.recordare.musicxml'],
	    ['mxml', 'application/xv+xml'],
	    ['mxs', 'application/vnd.triscape.mxs'],
	    ['mxu', 'video/vnd.mpegurl'],
	    ['my', 'audio/make'],
	    ['mzz', 'application/x-vnd.audioexplosion.mzz'],
	    ['n-gage', 'application/vnd.nokia.n-gage.symbian.install'],
	    ['n3', 'text/n3'],
	    ['nap', 'image/naplps'],
	    ['naplps', 'image/naplps'],
	    ['nbp', 'application/vnd.wolfram.player'],
	    ['nc', 'application/x-netcdf'],
	    ['ncm', 'application/vnd.nokia.configuration-message'],
	    ['ncx', 'application/x-dtbncx+xml'],
	    ['ngdat', 'application/vnd.nokia.n-gage.data'],
	    ['nif', 'image/x-niff'],
	    ['niff', 'image/x-niff'],
	    ['nix', 'application/x-mix-transfer'],
	    ['nlu', 'application/vnd.neurolanguage.nlu'],
	    ['nml', 'application/vnd.enliven'],
	    ['nnd', 'application/vnd.noblenet-directory'],
	    ['nns', 'application/vnd.noblenet-sealer'],
	    ['nnw', 'application/vnd.noblenet-web'],
	    ['npx', 'image/vnd.net-fpx'],
	    ['nsc', 'application/x-conference'],
	    ['nsf', 'application/vnd.lotus-notes'],
	    ['nvd', 'application/x-navidoc'],
	    ['nws', 'message/rfc822'],
	    ['o', 'application/octet-stream'],
	    ['oa2', 'application/vnd.fujitsu.oasys2'],
	    ['oa3', 'application/vnd.fujitsu.oasys3'],
	    ['oas', 'application/vnd.fujitsu.oasys'],
	    ['obd', 'application/x-msbinder'],
	    ['oda', 'application/oda'],
	    ['odb', 'application/vnd.oasis.opendocument.database'],
	    ['odc', 'application/vnd.oasis.opendocument.chart'],
	    ['odf', 'application/vnd.oasis.opendocument.formula'],
	    ['odft', 'application/vnd.oasis.opendocument.formula-template'],
	    ['odg', 'application/vnd.oasis.opendocument.graphics'],
	    ['odi', 'application/vnd.oasis.opendocument.image'],
	    ['odm', 'application/vnd.oasis.opendocument.text-master'],
	    ['odp', 'application/vnd.oasis.opendocument.presentation'],
	    ['ods', 'application/vnd.oasis.opendocument.spreadsheet'],
	    ['odt', 'application/vnd.oasis.opendocument.text'],
	    ['oga', 'audio/ogg'],
	    ['ogv', 'video/ogg'],
	    ['ogx', 'application/ogg'],
	    ['omc', 'application/x-omc'],
	    ['omcd', 'application/x-omcdatamaker'],
	    ['omcr', 'application/x-omcregerator'],
	    ['onetoc', 'application/onenote'],
	    ['opf', 'application/oebps-package+xml'],
	    ['org', 'application/vnd.lotus-organizer'],
	    ['osf', 'application/vnd.yamaha.openscoreformat'],
	    ['osfpvg', 'application/vnd.yamaha.openscoreformat.osfpvg+xml'],
	    ['otc', 'application/vnd.oasis.opendocument.chart-template'],
	    ['otf', 'application/x-font-otf'],
	    ['otg', 'application/vnd.oasis.opendocument.graphics-template'],
	    ['oth', 'application/vnd.oasis.opendocument.text-web'],
	    ['oti', 'application/vnd.oasis.opendocument.image-template'],
	    ['otp', 'application/vnd.oasis.opendocument.presentation-template'],
	    ['ots', 'application/vnd.oasis.opendocument.spreadsheet-template'],
	    ['ott', 'application/vnd.oasis.opendocument.text-template'],
	    ['oxt', 'application/vnd.openofficeorg.extension'],
	    ['p', 'text/x-pascal'],
	    ['p10', ['application/pkcs10', 'application/x-pkcs10']],
	    ['p12', ['application/pkcs-12', 'application/x-pkcs12']],
	    ['p7a', 'application/x-pkcs7-signature'],
	    ['p7b', 'application/x-pkcs7-certificates'],
	    ['p7c', ['application/pkcs7-mime', 'application/x-pkcs7-mime']],
	    ['p7m', ['application/pkcs7-mime', 'application/x-pkcs7-mime']],
	    ['p7r', 'application/x-pkcs7-certreqresp'],
	    ['p7s', ['application/pkcs7-signature', 'application/x-pkcs7-signature']],
	    ['p8', 'application/pkcs8'],
	    ['par', 'text/plain-bas'],
	    ['part', 'application/pro_eng'],
	    ['pas', 'text/pascal'],
	    ['paw', 'application/vnd.pawaafile'],
	    ['pbd', 'application/vnd.powerbuilder6'],
	    ['pbm', 'image/x-portable-bitmap'],
	    ['pcf', 'application/x-font-pcf'],
	    ['pcl', ['application/vnd.hp-pcl', 'application/x-pcl']],
	    ['pclxl', 'application/vnd.hp-pclxl'],
	    ['pct', 'image/x-pict'],
	    ['pcurl', 'application/vnd.curl.pcurl'],
	    ['pcx', 'image/x-pcx'],
	    ['pdb', ['application/vnd.palm', 'chemical/x-pdb']],
	    ['pdf', 'application/pdf'],
	    ['pfa', 'application/x-font-type1'],
	    ['pfr', 'application/font-tdpfr'],
	    ['pfunk', ['audio/make', 'audio/make.my.funk']],
	    ['pfx', 'application/x-pkcs12'],
	    ['pgm', ['image/x-portable-graymap', 'image/x-portable-greymap']],
	    ['pgn', 'application/x-chess-pgn'],
	    ['pgp', 'application/pgp-signature'],
	    ['pic', ['image/pict', 'image/x-pict']],
	    ['pict', 'image/pict'],
	    ['pkg', 'application/x-newton-compatible-pkg'],
	    ['pki', 'application/pkixcmp'],
	    ['pkipath', 'application/pkix-pkipath'],
	    ['pko', ['application/ynd.ms-pkipko', 'application/vnd.ms-pki.pko']],
	    ['pl', ['text/plain', 'text/x-script.perl']],
	    ['plb', 'application/vnd.3gpp.pic-bw-large'],
	    ['plc', 'application/vnd.mobius.plc'],
	    ['plf', 'application/vnd.pocketlearn'],
	    ['pls', 'application/pls+xml'],
	    ['plx', 'application/x-pixclscript'],
	    ['pm', ['text/x-script.perl-module', 'image/x-xpixmap']],
	    ['pm4', 'application/x-pagemaker'],
	    ['pm5', 'application/x-pagemaker'],
	    ['pma', 'application/x-perfmon'],
	    ['pmc', 'application/x-perfmon'],
	    ['pml', ['application/vnd.ctc-posml', 'application/x-perfmon']],
	    ['pmr', 'application/x-perfmon'],
	    ['pmw', 'application/x-perfmon'],
	    ['png', 'image/png'],
	    ['pnm', ['application/x-portable-anymap', 'image/x-portable-anymap']],
	    ['portpkg', 'application/vnd.macports.portpkg'],
	    ['pot', ['application/vnd.ms-powerpoint', 'application/mspowerpoint']],
	    ['potm', 'application/vnd.ms-powerpoint.template.macroenabled.12'],
	    ['potx', 'application/vnd.openxmlformats-officedocument.presentationml.template'],
	    ['pov', 'model/x-pov'],
	    ['ppa', 'application/vnd.ms-powerpoint'],
	    ['ppam', 'application/vnd.ms-powerpoint.addin.macroenabled.12'],
	    ['ppd', 'application/vnd.cups-ppd'],
	    ['ppm', 'image/x-portable-pixmap'],
	    ['pps', ['application/vnd.ms-powerpoint', 'application/mspowerpoint']],
	    ['ppsm', 'application/vnd.ms-powerpoint.slideshow.macroenabled.12'],
	    ['ppsx', 'application/vnd.openxmlformats-officedocument.presentationml.slideshow'],
	    ['ppt', ['application/vnd.ms-powerpoint', 'application/mspowerpoint', 'application/powerpoint', 'application/x-mspowerpoint']],
	    ['pptm', 'application/vnd.ms-powerpoint.presentation.macroenabled.12'],
	    ['pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'],
	    ['ppz', 'application/mspowerpoint'],
	    ['prc', 'application/x-mobipocket-ebook'],
	    ['pre', ['application/vnd.lotus-freelance', 'application/x-freelance']],
	    ['prf', 'application/pics-rules'],
	    ['prt', 'application/pro_eng'],
	    ['ps', 'application/postscript'],
	    ['psb', 'application/vnd.3gpp.pic-bw-small'],
	    ['psd', ['application/octet-stream', 'image/vnd.adobe.photoshop']],
	    ['psf', 'application/x-font-linux-psf'],
	    ['pskcxml', 'application/pskc+xml'],
	    ['ptid', 'application/vnd.pvi.ptid1'],
	    ['pub', 'application/x-mspublisher'],
	    ['pvb', 'application/vnd.3gpp.pic-bw-var'],
	    ['pvu', 'paleovu/x-pv'],
	    ['pwn', 'application/vnd.3m.post-it-notes'],
	    ['pwz', 'application/vnd.ms-powerpoint'],
	    ['py', 'text/x-script.phyton'],
	    ['pya', 'audio/vnd.ms-playready.media.pya'],
	    ['pyc', 'application/x-bytecode.python'],
	    ['pyv', 'video/vnd.ms-playready.media.pyv'],
	    ['qam', 'application/vnd.epson.quickanime'],
	    ['qbo', 'application/vnd.intu.qbo'],
	    ['qcp', 'audio/vnd.qcelp'],
	    ['qd3', 'x-world/x-3dmf'],
	    ['qd3d', 'x-world/x-3dmf'],
	    ['qfx', 'application/vnd.intu.qfx'],
	    ['qif', 'image/x-quicktime'],
	    ['qps', 'application/vnd.publishare-delta-tree'],
	    ['qt', 'video/quicktime'],
	    ['qtc', 'video/x-qtc'],
	    ['qti', 'image/x-quicktime'],
	    ['qtif', 'image/x-quicktime'],
	    ['qxd', 'application/vnd.quark.quarkxpress'],
	    ['ra', ['audio/x-realaudio', 'audio/x-pn-realaudio', 'audio/x-pn-realaudio-plugin']],
	    ['ram', 'audio/x-pn-realaudio'],
	    ['rar', 'application/x-rar-compressed'],
	    ['ras', ['image/cmu-raster', 'application/x-cmu-raster', 'image/x-cmu-raster']],
	    ['rast', 'image/cmu-raster'],
	    ['rcprofile', 'application/vnd.ipunplugged.rcprofile'],
	    ['rdf', 'application/rdf+xml'],
	    ['rdz', 'application/vnd.data-vision.rdz'],
	    ['rep', 'application/vnd.businessobjects'],
	    ['res', 'application/x-dtbresource+xml'],
	    ['rexx', 'text/x-script.rexx'],
	    ['rf', 'image/vnd.rn-realflash'],
	    ['rgb', 'image/x-rgb'],
	    ['rif', 'application/reginfo+xml'],
	    ['rip', 'audio/vnd.rip'],
	    ['rl', 'application/resource-lists+xml'],
	    ['rlc', 'image/vnd.fujixerox.edmics-rlc'],
	    ['rld', 'application/resource-lists-diff+xml'],
	    ['rm', ['application/vnd.rn-realmedia', 'audio/x-pn-realaudio']],
	    ['rmi', 'audio/mid'],
	    ['rmm', 'audio/x-pn-realaudio'],
	    ['rmp', ['audio/x-pn-realaudio-plugin', 'audio/x-pn-realaudio']],
	    ['rms', 'application/vnd.jcp.javame.midlet-rms'],
	    ['rnc', 'application/relax-ng-compact-syntax'],
	    ['rng', ['application/ringing-tones', 'application/vnd.nokia.ringing-tone']],
	    ['rnx', 'application/vnd.rn-realplayer'],
	    ['roff', 'application/x-troff'],
	    ['rp', 'image/vnd.rn-realpix'],
	    ['rp9', 'application/vnd.cloanto.rp9'],
	    ['rpm', 'audio/x-pn-realaudio-plugin'],
	    ['rpss', 'application/vnd.nokia.radio-presets'],
	    ['rpst', 'application/vnd.nokia.radio-preset'],
	    ['rq', 'application/sparql-query'],
	    ['rs', 'application/rls-services+xml'],
	    ['rsd', 'application/rsd+xml'],
	    ['rt', ['text/richtext', 'text/vnd.rn-realtext']],
	    ['rtf', ['application/rtf', 'text/richtext', 'application/x-rtf']],
	    ['rtx', ['text/richtext', 'application/rtf']],
	    ['rv', 'video/vnd.rn-realvideo'],
	    ['s', 'text/x-asm'],
	    ['s3m', 'audio/s3m'],
	    ['saf', 'application/vnd.yamaha.smaf-audio'],
	    ['saveme', 'application/octet-stream'],
	    ['sbk', 'application/x-tbook'],
	    ['sbml', 'application/sbml+xml'],
	    ['sc', 'application/vnd.ibm.secure-container'],
	    ['scd', 'application/x-msschedule'],
	    ['scm', ['application/vnd.lotus-screencam', 'video/x-scm', 'text/x-script.guile', 'application/x-lotusscreencam', 'text/x-script.scheme']],
	    ['scq', 'application/scvp-cv-request'],
	    ['scs', 'application/scvp-cv-response'],
	    ['sct', 'text/scriptlet'],
	    ['scurl', 'text/vnd.curl.scurl'],
	    ['sda', 'application/vnd.stardivision.draw'],
	    ['sdc', 'application/vnd.stardivision.calc'],
	    ['sdd', 'application/vnd.stardivision.impress'],
	    ['sdkm', 'application/vnd.solent.sdkm+xml'],
	    ['sdml', 'text/plain'],
	    ['sdp', ['application/sdp', 'application/x-sdp']],
	    ['sdr', 'application/sounder'],
	    ['sdw', 'application/vnd.stardivision.writer'],
	    ['sea', ['application/sea', 'application/x-sea']],
	    ['see', 'application/vnd.seemail'],
	    ['seed', 'application/vnd.fdsn.seed'],
	    ['sema', 'application/vnd.sema'],
	    ['semd', 'application/vnd.semd'],
	    ['semf', 'application/vnd.semf'],
	    ['ser', 'application/java-serialized-object'],
	    ['set', 'application/set'],
	    ['setpay', 'application/set-payment-initiation'],
	    ['setreg', 'application/set-registration-initiation'],
	    ['sfd-hdstx', 'application/vnd.hydrostatix.sof-data'],
	    ['sfs', 'application/vnd.spotfire.sfs'],
	    ['sgl', 'application/vnd.stardivision.writer-global'],
	    ['sgm', ['text/sgml', 'text/x-sgml']],
	    ['sgml', ['text/sgml', 'text/x-sgml']],
	    ['sh', ['application/x-shar', 'application/x-bsh', 'application/x-sh', 'text/x-script.sh']],
	    ['shar', ['application/x-bsh', 'application/x-shar']],
	    ['shf', 'application/shf+xml'],
	    ['shtml', ['text/html', 'text/x-server-parsed-html']],
	    ['sid', 'audio/x-psid'],
	    ['sis', 'application/vnd.symbian.install'],
	    ['sit', ['application/x-stuffit', 'application/x-sit']],
	    ['sitx', 'application/x-stuffitx'],
	    ['skd', 'application/x-koan'],
	    ['skm', 'application/x-koan'],
	    ['skp', ['application/vnd.koan', 'application/x-koan']],
	    ['skt', 'application/x-koan'],
	    ['sl', 'application/x-seelogo'],
	    ['sldm', 'application/vnd.ms-powerpoint.slide.macroenabled.12'],
	    ['sldx', 'application/vnd.openxmlformats-officedocument.presentationml.slide'],
	    ['slt', 'application/vnd.epson.salt'],
	    ['sm', 'application/vnd.stepmania.stepchart'],
	    ['smf', 'application/vnd.stardivision.math'],
	    ['smi', ['application/smil', 'application/smil+xml']],
	    ['smil', 'application/smil'],
	    ['snd', ['audio/basic', 'audio/x-adpcm']],
	    ['snf', 'application/x-font-snf'],
	    ['sol', 'application/solids'],
	    ['spc', ['text/x-speech', 'application/x-pkcs7-certificates']],
	    ['spf', 'application/vnd.yamaha.smaf-phrase'],
	    ['spl', ['application/futuresplash', 'application/x-futuresplash']],
	    ['spot', 'text/vnd.in3d.spot'],
	    ['spp', 'application/scvp-vp-response'],
	    ['spq', 'application/scvp-vp-request'],
	    ['spr', 'application/x-sprite'],
	    ['sprite', 'application/x-sprite'],
	    ['src', 'application/x-wais-source'],
	    ['sru', 'application/sru+xml'],
	    ['srx', 'application/sparql-results+xml'],
	    ['sse', 'application/vnd.kodak-descriptor'],
	    ['ssf', 'application/vnd.epson.ssf'],
	    ['ssi', 'text/x-server-parsed-html'],
	    ['ssm', 'application/streamingmedia'],
	    ['ssml', 'application/ssml+xml'],
	    ['sst', ['application/vnd.ms-pkicertstore', 'application/vnd.ms-pki.certstore']],
	    ['st', 'application/vnd.sailingtracker.track'],
	    ['stc', 'application/vnd.sun.xml.calc.template'],
	    ['std', 'application/vnd.sun.xml.draw.template'],
	    ['step', 'application/step'],
	    ['stf', 'application/vnd.wt.stf'],
	    ['sti', 'application/vnd.sun.xml.impress.template'],
	    ['stk', 'application/hyperstudio'],
	    ['stl', ['application/vnd.ms-pkistl', 'application/sla', 'application/vnd.ms-pki.stl', 'application/x-navistyle']],
	    ['stm', 'text/html'],
	    ['stp', 'application/step'],
	    ['str', 'application/vnd.pg.format'],
	    ['stw', 'application/vnd.sun.xml.writer.template'],
	    ['sub', 'image/vnd.dvb.subtitle'],
	    ['sus', 'application/vnd.sus-calendar'],
	    ['sv4cpio', 'application/x-sv4cpio'],
	    ['sv4crc', 'application/x-sv4crc'],
	    ['svc', 'application/vnd.dvb.service'],
	    ['svd', 'application/vnd.svd'],
	    ['svf', ['image/vnd.dwg', 'image/x-dwg']],
	    ['svg', 'image/svg+xml'],
	    ['svr', ['x-world/x-svr', 'application/x-world']],
	    ['swf', 'application/x-shockwave-flash'],
	    ['swi', 'application/vnd.aristanetworks.swi'],
	    ['sxc', 'application/vnd.sun.xml.calc'],
	    ['sxd', 'application/vnd.sun.xml.draw'],
	    ['sxg', 'application/vnd.sun.xml.writer.global'],
	    ['sxi', 'application/vnd.sun.xml.impress'],
	    ['sxm', 'application/vnd.sun.xml.math'],
	    ['sxw', 'application/vnd.sun.xml.writer'],
	    ['t', ['text/troff', 'application/x-troff']],
	    ['talk', 'text/x-speech'],
	    ['tao', 'application/vnd.tao.intent-module-archive'],
	    ['tar', 'application/x-tar'],
	    ['tbk', ['application/toolbook', 'application/x-tbook']],
	    ['tcap', 'application/vnd.3gpp2.tcap'],
	    ['tcl', ['text/x-script.tcl', 'application/x-tcl']],
	    ['tcsh', 'text/x-script.tcsh'],
	    ['teacher', 'application/vnd.smart.teacher'],
	    ['tei', 'application/tei+xml'],
	    ['tex', 'application/x-tex'],
	    ['texi', 'application/x-texinfo'],
	    ['texinfo', 'application/x-texinfo'],
	    ['text', ['application/plain', 'text/plain']],
	    ['tfi', 'application/thraud+xml'],
	    ['tfm', 'application/x-tex-tfm'],
	    ['tgz', ['application/gnutar', 'application/x-compressed']],
	    ['thmx', 'application/vnd.ms-officetheme'],
	    ['tif', ['image/tiff', 'image/x-tiff']],
	    ['tiff', ['image/tiff', 'image/x-tiff']],
	    ['tmo', 'application/vnd.tmobile-livetv'],
	    ['torrent', 'application/x-bittorrent'],
	    ['tpl', 'application/vnd.groove-tool-template'],
	    ['tpt', 'application/vnd.trid.tpt'],
	    ['tr', 'application/x-troff'],
	    ['tra', 'application/vnd.trueapp'],
	    ['trm', 'application/x-msterminal'],
	    ['tsd', 'application/timestamped-data'],
	    ['tsi', 'audio/tsp-audio'],
	    ['tsp', ['application/dsptype', 'audio/tsplayer']],
	    ['tsv', 'text/tab-separated-values'],
	    ['ttf', 'application/x-font-ttf'],
	    ['ttl', 'text/turtle'],
	    ['turbot', 'image/florian'],
	    ['twd', 'application/vnd.simtech-mindmapper'],
	    ['txd', 'application/vnd.genomatix.tuxedo'],
	    ['txf', 'application/vnd.mobius.txf'],
	    ['txt', 'text/plain'],
	    ['ufd', 'application/vnd.ufdl'],
	    ['uil', 'text/x-uil'],
	    ['uls', 'text/iuls'],
	    ['umj', 'application/vnd.umajin'],
	    ['uni', 'text/uri-list'],
	    ['unis', 'text/uri-list'],
	    ['unityweb', 'application/vnd.unity'],
	    ['unv', 'application/i-deas'],
	    ['uoml', 'application/vnd.uoml+xml'],
	    ['uri', 'text/uri-list'],
	    ['uris', 'text/uri-list'],
	    ['ustar', ['application/x-ustar', 'multipart/x-ustar']],
	    ['utz', 'application/vnd.uiq.theme'],
	    ['uu', ['application/octet-stream', 'text/x-uuencode']],
	    ['uue', 'text/x-uuencode'],
	    ['uva', 'audio/vnd.dece.audio'],
	    ['uvh', 'video/vnd.dece.hd'],
	    ['uvi', 'image/vnd.dece.graphic'],
	    ['uvm', 'video/vnd.dece.mobile'],
	    ['uvp', 'video/vnd.dece.pd'],
	    ['uvs', 'video/vnd.dece.sd'],
	    ['uvu', 'video/vnd.uvvu.mp4'],
	    ['uvv', 'video/vnd.dece.video'],
	    ['vcd', 'application/x-cdlink'],
	    ['vcf', 'text/x-vcard'],
	    ['vcg', 'application/vnd.groove-vcard'],
	    ['vcs', 'text/x-vcalendar'],
	    ['vcx', 'application/vnd.vcx'],
	    ['vda', 'application/vda'],
	    ['vdo', 'video/vdo'],
	    ['vew', 'application/groupwise'],
	    ['vis', 'application/vnd.visionary'],
	    ['viv', ['video/vivo', 'video/vnd.vivo']],
	    ['vivo', ['video/vivo', 'video/vnd.vivo']],
	    ['vmd', 'application/vocaltec-media-desc'],
	    ['vmf', 'application/vocaltec-media-file'],
	    ['voc', ['audio/voc', 'audio/x-voc']],
	    ['vos', 'video/vosaic'],
	    ['vox', 'audio/voxware'],
	    ['vqe', 'audio/x-twinvq-plugin'],
	    ['vqf', 'audio/x-twinvq'],
	    ['vql', 'audio/x-twinvq-plugin'],
	    ['vrml', ['model/vrml', 'x-world/x-vrml', 'application/x-vrml']],
	    ['vrt', 'x-world/x-vrt'],
	    ['vsd', ['application/vnd.visio', 'application/x-visio']],
	    ['vsf', 'application/vnd.vsf'],
	    ['vst', 'application/x-visio'],
	    ['vsw', 'application/x-visio'],
	    ['vtu', 'model/vnd.vtu'],
	    ['vxml', 'application/voicexml+xml'],
	    ['w60', 'application/wordperfect6.0'],
	    ['w61', 'application/wordperfect6.1'],
	    ['w6w', 'application/msword'],
	    ['wad', 'application/x-doom'],
	    ['wav', ['audio/wav', 'audio/x-wav']],
	    ['wax', 'audio/x-ms-wax'],
	    ['wb1', 'application/x-qpro'],
	    ['wbmp', 'image/vnd.wap.wbmp'],
	    ['wbs', 'application/vnd.criticaltools.wbs+xml'],
	    ['wbxml', 'application/vnd.wap.wbxml'],
	    ['wcm', 'application/vnd.ms-works'],
	    ['wdb', 'application/vnd.ms-works'],
	    ['web', 'application/vnd.xara'],
	    ['weba', 'audio/webm'],
	    ['webm', 'video/webm'],
	    ['webp', 'image/webp'],
	    ['wg', 'application/vnd.pmi.widget'],
	    ['wgt', 'application/widget'],
	    ['wiz', 'application/msword'],
	    ['wk1', 'application/x-123'],
	    ['wks', 'application/vnd.ms-works'],
	    ['wm', 'video/x-ms-wm'],
	    ['wma', 'audio/x-ms-wma'],
	    ['wmd', 'application/x-ms-wmd'],
	    ['wmf', ['windows/metafile', 'application/x-msmetafile']],
	    ['wml', 'text/vnd.wap.wml'],
	    ['wmlc', 'application/vnd.wap.wmlc'],
	    ['wmls', 'text/vnd.wap.wmlscript'],
	    ['wmlsc', 'application/vnd.wap.wmlscriptc'],
	    ['wmv', 'video/x-ms-wmv'],
	    ['wmx', 'video/x-ms-wmx'],
	    ['wmz', 'application/x-ms-wmz'],
	    ['woff', 'application/x-font-woff'],
	    ['word', 'application/msword'],
	    ['wp', 'application/wordperfect'],
	    ['wp5', ['application/wordperfect', 'application/wordperfect6.0']],
	    ['wp6', 'application/wordperfect'],
	    ['wpd', ['application/wordperfect', 'application/vnd.wordperfect', 'application/x-wpwin']],
	    ['wpl', 'application/vnd.ms-wpl'],
	    ['wps', 'application/vnd.ms-works'],
	    ['wq1', 'application/x-lotus'],
	    ['wqd', 'application/vnd.wqd'],
	    ['wri', ['application/mswrite', 'application/x-wri', 'application/x-mswrite']],
	    ['wrl', ['model/vrml', 'x-world/x-vrml', 'application/x-world']],
	    ['wrz', ['model/vrml', 'x-world/x-vrml']],
	    ['wsc', 'text/scriplet'],
	    ['wsdl', 'application/wsdl+xml'],
	    ['wspolicy', 'application/wspolicy+xml'],
	    ['wsrc', 'application/x-wais-source'],
	    ['wtb', 'application/vnd.webturbo'],
	    ['wtk', 'application/x-wintalk'],
	    ['wvx', 'video/x-ms-wvx'],
	    ['x-png', 'image/png'],
	    ['x3d', 'application/vnd.hzn-3d-crossword'],
	    ['xaf', 'x-world/x-vrml'],
	    ['xap', 'application/x-silverlight-app'],
	    ['xar', 'application/vnd.xara'],
	    ['xbap', 'application/x-ms-xbap'],
	    ['xbd', 'application/vnd.fujixerox.docuworks.binder'],
	    ['xbm', ['image/xbm', 'image/x-xbm', 'image/x-xbitmap']],
	    ['xdf', 'application/xcap-diff+xml'],
	    ['xdm', 'application/vnd.syncml.dm+xml'],
	    ['xdp', 'application/vnd.adobe.xdp+xml'],
	    ['xdr', 'video/x-amt-demorun'],
	    ['xdssc', 'application/dssc+xml'],
	    ['xdw', 'application/vnd.fujixerox.docuworks'],
	    ['xenc', 'application/xenc+xml'],
	    ['xer', 'application/patch-ops-error+xml'],
	    ['xfdf', 'application/vnd.adobe.xfdf'],
	    ['xfdl', 'application/vnd.xfdl'],
	    ['xgz', 'xgl/drawing'],
	    ['xhtml', 'application/xhtml+xml'],
	    ['xif', 'image/vnd.xiff'],
	    ['xl', 'application/excel'],
	    ['xla', ['application/vnd.ms-excel', 'application/excel', 'application/x-msexcel', 'application/x-excel']],
	    ['xlam', 'application/vnd.ms-excel.addin.macroenabled.12'],
	    ['xlb', ['application/excel', 'application/vnd.ms-excel', 'application/x-excel']],
	    ['xlc', ['application/vnd.ms-excel', 'application/excel', 'application/x-excel']],
	    ['xld', ['application/excel', 'application/x-excel']],
	    ['xlk', ['application/excel', 'application/x-excel']],
	    ['xll', ['application/excel', 'application/vnd.ms-excel', 'application/x-excel']],
	    ['xlm', ['application/vnd.ms-excel', 'application/excel', 'application/x-excel']],
	    ['xls', ['application/vnd.ms-excel', 'application/excel', 'application/x-msexcel', 'application/x-excel']],
	    ['xlsb', 'application/vnd.ms-excel.sheet.binary.macroenabled.12'],
	    ['xlsm', 'application/vnd.ms-excel.sheet.macroenabled.12'],
	    ['xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
	    ['xlt', ['application/vnd.ms-excel', 'application/excel', 'application/x-excel']],
	    ['xltm', 'application/vnd.ms-excel.template.macroenabled.12'],
	    ['xltx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.template'],
	    ['xlv', ['application/excel', 'application/x-excel']],
	    ['xlw', ['application/vnd.ms-excel', 'application/excel', 'application/x-msexcel', 'application/x-excel']],
	    ['xm', 'audio/xm'],
	    ['xml', ['application/xml', 'text/xml', 'application/atom+xml', 'application/rss+xml']],
	    ['xmz', 'xgl/movie'],
	    ['xo', 'application/vnd.olpc-sugar'],
	    ['xof', 'x-world/x-vrml'],
	    ['xop', 'application/xop+xml'],
	    ['xpi', 'application/x-xpinstall'],
	    ['xpix', 'application/x-vnd.ls-xpix'],
	    ['xpm', ['image/xpm', 'image/x-xpixmap']],
	    ['xpr', 'application/vnd.is-xpr'],
	    ['xps', 'application/vnd.ms-xpsdocument'],
	    ['xpw', 'application/vnd.intercon.formnet'],
	    ['xslt', 'application/xslt+xml'],
	    ['xsm', 'application/vnd.syncml+xml'],
	    ['xspf', 'application/xspf+xml'],
	    ['xsr', 'video/x-amt-showrun'],
	    ['xul', 'application/vnd.mozilla.xul+xml'],
	    ['xwd', ['image/x-xwd', 'image/x-xwindowdump']],
	    ['xyz', ['chemical/x-xyz', 'chemical/x-pdb']],
	    ['yang', 'application/yang'],
	    ['yin', 'application/yin+xml'],
	    ['z', ['application/x-compressed', 'application/x-compress']],
	    ['zaz', 'application/vnd.zzazz.deck+xml'],
	    ['zip', ['application/zip', 'multipart/x-zip', 'application/x-zip-compressed', 'application/x-compressed']],
	    ['zir', 'application/vnd.zul'],
	    ['zmm', 'application/vnd.handheld-entertainment+xml'],
	    ['zoo', 'application/octet-stream'],
	    ['zsh', 'text/x-script.zsh']
	]);

	mimeTypes_1 = {
	    detectMimeType(filename) {
	        if (!filename) {
	            return defaultMimeType;
	        }

	        let parsed = path.parse(filename);
	        let extension = (parsed.ext.substr(1) || parsed.name || '').split('?').shift().trim().toLowerCase();
	        let value = defaultMimeType;

	        if (extensions.has(extension)) {
	            value = extensions.get(extension);
	        }

	        if (Array.isArray(value)) {
	            return value[0];
	        }
	        return value;
	    },

	    detectExtension(mimeType) {
	        if (!mimeType) {
	            return defaultExtension;
	        }
	        let parts = (mimeType || '').toLowerCase().trim().split('/');
	        let rootType = parts.shift().trim();
	        let subType = parts.join('/').trim();

	        if (mimeTypes.has(rootType + '/' + subType)) {
	            let value = mimeTypes.get(rootType + '/' + subType);
	            if (Array.isArray(value)) {
	                return value[0];
	            }
	            return value;
	        }

	        switch (rootType) {
	            case 'text':
	                return 'txt';
	            default:
	                return 'bin';
	        }
	    }
	};
	return mimeTypes_1;
}

var base64;
var hasRequiredBase64;

function requireBase64 () {
	if (hasRequiredBase64) return base64;
	hasRequiredBase64 = 1;

	const Transform = require$$0$3.Transform;

	/**
	 * Encodes a Buffer into a base64 encoded string
	 *
	 * @param {Buffer} buffer Buffer to convert
	 * @returns {String} base64 encoded string
	 */
	function encode(buffer) {
	    if (typeof buffer === 'string') {
	        buffer = Buffer.from(buffer, 'utf-8');
	    }

	    return buffer.toString('base64');
	}

	/**
	 * Adds soft line breaks to a base64 string
	 *
	 * @param {String} str base64 encoded string that might need line wrapping
	 * @param {Number} [lineLength=76] Maximum allowed length for a line
	 * @returns {String} Soft-wrapped base64 encoded string
	 */
	function wrap(str, lineLength) {
	    str = (str || '').toString();
	    lineLength = lineLength || 76;

	    if (str.length <= lineLength) {
	        return str;
	    }

	    let result = [];
	    let pos = 0;
	    let chunkLength = lineLength * 1024;
	    while (pos < str.length) {
	        let wrappedLines = str
	            .substr(pos, chunkLength)
	            .replace(new RegExp('.{' + lineLength + '}', 'g'), '$&\r\n')
	            .trim();
	        result.push(wrappedLines);
	        pos += chunkLength;
	    }

	    return result.join('\r\n').trim();
	}

	/**
	 * Creates a transform stream for encoding data to base64 encoding
	 *
	 * @constructor
	 * @param {Object} options Stream options
	 * @param {Number} [options.lineLength=76] Maximum length for lines, set to false to disable wrapping
	 */
	class Encoder extends Transform {
	    constructor(options) {
	        super();
	        // init Transform
	        this.options = options || {};

	        if (this.options.lineLength !== false) {
	            this.options.lineLength = this.options.lineLength || 76;
	        }

	        this._curLine = '';
	        this._remainingBytes = false;

	        this.inputBytes = 0;
	        this.outputBytes = 0;
	    }

	    _transform(chunk, encoding, done) {
	        if (encoding !== 'buffer') {
	            chunk = Buffer.from(chunk, encoding);
	        }

	        if (!chunk || !chunk.length) {
	            return setImmediate(done);
	        }

	        this.inputBytes += chunk.length;

	        if (this._remainingBytes && this._remainingBytes.length) {
	            chunk = Buffer.concat([this._remainingBytes, chunk], this._remainingBytes.length + chunk.length);
	            this._remainingBytes = false;
	        }

	        if (chunk.length % 3) {
	            this._remainingBytes = chunk.slice(chunk.length - (chunk.length % 3));
	            chunk = chunk.slice(0, chunk.length - (chunk.length % 3));
	        } else {
	            this._remainingBytes = false;
	        }

	        let b64 = this._curLine + encode(chunk);

	        if (this.options.lineLength) {
	            b64 = wrap(b64, this.options.lineLength);

	            // remove last line as it is still most probably incomplete
	            let lastLF = b64.lastIndexOf('\n');
	            if (lastLF < 0) {
	                this._curLine = b64;
	                b64 = '';
	            } else if (lastLF === b64.length - 1) {
	                this._curLine = '';
	            } else {
	                this._curLine = b64.substr(lastLF + 1);
	                b64 = b64.substr(0, lastLF + 1);
	            }
	        }

	        if (b64) {
	            this.outputBytes += b64.length;
	            this.push(Buffer.from(b64, 'ascii'));
	        }

	        setImmediate(done);
	    }

	    _flush(done) {
	        if (this._remainingBytes && this._remainingBytes.length) {
	            this._curLine += encode(this._remainingBytes);
	        }

	        if (this._curLine) {
	            this._curLine = wrap(this._curLine, this.options.lineLength);
	            this.outputBytes += this._curLine.length;
	            this.push(this._curLine, 'ascii');
	            this._curLine = '';
	        }
	        done();
	    }
	}

	// expose to the world
	base64 = {
	    encode,
	    wrap,
	    Encoder
	};
	return base64;
}

var qp;
var hasRequiredQp;

function requireQp () {
	if (hasRequiredQp) return qp;
	hasRequiredQp = 1;

	const Transform = require$$0$3.Transform;

	/**
	 * Encodes a Buffer into a Quoted-Printable encoded string
	 *
	 * @param {Buffer} buffer Buffer to convert
	 * @returns {String} Quoted-Printable encoded string
	 */
	function encode(buffer) {
	    if (typeof buffer === 'string') {
	        buffer = Buffer.from(buffer, 'utf-8');
	    }

	    // usable characters that do not need encoding
	    let ranges = [
	        // https://tools.ietf.org/html/rfc2045#section-6.7
	        [0x09], // <TAB>
	        [0x0a], // <LF>
	        [0x0d], // <CR>
	        [0x20, 0x3c], // <SP>!"#$%&'()*+,-./0123456789:;
	        [0x3e, 0x7e] // >?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}
	    ];
	    let result = '';
	    let ord;

	    for (let i = 0, len = buffer.length; i < len; i++) {
	        ord = buffer[i];
	        // if the char is in allowed range, then keep as is, unless it is a WS in the end of a line
	        if (checkRanges(ord, ranges) && !((ord === 0x20 || ord === 0x09) && (i === len - 1 || buffer[i + 1] === 0x0a || buffer[i + 1] === 0x0d))) {
	            result += String.fromCharCode(ord);
	            continue;
	        }
	        result += '=' + (ord < 0x10 ? '0' : '') + ord.toString(16).toUpperCase();
	    }

	    return result;
	}

	/**
	 * Adds soft line breaks to a Quoted-Printable string
	 *
	 * @param {String} str Quoted-Printable encoded string that might need line wrapping
	 * @param {Number} [lineLength=76] Maximum allowed length for a line
	 * @returns {String} Soft-wrapped Quoted-Printable encoded string
	 */
	function wrap(str, lineLength) {
	    str = (str || '').toString();
	    lineLength = lineLength || 76;

	    if (str.length <= lineLength) {
	        return str;
	    }

	    let pos = 0;
	    let len = str.length;
	    let match, code, line;
	    let lineMargin = Math.floor(lineLength / 3);
	    let result = '';

	    // insert soft linebreaks where needed
	    while (pos < len) {
	        line = str.substr(pos, lineLength);
	        if ((match = line.match(/\r\n/))) {
	            line = line.substr(0, match.index + match[0].length);
	            result += line;
	            pos += line.length;
	            continue;
	        }

	        if (line.substr(-1) === '\n') {
	            // nothing to change here
	            result += line;
	            pos += line.length;
	            continue;
	        } else if ((match = line.substr(-lineMargin).match(/\n.*?$/))) {
	            // truncate to nearest line break
	            line = line.substr(0, line.length - (match[0].length - 1));
	            result += line;
	            pos += line.length;
	            continue;
	        } else if (line.length > lineLength - lineMargin && (match = line.substr(-lineMargin).match(/[ \t.,!?][^ \t.,!?]*$/))) {
	            // truncate to nearest space
	            line = line.substr(0, line.length - (match[0].length - 1));
	        } else if (line.match(/[=][\da-f]{0,2}$/i)) {
	            // push incomplete encoding sequences to the next line
	            if ((match = line.match(/[=][\da-f]{0,1}$/i))) {
	                line = line.substr(0, line.length - match[0].length);
	            }

	            // ensure that utf-8 sequences are not split
	            while (line.length > 3 && line.length < len - pos && !line.match(/^(?:=[\da-f]{2}){1,4}$/i) && (match = line.match(/[=][\da-f]{2}$/gi))) {
	                code = parseInt(match[0].substr(1, 2), 16);
	                if (code < 128) {
	                    break;
	                }

	                line = line.substr(0, line.length - 3);

	                if (code >= 0xc0) {
	                    break;
	                }
	            }
	        }

	        if (pos + line.length < len && line.substr(-1) !== '\n') {
	            if (line.length === lineLength && line.match(/[=][\da-f]{2}$/i)) {
	                line = line.substr(0, line.length - 3);
	            } else if (line.length === lineLength) {
	                line = line.substr(0, line.length - 1);
	            }
	            pos += line.length;
	            line += '=\r\n';
	        } else {
	            pos += line.length;
	        }

	        result += line;
	    }

	    return result;
	}

	/**
	 * Helper function to check if a number is inside provided ranges
	 *
	 * @param {Number} nr Number to check for
	 * @param {Array} ranges An Array of allowed values
	 * @returns {Boolean} True if the value was found inside allowed ranges, false otherwise
	 */
	function checkRanges(nr, ranges) {
	    for (let i = ranges.length - 1; i >= 0; i--) {
	        if (!ranges[i].length) {
	            continue;
	        }
	        if (ranges[i].length === 1 && nr === ranges[i][0]) {
	            return true;
	        }
	        if (ranges[i].length === 2 && nr >= ranges[i][0] && nr <= ranges[i][1]) {
	            return true;
	        }
	    }
	    return false;
	}

	/**
	 * Creates a transform stream for encoding data to Quoted-Printable encoding
	 *
	 * @constructor
	 * @param {Object} options Stream options
	 * @param {Number} [options.lineLength=76] Maximum length for lines, set to false to disable wrapping
	 */
	class Encoder extends Transform {
	    constructor(options) {
	        super();

	        // init Transform
	        this.options = options || {};

	        if (this.options.lineLength !== false) {
	            this.options.lineLength = this.options.lineLength || 76;
	        }

	        this._curLine = '';

	        this.inputBytes = 0;
	        this.outputBytes = 0;
	    }

	    _transform(chunk, encoding, done) {
	        let qp;

	        if (encoding !== 'buffer') {
	            chunk = Buffer.from(chunk, encoding);
	        }

	        if (!chunk || !chunk.length) {
	            return done();
	        }

	        this.inputBytes += chunk.length;

	        if (this.options.lineLength) {
	            qp = this._curLine + encode(chunk);
	            qp = wrap(qp, this.options.lineLength);
	            qp = qp.replace(/(^|\n)([^\n]*)$/, (match, lineBreak, lastLine) => {
	                this._curLine = lastLine;
	                return lineBreak;
	            });

	            if (qp) {
	                this.outputBytes += qp.length;
	                this.push(qp);
	            }
	        } else {
	            qp = encode(chunk);
	            this.outputBytes += qp.length;
	            this.push(qp, 'ascii');
	        }

	        done();
	    }

	    _flush(done) {
	        if (this._curLine) {
	            this.outputBytes += this._curLine.length;
	            this.push(this._curLine, 'ascii');
	        }
	        done();
	    }
	}

	// expose to the world
	qp = {
	    encode,
	    wrap,
	    Encoder
	};
	return qp;
}

/* eslint no-control-regex:0 */

var mimeFuncs;
var hasRequiredMimeFuncs;

function requireMimeFuncs () {
	if (hasRequiredMimeFuncs) return mimeFuncs;
	hasRequiredMimeFuncs = 1;

	const base64 = requireBase64();
	const qp = requireQp();
	const mimeTypes = requireMimeTypes();

	mimeFuncs = {
	    /**
	     * Checks if a value is plaintext string (uses only printable 7bit chars)
	     *
	     * @param {String} value String to be tested
	     * @returns {Boolean} true if it is a plaintext string
	     */
	    isPlainText(value, isParam) {
	        const re = isParam ? /[\x00-\x08\x0b\x0c\x0e-\x1f"\u0080-\uFFFF]/ : /[\x00-\x08\x0b\x0c\x0e-\x1f\u0080-\uFFFF]/;
	        if (typeof value !== 'string' || re.test(value)) {
	            return false;
	        } else {
	            return true;
	        }
	    },

	    /**
	     * Checks if a multi line string containes lines longer than the selected value.
	     *
	     * Useful when detecting if a mail message needs any processing at all –
	     * if only plaintext characters are used and lines are short, then there is
	     * no need to encode the values in any way. If the value is plaintext but has
	     * longer lines then allowed, then use format=flowed
	     *
	     * @param {Number} lineLength Max line length to check for
	     * @returns {Boolean} Returns true if there is at least one line longer than lineLength chars
	     */
	    hasLongerLines(str, lineLength) {
	        if (str.length > 128 * 1024) {
	            // do not test strings longer than 128kB
	            return true;
	        }
	        return new RegExp('^.{' + (lineLength + 1) + ',}', 'm').test(str);
	    },

	    /**
	     * Encodes a string or an Buffer to an UTF-8 MIME Word (rfc2047)
	     *
	     * @param {String|Buffer} data String to be encoded
	     * @param {String} mimeWordEncoding='Q' Encoding for the mime word, either Q or B
	     * @param {Number} [maxLength=0] If set, split mime words into several chunks if needed
	     * @return {String} Single or several mime words joined together
	     */
	    encodeWord(data, mimeWordEncoding, maxLength) {
	        mimeWordEncoding = (mimeWordEncoding || 'Q').toString().toUpperCase().trim().charAt(0);
	        maxLength = maxLength || 0;

	        let encodedStr;
	        let toCharset = 'UTF-8';

	        if (maxLength && maxLength > 7 + toCharset.length) {
	            maxLength -= 7 + toCharset.length;
	        }

	        if (mimeWordEncoding === 'Q') {
	            // https://tools.ietf.org/html/rfc2047#section-5 rule (3)
	            encodedStr = qp.encode(data).replace(/[^a-z0-9!*+\-/=]/gi, chr => {
	                let ord = chr.charCodeAt(0).toString(16).toUpperCase();
	                if (chr === ' ') {
	                    return '_';
	                } else {
	                    return '=' + (ord.length === 1 ? '0' + ord : ord);
	                }
	            });
	        } else if (mimeWordEncoding === 'B') {
	            encodedStr = typeof data === 'string' ? data : base64.encode(data);
	            maxLength = maxLength ? Math.max(3, ((maxLength - (maxLength % 4)) / 4) * 3) : 0;
	        }

	        if (maxLength && (mimeWordEncoding !== 'B' ? encodedStr : base64.encode(data)).length > maxLength) {
	            if (mimeWordEncoding === 'Q') {
	                encodedStr = this.splitMimeEncodedString(encodedStr, maxLength).join('?= =?' + toCharset + '?' + mimeWordEncoding + '?');
	            } else {
	                // RFC2047 6.3 (2) states that encoded-word must include an integral number of characters, so no chopping unicode sequences
	                let parts = [];
	                let lpart = '';
	                for (let i = 0, len = encodedStr.length; i < len; i++) {
	                    let chr = encodedStr.charAt(i);

	                    if (/[\ud83c\ud83d\ud83e]/.test(chr) && i < len - 1) {
	                        // composite emoji byte, so add the next byte as well
	                        chr += encodedStr.charAt(++i);
	                    }

	                    // check if we can add this character to the existing string
	                    // without breaking byte length limit
	                    if (Buffer.byteLength(lpart + chr) <= maxLength || i === 0) {
	                        lpart += chr;
	                    } else {
	                        // we hit the length limit, so push the existing string and start over
	                        parts.push(base64.encode(lpart));
	                        lpart = chr;
	                    }
	                }
	                if (lpart) {
	                    parts.push(base64.encode(lpart));
	                }

	                if (parts.length > 1) {
	                    encodedStr = parts.join('?= =?' + toCharset + '?' + mimeWordEncoding + '?');
	                } else {
	                    encodedStr = parts.join('');
	                }
	            }
	        } else if (mimeWordEncoding === 'B') {
	            encodedStr = base64.encode(data);
	        }

	        return '=?' + toCharset + '?' + mimeWordEncoding + '?' + encodedStr + (encodedStr.substr(-2) === '?=' ? '' : '?=');
	    },

	    /**
	     * Finds word sequences with non ascii text and converts these to mime words
	     *
	     * @param {String} value String to be encoded
	     * @param {String} mimeWordEncoding='Q' Encoding for the mime word, either Q or B
	     * @param {Number} [maxLength=0] If set, split mime words into several chunks if needed
	     * @param {Boolean} [encodeAll=false] If true and the value needs encoding then encodes entire string, not just the smallest match
	     * @return {String} String with possible mime words
	     */
	    encodeWords(value, mimeWordEncoding, maxLength, encodeAll) {
	        maxLength = maxLength || 0;

	        let encodedValue;

	        // find first word with a non-printable ascii or special symbol in it
	        let firstMatch = value.match(/(?:^|\s)([^\s]*["\u0080-\uFFFF])/);
	        if (!firstMatch) {
	            return value;
	        }

	        if (encodeAll) {
	            // if it is requested to encode everything or the string contains something that resebles encoded word, then encode everything

	            return this.encodeWord(value, mimeWordEncoding, maxLength);
	        }

	        // find the last word with a non-printable ascii in it
	        let lastMatch = value.match(/(["\u0080-\uFFFF][^\s]*)[^"\u0080-\uFFFF]*$/);
	        if (!lastMatch) {
	            // should not happen
	            return value;
	        }

	        let startIndex =
	            firstMatch.index +
	            (
	                firstMatch[0].match(/[^\s]/) || {
	                    index: 0
	                }
	            ).index;
	        let endIndex = lastMatch.index + (lastMatch[1] || '').length;

	        encodedValue =
	            (startIndex ? value.substr(0, startIndex) : '') +
	            this.encodeWord(value.substring(startIndex, endIndex), mimeWordEncoding || 'Q', maxLength) +
	            (endIndex < value.length ? value.substr(endIndex) : '');

	        return encodedValue;
	    },

	    /**
	     * Joins parsed header value together as 'value; param1=value1; param2=value2'
	     * PS: We are following RFC 822 for the list of special characters that we need to keep in quotes.
	     *      Refer: https://www.w3.org/Protocols/rfc1341/4_Content-Type.html
	     * @param {Object} structured Parsed header value
	     * @return {String} joined header value
	     */
	    buildHeaderValue(structured) {
	        let paramsArray = [];

	        Object.keys(structured.params || {}).forEach(param => {
	            // filename might include unicode characters so it is a special case
	            // other values probably do not
	            let value = structured.params[param];
	            if (!this.isPlainText(value, true) || value.length >= 75) {
	                this.buildHeaderParam(param, value, 50).forEach(encodedParam => {
	                    if (!/[\s"\\;:/=(),<>@[\]?]|^[-']|'$/.test(encodedParam.value) || encodedParam.key.substr(-1) === '*') {
	                        paramsArray.push(encodedParam.key + '=' + encodedParam.value);
	                    } else {
	                        paramsArray.push(encodedParam.key + '=' + JSON.stringify(encodedParam.value));
	                    }
	                });
	            } else if (/[\s'"\\;:/=(),<>@[\]?]|^-/.test(value)) {
	                paramsArray.push(param + '=' + JSON.stringify(value));
	            } else {
	                paramsArray.push(param + '=' + value);
	            }
	        });

	        return structured.value + (paramsArray.length ? '; ' + paramsArray.join('; ') : '');
	    },

	    /**
	     * Encodes a string or an Buffer to an UTF-8 Parameter Value Continuation encoding (rfc2231)
	     * Useful for splitting long parameter values.
	     *
	     * For example
	     *      title="unicode string"
	     * becomes
	     *     title*0*=utf-8''unicode
	     *     title*1*=%20string
	     *
	     * @param {String|Buffer} data String to be encoded
	     * @param {Number} [maxLength=50] Max length for generated chunks
	     * @param {String} [fromCharset='UTF-8'] Source sharacter set
	     * @return {Array} A list of encoded keys and headers
	     */
	    buildHeaderParam(key, data, maxLength) {
	        let list = [];
	        let encodedStr = typeof data === 'string' ? data : (data || '').toString();
	        let encodedStrArr;
	        let chr, ord;
	        let line;
	        let startPos = 0;
	        let i, len;

	        maxLength = maxLength || 50;

	        // process ascii only text
	        if (this.isPlainText(data, true)) {
	            // check if conversion is even needed
	            if (encodedStr.length <= maxLength) {
	                return [
	                    {
	                        key,
	                        value: encodedStr
	                    }
	                ];
	            }

	            encodedStr = encodedStr.replace(new RegExp('.{' + maxLength + '}', 'g'), str => {
	                list.push({
	                    line: str
	                });
	                return '';
	            });

	            if (encodedStr) {
	                list.push({
	                    line: encodedStr
	                });
	            }
	        } else {
	            if (/[\uD800-\uDBFF]/.test(encodedStr)) {
	                // string containts surrogate pairs, so normalize it to an array of bytes
	                encodedStrArr = [];
	                for (i = 0, len = encodedStr.length; i < len; i++) {
	                    chr = encodedStr.charAt(i);
	                    ord = chr.charCodeAt(0);
	                    if (ord >= 0xd800 && ord <= 0xdbff && i < len - 1) {
	                        chr += encodedStr.charAt(i + 1);
	                        encodedStrArr.push(chr);
	                        i++;
	                    } else {
	                        encodedStrArr.push(chr);
	                    }
	                }
	                encodedStr = encodedStrArr;
	            }

	            // first line includes the charset and language info and needs to be encoded
	            // even if it does not contain any unicode characters
	            line = 'utf-8\x27\x27';
	            let encoded = true;
	            startPos = 0;

	            // process text with unicode or special chars
	            for (i = 0, len = encodedStr.length; i < len; i++) {
	                chr = encodedStr[i];

	                if (encoded) {
	                    chr = this.safeEncodeURIComponent(chr);
	                } else {
	                    // try to urlencode current char
	                    chr = chr === ' ' ? chr : this.safeEncodeURIComponent(chr);
	                    // By default it is not required to encode a line, the need
	                    // only appears when the string contains unicode or special chars
	                    // in this case we start processing the line over and encode all chars
	                    if (chr !== encodedStr[i]) {
	                        // Check if it is even possible to add the encoded char to the line
	                        // If not, there is no reason to use this line, just push it to the list
	                        // and start a new line with the char that needs encoding
	                        if ((this.safeEncodeURIComponent(line) + chr).length >= maxLength) {
	                            list.push({
	                                line,
	                                encoded
	                            });
	                            line = '';
	                            startPos = i - 1;
	                        } else {
	                            encoded = true;
	                            i = startPos;
	                            line = '';
	                            continue;
	                        }
	                    }
	                }

	                // if the line is already too long, push it to the list and start a new one
	                if ((line + chr).length >= maxLength) {
	                    list.push({
	                        line,
	                        encoded
	                    });
	                    line = chr = encodedStr[i] === ' ' ? ' ' : this.safeEncodeURIComponent(encodedStr[i]);
	                    if (chr === encodedStr[i]) {
	                        encoded = false;
	                        startPos = i - 1;
	                    } else {
	                        encoded = true;
	                    }
	                } else {
	                    line += chr;
	                }
	            }

	            if (line) {
	                list.push({
	                    line,
	                    encoded
	                });
	            }
	        }

	        return list.map((item, i) => ({
	            // encoded lines: {name}*{part}*
	            // unencoded lines: {name}*{part}
	            // if any line needs to be encoded then the first line (part==0) is always encoded
	            key: key + '*' + i + (item.encoded ? '*' : ''),
	            value: item.line
	        }));
	    },

	    /**
	     * Parses a header value with key=value arguments into a structured
	     * object.
	     *
	     *   parseHeaderValue('content-type: text/plain; CHARSET='UTF-8'') ->
	     *   {
	     *     'value': 'text/plain',
	     *     'params': {
	     *       'charset': 'UTF-8'
	     *     }
	     *   }
	     *
	     * @param {String} str Header value
	     * @return {Object} Header value as a parsed structure
	     */
	    parseHeaderValue(str) {
	        let response = {
	            value: false,
	            params: {}
	        };
	        let key = false;
	        let value = '';
	        let type = 'value';
	        let quote = false;
	        let escaped = false;
	        let chr;

	        for (let i = 0, len = str.length; i < len; i++) {
	            chr = str.charAt(i);
	            if (type === 'key') {
	                if (chr === '=') {
	                    key = value.trim().toLowerCase();
	                    type = 'value';
	                    value = '';
	                    continue;
	                }
	                value += chr;
	            } else {
	                if (escaped) {
	                    value += chr;
	                } else if (chr === '\\') {
	                    escaped = true;
	                    continue;
	                } else if (quote && chr === quote) {
	                    quote = false;
	                } else if (!quote && chr === '"') {
	                    quote = chr;
	                } else if (!quote && chr === ';') {
	                    if (key === false) {
	                        response.value = value.trim();
	                    } else {
	                        response.params[key] = value.trim();
	                    }
	                    type = 'key';
	                    value = '';
	                } else {
	                    value += chr;
	                }
	                escaped = false;
	            }
	        }

	        if (type === 'value') {
	            if (key === false) {
	                response.value = value.trim();
	            } else {
	                response.params[key] = value.trim();
	            }
	        } else if (value.trim()) {
	            response.params[value.trim().toLowerCase()] = '';
	        }

	        // handle parameter value continuations
	        // https://tools.ietf.org/html/rfc2231#section-3

	        // preprocess values
	        Object.keys(response.params).forEach(key => {
	            let actualKey, nr, match, value;
	            if ((match = key.match(/(\*(\d+)|\*(\d+)\*|\*)$/))) {
	                actualKey = key.substr(0, match.index);
	                nr = Number(match[2] || match[3]) || 0;

	                if (!response.params[actualKey] || typeof response.params[actualKey] !== 'object') {
	                    response.params[actualKey] = {
	                        charset: false,
	                        values: []
	                    };
	                }

	                value = response.params[key];

	                if (nr === 0 && match[0].substr(-1) === '*' && (match = value.match(/^([^']*)'[^']*'(.*)$/))) {
	                    response.params[actualKey].charset = match[1] || 'iso-8859-1';
	                    value = match[2];
	                }

	                response.params[actualKey].values[nr] = value;

	                // remove the old reference
	                delete response.params[key];
	            }
	        });

	        // concatenate split rfc2231 strings and convert encoded strings to mime encoded words
	        Object.keys(response.params).forEach(key => {
	            let value;
	            if (response.params[key] && Array.isArray(response.params[key].values)) {
	                value = response.params[key].values.map(val => val || '').join('');

	                if (response.params[key].charset) {
	                    // convert "%AB" to "=?charset?Q?=AB?="
	                    response.params[key] =
	                        '=?' +
	                        response.params[key].charset +
	                        '?Q?' +
	                        value
	                            // fix invalidly encoded chars
	                            .replace(/[=?_\s]/g, s => {
	                                let c = s.charCodeAt(0).toString(16);
	                                if (s === ' ') {
	                                    return '_';
	                                } else {
	                                    return '%' + (c.length < 2 ? '0' : '') + c;
	                                }
	                            })
	                            // change from urlencoding to percent encoding
	                            .replace(/%/g, '=') +
	                        '?=';
	                } else {
	                    response.params[key] = value;
	                }
	            }
	        });

	        return response;
	    },

	    /**
	     * Returns file extension for a content type string. If no suitable extensions
	     * are found, 'bin' is used as the default extension
	     *
	     * @param {String} mimeType Content type to be checked for
	     * @return {String} File extension
	     */
	    detectExtension: mimeType => mimeTypes.detectExtension(mimeType),

	    /**
	     * Returns content type for a file extension. If no suitable content types
	     * are found, 'application/octet-stream' is used as the default content type
	     *
	     * @param {String} extension Extension to be checked for
	     * @return {String} File extension
	     */
	    detectMimeType: extension => mimeTypes.detectMimeType(extension),

	    /**
	     * Folds long lines, useful for folding header lines (afterSpace=false) and
	     * flowed text (afterSpace=true)
	     *
	     * @param {String} str String to be folded
	     * @param {Number} [lineLength=76] Maximum length of a line
	     * @param {Boolean} afterSpace If true, leave a space in th end of a line
	     * @return {String} String with folded lines
	     */
	    foldLines(str, lineLength, afterSpace) {
	        str = (str || '').toString();
	        lineLength = lineLength || 76;

	        let pos = 0,
	            len = str.length,
	            result = '',
	            line,
	            match;

	        while (pos < len) {
	            line = str.substr(pos, lineLength);
	            if (line.length < lineLength) {
	                result += line;
	                break;
	            }
	            if ((match = line.match(/^[^\n\r]*(\r?\n|\r)/))) {
	                line = match[0];
	                result += line;
	                pos += line.length;
	                continue;
	            } else if ((match = line.match(/(\s+)[^\s]*$/)) && match[0].length - (afterSpace ? (match[1] || '').length : 0) < line.length) {
	                line = line.substr(0, line.length - (match[0].length - (afterSpace ? (match[1] || '').length : 0)));
	            } else if ((match = str.substr(pos + line.length).match(/^[^\s]+(\s*)/))) {
	                line = line + match[0].substr(0, match[0].length - (!afterSpace ? (match[1] || '').length : 0));
	            }

	            result += line;
	            pos += line.length;
	            if (pos < len) {
	                result += '\r\n';
	            }
	        }

	        return result;
	    },

	    /**
	     * Splits a mime encoded string. Needed for dividing mime words into smaller chunks
	     *
	     * @param {String} str Mime encoded string to be split up
	     * @param {Number} maxlen Maximum length of characters for one part (minimum 12)
	     * @return {Array} Split string
	     */
	    splitMimeEncodedString: (str, maxlen) => {
	        let curLine,
	            match,
	            chr,
	            done,
	            lines = [];

	        // require at least 12 symbols to fit possible 4 octet UTF-8 sequences
	        maxlen = Math.max(maxlen || 0, 12);

	        while (str.length) {
	            curLine = str.substr(0, maxlen);

	            // move incomplete escaped char back to main
	            if ((match = curLine.match(/[=][0-9A-F]?$/i))) {
	                curLine = curLine.substr(0, match.index);
	            }

	            done = false;
	            while (!done) {
	                done = true;
	                // check if not middle of a unicode char sequence
	                if ((match = str.substr(curLine.length).match(/^[=]([0-9A-F]{2})/i))) {
	                    chr = parseInt(match[1], 16);
	                    // invalid sequence, move one char back anc recheck
	                    if (chr < 0xc2 && chr > 0x7f) {
	                        curLine = curLine.substr(0, curLine.length - 3);
	                        done = false;
	                    }
	                }
	            }

	            if (curLine.length) {
	                lines.push(curLine);
	            }
	            str = str.substr(curLine.length);
	        }

	        return lines;
	    },

	    encodeURICharComponent: chr => {
	        let res = '';
	        let ord = chr.charCodeAt(0).toString(16).toUpperCase();

	        if (ord.length % 2) {
	            ord = '0' + ord;
	        }

	        if (ord.length > 2) {
	            for (let i = 0, len = ord.length / 2; i < len; i++) {
	                res += '%' + ord.substr(i, 2);
	            }
	        } else {
	            res += '%' + ord;
	        }

	        return res;
	    },

	    safeEncodeURIComponent(str) {
	        str = (str || '').toString();

	        try {
	            // might throw if we try to encode invalid sequences, eg. partial emoji
	            str = encodeURIComponent(str);
	        } catch (E) {
	            // should never run
	            return str.replace(/[^\x00-\x1F *'()<>@,;:\\"[\]?=\u007F-\uFFFF]+/g, '');
	        }

	        // ensure chars that are not handled by encodeURICompent are converted as well
	        return str.replace(/[\x00-\x1F *'()<>@,;:\\"[\]?=\u007F-\uFFFF]/g, chr => this.encodeURICharComponent(chr));
	    }
	};
	return mimeFuncs;
}

var addressparser_1;
var hasRequiredAddressparser;

function requireAddressparser () {
	if (hasRequiredAddressparser) return addressparser_1;
	hasRequiredAddressparser = 1;

	/**
	 * Converts tokens for a single address into an address object
	 *
	 * @param {Array} tokens Tokens object
	 * @return {Object} Address object
	 */
	function _handleAddress(tokens) {
	    let token;
	    let isGroup = false;
	    let state = 'text';
	    let address;
	    let addresses = [];
	    let data = {
	        address: [],
	        comment: [],
	        group: [],
	        text: []
	    };
	    let i;
	    let len;

	    // Filter out <addresses>, (comments) and regular text
	    for (i = 0, len = tokens.length; i < len; i++) {
	        token = tokens[i];
	        if (token.type === 'operator') {
	            switch (token.value) {
	                case '<':
	                    state = 'address';
	                    break;
	                case '(':
	                    state = 'comment';
	                    break;
	                case ':':
	                    state = 'group';
	                    isGroup = true;
	                    break;
	                default:
	                    state = 'text';
	            }
	        } else if (token.value) {
	            if (state === 'address') {
	                // handle use case where unquoted name includes a "<"
	                // Apple Mail truncates everything between an unexpected < and an address
	                // and so will we
	                token.value = token.value.replace(/^[^<]*<\s*/, '');
	            }
	            data[state].push(token.value);
	        }
	    }

	    // If there is no text but a comment, replace the two
	    if (!data.text.length && data.comment.length) {
	        data.text = data.comment;
	        data.comment = [];
	    }

	    if (isGroup) {
	        // http://tools.ietf.org/html/rfc2822#appendix-A.1.3
	        data.text = data.text.join(' ');
	        addresses.push({
	            name: data.text || (address && address.name),
	            group: data.group.length ? addressparser(data.group.join(',')) : []
	        });
	    } else {
	        // If no address was found, try to detect one from regular text
	        if (!data.address.length && data.text.length) {
	            for (i = data.text.length - 1; i >= 0; i--) {
	                if (data.text[i].match(/^[^@\s]+@[^@\s]+$/)) {
	                    data.address = data.text.splice(i, 1);
	                    break;
	                }
	            }

	            let _regexHandler = function (address) {
	                if (!data.address.length) {
	                    data.address = [address.trim()];
	                    return ' ';
	                } else {
	                    return address;
	                }
	            };

	            // still no address
	            if (!data.address.length) {
	                for (i = data.text.length - 1; i >= 0; i--) {
	                    // fixed the regex to parse email address correctly when email address has more than one @
	                    data.text[i] = data.text[i].replace(/\s*\b[^@\s]+@[^\s]+\b\s*/, _regexHandler).trim();
	                    if (data.address.length) {
	                        break;
	                    }
	                }
	            }
	        }

	        // If there's still is no text but a comment exixts, replace the two
	        if (!data.text.length && data.comment.length) {
	            data.text = data.comment;
	            data.comment = [];
	        }

	        // Keep only the first address occurence, push others to regular text
	        if (data.address.length > 1) {
	            data.text = data.text.concat(data.address.splice(1));
	        }

	        // Join values with spaces
	        data.text = data.text.join(' ');
	        data.address = data.address.join(' ');

	        if (!data.address && isGroup) {
	            return [];
	        } else {
	            address = {
	                address: data.address || data.text || '',
	                name: data.text || data.address || ''
	            };

	            if (address.address === address.name) {
	                if ((address.address || '').match(/@/)) {
	                    address.name = '';
	                } else {
	                    address.address = '';
	                }
	            }

	            addresses.push(address);
	        }
	    }

	    return addresses;
	}

	/**
	 * Creates a Tokenizer object for tokenizing address field strings
	 *
	 * @constructor
	 * @param {String} str Address field string
	 */
	class Tokenizer {
	    constructor(str) {
	        this.str = (str || '').toString();
	        this.operatorCurrent = '';
	        this.operatorExpecting = '';
	        this.node = null;
	        this.escaped = false;

	        this.list = [];
	        /**
	         * Operator tokens and which tokens are expected to end the sequence
	         */
	        this.operators = {
	            '"': '"',
	            '(': ')',
	            '<': '>',
	            ',': '',
	            ':': ';',
	            // Semicolons are not a legal delimiter per the RFC2822 grammar other
	            // than for terminating a group, but they are also not valid for any
	            // other use in this context.  Given that some mail clients have
	            // historically allowed the semicolon as a delimiter equivalent to the
	            // comma in their UI, it makes sense to treat them the same as a comma
	            // when used outside of a group.
	            ';': ''
	        };
	    }

	    /**
	     * Tokenizes the original input string
	     *
	     * @return {Array} An array of operator|text tokens
	     */
	    tokenize() {
	        let chr,
	            list = [];
	        for (let i = 0, len = this.str.length; i < len; i++) {
	            chr = this.str.charAt(i);
	            this.checkChar(chr);
	        }

	        this.list.forEach(node => {
	            node.value = (node.value || '').toString().trim();
	            if (node.value) {
	                list.push(node);
	            }
	        });

	        return list;
	    }

	    /**
	     * Checks if a character is an operator or text and acts accordingly
	     *
	     * @param {String} chr Character from the address field
	     */
	    checkChar(chr) {
	        if (this.escaped) ; else if (chr === this.operatorExpecting) {
	            this.node = {
	                type: 'operator',
	                value: chr
	            };
	            this.list.push(this.node);
	            this.node = null;
	            this.operatorExpecting = '';
	            this.escaped = false;
	            return;
	        } else if (!this.operatorExpecting && chr in this.operators) {
	            this.node = {
	                type: 'operator',
	                value: chr
	            };
	            this.list.push(this.node);
	            this.node = null;
	            this.operatorExpecting = this.operators[chr];
	            this.escaped = false;
	            return;
	        } else if (['"', "'"].includes(this.operatorExpecting) && chr === '\\') {
	            this.escaped = true;
	            return;
	        }

	        if (!this.node) {
	            this.node = {
	                type: 'text',
	                value: ''
	            };
	            this.list.push(this.node);
	        }

	        if (chr === '\n') {
	            // Convert newlines to spaces. Carriage return is ignored as \r and \n usually
	            // go together anyway and there already is a WS for \n. Lone \r means something is fishy.
	            chr = ' ';
	        }

	        if (chr.charCodeAt(0) >= 0x21 || [' ', '\t'].includes(chr)) {
	            // skip command bytes
	            this.node.value += chr;
	        }

	        this.escaped = false;
	    }
	}

	/**
	 * Parses structured e-mail addresses from an address field
	 *
	 * Example:
	 *
	 *    'Name <address@domain>'
	 *
	 * will be converted to
	 *
	 *     [{name: 'Name', address: 'address@domain'}]
	 *
	 * @param {String} str Address field
	 * @return {Array} An array of address objects
	 */
	function addressparser(str, options) {
	    options = options || {};

	    let tokenizer = new Tokenizer(str);
	    let tokens = tokenizer.tokenize();

	    let addresses = [];
	    let address = [];
	    let parsedAddresses = [];

	    tokens.forEach(token => {
	        if (token.type === 'operator' && (token.value === ',' || token.value === ';')) {
	            if (address.length) {
	                addresses.push(address);
	            }
	            address = [];
	        } else {
	            address.push(token);
	        }
	    });

	    if (address.length) {
	        addresses.push(address);
	    }

	    addresses.forEach(address => {
	        address = _handleAddress(address);
	        if (address.length) {
	            parsedAddresses = parsedAddresses.concat(address);
	        }
	    });

	    if (options.flatten) {
	        let addresses = [];
	        let walkAddressList = list => {
	            list.forEach(address => {
	                if (address.group) {
	                    return walkAddressList(address.group);
	                } else {
	                    addresses.push(address);
	                }
	            });
	        };
	        walkAddressList(parsedAddresses);
	        return addresses;
	    }

	    return parsedAddresses;
	}

	// expose to the world
	addressparser_1 = addressparser;
	return addressparser_1;
}

var lastNewline;
var hasRequiredLastNewline;

function requireLastNewline () {
	if (hasRequiredLastNewline) return lastNewline;
	hasRequiredLastNewline = 1;

	const Transform = require$$0$3.Transform;

	class LastNewline extends Transform {
	    constructor() {
	        super();
	        this.lastByte = false;
	    }

	    _transform(chunk, encoding, done) {
	        if (chunk.length) {
	            this.lastByte = chunk[chunk.length - 1];
	        }

	        this.push(chunk);
	        done();
	    }

	    _flush(done) {
	        if (this.lastByte === 0x0a) {
	            return done();
	        }
	        if (this.lastByte === 0x0d) {
	            this.push(Buffer.from('\n'));
	            return done();
	        }
	        this.push(Buffer.from('\r\n'));
	        return done();
	    }
	}

	lastNewline = LastNewline;
	return lastNewline;
}

var leWindows;
var hasRequiredLeWindows;

function requireLeWindows () {
	if (hasRequiredLeWindows) return leWindows;
	hasRequiredLeWindows = 1;

	const stream = require$$0$3;
	const Transform = stream.Transform;

	/**
	 * Ensures that only <CR><LF> sequences are used for linebreaks
	 *
	 * @param {Object} options Stream options
	 */
	class LeWindows extends Transform {
	    constructor(options) {
	        super(options);
	        // init Transform
	        this.options = options || {};
	        this.lastByte = false;
	    }

	    /**
	     * Escapes dots
	     */
	    _transform(chunk, encoding, done) {
	        let buf;
	        let lastPos = 0;

	        for (let i = 0, len = chunk.length; i < len; i++) {
	            if (chunk[i] === 0x0a) {
	                // \n
	                if ((i && chunk[i - 1] !== 0x0d) || (!i && this.lastByte !== 0x0d)) {
	                    if (i > lastPos) {
	                        buf = chunk.slice(lastPos, i);
	                        this.push(buf);
	                    }
	                    this.push(Buffer.from('\r\n'));
	                    lastPos = i + 1;
	                }
	            }
	        }

	        if (lastPos && lastPos < chunk.length) {
	            buf = chunk.slice(lastPos);
	            this.push(buf);
	        } else if (!lastPos) {
	            this.push(chunk);
	        }

	        this.lastByte = chunk[chunk.length - 1];
	        done();
	    }
	}

	leWindows = LeWindows;
	return leWindows;
}

var leUnix;
var hasRequiredLeUnix;

function requireLeUnix () {
	if (hasRequiredLeUnix) return leUnix;
	hasRequiredLeUnix = 1;

	const stream = require$$0$3;
	const Transform = stream.Transform;

	/**
	 * Ensures that only <LF> is used for linebreaks
	 *
	 * @param {Object} options Stream options
	 */
	class LeWindows extends Transform {
	    constructor(options) {
	        super(options);
	        // init Transform
	        this.options = options || {};
	    }

	    /**
	     * Escapes dots
	     */
	    _transform(chunk, encoding, done) {
	        let buf;
	        let lastPos = 0;

	        for (let i = 0, len = chunk.length; i < len; i++) {
	            if (chunk[i] === 0x0d) {
	                // \n
	                buf = chunk.slice(lastPos, i);
	                lastPos = i + 1;
	                this.push(buf);
	            }
	        }
	        if (lastPos && lastPos < chunk.length) {
	            buf = chunk.slice(lastPos);
	            this.push(buf);
	        } else if (!lastPos) {
	            this.push(chunk);
	        }
	        done();
	    }
	}

	leUnix = LeWindows;
	return leUnix;
}

/* eslint no-undefined: 0, prefer-spread: 0, no-control-regex: 0 */

var mimeNode;
var hasRequiredMimeNode;

function requireMimeNode () {
	if (hasRequiredMimeNode) return mimeNode;
	hasRequiredMimeNode = 1;

	const crypto = require$$5;
	const fs = require$$2$1;
	const punycode = require$$2$2;
	const PassThrough = require$$0$3.PassThrough;
	const shared = requireShared();

	const mimeFuncs = requireMimeFuncs();
	const qp = requireQp();
	const base64 = requireBase64();
	const addressparser = requireAddressparser();
	const nmfetch = requireFetch();
	const LastNewline = requireLastNewline();

	const LeWindows = requireLeWindows();
	const LeUnix = requireLeUnix();

	/**
	 * Creates a new mime tree node. Assumes 'multipart/*' as the content type
	 * if it is a branch, anything else counts as leaf. If rootNode is missing from
	 * the options, assumes this is the root.
	 *
	 * @param {String} contentType Define the content type for the node. Can be left blank for attachments (derived from filename)
	 * @param {Object} [options] optional options
	 * @param {Object} [options.rootNode] root node for this tree
	 * @param {Object} [options.parentNode] immediate parent for this node
	 * @param {Object} [options.filename] filename for an attachment node
	 * @param {String} [options.baseBoundary] shared part of the unique multipart boundary
	 * @param {Boolean} [options.keepBcc] If true, do not exclude Bcc from the generated headers
	 * @param {Function} [options.normalizeHeaderKey] method to normalize header keys for custom caseing
	 * @param {String} [options.textEncoding] either 'Q' (the default) or 'B'
	 */
	class MimeNode {
	    constructor(contentType, options) {
	        this.nodeCounter = 0;

	        options = options || {};

	        /**
	         * shared part of the unique multipart boundary
	         */
	        this.baseBoundary = options.baseBoundary || crypto.randomBytes(8).toString('hex');
	        this.boundaryPrefix = options.boundaryPrefix || '--_NmP';

	        this.disableFileAccess = !!options.disableFileAccess;
	        this.disableUrlAccess = !!options.disableUrlAccess;

	        this.normalizeHeaderKey = options.normalizeHeaderKey;

	        /**
	         * If date headers is missing and current node is the root, this value is used instead
	         */
	        this.date = new Date();

	        /**
	         * Root node for current mime tree
	         */
	        this.rootNode = options.rootNode || this;

	        /**
	         * If true include Bcc in generated headers (if available)
	         */
	        this.keepBcc = !!options.keepBcc;

	        /**
	         * If filename is specified but contentType is not (probably an attachment)
	         * detect the content type from filename extension
	         */
	        if (options.filename) {
	            /**
	             * Filename for this node. Useful with attachments
	             */
	            this.filename = options.filename;
	            if (!contentType) {
	                contentType = mimeFuncs.detectMimeType(this.filename.split('.').pop());
	            }
	        }

	        /**
	         * Indicates which encoding should be used for header strings: "Q" or "B"
	         */
	        this.textEncoding = (options.textEncoding || '').toString().trim().charAt(0).toUpperCase();

	        /**
	         * Immediate parent for this node (or undefined if not set)
	         */
	        this.parentNode = options.parentNode;

	        /**
	         * Hostname for default message-id values
	         */
	        this.hostname = options.hostname;

	        /**
	         * If set to 'win' then uses \r\n, if 'linux' then \n. If not set (or `raw` is used) then newlines are kept as is.
	         */
	        this.newline = options.newline;

	        /**
	         * An array for possible child nodes
	         */
	        this.childNodes = [];

	        /**
	         * Used for generating unique boundaries (prepended to the shared base)
	         */
	        this._nodeId = ++this.rootNode.nodeCounter;

	        /**
	         * A list of header values for this node in the form of [{key:'', value:''}]
	         */
	        this._headers = [];

	        /**
	         * True if the content only uses ASCII printable characters
	         * @type {Boolean}
	         */
	        this._isPlainText = false;

	        /**
	         * True if the content is plain text but has longer lines than allowed
	         * @type {Boolean}
	         */
	        this._hasLongLines = false;

	        /**
	         * If set, use instead this value for envelopes instead of generating one
	         * @type {Boolean}
	         */
	        this._envelope = false;

	        /**
	         * If set then use this value as the stream content instead of building it
	         * @type {String|Buffer|Stream}
	         */
	        this._raw = false;

	        /**
	         * Additional transform streams that the message will be piped before
	         * exposing by createReadStream
	         * @type {Array}
	         */
	        this._transforms = [];

	        /**
	         * Additional process functions that the message will be piped through before
	         * exposing by createReadStream. These functions are run after transforms
	         * @type {Array}
	         */
	        this._processFuncs = [];

	        /**
	         * If content type is set (or derived from the filename) add it to headers
	         */
	        if (contentType) {
	            this.setHeader('Content-Type', contentType);
	        }
	    }

	    /////// PUBLIC METHODS

	    /**
	     * Creates and appends a child node.Arguments provided are passed to MimeNode constructor
	     *
	     * @param {String} [contentType] Optional content type
	     * @param {Object} [options] Optional options object
	     * @return {Object} Created node object
	     */
	    createChild(contentType, options) {
	        if (!options && typeof contentType === 'object') {
	            options = contentType;
	            contentType = undefined;
	        }
	        let node = new MimeNode(contentType, options);
	        this.appendChild(node);
	        return node;
	    }

	    /**
	     * Appends an existing node to the mime tree. Removes the node from an existing
	     * tree if needed
	     *
	     * @param {Object} childNode node to be appended
	     * @return {Object} Appended node object
	     */
	    appendChild(childNode) {
	        if (childNode.rootNode !== this.rootNode) {
	            childNode.rootNode = this.rootNode;
	            childNode._nodeId = ++this.rootNode.nodeCounter;
	        }

	        childNode.parentNode = this;

	        this.childNodes.push(childNode);
	        return childNode;
	    }

	    /**
	     * Replaces current node with another node
	     *
	     * @param {Object} node Replacement node
	     * @return {Object} Replacement node
	     */
	    replace(node) {
	        if (node === this) {
	            return this;
	        }

	        this.parentNode.childNodes.forEach((childNode, i) => {
	            if (childNode === this) {
	                node.rootNode = this.rootNode;
	                node.parentNode = this.parentNode;
	                node._nodeId = this._nodeId;

	                this.rootNode = this;
	                this.parentNode = undefined;

	                node.parentNode.childNodes[i] = node;
	            }
	        });

	        return node;
	    }

	    /**
	     * Removes current node from the mime tree
	     *
	     * @return {Object} removed node
	     */
	    remove() {
	        if (!this.parentNode) {
	            return this;
	        }

	        for (let i = this.parentNode.childNodes.length - 1; i >= 0; i--) {
	            if (this.parentNode.childNodes[i] === this) {
	                this.parentNode.childNodes.splice(i, 1);
	                this.parentNode = undefined;
	                this.rootNode = this;
	                return this;
	            }
	        }
	    }

	    /**
	     * Sets a header value. If the value for selected key exists, it is overwritten.
	     * You can set multiple values as well by using [{key:'', value:''}] or
	     * {key: 'value'} as the first argument.
	     *
	     * @param {String|Array|Object} key Header key or a list of key value pairs
	     * @param {String} value Header value
	     * @return {Object} current node
	     */
	    setHeader(key, value) {
	        let added = false,
	            headerValue;

	        // Allow setting multiple headers at once
	        if (!value && key && typeof key === 'object') {
	            // allow {key:'content-type', value: 'text/plain'}
	            if (key.key && 'value' in key) {
	                this.setHeader(key.key, key.value);
	            } else if (Array.isArray(key)) {
	                // allow [{key:'content-type', value: 'text/plain'}]
	                key.forEach(i => {
	                    this.setHeader(i.key, i.value);
	                });
	            } else {
	                // allow {'content-type': 'text/plain'}
	                Object.keys(key).forEach(i => {
	                    this.setHeader(i, key[i]);
	                });
	            }
	            return this;
	        }

	        key = this._normalizeHeaderKey(key);

	        headerValue = {
	            key,
	            value
	        };

	        // Check if the value exists and overwrite
	        for (let i = 0, len = this._headers.length; i < len; i++) {
	            if (this._headers[i].key === key) {
	                if (!added) {
	                    // replace the first match
	                    this._headers[i] = headerValue;
	                    added = true;
	                } else {
	                    // remove following matches
	                    this._headers.splice(i, 1);
	                    i--;
	                    len--;
	                }
	            }
	        }

	        // match not found, append the value
	        if (!added) {
	            this._headers.push(headerValue);
	        }

	        return this;
	    }

	    /**
	     * Adds a header value. If the value for selected key exists, the value is appended
	     * as a new field and old one is not touched.
	     * You can set multiple values as well by using [{key:'', value:''}] or
	     * {key: 'value'} as the first argument.
	     *
	     * @param {String|Array|Object} key Header key or a list of key value pairs
	     * @param {String} value Header value
	     * @return {Object} current node
	     */
	    addHeader(key, value) {
	        // Allow setting multiple headers at once
	        if (!value && key && typeof key === 'object') {
	            // allow {key:'content-type', value: 'text/plain'}
	            if (key.key && key.value) {
	                this.addHeader(key.key, key.value);
	            } else if (Array.isArray(key)) {
	                // allow [{key:'content-type', value: 'text/plain'}]
	                key.forEach(i => {
	                    this.addHeader(i.key, i.value);
	                });
	            } else {
	                // allow {'content-type': 'text/plain'}
	                Object.keys(key).forEach(i => {
	                    this.addHeader(i, key[i]);
	                });
	            }
	            return this;
	        } else if (Array.isArray(value)) {
	            value.forEach(val => {
	                this.addHeader(key, val);
	            });
	            return this;
	        }

	        this._headers.push({
	            key: this._normalizeHeaderKey(key),
	            value
	        });

	        return this;
	    }

	    /**
	     * Retrieves the first mathcing value of a selected key
	     *
	     * @param {String} key Key to search for
	     * @retun {String} Value for the key
	     */
	    getHeader(key) {
	        key = this._normalizeHeaderKey(key);
	        for (let i = 0, len = this._headers.length; i < len; i++) {
	            if (this._headers[i].key === key) {
	                return this._headers[i].value;
	            }
	        }
	    }

	    /**
	     * Sets body content for current node. If the value is a string, charset is added automatically
	     * to Content-Type (if it is text/*). If the value is a Buffer, you need to specify
	     * the charset yourself
	     *
	     * @param (String|Buffer) content Body content
	     * @return {Object} current node
	     */
	    setContent(content) {
	        this.content = content;
	        if (typeof this.content.pipe === 'function') {
	            // pre-stream handler. might be triggered if a stream is set as content
	            // and 'error' fires before anything is done with this stream
	            this._contentErrorHandler = err => {
	                this.content.removeListener('error', this._contentErrorHandler);
	                this.content = err;
	            };
	            this.content.once('error', this._contentErrorHandler);
	        } else if (typeof this.content === 'string') {
	            this._isPlainText = mimeFuncs.isPlainText(this.content);
	            if (this._isPlainText && mimeFuncs.hasLongerLines(this.content, 76)) {
	                // If there are lines longer than 76 symbols/bytes do not use 7bit
	                this._hasLongLines = true;
	            }
	        }
	        return this;
	    }

	    build(callback) {
	        let promise;

	        if (!callback) {
	            promise = new Promise((resolve, reject) => {
	                callback = shared.callbackPromise(resolve, reject);
	            });
	        }

	        let stream = this.createReadStream();
	        let buf = [];
	        let buflen = 0;
	        let returned = false;

	        stream.on('readable', () => {
	            let chunk;

	            while ((chunk = stream.read()) !== null) {
	                buf.push(chunk);
	                buflen += chunk.length;
	            }
	        });

	        stream.once('error', err => {
	            if (returned) {
	                return;
	            }
	            returned = true;

	            return callback(err);
	        });

	        stream.once('end', chunk => {
	            if (returned) {
	                return;
	            }
	            returned = true;

	            if (chunk && chunk.length) {
	                buf.push(chunk);
	                buflen += chunk.length;
	            }
	            return callback(null, Buffer.concat(buf, buflen));
	        });

	        return promise;
	    }

	    getTransferEncoding() {
	        let transferEncoding = false;
	        let contentType = (this.getHeader('Content-Type') || '').toString().toLowerCase().trim();

	        if (this.content) {
	            transferEncoding = (this.getHeader('Content-Transfer-Encoding') || '').toString().toLowerCase().trim();
	            if (!transferEncoding || !['base64', 'quoted-printable'].includes(transferEncoding)) {
	                if (/^text\//i.test(contentType)) {
	                    // If there are no special symbols, no need to modify the text
	                    if (this._isPlainText && !this._hasLongLines) {
	                        transferEncoding = '7bit';
	                    } else if (typeof this.content === 'string' || this.content instanceof Buffer) {
	                        // detect preferred encoding for string value
	                        transferEncoding = this._getTextEncoding(this.content) === 'Q' ? 'quoted-printable' : 'base64';
	                    } else {
	                        // we can not check content for a stream, so either use preferred encoding or fallback to QP
	                        transferEncoding = this.textEncoding === 'B' ? 'base64' : 'quoted-printable';
	                    }
	                } else if (!/^(multipart|message)\//i.test(contentType)) {
	                    transferEncoding = transferEncoding || 'base64';
	                }
	            }
	        }
	        return transferEncoding;
	    }

	    /**
	     * Builds the header block for the mime node. Append \r\n\r\n before writing the content
	     *
	     * @returns {String} Headers
	     */
	    buildHeaders() {
	        let transferEncoding = this.getTransferEncoding();
	        let headers = [];

	        if (transferEncoding) {
	            this.setHeader('Content-Transfer-Encoding', transferEncoding);
	        }

	        if (this.filename && !this.getHeader('Content-Disposition')) {
	            this.setHeader('Content-Disposition', 'attachment');
	        }

	        // Ensure mandatory header fields
	        if (this.rootNode === this) {
	            if (!this.getHeader('Date')) {
	                this.setHeader('Date', this.date.toUTCString().replace(/GMT/, '+0000'));
	            }

	            // ensure that Message-Id is present
	            this.messageId();

	            if (!this.getHeader('MIME-Version')) {
	                this.setHeader('MIME-Version', '1.0');
	            }
	        }

	        this._headers.forEach(header => {
	            let key = header.key;
	            let value = header.value;
	            let structured;
	            let param;
	            let options = {};
	            let formattedHeaders = ['From', 'Sender', 'To', 'Cc', 'Bcc', 'Reply-To', 'Date', 'References'];

	            if (value && typeof value === 'object' && !formattedHeaders.includes(key)) {
	                Object.keys(value).forEach(key => {
	                    if (key !== 'value') {
	                        options[key] = value[key];
	                    }
	                });
	                value = (value.value || '').toString();
	                if (!value.trim()) {
	                    return;
	                }
	            }

	            if (options.prepared) {
	                // header value is
	                if (options.foldLines) {
	                    headers.push(mimeFuncs.foldLines(key + ': ' + value));
	                } else {
	                    headers.push(key + ': ' + value);
	                }
	                return;
	            }

	            switch (header.key) {
	                case 'Content-Disposition':
	                    structured = mimeFuncs.parseHeaderValue(value);
	                    if (this.filename) {
	                        structured.params.filename = this.filename;
	                    }
	                    value = mimeFuncs.buildHeaderValue(structured);
	                    break;

	                case 'Content-Type':
	                    structured = mimeFuncs.parseHeaderValue(value);

	                    this._handleContentType(structured);

	                    if (structured.value.match(/^text\/plain\b/) && typeof this.content === 'string' && /[\u0080-\uFFFF]/.test(this.content)) {
	                        structured.params.charset = 'utf-8';
	                    }

	                    value = mimeFuncs.buildHeaderValue(structured);

	                    if (this.filename) {
	                        // add support for non-compliant clients like QQ webmail
	                        // we can't build the value with buildHeaderValue as the value is non standard and
	                        // would be converted to parameter continuation encoding that we do not want
	                        param = this._encodeWords(this.filename);

	                        if (param !== this.filename || /[\s'"\\;:/=(),<>@[\]?]|^-/.test(param)) {
	                            // include value in quotes if needed
	                            param = '"' + param + '"';
	                        }
	                        value += '; name=' + param;
	                    }
	                    break;

	                case 'Bcc':
	                    if (!this.keepBcc) {
	                        // skip BCC values
	                        return;
	                    }
	                    break;
	            }

	            value = this._encodeHeaderValue(key, value);

	            // skip empty lines
	            if (!(value || '').toString().trim()) {
	                return;
	            }

	            if (typeof this.normalizeHeaderKey === 'function') {
	                let normalized = this.normalizeHeaderKey(key, value);
	                if (normalized && typeof normalized === 'string' && normalized.length) {
	                    key = normalized;
	                }
	            }

	            headers.push(mimeFuncs.foldLines(key + ': ' + value, 76));
	        });

	        return headers.join('\r\n');
	    }

	    /**
	     * Streams the rfc2822 message from the current node. If this is a root node,
	     * mandatory header fields are set if missing (Date, Message-Id, MIME-Version)
	     *
	     * @return {String} Compiled message
	     */
	    createReadStream(options) {
	        options = options || {};

	        let stream = new PassThrough(options);
	        let outputStream = stream;
	        let transform;

	        this.stream(stream, options, err => {
	            if (err) {
	                outputStream.emit('error', err);
	                return;
	            }
	            stream.end();
	        });

	        for (let i = 0, len = this._transforms.length; i < len; i++) {
	            transform = typeof this._transforms[i] === 'function' ? this._transforms[i]() : this._transforms[i];
	            outputStream.once('error', err => {
	                transform.emit('error', err);
	            });
	            outputStream = outputStream.pipe(transform);
	        }

	        // ensure terminating newline after possible user transforms
	        transform = new LastNewline();
	        outputStream.once('error', err => {
	            transform.emit('error', err);
	        });
	        outputStream = outputStream.pipe(transform);

	        // dkim and stuff
	        for (let i = 0, len = this._processFuncs.length; i < len; i++) {
	            transform = this._processFuncs[i];
	            outputStream = transform(outputStream);
	        }

	        if (this.newline) {
	            const winbreak = ['win', 'windows', 'dos', '\r\n'].includes(this.newline.toString().toLowerCase());
	            const newlineTransform = winbreak ? new LeWindows() : new LeUnix();

	            const stream = outputStream.pipe(newlineTransform);
	            outputStream.on('error', err => stream.emit('error', err));
	            return stream;
	        }

	        return outputStream;
	    }

	    /**
	     * Appends a transform stream object to the transforms list. Final output
	     * is passed through this stream before exposing
	     *
	     * @param {Object} transform Read-Write stream
	     */
	    transform(transform) {
	        this._transforms.push(transform);
	    }

	    /**
	     * Appends a post process function. The functon is run after transforms and
	     * uses the following syntax
	     *
	     *   processFunc(input) -> outputStream
	     *
	     * @param {Object} processFunc Read-Write stream
	     */
	    processFunc(processFunc) {
	        this._processFuncs.push(processFunc);
	    }

	    stream(outputStream, options, done) {
	        let transferEncoding = this.getTransferEncoding();
	        let contentStream;
	        let localStream;

	        // protect actual callback against multiple triggering
	        let returned = false;
	        let callback = err => {
	            if (returned) {
	                return;
	            }
	            returned = true;
	            done(err);
	        };

	        // for multipart nodes, push child nodes
	        // for content nodes end the stream
	        let finalize = () => {
	            let childId = 0;
	            let processChildNode = () => {
	                if (childId >= this.childNodes.length) {
	                    outputStream.write('\r\n--' + this.boundary + '--\r\n');
	                    return callback();
	                }
	                let child = this.childNodes[childId++];
	                outputStream.write((childId > 1 ? '\r\n' : '') + '--' + this.boundary + '\r\n');
	                child.stream(outputStream, options, err => {
	                    if (err) {
	                        return callback(err);
	                    }
	                    setImmediate(processChildNode);
	                });
	            };

	            if (this.multipart) {
	                setImmediate(processChildNode);
	            } else {
	                return callback();
	            }
	        };

	        // pushes node content
	        let sendContent = () => {
	            if (this.content) {
	                if (Object.prototype.toString.call(this.content) === '[object Error]') {
	                    // content is already errored
	                    return callback(this.content);
	                }

	                if (typeof this.content.pipe === 'function') {
	                    this.content.removeListener('error', this._contentErrorHandler);
	                    this._contentErrorHandler = err => callback(err);
	                    this.content.once('error', this._contentErrorHandler);
	                }

	                let createStream = () => {
	                    if (['quoted-printable', 'base64'].includes(transferEncoding)) {
	                        contentStream = new (transferEncoding === 'base64' ? base64 : qp).Encoder(options);

	                        contentStream.pipe(outputStream, {
	                            end: false
	                        });
	                        contentStream.once('end', finalize);
	                        contentStream.once('error', err => callback(err));

	                        localStream = this._getStream(this.content);
	                        localStream.pipe(contentStream);
	                    } else {
	                        // anything that is not QP or Base54 passes as-is
	                        localStream = this._getStream(this.content);
	                        localStream.pipe(outputStream, {
	                            end: false
	                        });
	                        localStream.once('end', finalize);
	                    }

	                    localStream.once('error', err => callback(err));
	                };

	                if (this.content._resolve) {
	                    let chunks = [];
	                    let chunklen = 0;
	                    let returned = false;
	                    let sourceStream = this._getStream(this.content);
	                    sourceStream.on('error', err => {
	                        if (returned) {
	                            return;
	                        }
	                        returned = true;
	                        callback(err);
	                    });
	                    sourceStream.on('readable', () => {
	                        let chunk;
	                        while ((chunk = sourceStream.read()) !== null) {
	                            chunks.push(chunk);
	                            chunklen += chunk.length;
	                        }
	                    });
	                    sourceStream.on('end', () => {
	                        if (returned) {
	                            return;
	                        }
	                        returned = true;
	                        this.content._resolve = false;
	                        this.content._resolvedValue = Buffer.concat(chunks, chunklen);
	                        setImmediate(createStream);
	                    });
	                } else {
	                    setImmediate(createStream);
	                }
	                return;
	            } else {
	                return setImmediate(finalize);
	            }
	        };

	        if (this._raw) {
	            setImmediate(() => {
	                if (Object.prototype.toString.call(this._raw) === '[object Error]') {
	                    // content is already errored
	                    return callback(this._raw);
	                }

	                // remove default error handler (if set)
	                if (typeof this._raw.pipe === 'function') {
	                    this._raw.removeListener('error', this._contentErrorHandler);
	                }

	                let raw = this._getStream(this._raw);
	                raw.pipe(outputStream, {
	                    end: false
	                });
	                raw.on('error', err => outputStream.emit('error', err));
	                raw.on('end', finalize);
	            });
	        } else {
	            outputStream.write(this.buildHeaders() + '\r\n\r\n');
	            setImmediate(sendContent);
	        }
	    }

	    /**
	     * Sets envelope to be used instead of the generated one
	     *
	     * @return {Object} SMTP envelope in the form of {from: 'from@example.com', to: ['to@example.com']}
	     */
	    setEnvelope(envelope) {
	        let list;

	        this._envelope = {
	            from: false,
	            to: []
	        };

	        if (envelope.from) {
	            list = [];
	            this._convertAddresses(this._parseAddresses(envelope.from), list);
	            list = list.filter(address => address && address.address);
	            if (list.length && list[0]) {
	                this._envelope.from = list[0].address;
	            }
	        }
	        ['to', 'cc', 'bcc'].forEach(key => {
	            if (envelope[key]) {
	                this._convertAddresses(this._parseAddresses(envelope[key]), this._envelope.to);
	            }
	        });

	        this._envelope.to = this._envelope.to.map(to => to.address).filter(address => address);

	        let standardFields = ['to', 'cc', 'bcc', 'from'];
	        Object.keys(envelope).forEach(key => {
	            if (!standardFields.includes(key)) {
	                this._envelope[key] = envelope[key];
	            }
	        });

	        return this;
	    }

	    /**
	     * Generates and returns an object with parsed address fields
	     *
	     * @return {Object} Address object
	     */
	    getAddresses() {
	        let addresses = {};

	        this._headers.forEach(header => {
	            let key = header.key.toLowerCase();
	            if (['from', 'sender', 'reply-to', 'to', 'cc', 'bcc'].includes(key)) {
	                if (!Array.isArray(addresses[key])) {
	                    addresses[key] = [];
	                }

	                this._convertAddresses(this._parseAddresses(header.value), addresses[key]);
	            }
	        });

	        return addresses;
	    }

	    /**
	     * Generates and returns SMTP envelope with the sender address and a list of recipients addresses
	     *
	     * @return {Object} SMTP envelope in the form of {from: 'from@example.com', to: ['to@example.com']}
	     */
	    getEnvelope() {
	        if (this._envelope) {
	            return this._envelope;
	        }

	        let envelope = {
	            from: false,
	            to: []
	        };
	        this._headers.forEach(header => {
	            let list = [];
	            if (header.key === 'From' || (!envelope.from && ['Reply-To', 'Sender'].includes(header.key))) {
	                this._convertAddresses(this._parseAddresses(header.value), list);
	                if (list.length && list[0]) {
	                    envelope.from = list[0].address;
	                }
	            } else if (['To', 'Cc', 'Bcc'].includes(header.key)) {
	                this._convertAddresses(this._parseAddresses(header.value), envelope.to);
	            }
	        });

	        envelope.to = envelope.to.map(to => to.address);

	        return envelope;
	    }

	    /**
	     * Returns Message-Id value. If it does not exist, then creates one
	     *
	     * @return {String} Message-Id value
	     */
	    messageId() {
	        let messageId = this.getHeader('Message-ID');
	        // You really should define your own Message-Id field!
	        if (!messageId) {
	            messageId = this._generateMessageId();
	            this.setHeader('Message-ID', messageId);
	        }
	        return messageId;
	    }

	    /**
	     * Sets pregenerated content that will be used as the output of this node
	     *
	     * @param {String|Buffer|Stream} Raw MIME contents
	     */
	    setRaw(raw) {
	        this._raw = raw;

	        if (this._raw && typeof this._raw.pipe === 'function') {
	            // pre-stream handler. might be triggered if a stream is set as content
	            // and 'error' fires before anything is done with this stream
	            this._contentErrorHandler = err => {
	                this._raw.removeListener('error', this._contentErrorHandler);
	                this._raw = err;
	            };
	            this._raw.once('error', this._contentErrorHandler);
	        }

	        return this;
	    }

	    /////// PRIVATE METHODS

	    /**
	     * Detects and returns handle to a stream related with the content.
	     *
	     * @param {Mixed} content Node content
	     * @returns {Object} Stream object
	     */
	    _getStream(content) {
	        let contentStream;

	        if (content._resolvedValue) {
	            // pass string or buffer content as a stream
	            contentStream = new PassThrough();

	            setImmediate(() => {
	                try {
	                    contentStream.end(content._resolvedValue);
	                } catch (err) {
	                    contentStream.emit('error', err);
	                }
	            });

	            return contentStream;
	        } else if (typeof content.pipe === 'function') {
	            // assume as stream
	            return content;
	        } else if (content && typeof content.path === 'string' && !content.href) {
	            if (this.disableFileAccess) {
	                contentStream = new PassThrough();
	                setImmediate(() => contentStream.emit('error', new Error('File access rejected for ' + content.path)));
	                return contentStream;
	            }
	            // read file
	            return fs.createReadStream(content.path);
	        } else if (content && typeof content.href === 'string') {
	            if (this.disableUrlAccess) {
	                contentStream = new PassThrough();
	                setImmediate(() => contentStream.emit('error', new Error('Url access rejected for ' + content.href)));
	                return contentStream;
	            }
	            // fetch URL
	            return nmfetch(content.href, { headers: content.httpHeaders });
	        } else {
	            // pass string or buffer content as a stream
	            contentStream = new PassThrough();

	            setImmediate(() => {
	                try {
	                    contentStream.end(content || '');
	                } catch (err) {
	                    contentStream.emit('error', err);
	                }
	            });
	            return contentStream;
	        }
	    }

	    /**
	     * Parses addresses. Takes in a single address or an array or an
	     * array of address arrays (eg. To: [[first group], [second group],...])
	     *
	     * @param {Mixed} addresses Addresses to be parsed
	     * @return {Array} An array of address objects
	     */
	    _parseAddresses(addresses) {
	        return [].concat.apply(
	            [],
	            [].concat(addresses).map(address => {
	                // eslint-disable-line prefer-spread
	                if (address && address.address) {
	                    address.address = this._normalizeAddress(address.address);
	                    address.name = address.name || '';
	                    return [address];
	                }
	                return addressparser(address);
	            })
	        );
	    }

	    /**
	     * Normalizes a header key, uses Camel-Case form, except for uppercase MIME-
	     *
	     * @param {String} key Key to be normalized
	     * @return {String} key in Camel-Case form
	     */
	    _normalizeHeaderKey(key) {
	        key = (key || '')
	            .toString()
	            // no newlines in keys
	            .replace(/\r?\n|\r/g, ' ')
	            .trim()
	            .toLowerCase()
	            // use uppercase words, except MIME
	            .replace(/^X-SMTPAPI$|^(MIME|DKIM|ARC|BIMI)\b|^[a-z]|-(SPF|FBL|ID|MD5)$|-[a-z]/gi, c => c.toUpperCase())
	            // special case
	            .replace(/^Content-Features$/i, 'Content-features');

	        return key;
	    }

	    /**
	     * Checks if the content type is multipart and defines boundary if needed.
	     * Doesn't return anything, modifies object argument instead.
	     *
	     * @param {Object} structured Parsed header value for 'Content-Type' key
	     */
	    _handleContentType(structured) {
	        this.contentType = structured.value.trim().toLowerCase();

	        this.multipart = /^multipart\//i.test(this.contentType) ? this.contentType.substr(this.contentType.indexOf('/') + 1) : false;

	        if (this.multipart) {
	            this.boundary = structured.params.boundary = structured.params.boundary || this.boundary || this._generateBoundary();
	        } else {
	            this.boundary = false;
	        }
	    }

	    /**
	     * Generates a multipart boundary value
	     *
	     * @return {String} boundary value
	     */
	    _generateBoundary() {
	        return this.rootNode.boundaryPrefix + '-' + this.rootNode.baseBoundary + '-Part_' + this._nodeId;
	    }

	    /**
	     * Encodes a header value for use in the generated rfc2822 email.
	     *
	     * @param {String} key Header key
	     * @param {String} value Header value
	     */
	    _encodeHeaderValue(key, value) {
	        key = this._normalizeHeaderKey(key);

	        switch (key) {
	            // Structured headers
	            case 'From':
	            case 'Sender':
	            case 'To':
	            case 'Cc':
	            case 'Bcc':
	            case 'Reply-To':
	                return this._convertAddresses(this._parseAddresses(value));

	            // values enclosed in <>
	            case 'Message-ID':
	            case 'In-Reply-To':
	            case 'Content-Id':
	                value = (value || '').toString().replace(/\r?\n|\r/g, ' ');

	                if (value.charAt(0) !== '<') {
	                    value = '<' + value;
	                }

	                if (value.charAt(value.length - 1) !== '>') {
	                    value = value + '>';
	                }
	                return value;

	            // space separated list of values enclosed in <>
	            case 'References':
	                value = [].concat
	                    .apply(
	                        [],
	                        [].concat(value || '').map(elm => {
	                            // eslint-disable-line prefer-spread
	                            elm = (elm || '')
	                                .toString()
	                                .replace(/\r?\n|\r/g, ' ')
	                                .trim();
	                            return elm.replace(/<[^>]*>/g, str => str.replace(/\s/g, '')).split(/\s+/);
	                        })
	                    )
	                    .map(elm => {
	                        if (elm.charAt(0) !== '<') {
	                            elm = '<' + elm;
	                        }
	                        if (elm.charAt(elm.length - 1) !== '>') {
	                            elm = elm + '>';
	                        }
	                        return elm;
	                    });

	                return value.join(' ').trim();

	            case 'Date':
	                if (Object.prototype.toString.call(value) === '[object Date]') {
	                    return value.toUTCString().replace(/GMT/, '+0000');
	                }

	                value = (value || '').toString().replace(/\r?\n|\r/g, ' ');
	                return this._encodeWords(value);

	            case 'Content-Type':
	            case 'Content-Disposition':
	                // if it includes a filename then it is already encoded
	                return (value || '').toString().replace(/\r?\n|\r/g, ' ');

	            default:
	                value = (value || '').toString().replace(/\r?\n|\r/g, ' ');
	                // encodeWords only encodes if needed, otherwise the original string is returned
	                return this._encodeWords(value);
	        }
	    }

	    /**
	     * Rebuilds address object using punycode and other adjustments
	     *
	     * @param {Array} addresses An array of address objects
	     * @param {Array} [uniqueList] An array to be populated with addresses
	     * @return {String} address string
	     */
	    _convertAddresses(addresses, uniqueList) {
	        let values = [];

	        uniqueList = uniqueList || [];

	        [].concat(addresses || []).forEach(address => {
	            if (address.address) {
	                address.address = this._normalizeAddress(address.address);

	                if (!address.name) {
	                    values.push(address.address.indexOf(' ') >= 0 ? `<${address.address}>` : `${address.address}`);
	                } else if (address.name) {
	                    values.push(`${this._encodeAddressName(address.name)} <${address.address}>`);
	                }

	                if (address.address) {
	                    if (!uniqueList.filter(a => a.address === address.address).length) {
	                        uniqueList.push(address);
	                    }
	                }
	            } else if (address.group) {
	                let groupListAddresses = (address.group.length ? this._convertAddresses(address.group, uniqueList) : '').trim();
	                values.push(`${this._encodeAddressName(address.name)}:${groupListAddresses};`);
	            }
	        });

	        return values.join(', ');
	    }

	    /**
	     * Normalizes an email address
	     *
	     * @param {Array} address An array of address objects
	     * @return {String} address string
	     */
	    _normalizeAddress(address) {
	        address = (address || '')
	            .toString()
	            .replace(/[\x00-\x1F<>]+/g, ' ') // remove unallowed characters
	            .trim();

	        let lastAt = address.lastIndexOf('@');
	        if (lastAt < 0) {
	            // Bare username
	            return address;
	        }

	        let user = address.substr(0, lastAt);
	        let domain = address.substr(lastAt + 1);

	        // Usernames are not touched and are kept as is even if these include unicode
	        // Domains are punycoded by default
	        // 'jõgeva.ee' will be converted to 'xn--jgeva-dua.ee'
	        // non-unicode domains are left as is

	        let encodedDomain;

	        try {
	            encodedDomain = punycode.toASCII(domain.toLowerCase());
	        } catch (err) {
	            // keep as is?
	        }

	        if (user.indexOf(' ') >= 0) {
	            if (user.charAt(0) !== '"') {
	                user = '"' + user;
	            }
	            if (user.substr(-1) !== '"') {
	                user = user + '"';
	            }
	        }

	        return `${user}@${encodedDomain}`;
	    }

	    /**
	     * If needed, mime encodes the name part
	     *
	     * @param {String} name Name part of an address
	     * @returns {String} Mime word encoded string if needed
	     */
	    _encodeAddressName(name) {
	        if (!/^[\w ']*$/.test(name)) {
	            if (/^[\x20-\x7e]*$/.test(name)) {
	                return '"' + name.replace(/([\\"])/g, '\\$1') + '"';
	            } else {
	                return mimeFuncs.encodeWord(name, this._getTextEncoding(name), 52);
	            }
	        }
	        return name;
	    }

	    /**
	     * If needed, mime encodes the name part
	     *
	     * @param {String} name Name part of an address
	     * @returns {String} Mime word encoded string if needed
	     */
	    _encodeWords(value) {
	        // set encodeAll parameter to true even though it is against the recommendation of RFC2047,
	        // by default only words that include non-ascii should be converted into encoded words
	        // but some clients (eg. Zimbra) do not handle it properly and remove surrounding whitespace
	        return mimeFuncs.encodeWords(value, this._getTextEncoding(value), 52, true);
	    }

	    /**
	     * Detects best mime encoding for a text value
	     *
	     * @param {String} value Value to check for
	     * @return {String} either 'Q' or 'B'
	     */
	    _getTextEncoding(value) {
	        value = (value || '').toString();

	        let encoding = this.textEncoding;
	        let latinLen;
	        let nonLatinLen;

	        if (!encoding) {
	            // count latin alphabet symbols and 8-bit range symbols + control symbols
	            // if there are more latin characters, then use quoted-printable
	            // encoding, otherwise use base64
	            nonLatinLen = (value.match(/[\x00-\x08\x0B\x0C\x0E-\x1F\u0080-\uFFFF]/g) || []).length; // eslint-disable-line no-control-regex
	            latinLen = (value.match(/[a-z]/gi) || []).length;
	            // if there are more latin symbols than binary/unicode, then prefer Q, otherwise B
	            encoding = nonLatinLen < latinLen ? 'Q' : 'B';
	        }
	        return encoding;
	    }

	    /**
	     * Generates a message id
	     *
	     * @return {String} Random Message-ID value
	     */
	    _generateMessageId() {
	        return (
	            '<' +
	            [2, 2, 2, 6].reduce(
	                // crux to generate UUID-like random strings
	                (prev, len) => prev + '-' + crypto.randomBytes(len).toString('hex'),
	                crypto.randomBytes(4).toString('hex')
	            ) +
	            '@' +
	            // try to use the domain of the FROM address or fallback to server hostname
	            (this.getEnvelope().from || this.hostname || 'localhost').split('@').pop() +
	            '>'
	        );
	    }
	}

	mimeNode = MimeNode;
	return mimeNode;
}

/* eslint no-undefined: 0 */

var mailComposer;
var hasRequiredMailComposer;

function requireMailComposer () {
	if (hasRequiredMailComposer) return mailComposer;
	hasRequiredMailComposer = 1;

	const MimeNode = requireMimeNode();
	const mimeFuncs = requireMimeFuncs();

	/**
	 * Creates the object for composing a MimeNode instance out from the mail options
	 *
	 * @constructor
	 * @param {Object} mail Mail options
	 */
	class MailComposer {
	    constructor(mail) {
	        this.mail = mail || {};
	        this.message = false;
	    }

	    /**
	     * Builds MimeNode instance
	     */
	    compile() {
	        this._alternatives = this.getAlternatives();
	        this._htmlNode = this._alternatives.filter(alternative => /^text\/html\b/i.test(alternative.contentType)).pop();
	        this._attachments = this.getAttachments(!!this._htmlNode);

	        this._useRelated = !!(this._htmlNode && this._attachments.related.length);
	        this._useAlternative = this._alternatives.length > 1;
	        this._useMixed = this._attachments.attached.length > 1 || (this._alternatives.length && this._attachments.attached.length === 1);

	        // Compose MIME tree
	        if (this.mail.raw) {
	            this.message = new MimeNode('message/rfc822', { newline: this.mail.newline }).setRaw(this.mail.raw);
	        } else if (this._useMixed) {
	            this.message = this._createMixed();
	        } else if (this._useAlternative) {
	            this.message = this._createAlternative();
	        } else if (this._useRelated) {
	            this.message = this._createRelated();
	        } else {
	            this.message = this._createContentNode(
	                false,
	                []
	                    .concat(this._alternatives || [])
	                    .concat(this._attachments.attached || [])
	                    .shift() || {
	                    contentType: 'text/plain',
	                    content: ''
	                }
	            );
	        }

	        // Add custom headers
	        if (this.mail.headers) {
	            this.message.addHeader(this.mail.headers);
	        }

	        // Add headers to the root node, always overrides custom headers
	        ['from', 'sender', 'to', 'cc', 'bcc', 'reply-to', 'in-reply-to', 'references', 'subject', 'message-id', 'date'].forEach(header => {
	            let key = header.replace(/-(\w)/g, (o, c) => c.toUpperCase());
	            if (this.mail[key]) {
	                this.message.setHeader(header, this.mail[key]);
	            }
	        });

	        // Sets custom envelope
	        if (this.mail.envelope) {
	            this.message.setEnvelope(this.mail.envelope);
	        }

	        // ensure Message-Id value
	        this.message.messageId();

	        return this.message;
	    }

	    /**
	     * List all attachments. Resulting attachment objects can be used as input for MimeNode nodes
	     *
	     * @param {Boolean} findRelated If true separate related attachments from attached ones
	     * @returns {Object} An object of arrays (`related` and `attached`)
	     */
	    getAttachments(findRelated) {
	        let icalEvent, eventObject;
	        let attachments = [].concat(this.mail.attachments || []).map((attachment, i) => {
	            let data;
	            let isMessageNode = /^message\//i.test(attachment.contentType);

	            if (/^data:/i.test(attachment.path || attachment.href)) {
	                attachment = this._processDataUrl(attachment);
	            }

	            let contentType = attachment.contentType || mimeFuncs.detectMimeType(attachment.filename || attachment.path || attachment.href || 'bin');
	            let isImage = /^image\//i.test(contentType);
	            let contentDisposition = attachment.contentDisposition || (isMessageNode || (isImage && attachment.cid) ? 'inline' : 'attachment');

	            data = {
	                contentType,
	                contentDisposition,
	                contentTransferEncoding: 'contentTransferEncoding' in attachment ? attachment.contentTransferEncoding : 'base64'
	            };

	            if (attachment.filename) {
	                data.filename = attachment.filename;
	            } else if (!isMessageNode && attachment.filename !== false) {
	                data.filename = (attachment.path || attachment.href || '').split('/').pop().split('?').shift() || 'attachment-' + (i + 1);
	                if (data.filename.indexOf('.') < 0) {
	                    data.filename += '.' + mimeFuncs.detectExtension(data.contentType);
	                }
	            }

	            if (/^https?:\/\//i.test(attachment.path)) {
	                attachment.href = attachment.path;
	                attachment.path = undefined;
	            }

	            if (attachment.cid) {
	                data.cid = attachment.cid;
	            }

	            if (attachment.raw) {
	                data.raw = attachment.raw;
	            } else if (attachment.path) {
	                data.content = {
	                    path: attachment.path
	                };
	            } else if (attachment.href) {
	                data.content = {
	                    href: attachment.href,
	                    httpHeaders: attachment.httpHeaders
	                };
	            } else {
	                data.content = attachment.content || '';
	            }

	            if (attachment.encoding) {
	                data.encoding = attachment.encoding;
	            }

	            if (attachment.headers) {
	                data.headers = attachment.headers;
	            }

	            return data;
	        });

	        if (this.mail.icalEvent) {
	            if (
	                typeof this.mail.icalEvent === 'object' &&
	                (this.mail.icalEvent.content || this.mail.icalEvent.path || this.mail.icalEvent.href || this.mail.icalEvent.raw)
	            ) {
	                icalEvent = this.mail.icalEvent;
	            } else {
	                icalEvent = {
	                    content: this.mail.icalEvent
	                };
	            }

	            eventObject = {};
	            Object.keys(icalEvent).forEach(key => {
	                eventObject[key] = icalEvent[key];
	            });

	            eventObject.contentType = 'application/ics';
	            if (!eventObject.headers) {
	                eventObject.headers = {};
	            }
	            eventObject.filename = eventObject.filename || 'invite.ics';
	            eventObject.headers['Content-Disposition'] = 'attachment';
	            eventObject.headers['Content-Transfer-Encoding'] = 'base64';
	        }

	        if (!findRelated) {
	            return {
	                attached: attachments.concat(eventObject || []),
	                related: []
	            };
	        } else {
	            return {
	                attached: attachments.filter(attachment => !attachment.cid).concat(eventObject || []),
	                related: attachments.filter(attachment => !!attachment.cid)
	            };
	        }
	    }

	    /**
	     * List alternatives. Resulting objects can be used as input for MimeNode nodes
	     *
	     * @returns {Array} An array of alternative elements. Includes the `text` and `html` values as well
	     */
	    getAlternatives() {
	        let alternatives = [],
	            text,
	            html,
	            watchHtml,
	            amp,
	            icalEvent,
	            eventObject;

	        if (this.mail.text) {
	            if (typeof this.mail.text === 'object' && (this.mail.text.content || this.mail.text.path || this.mail.text.href || this.mail.text.raw)) {
	                text = this.mail.text;
	            } else {
	                text = {
	                    content: this.mail.text
	                };
	            }
	            text.contentType = 'text/plain; charset=utf-8';
	        }

	        if (this.mail.watchHtml) {
	            if (
	                typeof this.mail.watchHtml === 'object' &&
	                (this.mail.watchHtml.content || this.mail.watchHtml.path || this.mail.watchHtml.href || this.mail.watchHtml.raw)
	            ) {
	                watchHtml = this.mail.watchHtml;
	            } else {
	                watchHtml = {
	                    content: this.mail.watchHtml
	                };
	            }
	            watchHtml.contentType = 'text/watch-html; charset=utf-8';
	        }

	        if (this.mail.amp) {
	            if (typeof this.mail.amp === 'object' && (this.mail.amp.content || this.mail.amp.path || this.mail.amp.href || this.mail.amp.raw)) {
	                amp = this.mail.amp;
	            } else {
	                amp = {
	                    content: this.mail.amp
	                };
	            }
	            amp.contentType = 'text/x-amp-html; charset=utf-8';
	        }

	        // NB! when including attachments with a calendar alternative you might end up in a blank screen on some clients
	        if (this.mail.icalEvent) {
	            if (
	                typeof this.mail.icalEvent === 'object' &&
	                (this.mail.icalEvent.content || this.mail.icalEvent.path || this.mail.icalEvent.href || this.mail.icalEvent.raw)
	            ) {
	                icalEvent = this.mail.icalEvent;
	            } else {
	                icalEvent = {
	                    content: this.mail.icalEvent
	                };
	            }

	            eventObject = {};
	            Object.keys(icalEvent).forEach(key => {
	                eventObject[key] = icalEvent[key];
	            });

	            if (eventObject.content && typeof eventObject.content === 'object') {
	                // we are going to have the same attachment twice, so mark this to be
	                // resolved just once
	                eventObject.content._resolve = true;
	            }

	            eventObject.filename = false;
	            eventObject.contentType = 'text/calendar; charset=utf-8; method=' + (eventObject.method || 'PUBLISH').toString().trim().toUpperCase();
	            if (!eventObject.headers) {
	                eventObject.headers = {};
	            }
	        }

	        if (this.mail.html) {
	            if (typeof this.mail.html === 'object' && (this.mail.html.content || this.mail.html.path || this.mail.html.href || this.mail.html.raw)) {
	                html = this.mail.html;
	            } else {
	                html = {
	                    content: this.mail.html
	                };
	            }
	            html.contentType = 'text/html; charset=utf-8';
	        }

	        []
	            .concat(text || [])
	            .concat(watchHtml || [])
	            .concat(amp || [])
	            .concat(html || [])
	            .concat(eventObject || [])
	            .concat(this.mail.alternatives || [])
	            .forEach(alternative => {
	                let data;

	                if (/^data:/i.test(alternative.path || alternative.href)) {
	                    alternative = this._processDataUrl(alternative);
	                }

	                data = {
	                    contentType: alternative.contentType || mimeFuncs.detectMimeType(alternative.filename || alternative.path || alternative.href || 'txt'),
	                    contentTransferEncoding: alternative.contentTransferEncoding
	                };

	                if (alternative.filename) {
	                    data.filename = alternative.filename;
	                }

	                if (/^https?:\/\//i.test(alternative.path)) {
	                    alternative.href = alternative.path;
	                    alternative.path = undefined;
	                }

	                if (alternative.raw) {
	                    data.raw = alternative.raw;
	                } else if (alternative.path) {
	                    data.content = {
	                        path: alternative.path
	                    };
	                } else if (alternative.href) {
	                    data.content = {
	                        href: alternative.href
	                    };
	                } else {
	                    data.content = alternative.content || '';
	                }

	                if (alternative.encoding) {
	                    data.encoding = alternative.encoding;
	                }

	                if (alternative.headers) {
	                    data.headers = alternative.headers;
	                }

	                alternatives.push(data);
	            });

	        return alternatives;
	    }

	    /**
	     * Builds multipart/mixed node. It should always contain different type of elements on the same level
	     * eg. text + attachments
	     *
	     * @param {Object} parentNode Parent for this note. If it does not exist, a root node is created
	     * @returns {Object} MimeNode node element
	     */
	    _createMixed(parentNode) {
	        let node;

	        if (!parentNode) {
	            node = new MimeNode('multipart/mixed', {
	                baseBoundary: this.mail.baseBoundary,
	                textEncoding: this.mail.textEncoding,
	                boundaryPrefix: this.mail.boundaryPrefix,
	                disableUrlAccess: this.mail.disableUrlAccess,
	                disableFileAccess: this.mail.disableFileAccess,
	                normalizeHeaderKey: this.mail.normalizeHeaderKey,
	                newline: this.mail.newline
	            });
	        } else {
	            node = parentNode.createChild('multipart/mixed', {
	                disableUrlAccess: this.mail.disableUrlAccess,
	                disableFileAccess: this.mail.disableFileAccess,
	                normalizeHeaderKey: this.mail.normalizeHeaderKey,
	                newline: this.mail.newline
	            });
	        }

	        if (this._useAlternative) {
	            this._createAlternative(node);
	        } else if (this._useRelated) {
	            this._createRelated(node);
	        }

	        []
	            .concat((!this._useAlternative && this._alternatives) || [])
	            .concat(this._attachments.attached || [])
	            .forEach(element => {
	                // if the element is a html node from related subpart then ignore it
	                if (!this._useRelated || element !== this._htmlNode) {
	                    this._createContentNode(node, element);
	                }
	            });

	        return node;
	    }

	    /**
	     * Builds multipart/alternative node. It should always contain same type of elements on the same level
	     * eg. text + html view of the same data
	     *
	     * @param {Object} parentNode Parent for this note. If it does not exist, a root node is created
	     * @returns {Object} MimeNode node element
	     */
	    _createAlternative(parentNode) {
	        let node;

	        if (!parentNode) {
	            node = new MimeNode('multipart/alternative', {
	                baseBoundary: this.mail.baseBoundary,
	                textEncoding: this.mail.textEncoding,
	                boundaryPrefix: this.mail.boundaryPrefix,
	                disableUrlAccess: this.mail.disableUrlAccess,
	                disableFileAccess: this.mail.disableFileAccess,
	                normalizeHeaderKey: this.mail.normalizeHeaderKey,
	                newline: this.mail.newline
	            });
	        } else {
	            node = parentNode.createChild('multipart/alternative', {
	                disableUrlAccess: this.mail.disableUrlAccess,
	                disableFileAccess: this.mail.disableFileAccess,
	                normalizeHeaderKey: this.mail.normalizeHeaderKey,
	                newline: this.mail.newline
	            });
	        }

	        this._alternatives.forEach(alternative => {
	            if (this._useRelated && this._htmlNode === alternative) {
	                this._createRelated(node);
	            } else {
	                this._createContentNode(node, alternative);
	            }
	        });

	        return node;
	    }

	    /**
	     * Builds multipart/related node. It should always contain html node with related attachments
	     *
	     * @param {Object} parentNode Parent for this note. If it does not exist, a root node is created
	     * @returns {Object} MimeNode node element
	     */
	    _createRelated(parentNode) {
	        let node;

	        if (!parentNode) {
	            node = new MimeNode('multipart/related; type="text/html"', {
	                baseBoundary: this.mail.baseBoundary,
	                textEncoding: this.mail.textEncoding,
	                boundaryPrefix: this.mail.boundaryPrefix,
	                disableUrlAccess: this.mail.disableUrlAccess,
	                disableFileAccess: this.mail.disableFileAccess,
	                normalizeHeaderKey: this.mail.normalizeHeaderKey,
	                newline: this.mail.newline
	            });
	        } else {
	            node = parentNode.createChild('multipart/related; type="text/html"', {
	                disableUrlAccess: this.mail.disableUrlAccess,
	                disableFileAccess: this.mail.disableFileAccess,
	                normalizeHeaderKey: this.mail.normalizeHeaderKey,
	                newline: this.mail.newline
	            });
	        }

	        this._createContentNode(node, this._htmlNode);

	        this._attachments.related.forEach(alternative => this._createContentNode(node, alternative));

	        return node;
	    }

	    /**
	     * Creates a regular node with contents
	     *
	     * @param {Object} parentNode Parent for this note. If it does not exist, a root node is created
	     * @param {Object} element Node data
	     * @returns {Object} MimeNode node element
	     */
	    _createContentNode(parentNode, element) {
	        element = element || {};
	        element.content = element.content || '';

	        let node;
	        let encoding = (element.encoding || 'utf8')
	            .toString()
	            .toLowerCase()
	            .replace(/[-_\s]/g, '');

	        if (!parentNode) {
	            node = new MimeNode(element.contentType, {
	                filename: element.filename,
	                baseBoundary: this.mail.baseBoundary,
	                textEncoding: this.mail.textEncoding,
	                boundaryPrefix: this.mail.boundaryPrefix,
	                disableUrlAccess: this.mail.disableUrlAccess,
	                disableFileAccess: this.mail.disableFileAccess,
	                normalizeHeaderKey: this.mail.normalizeHeaderKey,
	                newline: this.mail.newline
	            });
	        } else {
	            node = parentNode.createChild(element.contentType, {
	                filename: element.filename,
	                textEncoding: this.mail.textEncoding,
	                disableUrlAccess: this.mail.disableUrlAccess,
	                disableFileAccess: this.mail.disableFileAccess,
	                normalizeHeaderKey: this.mail.normalizeHeaderKey,
	                newline: this.mail.newline
	            });
	        }

	        // add custom headers
	        if (element.headers) {
	            node.addHeader(element.headers);
	        }

	        if (element.cid) {
	            node.setHeader('Content-Id', '<' + element.cid.replace(/[<>]/g, '') + '>');
	        }

	        if (element.contentTransferEncoding) {
	            node.setHeader('Content-Transfer-Encoding', element.contentTransferEncoding);
	        } else if (this.mail.encoding && /^text\//i.test(element.contentType)) {
	            node.setHeader('Content-Transfer-Encoding', this.mail.encoding);
	        }

	        if (!/^text\//i.test(element.contentType) || element.contentDisposition) {
	            node.setHeader(
	                'Content-Disposition',
	                element.contentDisposition || (element.cid && /^image\//i.test(element.contentType) ? 'inline' : 'attachment')
	            );
	        }

	        if (typeof element.content === 'string' && !['utf8', 'usascii', 'ascii'].includes(encoding)) {
	            element.content = Buffer.from(element.content, encoding);
	        }

	        // prefer pregenerated raw content
	        if (element.raw) {
	            node.setRaw(element.raw);
	        } else {
	            node.setContent(element.content);
	        }

	        return node;
	    }

	    /**
	     * Parses data uri and converts it to a Buffer
	     *
	     * @param {Object} element Content element
	     * @return {Object} Parsed element
	     */
	    _processDataUrl(element) {
	        let parts = (element.path || element.href).match(/^data:((?:[^;]*;)*(?:[^,]*)),(.*)$/i);
	        if (!parts) {
	            return element;
	        }

	        element.content = /\bbase64$/i.test(parts[1]) ? Buffer.from(parts[2], 'base64') : Buffer.from(decodeURIComponent(parts[2]));

	        if ('path' in element) {
	            element.path = false;
	        }

	        if ('href' in element) {
	            element.href = false;
	        }

	        parts[1].split(';').forEach(item => {
	            if (/^\w+\/[^/]+$/i.test(item)) {
	                element.contentType = element.contentType || item.toLowerCase();
	            }
	        });

	        return element;
	    }
	}

	mailComposer = MailComposer;
	return mailComposer;
}

var messageParser;
var hasRequiredMessageParser;

function requireMessageParser () {
	if (hasRequiredMessageParser) return messageParser;
	hasRequiredMessageParser = 1;

	const Transform = require$$0$3.Transform;

	/**
	 * MessageParser instance is a transform stream that separates message headers
	 * from the rest of the body. Headers are emitted with the 'headers' event. Message
	 * body is passed on as the resulting stream.
	 */
	class MessageParser extends Transform {
	    constructor(options) {
	        super(options);
	        this.lastBytes = Buffer.alloc(4);
	        this.headersParsed = false;
	        this.headerBytes = 0;
	        this.headerChunks = [];
	        this.rawHeaders = false;
	        this.bodySize = 0;
	    }

	    /**
	     * Keeps count of the last 4 bytes in order to detect line breaks on chunk boundaries
	     *
	     * @param {Buffer} data Next data chunk from the stream
	     */
	    updateLastBytes(data) {
	        let lblen = this.lastBytes.length;
	        let nblen = Math.min(data.length, lblen);

	        // shift existing bytes
	        for (let i = 0, len = lblen - nblen; i < len; i++) {
	            this.lastBytes[i] = this.lastBytes[i + nblen];
	        }

	        // add new bytes
	        for (let i = 1; i <= nblen; i++) {
	            this.lastBytes[lblen - i] = data[data.length - i];
	        }
	    }

	    /**
	     * Finds and removes message headers from the remaining body. We want to keep
	     * headers separated until final delivery to be able to modify these
	     *
	     * @param {Buffer} data Next chunk of data
	     * @return {Boolean} Returns true if headers are already found or false otherwise
	     */
	    checkHeaders(data) {
	        if (this.headersParsed) {
	            return true;
	        }

	        let lblen = this.lastBytes.length;
	        let headerPos = 0;
	        this.curLinePos = 0;
	        for (let i = 0, len = this.lastBytes.length + data.length; i < len; i++) {
	            let chr;
	            if (i < lblen) {
	                chr = this.lastBytes[i];
	            } else {
	                chr = data[i - lblen];
	            }
	            if (chr === 0x0a && i) {
	                let pr1 = i - 1 < lblen ? this.lastBytes[i - 1] : data[i - 1 - lblen];
	                let pr2 = i > 1 ? (i - 2 < lblen ? this.lastBytes[i - 2] : data[i - 2 - lblen]) : false;
	                if (pr1 === 0x0a) {
	                    this.headersParsed = true;
	                    headerPos = i - lblen + 1;
	                    this.headerBytes += headerPos;
	                    break;
	                } else if (pr1 === 0x0d && pr2 === 0x0a) {
	                    this.headersParsed = true;
	                    headerPos = i - lblen + 1;
	                    this.headerBytes += headerPos;
	                    break;
	                }
	            }
	        }

	        if (this.headersParsed) {
	            this.headerChunks.push(data.slice(0, headerPos));
	            this.rawHeaders = Buffer.concat(this.headerChunks, this.headerBytes);
	            this.headerChunks = null;
	            this.emit('headers', this.parseHeaders());
	            if (data.length - 1 > headerPos) {
	                let chunk = data.slice(headerPos);
	                this.bodySize += chunk.length;
	                // this would be the first chunk of data sent downstream
	                setImmediate(() => this.push(chunk));
	            }
	            return false;
	        } else {
	            this.headerBytes += data.length;
	            this.headerChunks.push(data);
	        }

	        // store last 4 bytes to catch header break
	        this.updateLastBytes(data);

	        return false;
	    }

	    _transform(chunk, encoding, callback) {
	        if (!chunk || !chunk.length) {
	            return callback();
	        }

	        if (typeof chunk === 'string') {
	            chunk = Buffer.from(chunk, encoding);
	        }

	        let headersFound;

	        try {
	            headersFound = this.checkHeaders(chunk);
	        } catch (E) {
	            return callback(E);
	        }

	        if (headersFound) {
	            this.bodySize += chunk.length;
	            this.push(chunk);
	        }

	        setImmediate(callback);
	    }

	    _flush(callback) {
	        if (this.headerChunks) {
	            let chunk = Buffer.concat(this.headerChunks, this.headerBytes);
	            this.bodySize += chunk.length;
	            this.push(chunk);
	            this.headerChunks = null;
	        }
	        callback();
	    }

	    parseHeaders() {
	        let lines = (this.rawHeaders || '').toString().split(/\r?\n/);
	        for (let i = lines.length - 1; i > 0; i--) {
	            if (/^\s/.test(lines[i])) {
	                lines[i - 1] += '\n' + lines[i];
	                lines.splice(i, 1);
	            }
	        }
	        return lines
	            .filter(line => line.trim())
	            .map(line => ({
	                key: line.substr(0, line.indexOf(':')).trim().toLowerCase(),
	                line
	            }));
	    }
	}

	messageParser = MessageParser;
	return messageParser;
}

var relaxedBody;
var hasRequiredRelaxedBody;

function requireRelaxedBody () {
	if (hasRequiredRelaxedBody) return relaxedBody;
	hasRequiredRelaxedBody = 1;

	// streams through a message body and calculates relaxed body hash

	const Transform = require$$0$3.Transform;
	const crypto = require$$5;

	class RelaxedBody extends Transform {
	    constructor(options) {
	        super();
	        options = options || {};
	        this.chunkBuffer = [];
	        this.chunkBufferLen = 0;
	        this.bodyHash = crypto.createHash(options.hashAlgo || 'sha1');
	        this.remainder = '';
	        this.byteLength = 0;

	        this.debug = options.debug;
	        this._debugBody = options.debug ? [] : false;
	    }

	    updateHash(chunk) {
	        let bodyStr;

	        // find next remainder
	        let nextRemainder = '';

	        // This crux finds and removes the spaces from the last line and the newline characters after the last non-empty line
	        // If we get another chunk that does not match this description then we can restore the previously processed data
	        let state = 'file';
	        for (let i = chunk.length - 1; i >= 0; i--) {
	            let c = chunk[i];

	            if (state === 'file' && (c === 0x0a || c === 0x0d)) ; else if (state === 'file' && (c === 0x09 || c === 0x20)) {
	                // switch to line ending mode, this is the last non-empty line
	                state = 'line';
	            } else if (state === 'line' && (c === 0x09 || c === 0x20)) ; else if (state === 'file' || state === 'line') {
	                // non line/file ending character found, switch to body mode
	                state = 'body';
	                if (i === chunk.length - 1) {
	                    // final char is not part of line end or file end, so do nothing
	                    break;
	                }
	            }

	            if (i === 0) {
	                // reached to the beginning of the chunk, check if it is still about the ending
	                // and if the remainder also matches
	                if (
	                    (state === 'file' && (!this.remainder || /[\r\n]$/.test(this.remainder))) ||
	                    (state === 'line' && (!this.remainder || /[ \t]$/.test(this.remainder)))
	                ) {
	                    // keep everything
	                    this.remainder += chunk.toString('binary');
	                    return;
	                } else if (state === 'line' || state === 'file') {
	                    // process existing remainder as normal line but store the current chunk
	                    nextRemainder = chunk.toString('binary');
	                    chunk = false;
	                    break;
	                }
	            }

	            if (state !== 'body') {
	                continue;
	            }

	            // reached first non ending byte
	            nextRemainder = chunk.slice(i + 1).toString('binary');
	            chunk = chunk.slice(0, i + 1);
	            break;
	        }

	        let needsFixing = !!this.remainder;
	        if (chunk && !needsFixing) {
	            // check if we even need to change anything
	            for (let i = 0, len = chunk.length; i < len; i++) {
	                if (i && chunk[i] === 0x0a && chunk[i - 1] !== 0x0d) {
	                    // missing \r before \n
	                    needsFixing = true;
	                    break;
	                } else if (i && chunk[i] === 0x0d && chunk[i - 1] === 0x20) {
	                    // trailing WSP found
	                    needsFixing = true;
	                    break;
	                } else if (i && chunk[i] === 0x20 && chunk[i - 1] === 0x20) {
	                    // multiple spaces found, needs to be replaced with just one
	                    needsFixing = true;
	                    break;
	                } else if (chunk[i] === 0x09) {
	                    // TAB found, needs to be replaced with a space
	                    needsFixing = true;
	                    break;
	                }
	            }
	        }

	        if (needsFixing) {
	            bodyStr = this.remainder + (chunk ? chunk.toString('binary') : '');
	            this.remainder = nextRemainder;
	            bodyStr = bodyStr
	                .replace(/\r?\n/g, '\n') // use js line endings
	                .replace(/[ \t]*$/gm, '') // remove line endings, rtrim
	                .replace(/[ \t]+/gm, ' ') // single spaces
	                .replace(/\n/g, '\r\n'); // restore rfc822 line endings
	            chunk = Buffer.from(bodyStr, 'binary');
	        } else if (nextRemainder) {
	            this.remainder = nextRemainder;
	        }

	        if (this.debug) {
	            this._debugBody.push(chunk);
	        }
	        this.bodyHash.update(chunk);
	    }

	    _transform(chunk, encoding, callback) {
	        if (!chunk || !chunk.length) {
	            return callback();
	        }

	        if (typeof chunk === 'string') {
	            chunk = Buffer.from(chunk, encoding);
	        }

	        this.updateHash(chunk);

	        this.byteLength += chunk.length;
	        this.push(chunk);
	        callback();
	    }

	    _flush(callback) {
	        // generate final hash and emit it
	        if (/[\r\n]$/.test(this.remainder) && this.byteLength > 2) {
	            // add terminating line end
	            this.bodyHash.update(Buffer.from('\r\n'));
	        }
	        if (!this.byteLength) {
	            // emit empty line buffer to keep the stream flowing
	            this.push(Buffer.from('\r\n'));
	            // this.bodyHash.update(Buffer.from('\r\n'));
	        }

	        this.emit('hash', this.bodyHash.digest('base64'), this.debug ? Buffer.concat(this._debugBody) : false);
	        callback();
	    }
	}

	relaxedBody = RelaxedBody;
	return relaxedBody;
}

var sign = {exports: {}};

var hasRequiredSign;

function requireSign () {
	if (hasRequiredSign) return sign.exports;
	hasRequiredSign = 1;

	const punycode = require$$2$2;
	const mimeFuncs = requireMimeFuncs();
	const crypto = require$$5;

	/**
	 * Returns DKIM signature header line
	 *
	 * @param {Object} headers Parsed headers object from MessageParser
	 * @param {String} bodyHash Base64 encoded hash of the message
	 * @param {Object} options DKIM options
	 * @param {String} options.domainName Domain name to be signed for
	 * @param {String} options.keySelector DKIM key selector to use
	 * @param {String} options.privateKey DKIM private key to use
	 * @return {String} Complete header line
	 */

	sign.exports = (headers, hashAlgo, bodyHash, options) => {
	    options = options || {};

	    // all listed fields from RFC4871 #5.5
	    let defaultFieldNames =
	        'From:Sender:Reply-To:Subject:Date:Message-ID:To:' +
	        'Cc:MIME-Version:Content-Type:Content-Transfer-Encoding:Content-ID:' +
	        'Content-Description:Resent-Date:Resent-From:Resent-Sender:' +
	        'Resent-To:Resent-Cc:Resent-Message-ID:In-Reply-To:References:' +
	        'List-Id:List-Help:List-Unsubscribe:List-Subscribe:List-Post:' +
	        'List-Owner:List-Archive';

	    let fieldNames = options.headerFieldNames || defaultFieldNames;

	    let canonicalizedHeaderData = relaxedHeaders(headers, fieldNames, options.skipFields);
	    let dkimHeader = generateDKIMHeader(options.domainName, options.keySelector, canonicalizedHeaderData.fieldNames, hashAlgo, bodyHash);

	    let signer, signature;

	    canonicalizedHeaderData.headers += 'dkim-signature:' + relaxedHeaderLine(dkimHeader);

	    signer = crypto.createSign(('rsa-' + hashAlgo).toUpperCase());
	    signer.update(canonicalizedHeaderData.headers);
	    try {
	        signature = signer.sign(options.privateKey, 'base64');
	    } catch (E) {
	        return false;
	    }

	    return dkimHeader + signature.replace(/(^.{73}|.{75}(?!\r?\n|\r))/g, '$&\r\n ').trim();
	};

	sign.exports.relaxedHeaders = relaxedHeaders;

	function generateDKIMHeader(domainName, keySelector, fieldNames, hashAlgo, bodyHash) {
	    let dkim = [
	        'v=1',
	        'a=rsa-' + hashAlgo,
	        'c=relaxed/relaxed',
	        'd=' + punycode.toASCII(domainName),
	        'q=dns/txt',
	        's=' + keySelector,
	        'bh=' + bodyHash,
	        'h=' + fieldNames
	    ].join('; ');

	    return mimeFuncs.foldLines('DKIM-Signature: ' + dkim, 76) + ';\r\n b=';
	}

	function relaxedHeaders(headers, fieldNames, skipFields) {
	    let includedFields = new Set();
	    let skip = new Set();
	    let headerFields = new Map();

	    (skipFields || '')
	        .toLowerCase()
	        .split(':')
	        .forEach(field => {
	            skip.add(field.trim());
	        });

	    (fieldNames || '')
	        .toLowerCase()
	        .split(':')
	        .filter(field => !skip.has(field.trim()))
	        .forEach(field => {
	            includedFields.add(field.trim());
	        });

	    for (let i = headers.length - 1; i >= 0; i--) {
	        let line = headers[i];
	        // only include the first value from bottom to top
	        if (includedFields.has(line.key) && !headerFields.has(line.key)) {
	            headerFields.set(line.key, relaxedHeaderLine(line.line));
	        }
	    }

	    let headersList = [];
	    let fields = [];
	    includedFields.forEach(field => {
	        if (headerFields.has(field)) {
	            fields.push(field);
	            headersList.push(field + ':' + headerFields.get(field));
	        }
	    });

	    return {
	        headers: headersList.join('\r\n') + '\r\n',
	        fieldNames: fields.join(':')
	    };
	}

	function relaxedHeaderLine(line) {
	    return line
	        .substr(line.indexOf(':') + 1)
	        .replace(/\r?\n/g, '')
	        .replace(/\s+/g, ' ')
	        .trim();
	}
	return sign.exports;
}

var dkim;
var hasRequiredDkim;

function requireDkim () {
	if (hasRequiredDkim) return dkim;
	hasRequiredDkim = 1;

	// FIXME:
	// replace this Transform mess with a method that pipes input argument to output argument

	const MessageParser = requireMessageParser();
	const RelaxedBody = requireRelaxedBody();
	const sign = requireSign();
	const PassThrough = require$$0$3.PassThrough;
	const fs = require$$2$1;
	const path = require$$0$6;
	const crypto = require$$5;

	const DKIM_ALGO = 'sha256';
	const MAX_MESSAGE_SIZE = 128 * 1024; // buffer messages larger than this to disk

	/*
	// Usage:

	let dkim = new DKIM({
	    domainName: 'example.com',
	    keySelector: 'key-selector',
	    privateKey,
	    cacheDir: '/tmp'
	});
	dkim.sign(input).pipe(process.stdout);

	// Where inputStream is a rfc822 message (either a stream, string or Buffer)
	// and outputStream is a DKIM signed rfc822 message
	*/

	class DKIMSigner {
	    constructor(options, keys, input, output) {
	        this.options = options || {};
	        this.keys = keys;

	        this.cacheTreshold = Number(this.options.cacheTreshold) || MAX_MESSAGE_SIZE;
	        this.hashAlgo = this.options.hashAlgo || DKIM_ALGO;

	        this.cacheDir = this.options.cacheDir || false;

	        this.chunks = [];
	        this.chunklen = 0;
	        this.readPos = 0;
	        this.cachePath = this.cacheDir ? path.join(this.cacheDir, 'message.' + Date.now() + '-' + crypto.randomBytes(14).toString('hex')) : false;
	        this.cache = false;

	        this.headers = false;
	        this.bodyHash = false;
	        this.parser = false;
	        this.relaxedBody = false;

	        this.input = input;
	        this.output = output;
	        this.output.usingCache = false;

	        this.hasErrored = false;

	        this.input.on('error', err => {
	            this.hasErrored = true;
	            this.cleanup();
	            output.emit('error', err);
	        });
	    }

	    cleanup() {
	        if (!this.cache || !this.cachePath) {
	            return;
	        }
	        fs.unlink(this.cachePath, () => false);
	    }

	    createReadCache() {
	        // pipe remainings to cache file
	        this.cache = fs.createReadStream(this.cachePath);
	        this.cache.once('error', err => {
	            this.cleanup();
	            this.output.emit('error', err);
	        });
	        this.cache.once('close', () => {
	            this.cleanup();
	        });
	        this.cache.pipe(this.output);
	    }

	    sendNextChunk() {
	        if (this.hasErrored) {
	            return;
	        }

	        if (this.readPos >= this.chunks.length) {
	            if (!this.cache) {
	                return this.output.end();
	            }
	            return this.createReadCache();
	        }
	        let chunk = this.chunks[this.readPos++];
	        if (this.output.write(chunk) === false) {
	            return this.output.once('drain', () => {
	                this.sendNextChunk();
	            });
	        }
	        setImmediate(() => this.sendNextChunk());
	    }

	    sendSignedOutput() {
	        let keyPos = 0;
	        let signNextKey = () => {
	            if (keyPos >= this.keys.length) {
	                this.output.write(this.parser.rawHeaders);
	                return setImmediate(() => this.sendNextChunk());
	            }
	            let key = this.keys[keyPos++];
	            let dkimField = sign(this.headers, this.hashAlgo, this.bodyHash, {
	                domainName: key.domainName,
	                keySelector: key.keySelector,
	                privateKey: key.privateKey,
	                headerFieldNames: this.options.headerFieldNames,
	                skipFields: this.options.skipFields
	            });
	            if (dkimField) {
	                this.output.write(Buffer.from(dkimField + '\r\n'));
	            }
	            return setImmediate(signNextKey);
	        };

	        if (this.bodyHash && this.headers) {
	            return signNextKey();
	        }

	        this.output.write(this.parser.rawHeaders);
	        this.sendNextChunk();
	    }

	    createWriteCache() {
	        this.output.usingCache = true;
	        // pipe remainings to cache file
	        this.cache = fs.createWriteStream(this.cachePath);
	        this.cache.once('error', err => {
	            this.cleanup();
	            // drain input
	            this.relaxedBody.unpipe(this.cache);
	            this.relaxedBody.on('readable', () => {
	                while (this.relaxedBody.read() !== null) {
	                    // do nothing
	                }
	            });
	            this.hasErrored = true;
	            // emit error
	            this.output.emit('error', err);
	        });
	        this.cache.once('close', () => {
	            this.sendSignedOutput();
	        });
	        this.relaxedBody.removeAllListeners('readable');
	        this.relaxedBody.pipe(this.cache);
	    }

	    signStream() {
	        this.parser = new MessageParser();
	        this.relaxedBody = new RelaxedBody({
	            hashAlgo: this.hashAlgo
	        });

	        this.parser.on('headers', value => {
	            this.headers = value;
	        });

	        this.relaxedBody.on('hash', value => {
	            this.bodyHash = value;
	        });

	        this.relaxedBody.on('readable', () => {
	            let chunk;
	            if (this.cache) {
	                return;
	            }
	            while ((chunk = this.relaxedBody.read()) !== null) {
	                this.chunks.push(chunk);
	                this.chunklen += chunk.length;
	                if (this.chunklen >= this.cacheTreshold && this.cachePath) {
	                    return this.createWriteCache();
	                }
	            }
	        });

	        this.relaxedBody.on('end', () => {
	            if (this.cache) {
	                return;
	            }
	            this.sendSignedOutput();
	        });

	        this.parser.pipe(this.relaxedBody);
	        setImmediate(() => this.input.pipe(this.parser));
	    }
	}

	class DKIM {
	    constructor(options) {
	        this.options = options || {};
	        this.keys = [].concat(
	            this.options.keys || {
	                domainName: options.domainName,
	                keySelector: options.keySelector,
	                privateKey: options.privateKey
	            }
	        );
	    }

	    sign(input, extraOptions) {
	        let output = new PassThrough();
	        let inputStream = input;
	        let writeValue = false;

	        if (Buffer.isBuffer(input)) {
	            writeValue = input;
	            inputStream = new PassThrough();
	        } else if (typeof input === 'string') {
	            writeValue = Buffer.from(input);
	            inputStream = new PassThrough();
	        }

	        let options = this.options;
	        if (extraOptions && Object.keys(extraOptions).length) {
	            options = {};
	            Object.keys(this.options || {}).forEach(key => {
	                options[key] = this.options[key];
	            });
	            Object.keys(extraOptions || {}).forEach(key => {
	                if (!(key in options)) {
	                    options[key] = extraOptions[key];
	                }
	            });
	        }

	        let signer = new DKIMSigner(options, this.keys, inputStream, output);
	        setImmediate(() => {
	            signer.signStream();
	            if (writeValue) {
	                setImmediate(() => {
	                    inputStream.end(writeValue);
	                });
	            }
	        });

	        return output;
	    }
	}

	dkim = DKIM;
	return dkim;
}

var httpProxyClient_1;
var hasRequiredHttpProxyClient;

function requireHttpProxyClient () {
	if (hasRequiredHttpProxyClient) return httpProxyClient_1;
	hasRequiredHttpProxyClient = 1;

	/**
	 * Minimal HTTP/S proxy client
	 */

	const net = require$$3;
	const tls = require$$4;
	const urllib = require$$0$5;

	/**
	 * Establishes proxied connection to destinationPort
	 *
	 * httpProxyClient("http://localhost:3128/", 80, "google.com", function(err, socket){
	 *     socket.write("GET / HTTP/1.0\r\n\r\n");
	 * });
	 *
	 * @param {String} proxyUrl proxy configuration, etg "http://proxy.host:3128/"
	 * @param {Number} destinationPort Port to open in destination host
	 * @param {String} destinationHost Destination hostname
	 * @param {Function} callback Callback to run with the rocket object once connection is established
	 */
	function httpProxyClient(proxyUrl, destinationPort, destinationHost, callback) {
	    let proxy = urllib.parse(proxyUrl);

	    // create a socket connection to the proxy server
	    let options;
	    let connect;
	    let socket;

	    options = {
	        host: proxy.hostname,
	        port: Number(proxy.port) ? Number(proxy.port) : proxy.protocol === 'https:' ? 443 : 80
	    };

	    if (proxy.protocol === 'https:') {
	        // we can use untrusted proxies as long as we verify actual SMTP certificates
	        options.rejectUnauthorized = false;
	        connect = tls.connect.bind(tls);
	    } else {
	        connect = net.connect.bind(net);
	    }

	    // Error harness for initial connection. Once connection is established, the responsibility
	    // to handle errors is passed to whoever uses this socket
	    let finished = false;
	    let tempSocketErr = err => {
	        if (finished) {
	            return;
	        }
	        finished = true;
	        try {
	            socket.destroy();
	        } catch (E) {
	            // ignore
	        }
	        callback(err);
	    };

	    let timeoutErr = () => {
	        let err = new Error('Proxy socket timed out');
	        err.code = 'ETIMEDOUT';
	        tempSocketErr(err);
	    };

	    socket = connect(options, () => {
	        if (finished) {
	            return;
	        }

	        let reqHeaders = {
	            Host: destinationHost + ':' + destinationPort,
	            Connection: 'close'
	        };
	        if (proxy.auth) {
	            reqHeaders['Proxy-Authorization'] = 'Basic ' + Buffer.from(proxy.auth).toString('base64');
	        }

	        socket.write(
	            // HTTP method
	            'CONNECT ' +
	                destinationHost +
	                ':' +
	                destinationPort +
	                ' HTTP/1.1\r\n' +
	                // HTTP request headers
	                Object.keys(reqHeaders)
	                    .map(key => key + ': ' + reqHeaders[key])
	                    .join('\r\n') +
	                // End request
	                '\r\n\r\n'
	        );

	        let headers = '';
	        let onSocketData = chunk => {
	            let match;
	            let remainder;

	            if (finished) {
	                return;
	            }

	            headers += chunk.toString('binary');
	            if ((match = headers.match(/\r\n\r\n/))) {
	                socket.removeListener('data', onSocketData);

	                remainder = headers.substr(match.index + match[0].length);
	                headers = headers.substr(0, match.index);
	                if (remainder) {
	                    socket.unshift(Buffer.from(remainder, 'binary'));
	                }

	                // proxy connection is now established
	                finished = true;

	                // check response code
	                match = headers.match(/^HTTP\/\d+\.\d+ (\d+)/i);
	                if (!match || (match[1] || '').charAt(0) !== '2') {
	                    try {
	                        socket.destroy();
	                    } catch (E) {
	                        // ignore
	                    }
	                    return callback(new Error('Invalid response from proxy' + ((match && ': ' + match[1]) || '')));
	                }

	                socket.removeListener('error', tempSocketErr);
	                socket.removeListener('timeout', timeoutErr);
	                socket.setTimeout(0);

	                return callback(null, socket);
	            }
	        };
	        socket.on('data', onSocketData);
	    });

	    socket.setTimeout(httpProxyClient.timeout || 30 * 1000);
	    socket.on('timeout', timeoutErr);

	    socket.once('error', tempSocketErr);
	}

	httpProxyClient_1 = httpProxyClient;
	return httpProxyClient_1;
}

var mailMessage;
var hasRequiredMailMessage;

function requireMailMessage () {
	if (hasRequiredMailMessage) return mailMessage;
	hasRequiredMailMessage = 1;

	const shared = requireShared();
	const MimeNode = requireMimeNode();
	const mimeFuncs = requireMimeFuncs();

	class MailMessage {
	    constructor(mailer, data) {
	        this.mailer = mailer;
	        this.data = {};
	        this.message = null;

	        data = data || {};
	        let options = mailer.options || {};
	        let defaults = mailer._defaults || {};

	        Object.keys(data).forEach(key => {
	            this.data[key] = data[key];
	        });

	        this.data.headers = this.data.headers || {};

	        // apply defaults
	        Object.keys(defaults).forEach(key => {
	            if (!(key in this.data)) {
	                this.data[key] = defaults[key];
	            } else if (key === 'headers') {
	                // headers is a special case. Allow setting individual default headers
	                Object.keys(defaults.headers).forEach(key => {
	                    if (!(key in this.data.headers)) {
	                        this.data.headers[key] = defaults.headers[key];
	                    }
	                });
	            }
	        });

	        // force specific keys from transporter options
	        ['disableFileAccess', 'disableUrlAccess', 'normalizeHeaderKey'].forEach(key => {
	            if (key in options) {
	                this.data[key] = options[key];
	            }
	        });
	    }

	    resolveContent(...args) {
	        return shared.resolveContent(...args);
	    }

	    resolveAll(callback) {
	        let keys = [
	            [this.data, 'html'],
	            [this.data, 'text'],
	            [this.data, 'watchHtml'],
	            [this.data, 'amp'],
	            [this.data, 'icalEvent']
	        ];

	        if (this.data.alternatives && this.data.alternatives.length) {
	            this.data.alternatives.forEach((alternative, i) => {
	                keys.push([this.data.alternatives, i]);
	            });
	        }

	        if (this.data.attachments && this.data.attachments.length) {
	            this.data.attachments.forEach((attachment, i) => {
	                if (!attachment.filename) {
	                    attachment.filename = (attachment.path || attachment.href || '').split('/').pop().split('?').shift() || 'attachment-' + (i + 1);
	                    if (attachment.filename.indexOf('.') < 0) {
	                        attachment.filename += '.' + mimeFuncs.detectExtension(attachment.contentType);
	                    }
	                }

	                if (!attachment.contentType) {
	                    attachment.contentType = mimeFuncs.detectMimeType(attachment.filename || attachment.path || attachment.href || 'bin');
	                }

	                keys.push([this.data.attachments, i]);
	            });
	        }

	        let mimeNode = new MimeNode();

	        let addressKeys = ['from', 'to', 'cc', 'bcc', 'sender', 'replyTo'];

	        addressKeys.forEach(address => {
	            let value;
	            if (this.message) {
	                value = [].concat(mimeNode._parseAddresses(this.message.getHeader(address === 'replyTo' ? 'reply-to' : address)) || []);
	            } else if (this.data[address]) {
	                value = [].concat(mimeNode._parseAddresses(this.data[address]) || []);
	            }
	            if (value && value.length) {
	                this.data[address] = value;
	            } else if (address in this.data) {
	                this.data[address] = null;
	            }
	        });

	        let singleKeys = ['from', 'sender'];
	        singleKeys.forEach(address => {
	            if (this.data[address]) {
	                this.data[address] = this.data[address].shift();
	            }
	        });

	        let pos = 0;
	        let resolveNext = () => {
	            if (pos >= keys.length) {
	                return callback(null, this.data);
	            }
	            let args = keys[pos++];
	            if (!args[0] || !args[0][args[1]]) {
	                return resolveNext();
	            }
	            shared.resolveContent(...args, (err, value) => {
	                if (err) {
	                    return callback(err);
	                }

	                let node = {
	                    content: value
	                };
	                if (args[0][args[1]] && typeof args[0][args[1]] === 'object' && !Buffer.isBuffer(args[0][args[1]])) {
	                    Object.keys(args[0][args[1]]).forEach(key => {
	                        if (!(key in node) && !['content', 'path', 'href', 'raw'].includes(key)) {
	                            node[key] = args[0][args[1]][key];
	                        }
	                    });
	                }

	                args[0][args[1]] = node;
	                resolveNext();
	            });
	        };

	        setImmediate(() => resolveNext());
	    }

	    normalize(callback) {
	        let envelope = this.data.envelope || this.message.getEnvelope();
	        let messageId = this.message.messageId();

	        this.resolveAll((err, data) => {
	            if (err) {
	                return callback(err);
	            }

	            data.envelope = envelope;
	            data.messageId = messageId;

	            ['html', 'text', 'watchHtml', 'amp'].forEach(key => {
	                if (data[key] && data[key].content) {
	                    if (typeof data[key].content === 'string') {
	                        data[key] = data[key].content;
	                    } else if (Buffer.isBuffer(data[key].content)) {
	                        data[key] = data[key].content.toString();
	                    }
	                }
	            });

	            if (data.icalEvent && Buffer.isBuffer(data.icalEvent.content)) {
	                data.icalEvent.content = data.icalEvent.content.toString('base64');
	                data.icalEvent.encoding = 'base64';
	            }

	            if (data.alternatives && data.alternatives.length) {
	                data.alternatives.forEach(alternative => {
	                    if (alternative && alternative.content && Buffer.isBuffer(alternative.content)) {
	                        alternative.content = alternative.content.toString('base64');
	                        alternative.encoding = 'base64';
	                    }
	                });
	            }

	            if (data.attachments && data.attachments.length) {
	                data.attachments.forEach(attachment => {
	                    if (attachment && attachment.content && Buffer.isBuffer(attachment.content)) {
	                        attachment.content = attachment.content.toString('base64');
	                        attachment.encoding = 'base64';
	                    }
	                });
	            }

	            data.normalizedHeaders = {};
	            Object.keys(data.headers || {}).forEach(key => {
	                let value = [].concat(data.headers[key] || []).shift();
	                value = (value && value.value) || value;
	                if (value) {
	                    if (['references', 'in-reply-to', 'message-id', 'content-id'].includes(key)) {
	                        value = this.message._encodeHeaderValue(key, value);
	                    }
	                    data.normalizedHeaders[key] = value;
	                }
	            });

	            if (data.list && typeof data.list === 'object') {
	                let listHeaders = this._getListHeaders(data.list);
	                listHeaders.forEach(entry => {
	                    data.normalizedHeaders[entry.key] = entry.value.map(val => (val && val.value) || val).join(', ');
	                });
	            }

	            if (data.references) {
	                data.normalizedHeaders.references = this.message._encodeHeaderValue('references', data.references);
	            }

	            if (data.inReplyTo) {
	                data.normalizedHeaders['in-reply-to'] = this.message._encodeHeaderValue('in-reply-to', data.inReplyTo);
	            }

	            return callback(null, data);
	        });
	    }

	    setMailerHeader() {
	        if (!this.message || !this.data.xMailer) {
	            return;
	        }
	        this.message.setHeader('X-Mailer', this.data.xMailer);
	    }

	    setPriorityHeaders() {
	        if (!this.message || !this.data.priority) {
	            return;
	        }
	        switch ((this.data.priority || '').toString().toLowerCase()) {
	            case 'high':
	                this.message.setHeader('X-Priority', '1 (Highest)');
	                this.message.setHeader('X-MSMail-Priority', 'High');
	                this.message.setHeader('Importance', 'High');
	                break;
	            case 'low':
	                this.message.setHeader('X-Priority', '5 (Lowest)');
	                this.message.setHeader('X-MSMail-Priority', 'Low');
	                this.message.setHeader('Importance', 'Low');
	                break;
	            // do not add anything, since all messages are 'Normal' by default
	        }
	    }

	    setListHeaders() {
	        if (!this.message || !this.data.list || typeof this.data.list !== 'object') {
	            return;
	        }
	        // add optional List-* headers
	        if (this.data.list && typeof this.data.list === 'object') {
	            this._getListHeaders(this.data.list).forEach(listHeader => {
	                listHeader.value.forEach(value => {
	                    this.message.addHeader(listHeader.key, value);
	                });
	            });
	        }
	    }

	    _getListHeaders(listData) {
	        // make sure an url looks like <protocol:url>
	        return Object.keys(listData).map(key => ({
	            key: 'list-' + key.toLowerCase().trim(),
	            value: [].concat(listData[key] || []).map(value => ({
	                prepared: true,
	                foldLines: true,
	                value: []
	                    .concat(value || [])
	                    .map(value => {
	                        if (typeof value === 'string') {
	                            value = {
	                                url: value
	                            };
	                        }

	                        if (value && value.url) {
	                            if (key.toLowerCase().trim() === 'id') {
	                                // List-ID: "comment" <domain>
	                                let comment = value.comment || '';
	                                if (mimeFuncs.isPlainText(comment)) {
	                                    comment = '"' + comment + '"';
	                                } else {
	                                    comment = mimeFuncs.encodeWord(comment);
	                                }

	                                return (value.comment ? comment + ' ' : '') + this._formatListUrl(value.url).replace(/^<[^:]+\/{,2}/, '');
	                            }

	                            // List-*: <http://domain> (comment)
	                            let comment = value.comment || '';
	                            if (!mimeFuncs.isPlainText(comment)) {
	                                comment = mimeFuncs.encodeWord(comment);
	                            }

	                            return this._formatListUrl(value.url) + (value.comment ? ' (' + comment + ')' : '');
	                        }

	                        return '';
	                    })
	                    .filter(value => value)
	                    .join(', ')
	            }))
	        }));
	    }

	    _formatListUrl(url) {
	        url = url.replace(/[\s<]+|[\s>]+/g, '');
	        if (/^(https?|mailto|ftp):/.test(url)) {
	            return '<' + url + '>';
	        }
	        if (/^[^@]+@[^@]+$/.test(url)) {
	            return '<mailto:' + url + '>';
	        }

	        return '<http://' + url + '>';
	    }
	}

	mailMessage = MailMessage;
	return mailMessage;
}

var mailer;
var hasRequiredMailer;

function requireMailer () {
	if (hasRequiredMailer) return mailer;
	hasRequiredMailer = 1;

	const EventEmitter = require$$0$4;
	const shared = requireShared();
	const mimeTypes = requireMimeTypes();
	const MailComposer = requireMailComposer();
	const DKIM = requireDkim();
	const httpProxyClient = requireHttpProxyClient();
	const util = require$$1$1;
	const urllib = require$$0$5;
	const packageData = require$$9;
	const MailMessage = requireMailMessage();
	const net = require$$3;
	const dns = require$$4$1;
	const crypto = require$$5;

	/**
	 * Creates an object for exposing the Mail API
	 *
	 * @constructor
	 * @param {Object} transporter Transport object instance to pass the mails to
	 */
	class Mail extends EventEmitter {
	    constructor(transporter, options, defaults) {
	        super();

	        this.options = options || {};
	        this._defaults = defaults || {};

	        this._defaultPlugins = {
	            compile: [(...args) => this._convertDataImages(...args)],
	            stream: []
	        };

	        this._userPlugins = {
	            compile: [],
	            stream: []
	        };

	        this.meta = new Map();

	        this.dkim = this.options.dkim ? new DKIM(this.options.dkim) : false;

	        this.transporter = transporter;
	        this.transporter.mailer = this;

	        this.logger = shared.getLogger(this.options, {
	            component: this.options.component || 'mail'
	        });

	        this.logger.debug(
	            {
	                tnx: 'create'
	            },
	            'Creating transport: %s',
	            this.getVersionString()
	        );

	        // setup emit handlers for the transporter
	        if (typeof this.transporter.on === 'function') {
	            // deprecated log interface
	            this.transporter.on('log', log => {
	                this.logger.debug(
	                    {
	                        tnx: 'transport'
	                    },
	                    '%s: %s',
	                    log.type,
	                    log.message
	                );
	            });

	            // transporter errors
	            this.transporter.on('error', err => {
	                this.logger.error(
	                    {
	                        err,
	                        tnx: 'transport'
	                    },
	                    'Transport Error: %s',
	                    err.message
	                );
	                this.emit('error', err);
	            });

	            // indicates if the sender has became idle
	            this.transporter.on('idle', (...args) => {
	                this.emit('idle', ...args);
	            });
	        }

	        /**
	         * Optional methods passed to the underlying transport object
	         */
	        ['close', 'isIdle', 'verify'].forEach(method => {
	            this[method] = (...args) => {
	                if (typeof this.transporter[method] === 'function') {
	                    if (method === 'verify' && typeof this.getSocket === 'function') {
	                        this.transporter.getSocket = this.getSocket;
	                        this.getSocket = false;
	                    }
	                    return this.transporter[method](...args);
	                } else {
	                    this.logger.warn(
	                        {
	                            tnx: 'transport',
	                            methodName: method
	                        },
	                        'Non existing method %s called for transport',
	                        method
	                    );
	                    return false;
	                }
	            };
	        });

	        // setup proxy handling
	        if (this.options.proxy && typeof this.options.proxy === 'string') {
	            this.setupProxy(this.options.proxy);
	        }
	    }

	    use(step, plugin) {
	        step = (step || '').toString();
	        if (!this._userPlugins.hasOwnProperty(step)) {
	            this._userPlugins[step] = [plugin];
	        } else {
	            this._userPlugins[step].push(plugin);
	        }

	        return this;
	    }

	    /**
	     * Sends an email using the preselected transport object
	     *
	     * @param {Object} data E-data description
	     * @param {Function?} callback Callback to run once the sending succeeded or failed
	     */
	    sendMail(data, callback = null) {
	        let promise;

	        if (!callback) {
	            promise = new Promise((resolve, reject) => {
	                callback = shared.callbackPromise(resolve, reject);
	            });
	        }

	        if (typeof this.getSocket === 'function') {
	            this.transporter.getSocket = this.getSocket;
	            this.getSocket = false;
	        }

	        let mail = new MailMessage(this, data);

	        this.logger.debug(
	            {
	                tnx: 'transport',
	                name: this.transporter.name,
	                version: this.transporter.version,
	                action: 'send'
	            },
	            'Sending mail using %s/%s',
	            this.transporter.name,
	            this.transporter.version
	        );

	        this._processPlugins('compile', mail, err => {
	            if (err) {
	                this.logger.error(
	                    {
	                        err,
	                        tnx: 'plugin',
	                        action: 'compile'
	                    },
	                    'PluginCompile Error: %s',
	                    err.message
	                );
	                return callback(err);
	            }

	            mail.message = new MailComposer(mail.data).compile();

	            mail.setMailerHeader();
	            mail.setPriorityHeaders();
	            mail.setListHeaders();

	            this._processPlugins('stream', mail, err => {
	                if (err) {
	                    this.logger.error(
	                        {
	                            err,
	                            tnx: 'plugin',
	                            action: 'stream'
	                        },
	                        'PluginStream Error: %s',
	                        err.message
	                    );
	                    return callback(err);
	                }

	                if (mail.data.dkim || this.dkim) {
	                    mail.message.processFunc(input => {
	                        let dkim = mail.data.dkim ? new DKIM(mail.data.dkim) : this.dkim;
	                        this.logger.debug(
	                            {
	                                tnx: 'DKIM',
	                                messageId: mail.message.messageId(),
	                                dkimDomains: dkim.keys.map(key => key.keySelector + '.' + key.domainName).join(', ')
	                            },
	                            'Signing outgoing message with %s keys',
	                            dkim.keys.length
	                        );
	                        return dkim.sign(input, mail.data._dkim);
	                    });
	                }

	                this.transporter.send(mail, (...args) => {
	                    if (args[0]) {
	                        this.logger.error(
	                            {
	                                err: args[0],
	                                tnx: 'transport',
	                                action: 'send'
	                            },
	                            'Send Error: %s',
	                            args[0].message
	                        );
	                    }
	                    callback(...args);
	                });
	            });
	        });

	        return promise;
	    }

	    getVersionString() {
	        return util.format('%s (%s; +%s; %s/%s)', packageData.name, packageData.version, packageData.homepage, this.transporter.name, this.transporter.version);
	    }

	    _processPlugins(step, mail, callback) {
	        step = (step || '').toString();

	        if (!this._userPlugins.hasOwnProperty(step)) {
	            return callback();
	        }

	        let userPlugins = this._userPlugins[step] || [];
	        let defaultPlugins = this._defaultPlugins[step] || [];

	        if (userPlugins.length) {
	            this.logger.debug(
	                {
	                    tnx: 'transaction',
	                    pluginCount: userPlugins.length,
	                    step
	                },
	                'Using %s plugins for %s',
	                userPlugins.length,
	                step
	            );
	        }

	        if (userPlugins.length + defaultPlugins.length === 0) {
	            return callback();
	        }

	        let pos = 0;
	        let block = 'default';
	        let processPlugins = () => {
	            let curplugins = block === 'default' ? defaultPlugins : userPlugins;
	            if (pos >= curplugins.length) {
	                if (block === 'default' && userPlugins.length) {
	                    block = 'user';
	                    pos = 0;
	                    curplugins = userPlugins;
	                } else {
	                    return callback();
	                }
	            }
	            let plugin = curplugins[pos++];
	            plugin(mail, err => {
	                if (err) {
	                    return callback(err);
	                }
	                processPlugins();
	            });
	        };

	        processPlugins();
	    }

	    /**
	     * Sets up proxy handler for a Nodemailer object
	     *
	     * @param {String} proxyUrl Proxy configuration url
	     */
	    setupProxy(proxyUrl) {
	        let proxy = urllib.parse(proxyUrl);

	        // setup socket handler for the mailer object
	        this.getSocket = (options, callback) => {
	            let protocol = proxy.protocol.replace(/:$/, '').toLowerCase();

	            if (this.meta.has('proxy_handler_' + protocol)) {
	                return this.meta.get('proxy_handler_' + protocol)(proxy, options, callback);
	            }

	            switch (protocol) {
	                // Connect using a HTTP CONNECT method
	                case 'http':
	                case 'https':
	                    httpProxyClient(proxy.href, options.port, options.host, (err, socket) => {
	                        if (err) {
	                            return callback(err);
	                        }
	                        return callback(null, {
	                            connection: socket
	                        });
	                    });
	                    return;
	                case 'socks':
	                case 'socks5':
	                case 'socks4':
	                case 'socks4a': {
	                    if (!this.meta.has('proxy_socks_module')) {
	                        return callback(new Error('Socks module not loaded'));
	                    }
	                    let connect = ipaddress => {
	                        let proxyV2 = !!this.meta.get('proxy_socks_module').SocksClient;
	                        let socksClient = proxyV2 ? this.meta.get('proxy_socks_module').SocksClient : this.meta.get('proxy_socks_module');
	                        let proxyType = Number(proxy.protocol.replace(/\D/g, '')) || 5;
	                        let connectionOpts = {
	                            proxy: {
	                                ipaddress,
	                                port: Number(proxy.port),
	                                type: proxyType
	                            },
	                            [proxyV2 ? 'destination' : 'target']: {
	                                host: options.host,
	                                port: options.port
	                            },
	                            command: 'connect'
	                        };

	                        if (proxy.auth) {
	                            let username = decodeURIComponent(proxy.auth.split(':').shift());
	                            let password = decodeURIComponent(proxy.auth.split(':').pop());
	                            if (proxyV2) {
	                                connectionOpts.proxy.userId = username;
	                                connectionOpts.proxy.password = password;
	                            } else if (proxyType === 4) {
	                                connectionOpts.userid = username;
	                            } else {
	                                connectionOpts.authentication = {
	                                    username,
	                                    password
	                                };
	                            }
	                        }

	                        socksClient.createConnection(connectionOpts, (err, info) => {
	                            if (err) {
	                                return callback(err);
	                            }
	                            return callback(null, {
	                                connection: info.socket || info
	                            });
	                        });
	                    };

	                    if (net.isIP(proxy.hostname)) {
	                        return connect(proxy.hostname);
	                    }

	                    return dns.resolve(proxy.hostname, (err, address) => {
	                        if (err) {
	                            return callback(err);
	                        }
	                        connect(Array.isArray(address) ? address[0] : address);
	                    });
	                }
	            }
	            callback(new Error('Unknown proxy configuration'));
	        };
	    }

	    _convertDataImages(mail, callback) {
	        if ((!this.options.attachDataUrls && !mail.data.attachDataUrls) || !mail.data.html) {
	            return callback();
	        }
	        mail.resolveContent(mail.data, 'html', (err, html) => {
	            if (err) {
	                return callback(err);
	            }
	            let cidCounter = 0;
	            html = (html || '').toString().replace(/(<img\b[^>]* src\s*=[\s"']*)(data:([^;]+);[^"'>\s]+)/gi, (match, prefix, dataUri, mimeType) => {
	                let cid = crypto.randomBytes(10).toString('hex') + '@localhost';
	                if (!mail.data.attachments) {
	                    mail.data.attachments = [];
	                }
	                if (!Array.isArray(mail.data.attachments)) {
	                    mail.data.attachments = [].concat(mail.data.attachments || []);
	                }
	                mail.data.attachments.push({
	                    path: dataUri,
	                    cid,
	                    filename: 'image-' + ++cidCounter + '.' + mimeTypes.detectExtension(mimeType)
	                });
	                return prefix + 'cid:' + cid;
	            });
	            mail.data.html = html;
	            callback();
	        });
	    }

	    set(key, value) {
	        return this.meta.set(key, value);
	    }

	    get(key) {
	        return this.meta.get(key);
	    }
	}

	mailer = Mail;
	return mailer;
}

var dataStream;
var hasRequiredDataStream;

function requireDataStream () {
	if (hasRequiredDataStream) return dataStream;
	hasRequiredDataStream = 1;

	const stream = require$$0$3;
	const Transform = stream.Transform;

	/**
	 * Escapes dots in the beginning of lines. Ends the stream with <CR><LF>.<CR><LF>
	 * Also makes sure that only <CR><LF> sequences are used for linebreaks
	 *
	 * @param {Object} options Stream options
	 */
	class DataStream extends Transform {
	    constructor(options) {
	        super(options);
	        // init Transform
	        this.options = options || {};
	        this._curLine = '';

	        this.inByteCount = 0;
	        this.outByteCount = 0;
	        this.lastByte = false;
	    }

	    /**
	     * Escapes dots
	     */
	    _transform(chunk, encoding, done) {
	        let chunks = [];
	        let chunklen = 0;
	        let i,
	            len,
	            lastPos = 0;
	        let buf;

	        if (!chunk || !chunk.length) {
	            return done();
	        }

	        if (typeof chunk === 'string') {
	            chunk = Buffer.from(chunk);
	        }

	        this.inByteCount += chunk.length;

	        for (i = 0, len = chunk.length; i < len; i++) {
	            if (chunk[i] === 0x2e) {
	                // .
	                if ((i && chunk[i - 1] === 0x0a) || (!i && (!this.lastByte || this.lastByte === 0x0a))) {
	                    buf = chunk.slice(lastPos, i + 1);
	                    chunks.push(buf);
	                    chunks.push(Buffer.from('.'));
	                    chunklen += buf.length + 1;
	                    lastPos = i + 1;
	                }
	            } else if (chunk[i] === 0x0a) {
	                // .
	                if ((i && chunk[i - 1] !== 0x0d) || (!i && this.lastByte !== 0x0d)) {
	                    if (i > lastPos) {
	                        buf = chunk.slice(lastPos, i);
	                        chunks.push(buf);
	                        chunklen += buf.length + 2;
	                    } else {
	                        chunklen += 2;
	                    }
	                    chunks.push(Buffer.from('\r\n'));
	                    lastPos = i + 1;
	                }
	            }
	        }

	        if (chunklen) {
	            // add last piece
	            if (lastPos < chunk.length) {
	                buf = chunk.slice(lastPos);
	                chunks.push(buf);
	                chunklen += buf.length;
	            }

	            this.outByteCount += chunklen;
	            this.push(Buffer.concat(chunks, chunklen));
	        } else {
	            this.outByteCount += chunk.length;
	            this.push(chunk);
	        }

	        this.lastByte = chunk[chunk.length - 1];
	        done();
	    }

	    /**
	     * Finalizes the stream with a dot on a single line
	     */
	    _flush(done) {
	        let buf;
	        if (this.lastByte === 0x0a) {
	            buf = Buffer.from('.\r\n');
	        } else if (this.lastByte === 0x0d) {
	            buf = Buffer.from('\n.\r\n');
	        } else {
	            buf = Buffer.from('\r\n.\r\n');
	        }
	        this.outByteCount += buf.length;
	        this.push(buf);
	        done();
	    }
	}

	dataStream = DataStream;
	return dataStream;
}

var smtpConnection;
var hasRequiredSmtpConnection;

function requireSmtpConnection () {
	if (hasRequiredSmtpConnection) return smtpConnection;
	hasRequiredSmtpConnection = 1;

	const packageInfo = require$$9;
	const EventEmitter = require$$0$4.EventEmitter;
	const net = require$$3;
	const tls = require$$4;
	const os = require$$6;
	const crypto = require$$5;
	const DataStream = requireDataStream();
	const PassThrough = require$$0$3.PassThrough;
	const shared = requireShared();

	// default timeout values in ms
	const CONNECTION_TIMEOUT = 2 * 60 * 1000; // how much to wait for the connection to be established
	const SOCKET_TIMEOUT = 10 * 60 * 1000; // how much to wait for socket inactivity before disconnecting the client
	const GREETING_TIMEOUT = 30 * 1000; // how much to wait after connection is established but SMTP greeting is not receieved
	const DNS_TIMEOUT = 30 * 1000; // how much to wait for resolveHostname

	/**
	 * Generates a SMTP connection object
	 *
	 * Optional options object takes the following possible properties:
	 *
	 *  * **port** - is the port to connect to (defaults to 587 or 465)
	 *  * **host** - is the hostname or IP address to connect to (defaults to 'localhost')
	 *  * **secure** - use SSL
	 *  * **ignoreTLS** - ignore server support for STARTTLS
	 *  * **requireTLS** - forces the client to use STARTTLS
	 *  * **name** - the name of the client server
	 *  * **localAddress** - outbound address to bind to (see: http://nodejs.org/api/net.html#net_net_connect_options_connectionlistener)
	 *  * **greetingTimeout** - Time to wait in ms until greeting message is received from the server (defaults to 10000)
	 *  * **connectionTimeout** - how many milliseconds to wait for the connection to establish
	 *  * **socketTimeout** - Time of inactivity until the connection is closed (defaults to 1 hour)
	 *  * **dnsTimeout** - Time to wait in ms for the DNS requests to be resolved (defaults to 30 seconds)
	 *  * **lmtp** - if true, uses LMTP instead of SMTP protocol
	 *  * **logger** - bunyan compatible logger interface
	 *  * **debug** - if true pass SMTP traffic to the logger
	 *  * **tls** - options for createCredentials
	 *  * **socket** - existing socket to use instead of creating a new one (see: http://nodejs.org/api/net.html#net_class_net_socket)
	 *  * **secured** - boolean indicates that the provided socket has already been upgraded to tls
	 *
	 * @constructor
	 * @namespace SMTP Client module
	 * @param {Object} [options] Option properties
	 */
	class SMTPConnection extends EventEmitter {
	    constructor(options) {
	        super(options);

	        this.id = crypto.randomBytes(8).toString('base64').replace(/\W/g, '');
	        this.stage = 'init';

	        this.options = options || {};

	        this.secureConnection = !!this.options.secure;
	        this.alreadySecured = !!this.options.secured;

	        this.port = Number(this.options.port) || (this.secureConnection ? 465 : 587);
	        this.host = this.options.host || 'localhost';

	        this.allowInternalNetworkInterfaces = this.options.allowInternalNetworkInterfaces || false;

	        if (typeof this.options.secure === 'undefined' && this.port === 465) {
	            // if secure option is not set but port is 465, then default to secure
	            this.secureConnection = true;
	        }

	        this.name = this.options.name || this._getHostname();

	        this.logger = shared.getLogger(this.options, {
	            component: this.options.component || 'smtp-connection',
	            sid: this.id
	        });

	        this.customAuth = new Map();
	        Object.keys(this.options.customAuth || {}).forEach(key => {
	            let mapKey = (key || '').toString().trim().toUpperCase();
	            if (!mapKey) {
	                return;
	            }
	            this.customAuth.set(mapKey, this.options.customAuth[key]);
	        });

	        /**
	         * Expose version nr, just for the reference
	         * @type {String}
	         */
	        this.version = packageInfo.version;

	        /**
	         * If true, then the user is authenticated
	         * @type {Boolean}
	         */
	        this.authenticated = false;

	        /**
	         * If set to true, this instance is no longer active
	         * @private
	         */
	        this.destroyed = false;

	        /**
	         * Defines if the current connection is secure or not. If not,
	         * STARTTLS can be used if available
	         * @private
	         */
	        this.secure = !!this.secureConnection;

	        /**
	         * Store incomplete messages coming from the server
	         * @private
	         */
	        this._remainder = '';

	        /**
	         * Unprocessed responses from the server
	         * @type {Array}
	         */
	        this._responseQueue = [];

	        this.lastServerResponse = false;

	        /**
	         * The socket connecting to the server
	         * @publick
	         */
	        this._socket = false;

	        /**
	         * Lists supported auth mechanisms
	         * @private
	         */
	        this._supportedAuth = [];

	        /**
	         * Set to true, if EHLO response includes "AUTH".
	         * If false then authentication is not tried
	         */
	        this.allowsAuth = false;

	        /**
	         * Includes current envelope (from, to)
	         * @private
	         */
	        this._envelope = false;

	        /**
	         * Lists supported extensions
	         * @private
	         */
	        this._supportedExtensions = [];

	        /**
	         * Defines the maximum allowed size for a single message
	         * @private
	         */
	        this._maxAllowedSize = 0;

	        /**
	         * Function queue to run if a data chunk comes from the server
	         * @private
	         */
	        this._responseActions = [];
	        this._recipientQueue = [];

	        /**
	         * Timeout variable for waiting the greeting
	         * @private
	         */
	        this._greetingTimeout = false;

	        /**
	         * Timeout variable for waiting the connection to start
	         * @private
	         */
	        this._connectionTimeout = false;

	        /**
	         * If the socket is deemed already closed
	         * @private
	         */
	        this._destroyed = false;

	        /**
	         * If the socket is already being closed
	         * @private
	         */
	        this._closing = false;

	        /**
	         * Callbacks for socket's listeners
	         */
	        this._onSocketData = chunk => this._onData(chunk);
	        this._onSocketError = error => this._onError(error, 'ESOCKET', false, 'CONN');
	        this._onSocketClose = () => this._onClose();
	        this._onSocketEnd = () => this._onEnd();
	        this._onSocketTimeout = () => this._onTimeout();
	    }

	    /**
	     * Creates a connection to a SMTP server and sets up connection
	     * listener
	     */
	    connect(connectCallback) {
	        if (typeof connectCallback === 'function') {
	            this.once('connect', () => {
	                this.logger.debug(
	                    {
	                        tnx: 'smtp'
	                    },
	                    'SMTP handshake finished'
	                );
	                connectCallback();
	            });

	            const isDestroyedMessage = this._isDestroyedMessage('connect');
	            if (isDestroyedMessage) {
	                return connectCallback(this._formatError(isDestroyedMessage, 'ECONNECTION', false, 'CONN'));
	            }
	        }

	        let opts = {
	            port: this.port,
	            host: this.host,
	            allowInternalNetworkInterfaces: this.allowInternalNetworkInterfaces,
	            timeout: this.options.dnsTimeout || DNS_TIMEOUT
	        };

	        if (this.options.localAddress) {
	            opts.localAddress = this.options.localAddress;
	        }

	        let setupConnectionHandlers = () => {
	            this._connectionTimeout = setTimeout(() => {
	                this._onError('Connection timeout', 'ETIMEDOUT', false, 'CONN');
	            }, this.options.connectionTimeout || CONNECTION_TIMEOUT);

	            this._socket.on('error', this._onSocketError);
	        };

	        if (this.options.connection) {
	            // connection is already opened
	            this._socket = this.options.connection;
	            if (this.secureConnection && !this.alreadySecured) {
	                setImmediate(() =>
	                    this._upgradeConnection(err => {
	                        if (err) {
	                            this._onError(new Error('Error initiating TLS - ' + (err.message || err)), 'ETLS', false, 'CONN');
	                            return;
	                        }
	                        this._onConnect();
	                    })
	                );
	            } else {
	                setImmediate(() => this._onConnect());
	            }
	            return;
	        } else if (this.options.socket) {
	            // socket object is set up but not yet connected
	            this._socket = this.options.socket;
	            return shared.resolveHostname(opts, (err, resolved) => {
	                if (err) {
	                    return setImmediate(() => this._onError(err, 'EDNS', false, 'CONN'));
	                }
	                this.logger.debug(
	                    {
	                        tnx: 'dns',
	                        source: opts.host,
	                        resolved: resolved.host,
	                        cached: !!resolved.cached
	                    },
	                    'Resolved %s as %s [cache %s]',
	                    opts.host,
	                    resolved.host,
	                    resolved.cached ? 'hit' : 'miss'
	                );
	                Object.keys(resolved).forEach(key => {
	                    if (key.charAt(0) !== '_' && resolved[key]) {
	                        opts[key] = resolved[key];
	                    }
	                });
	                try {
	                    this._socket.connect(this.port, this.host, () => {
	                        this._socket.setKeepAlive(true);
	                        this._onConnect();
	                    });
	                    setupConnectionHandlers();
	                } catch (E) {
	                    return setImmediate(() => this._onError(E, 'ECONNECTION', false, 'CONN'));
	                }
	            });
	        } else if (this.secureConnection) {
	            // connect using tls
	            if (this.options.tls) {
	                Object.keys(this.options.tls).forEach(key => {
	                    opts[key] = this.options.tls[key];
	                });
	            }
	            return shared.resolveHostname(opts, (err, resolved) => {
	                if (err) {
	                    return setImmediate(() => this._onError(err, 'EDNS', false, 'CONN'));
	                }
	                this.logger.debug(
	                    {
	                        tnx: 'dns',
	                        source: opts.host,
	                        resolved: resolved.host,
	                        cached: !!resolved.cached
	                    },
	                    'Resolved %s as %s [cache %s]',
	                    opts.host,
	                    resolved.host,
	                    resolved.cached ? 'hit' : 'miss'
	                );
	                Object.keys(resolved).forEach(key => {
	                    if (key.charAt(0) !== '_' && resolved[key]) {
	                        opts[key] = resolved[key];
	                    }
	                });
	                try {
	                    this._socket = tls.connect(opts, () => {
	                        this._socket.setKeepAlive(true);
	                        this._onConnect();
	                    });
	                    setupConnectionHandlers();
	                } catch (E) {
	                    return setImmediate(() => this._onError(E, 'ECONNECTION', false, 'CONN'));
	                }
	            });
	        } else {
	            // connect using plaintext
	            return shared.resolveHostname(opts, (err, resolved) => {
	                if (err) {
	                    return setImmediate(() => this._onError(err, 'EDNS', false, 'CONN'));
	                }
	                this.logger.debug(
	                    {
	                        tnx: 'dns',
	                        source: opts.host,
	                        resolved: resolved.host,
	                        cached: !!resolved.cached
	                    },
	                    'Resolved %s as %s [cache %s]',
	                    opts.host,
	                    resolved.host,
	                    resolved.cached ? 'hit' : 'miss'
	                );
	                Object.keys(resolved).forEach(key => {
	                    if (key.charAt(0) !== '_' && resolved[key]) {
	                        opts[key] = resolved[key];
	                    }
	                });
	                try {
	                    this._socket = net.connect(opts, () => {
	                        this._socket.setKeepAlive(true);
	                        this._onConnect();
	                    });
	                    setupConnectionHandlers();
	                } catch (E) {
	                    return setImmediate(() => this._onError(E, 'ECONNECTION', false, 'CONN'));
	                }
	            });
	        }
	    }

	    /**
	     * Sends QUIT
	     */
	    quit() {
	        this._sendCommand('QUIT');
	        this._responseActions.push(this.close);
	    }

	    /**
	     * Closes the connection to the server
	     */
	    close() {
	        clearTimeout(this._connectionTimeout);
	        clearTimeout(this._greetingTimeout);
	        this._responseActions = [];

	        // allow to run this function only once
	        if (this._closing) {
	            return;
	        }
	        this._closing = true;

	        let closeMethod = 'end';

	        if (this.stage === 'init') {
	            // Close the socket immediately when connection timed out
	            closeMethod = 'destroy';
	        }

	        this.logger.debug(
	            {
	                tnx: 'smtp'
	            },
	            'Closing connection to the server using "%s"',
	            closeMethod
	        );

	        let socket = (this._socket && this._socket.socket) || this._socket;

	        if (socket && !socket.destroyed) {
	            try {
	                this._socket[closeMethod]();
	            } catch (E) {
	                // just ignore
	            }
	        }

	        this._destroy();
	    }

	    /**
	     * Authenticate user
	     */
	    login(authData, callback) {
	        const isDestroyedMessage = this._isDestroyedMessage('login');
	        if (isDestroyedMessage) {
	            return callback(this._formatError(isDestroyedMessage, 'ECONNECTION', false, 'API'));
	        }

	        this._auth = authData || {};
	        // Select SASL authentication method
	        this._authMethod = (this._auth.method || '').toString().trim().toUpperCase() || false;

	        if (!this._authMethod && this._auth.oauth2 && !this._auth.credentials) {
	            this._authMethod = 'XOAUTH2';
	        } else if (!this._authMethod || (this._authMethod === 'XOAUTH2' && !this._auth.oauth2)) {
	            // use first supported
	            this._authMethod = (this._supportedAuth[0] || 'PLAIN').toUpperCase().trim();
	        }

	        if (this._authMethod !== 'XOAUTH2' && (!this._auth.credentials || !this._auth.credentials.user || !this._auth.credentials.pass)) {
	            if ((this._auth.user && this._auth.pass) || this.customAuth.has(this._authMethod)) {
	                this._auth.credentials = {
	                    user: this._auth.user,
	                    pass: this._auth.pass,
	                    options: this._auth.options
	                };
	            } else {
	                return callback(this._formatError('Missing credentials for "' + this._authMethod + '"', 'EAUTH', false, 'API'));
	            }
	        }

	        if (this.customAuth.has(this._authMethod)) {
	            let handler = this.customAuth.get(this._authMethod);
	            let lastResponse;
	            let returned = false;

	            let resolve = () => {
	                if (returned) {
	                    return;
	                }
	                returned = true;
	                this.logger.info(
	                    {
	                        tnx: 'smtp',
	                        username: this._auth.user,
	                        action: 'authenticated',
	                        method: this._authMethod
	                    },
	                    'User %s authenticated',
	                    JSON.stringify(this._auth.user)
	                );
	                this.authenticated = true;
	                callback(null, true);
	            };

	            let reject = err => {
	                if (returned) {
	                    return;
	                }
	                returned = true;
	                callback(this._formatError(err, 'EAUTH', lastResponse, 'AUTH ' + this._authMethod));
	            };

	            let handlerResponse = handler({
	                auth: this._auth,
	                method: this._authMethod,

	                extensions: [].concat(this._supportedExtensions),
	                authMethods: [].concat(this._supportedAuth),
	                maxAllowedSize: this._maxAllowedSize || false,

	                sendCommand: (cmd, done) => {
	                    let promise;

	                    if (!done) {
	                        promise = new Promise((resolve, reject) => {
	                            done = shared.callbackPromise(resolve, reject);
	                        });
	                    }

	                    this._responseActions.push(str => {
	                        lastResponse = str;

	                        let codes = str.match(/^(\d+)(?:\s(\d+\.\d+\.\d+))?\s/);
	                        let data = {
	                            command: cmd,
	                            response: str
	                        };
	                        if (codes) {
	                            data.status = Number(codes[1]) || 0;
	                            if (codes[2]) {
	                                data.code = codes[2];
	                            }
	                            data.text = str.substr(codes[0].length);
	                        } else {
	                            data.text = str;
	                            data.status = 0; // just in case we need to perform numeric comparisons
	                        }
	                        done(null, data);
	                    });
	                    setImmediate(() => this._sendCommand(cmd));

	                    return promise;
	                },

	                resolve,
	                reject
	            });

	            if (handlerResponse && typeof handlerResponse.catch === 'function') {
	                // a promise was returned
	                handlerResponse.then(resolve).catch(reject);
	            }

	            return;
	        }

	        switch (this._authMethod) {
	            case 'XOAUTH2':
	                this._handleXOauth2Token(false, callback);
	                return;
	            case 'LOGIN':
	                this._responseActions.push(str => {
	                    this._actionAUTH_LOGIN_USER(str, callback);
	                });
	                this._sendCommand('AUTH LOGIN');
	                return;
	            case 'PLAIN':
	                this._responseActions.push(str => {
	                    this._actionAUTHComplete(str, callback);
	                });
	                this._sendCommand(
	                    'AUTH PLAIN ' +
	                        Buffer.from(
	                            //this._auth.user+'\u0000'+
	                            '\u0000' + // skip authorization identity as it causes problems with some servers
	                                this._auth.credentials.user +
	                                '\u0000' +
	                                this._auth.credentials.pass,
	                            'utf-8'
	                        ).toString('base64'),
	                    // log entry without passwords
	                    'AUTH PLAIN ' +
	                        Buffer.from(
	                            //this._auth.user+'\u0000'+
	                            '\u0000' + // skip authorization identity as it causes problems with some servers
	                                this._auth.credentials.user +
	                                '\u0000' +
	                                '/* secret */',
	                            'utf-8'
	                        ).toString('base64')
	                );
	                return;
	            case 'CRAM-MD5':
	                this._responseActions.push(str => {
	                    this._actionAUTH_CRAM_MD5(str, callback);
	                });
	                this._sendCommand('AUTH CRAM-MD5');
	                return;
	        }

	        return callback(this._formatError('Unknown authentication method "' + this._authMethod + '"', 'EAUTH', false, 'API'));
	    }

	    /**
	     * Sends a message
	     *
	     * @param {Object} envelope Envelope object, {from: addr, to: [addr]}
	     * @param {Object} message String, Buffer or a Stream
	     * @param {Function} callback Callback to return once sending is completed
	     */
	    send(envelope, message, done) {
	        if (!message) {
	            return done(this._formatError('Empty message', 'EMESSAGE', false, 'API'));
	        }

	        const isDestroyedMessage = this._isDestroyedMessage('send message');
	        if (isDestroyedMessage) {
	            return done(this._formatError(isDestroyedMessage, 'ECONNECTION', false, 'API'));
	        }

	        // reject larger messages than allowed
	        if (this._maxAllowedSize && envelope.size > this._maxAllowedSize) {
	            return setImmediate(() => {
	                done(this._formatError('Message size larger than allowed ' + this._maxAllowedSize, 'EMESSAGE', false, 'MAIL FROM'));
	            });
	        }

	        // ensure that callback is only called once
	        let returned = false;
	        let callback = function () {
	            if (returned) {
	                return;
	            }
	            returned = true;

	            done(...arguments);
	        };

	        if (typeof message.on === 'function') {
	            message.on('error', err => callback(this._formatError(err, 'ESTREAM', false, 'API')));
	        }

	        let startTime = Date.now();
	        this._setEnvelope(envelope, (err, info) => {
	            if (err) {
	                return callback(err);
	            }
	            let envelopeTime = Date.now();
	            let stream = this._createSendStream((err, str) => {
	                if (err) {
	                    return callback(err);
	                }

	                info.envelopeTime = envelopeTime - startTime;
	                info.messageTime = Date.now() - envelopeTime;
	                info.messageSize = stream.outByteCount;
	                info.response = str;

	                return callback(null, info);
	            });
	            if (typeof message.pipe === 'function') {
	                message.pipe(stream);
	            } else {
	                stream.write(message);
	                stream.end();
	            }
	        });
	    }

	    /**
	     * Resets connection state
	     *
	     * @param {Function} callback Callback to return once connection is reset
	     */
	    reset(callback) {
	        this._sendCommand('RSET');
	        this._responseActions.push(str => {
	            if (str.charAt(0) !== '2') {
	                return callback(this._formatError('Could not reset session state. response=' + str, 'EPROTOCOL', str, 'RSET'));
	            }
	            this._envelope = false;
	            return callback(null, true);
	        });
	    }

	    /**
	     * Connection listener that is run when the connection to
	     * the server is opened
	     *
	     * @event
	     */
	    _onConnect() {
	        clearTimeout(this._connectionTimeout);

	        this.logger.info(
	            {
	                tnx: 'network',
	                localAddress: this._socket.localAddress,
	                localPort: this._socket.localPort,
	                remoteAddress: this._socket.remoteAddress,
	                remotePort: this._socket.remotePort
	            },
	            '%s established to %s:%s',
	            this.secure ? 'Secure connection' : 'Connection',
	            this._socket.remoteAddress,
	            this._socket.remotePort
	        );

	        if (this._destroyed) {
	            // Connection was established after we already had canceled it
	            this.close();
	            return;
	        }

	        this.stage = 'connected';

	        // clear existing listeners for the socket
	        this._socket.removeListener('data', this._onSocketData);
	        this._socket.removeListener('timeout', this._onSocketTimeout);
	        this._socket.removeListener('close', this._onSocketClose);
	        this._socket.removeListener('end', this._onSocketEnd);

	        this._socket.on('data', this._onSocketData);
	        this._socket.once('close', this._onSocketClose);
	        this._socket.once('end', this._onSocketEnd);

	        this._socket.setTimeout(this.options.socketTimeout || SOCKET_TIMEOUT);
	        this._socket.on('timeout', this._onSocketTimeout);

	        this._greetingTimeout = setTimeout(() => {
	            // if still waiting for greeting, give up
	            if (this._socket && !this._destroyed && this._responseActions[0] === this._actionGreeting) {
	                this._onError('Greeting never received', 'ETIMEDOUT', false, 'CONN');
	            }
	        }, this.options.greetingTimeout || GREETING_TIMEOUT);

	        this._responseActions.push(this._actionGreeting);

	        // we have a 'data' listener set up so resume socket if it was paused
	        this._socket.resume();
	    }

	    /**
	     * 'data' listener for data coming from the server
	     *
	     * @event
	     * @param {Buffer} chunk Data chunk coming from the server
	     */
	    _onData(chunk) {
	        if (this._destroyed || !chunk || !chunk.length) {
	            return;
	        }

	        let data = (chunk || '').toString('binary');
	        let lines = (this._remainder + data).split(/\r?\n/);
	        let lastline;

	        this._remainder = lines.pop();

	        for (let i = 0, len = lines.length; i < len; i++) {
	            if (this._responseQueue.length) {
	                lastline = this._responseQueue[this._responseQueue.length - 1];
	                if (/^\d+-/.test(lastline.split('\n').pop())) {
	                    this._responseQueue[this._responseQueue.length - 1] += '\n' + lines[i];
	                    continue;
	                }
	            }
	            this._responseQueue.push(lines[i]);
	        }

	        if (this._responseQueue.length) {
	            lastline = this._responseQueue[this._responseQueue.length - 1];
	            if (/^\d+-/.test(lastline.split('\n').pop())) {
	                return;
	            }
	        }

	        this._processResponse();
	    }

	    /**
	     * 'error' listener for the socket
	     *
	     * @event
	     * @param {Error} err Error object
	     * @param {String} type Error name
	     */
	    _onError(err, type, data, command) {
	        clearTimeout(this._connectionTimeout);
	        clearTimeout(this._greetingTimeout);

	        if (this._destroyed) {
	            // just ignore, already closed
	            // this might happen when a socket is canceled because of reached timeout
	            // but the socket timeout error itself receives only after
	            return;
	        }

	        err = this._formatError(err, type, data, command);

	        this.logger.error(data, err.message);

	        this.emit('error', err);
	        this.close();
	    }

	    _formatError(message, type, response, command) {
	        let err;

	        if (/Error\]$/i.test(Object.prototype.toString.call(message))) {
	            err = message;
	        } else {
	            err = new Error(message);
	        }

	        if (type && type !== 'Error') {
	            err.code = type;
	        }

	        if (response) {
	            err.response = response;
	            err.message += ': ' + response;
	        }

	        let responseCode = (typeof response === 'string' && Number((response.match(/^\d+/) || [])[0])) || false;
	        if (responseCode) {
	            err.responseCode = responseCode;
	        }

	        if (command) {
	            err.command = command;
	        }

	        return err;
	    }

	    /**
	     * 'close' listener for the socket
	     *
	     * @event
	     */
	    _onClose() {
	        let serverResponse = false;

	        if (this._remainder && this._remainder.trim()) {
	            if (this.options.debug || this.options.transactionLog) {
	                this.logger.debug(
	                    {
	                        tnx: 'server'
	                    },
	                    this._remainder.replace(/\r?\n$/, '')
	                );
	            }
	            this.lastServerResponse = serverResponse = this._remainder.trim();
	        }

	        this.logger.info(
	            {
	                tnx: 'network'
	            },
	            'Connection closed'
	        );

	        if (this.upgrading && !this._destroyed) {
	            return this._onError(new Error('Connection closed unexpectedly'), 'ETLS', serverResponse, 'CONN');
	        } else if (![this._actionGreeting, this.close].includes(this._responseActions[0]) && !this._destroyed) {
	            return this._onError(new Error('Connection closed unexpectedly'), 'ECONNECTION', serverResponse, 'CONN');
	        } else if (/^[45]\d{2}\b/.test(serverResponse)) {
	            return this._onError(new Error('Connection closed unexpectedly'), 'ECONNECTION', serverResponse, 'CONN');
	        }

	        this._destroy();
	    }

	    /**
	     * 'end' listener for the socket
	     *
	     * @event
	     */
	    _onEnd() {
	        if (this._socket && !this._socket.destroyed) {
	            this._socket.destroy();
	        }
	    }

	    /**
	     * 'timeout' listener for the socket
	     *
	     * @event
	     */
	    _onTimeout() {
	        return this._onError(new Error('Timeout'), 'ETIMEDOUT', false, 'CONN');
	    }

	    /**
	     * Destroys the client, emits 'end'
	     */
	    _destroy() {
	        if (this._destroyed) {
	            return;
	        }
	        this._destroyed = true;
	        this.emit('end');
	    }

	    /**
	     * Upgrades the connection to TLS
	     *
	     * @param {Function} callback Callback function to run when the connection
	     *        has been secured
	     */
	    _upgradeConnection(callback) {
	        // do not remove all listeners or it breaks node v0.10 as there's
	        // apparently a 'finish' event set that would be cleared as well

	        // we can safely keep 'error', 'end', 'close' etc. events
	        this._socket.removeListener('data', this._onSocketData); // incoming data is going to be gibberish from this point onwards
	        this._socket.removeListener('timeout', this._onSocketTimeout); // timeout will be re-set for the new socket object

	        let socketPlain = this._socket;
	        let opts = {
	            socket: this._socket,
	            host: this.host
	        };

	        Object.keys(this.options.tls || {}).forEach(key => {
	            opts[key] = this.options.tls[key];
	        });

	        this.upgrading = true;
	        // tls.connect is not an asynchronous function however it may still throw errors and requires to be wrapped with try/catch
	        try {
	            this._socket = tls.connect(opts, () => {
	                this.secure = true;
	                this.upgrading = false;
	                this._socket.on('data', this._onSocketData);

	                socketPlain.removeListener('close', this._onSocketClose);
	                socketPlain.removeListener('end', this._onSocketEnd);

	                return callback(null, true);
	            });
	        } catch (err) {
	            return callback(err);
	        }

	        this._socket.on('error', this._onSocketError);
	        this._socket.once('close', this._onSocketClose);
	        this._socket.once('end', this._onSocketEnd);

	        this._socket.setTimeout(this.options.socketTimeout || SOCKET_TIMEOUT); // 10 min.
	        this._socket.on('timeout', this._onSocketTimeout);

	        // resume in case the socket was paused
	        socketPlain.resume();
	    }

	    /**
	     * Processes queued responses from the server
	     *
	     * @param {Boolean} force If true, ignores _processing flag
	     */
	    _processResponse() {
	        if (!this._responseQueue.length) {
	            return false;
	        }

	        let str = (this.lastServerResponse = (this._responseQueue.shift() || '').toString());

	        if (/^\d+-/.test(str.split('\n').pop())) {
	            // keep waiting for the final part of multiline response
	            return;
	        }

	        if (this.options.debug || this.options.transactionLog) {
	            this.logger.debug(
	                {
	                    tnx: 'server'
	                },
	                str.replace(/\r?\n$/, '')
	            );
	        }

	        if (!str.trim()) {
	            // skip unexpected empty lines
	            setImmediate(() => this._processResponse());
	        }

	        let action = this._responseActions.shift();

	        if (typeof action === 'function') {
	            action.call(this, str);
	            setImmediate(() => this._processResponse());
	        } else {
	            return this._onError(new Error('Unexpected Response'), 'EPROTOCOL', str, 'CONN');
	        }
	    }

	    /**
	     * Send a command to the server, append \r\n
	     *
	     * @param {String} str String to be sent to the server
	     * @param {String} logStr Optional string to be used for logging instead of the actual string
	     */
	    _sendCommand(str, logStr) {
	        if (this._destroyed) {
	            // Connection already closed, can't send any more data
	            return;
	        }

	        if (this._socket.destroyed) {
	            return this.close();
	        }

	        if (this.options.debug || this.options.transactionLog) {
	            this.logger.debug(
	                {
	                    tnx: 'client'
	                },
	                (logStr || str || '').toString().replace(/\r?\n$/, '')
	            );
	        }

	        this._socket.write(Buffer.from(str + '\r\n', 'utf-8'));
	    }

	    /**
	     * Initiates a new message by submitting envelope data, starting with
	     * MAIL FROM: command
	     *
	     * @param {Object} envelope Envelope object in the form of
	     *        {from:'...', to:['...']}
	     *        or
	     *        {from:{address:'...',name:'...'}, to:[address:'...',name:'...']}
	     */
	    _setEnvelope(envelope, callback) {
	        let args = [];
	        let useSmtpUtf8 = false;

	        this._envelope = envelope || {};
	        this._envelope.from = ((this._envelope.from && this._envelope.from.address) || this._envelope.from || '').toString().trim();

	        this._envelope.to = [].concat(this._envelope.to || []).map(to => ((to && to.address) || to || '').toString().trim());

	        if (!this._envelope.to.length) {
	            return callback(this._formatError('No recipients defined', 'EENVELOPE', false, 'API'));
	        }

	        if (this._envelope.from && /[\r\n<>]/.test(this._envelope.from)) {
	            return callback(this._formatError('Invalid sender ' + JSON.stringify(this._envelope.from), 'EENVELOPE', false, 'API'));
	        }

	        // check if the sender address uses only ASCII characters,
	        // otherwise require usage of SMTPUTF8 extension
	        if (/[\x80-\uFFFF]/.test(this._envelope.from)) {
	            useSmtpUtf8 = true;
	        }

	        for (let i = 0, len = this._envelope.to.length; i < len; i++) {
	            if (!this._envelope.to[i] || /[\r\n<>]/.test(this._envelope.to[i])) {
	                return callback(this._formatError('Invalid recipient ' + JSON.stringify(this._envelope.to[i]), 'EENVELOPE', false, 'API'));
	            }

	            // check if the recipients addresses use only ASCII characters,
	            // otherwise require usage of SMTPUTF8 extension
	            if (/[\x80-\uFFFF]/.test(this._envelope.to[i])) {
	                useSmtpUtf8 = true;
	            }
	        }

	        // clone the recipients array for latter manipulation
	        this._envelope.rcptQueue = JSON.parse(JSON.stringify(this._envelope.to || []));
	        this._envelope.rejected = [];
	        this._envelope.rejectedErrors = [];
	        this._envelope.accepted = [];

	        if (this._envelope.dsn) {
	            try {
	                this._envelope.dsn = this._setDsnEnvelope(this._envelope.dsn);
	            } catch (err) {
	                return callback(this._formatError('Invalid DSN ' + err.message, 'EENVELOPE', false, 'API'));
	            }
	        }

	        this._responseActions.push(str => {
	            this._actionMAIL(str, callback);
	        });

	        // If the server supports SMTPUTF8 and the envelope includes an internationalized
	        // email address then append SMTPUTF8 keyword to the MAIL FROM command
	        if (useSmtpUtf8 && this._supportedExtensions.includes('SMTPUTF8')) {
	            args.push('SMTPUTF8');
	            this._usingSmtpUtf8 = true;
	        }

	        // If the server supports 8BITMIME and the message might contain non-ascii bytes
	        // then append the 8BITMIME keyword to the MAIL FROM command
	        if (this._envelope.use8BitMime && this._supportedExtensions.includes('8BITMIME')) {
	            args.push('BODY=8BITMIME');
	            this._using8BitMime = true;
	        }

	        if (this._envelope.size && this._supportedExtensions.includes('SIZE')) {
	            args.push('SIZE=' + this._envelope.size);
	        }

	        // If the server supports DSN and the envelope includes an DSN prop
	        // then append DSN params to the MAIL FROM command
	        if (this._envelope.dsn && this._supportedExtensions.includes('DSN')) {
	            if (this._envelope.dsn.ret) {
	                args.push('RET=' + shared.encodeXText(this._envelope.dsn.ret));
	            }
	            if (this._envelope.dsn.envid) {
	                args.push('ENVID=' + shared.encodeXText(this._envelope.dsn.envid));
	            }
	        }

	        this._sendCommand('MAIL FROM:<' + this._envelope.from + '>' + (args.length ? ' ' + args.join(' ') : ''));
	    }

	    _setDsnEnvelope(params) {
	        let ret = (params.ret || params.return || '').toString().toUpperCase() || null;
	        if (ret) {
	            switch (ret) {
	                case 'HDRS':
	                case 'HEADERS':
	                    ret = 'HDRS';
	                    break;
	                case 'FULL':
	                case 'BODY':
	                    ret = 'FULL';
	                    break;
	            }
	        }

	        if (ret && !['FULL', 'HDRS'].includes(ret)) {
	            throw new Error('ret: ' + JSON.stringify(ret));
	        }

	        let envid = (params.envid || params.id || '').toString() || null;

	        let notify = params.notify || null;
	        if (notify) {
	            if (typeof notify === 'string') {
	                notify = notify.split(',');
	            }
	            notify = notify.map(n => n.trim().toUpperCase());
	            let validNotify = ['NEVER', 'SUCCESS', 'FAILURE', 'DELAY'];
	            let invaliNotify = notify.filter(n => !validNotify.includes(n));
	            if (invaliNotify.length || (notify.length > 1 && notify.includes('NEVER'))) {
	                throw new Error('notify: ' + JSON.stringify(notify.join(',')));
	            }
	            notify = notify.join(',');
	        }

	        let orcpt = (params.recipient || params.orcpt || '').toString() || null;
	        if (orcpt && orcpt.indexOf(';') < 0) {
	            orcpt = 'rfc822;' + orcpt;
	        }

	        return {
	            ret,
	            envid,
	            notify,
	            orcpt
	        };
	    }

	    _getDsnRcptToArgs() {
	        let args = [];
	        // If the server supports DSN and the envelope includes an DSN prop
	        // then append DSN params to the RCPT TO command
	        if (this._envelope.dsn && this._supportedExtensions.includes('DSN')) {
	            if (this._envelope.dsn.notify) {
	                args.push('NOTIFY=' + shared.encodeXText(this._envelope.dsn.notify));
	            }
	            if (this._envelope.dsn.orcpt) {
	                args.push('ORCPT=' + shared.encodeXText(this._envelope.dsn.orcpt));
	            }
	        }
	        return args.length ? ' ' + args.join(' ') : '';
	    }

	    _createSendStream(callback) {
	        let dataStream = new DataStream();
	        let logStream;

	        if (this.options.lmtp) {
	            this._envelope.accepted.forEach((recipient, i) => {
	                let final = i === this._envelope.accepted.length - 1;
	                this._responseActions.push(str => {
	                    this._actionLMTPStream(recipient, final, str, callback);
	                });
	            });
	        } else {
	            this._responseActions.push(str => {
	                this._actionSMTPStream(str, callback);
	            });
	        }

	        dataStream.pipe(this._socket, {
	            end: false
	        });

	        if (this.options.debug) {
	            logStream = new PassThrough();
	            logStream.on('readable', () => {
	                let chunk;
	                while ((chunk = logStream.read())) {
	                    this.logger.debug(
	                        {
	                            tnx: 'message'
	                        },
	                        chunk.toString('binary').replace(/\r?\n$/, '')
	                    );
	                }
	            });
	            dataStream.pipe(logStream);
	        }

	        dataStream.once('end', () => {
	            this.logger.info(
	                {
	                    tnx: 'message',
	                    inByteCount: dataStream.inByteCount,
	                    outByteCount: dataStream.outByteCount
	                },
	                '<%s bytes encoded mime message (source size %s bytes)>',
	                dataStream.outByteCount,
	                dataStream.inByteCount
	            );
	        });

	        return dataStream;
	    }

	    /** ACTIONS **/

	    /**
	     * Will be run after the connection is created and the server sends
	     * a greeting. If the incoming message starts with 220 initiate
	     * SMTP session by sending EHLO command
	     *
	     * @param {String} str Message from the server
	     */
	    _actionGreeting(str) {
	        clearTimeout(this._greetingTimeout);

	        if (str.substr(0, 3) !== '220') {
	            this._onError(new Error('Invalid greeting. response=' + str), 'EPROTOCOL', str, 'CONN');
	            return;
	        }

	        if (this.options.lmtp) {
	            this._responseActions.push(this._actionLHLO);
	            this._sendCommand('LHLO ' + this.name);
	        } else {
	            this._responseActions.push(this._actionEHLO);
	            this._sendCommand('EHLO ' + this.name);
	        }
	    }

	    /**
	     * Handles server response for LHLO command. If it yielded in
	     * error, emit 'error', otherwise treat this as an EHLO response
	     *
	     * @param {String} str Message from the server
	     */
	    _actionLHLO(str) {
	        if (str.charAt(0) !== '2') {
	            this._onError(new Error('Invalid LHLO. response=' + str), 'EPROTOCOL', str, 'LHLO');
	            return;
	        }

	        this._actionEHLO(str);
	    }

	    /**
	     * Handles server response for EHLO command. If it yielded in
	     * error, try HELO instead, otherwise initiate TLS negotiation
	     * if STARTTLS is supported by the server or move into the
	     * authentication phase.
	     *
	     * @param {String} str Message from the server
	     */
	    _actionEHLO(str) {
	        let match;

	        if (str.substr(0, 3) === '421') {
	            this._onError(new Error('Server terminates connection. response=' + str), 'ECONNECTION', str, 'EHLO');
	            return;
	        }

	        if (str.charAt(0) !== '2') {
	            if (this.options.requireTLS) {
	                this._onError(new Error('EHLO failed but HELO does not support required STARTTLS. response=' + str), 'ECONNECTION', str, 'EHLO');
	                return;
	            }

	            // Try HELO instead
	            this._responseActions.push(this._actionHELO);
	            this._sendCommand('HELO ' + this.name);
	            return;
	        }

	        this._ehloLines = str
	            .split(/\r?\n/)
	            .map(line => line.replace(/^\d+[ -]/, '').trim())
	            .filter(line => line)
	            .slice(1);

	        // Detect if the server supports STARTTLS
	        if (!this.secure && !this.options.ignoreTLS && (/[ -]STARTTLS\b/im.test(str) || this.options.requireTLS)) {
	            this._sendCommand('STARTTLS');
	            this._responseActions.push(this._actionSTARTTLS);
	            return;
	        }

	        // Detect if the server supports SMTPUTF8
	        if (/[ -]SMTPUTF8\b/im.test(str)) {
	            this._supportedExtensions.push('SMTPUTF8');
	        }

	        // Detect if the server supports DSN
	        if (/[ -]DSN\b/im.test(str)) {
	            this._supportedExtensions.push('DSN');
	        }

	        // Detect if the server supports 8BITMIME
	        if (/[ -]8BITMIME\b/im.test(str)) {
	            this._supportedExtensions.push('8BITMIME');
	        }

	        // Detect if the server supports PIPELINING
	        if (/[ -]PIPELINING\b/im.test(str)) {
	            this._supportedExtensions.push('PIPELINING');
	        }

	        // Detect if the server supports AUTH
	        if (/[ -]AUTH\b/i.test(str)) {
	            this.allowsAuth = true;
	        }

	        // Detect if the server supports PLAIN auth
	        if (/[ -]AUTH(?:(\s+|=)[^\n]*\s+|\s+|=)PLAIN/i.test(str)) {
	            this._supportedAuth.push('PLAIN');
	        }

	        // Detect if the server supports LOGIN auth
	        if (/[ -]AUTH(?:(\s+|=)[^\n]*\s+|\s+|=)LOGIN/i.test(str)) {
	            this._supportedAuth.push('LOGIN');
	        }

	        // Detect if the server supports CRAM-MD5 auth
	        if (/[ -]AUTH(?:(\s+|=)[^\n]*\s+|\s+|=)CRAM-MD5/i.test(str)) {
	            this._supportedAuth.push('CRAM-MD5');
	        }

	        // Detect if the server supports XOAUTH2 auth
	        if (/[ -]AUTH(?:(\s+|=)[^\n]*\s+|\s+|=)XOAUTH2/i.test(str)) {
	            this._supportedAuth.push('XOAUTH2');
	        }

	        // Detect if the server supports SIZE extensions (and the max allowed size)
	        if ((match = str.match(/[ -]SIZE(?:[ \t]+(\d+))?/im))) {
	            this._supportedExtensions.push('SIZE');
	            this._maxAllowedSize = Number(match[1]) || 0;
	        }

	        this.emit('connect');
	    }

	    /**
	     * Handles server response for HELO command. If it yielded in
	     * error, emit 'error', otherwise move into the authentication phase.
	     *
	     * @param {String} str Message from the server
	     */
	    _actionHELO(str) {
	        if (str.charAt(0) !== '2') {
	            this._onError(new Error('Invalid HELO. response=' + str), 'EPROTOCOL', str, 'HELO');
	            return;
	        }

	        // assume that authentication is enabled (most probably is not though)
	        this.allowsAuth = true;

	        this.emit('connect');
	    }

	    /**
	     * Handles server response for STARTTLS command. If there's an error
	     * try HELO instead, otherwise initiate TLS upgrade. If the upgrade
	     * succeedes restart the EHLO
	     *
	     * @param {String} str Message from the server
	     */
	    _actionSTARTTLS(str) {
	        if (str.charAt(0) !== '2') {
	            if (this.options.opportunisticTLS) {
	                this.logger.info(
	                    {
	                        tnx: 'smtp'
	                    },
	                    'Failed STARTTLS upgrade, continuing unencrypted'
	                );
	                return this.emit('connect');
	            }
	            this._onError(new Error('Error upgrading connection with STARTTLS'), 'ETLS', str, 'STARTTLS');
	            return;
	        }

	        this._upgradeConnection((err, secured) => {
	            if (err) {
	                this._onError(new Error('Error initiating TLS - ' + (err.message || err)), 'ETLS', false, 'STARTTLS');
	                return;
	            }

	            this.logger.info(
	                {
	                    tnx: 'smtp'
	                },
	                'Connection upgraded with STARTTLS'
	            );

	            if (secured) {
	                // restart session
	                if (this.options.lmtp) {
	                    this._responseActions.push(this._actionLHLO);
	                    this._sendCommand('LHLO ' + this.name);
	                } else {
	                    this._responseActions.push(this._actionEHLO);
	                    this._sendCommand('EHLO ' + this.name);
	                }
	            } else {
	                this.emit('connect');
	            }
	        });
	    }

	    /**
	     * Handle the response for AUTH LOGIN command. We are expecting
	     * '334 VXNlcm5hbWU6' (base64 for 'Username:'). Data to be sent as
	     * response needs to be base64 encoded username. We do not need
	     * exact match but settle with 334 response in general as some
	     * hosts invalidly use a longer message than VXNlcm5hbWU6
	     *
	     * @param {String} str Message from the server
	     */
	    _actionAUTH_LOGIN_USER(str, callback) {
	        if (!/^334[ -]/.test(str)) {
	            // expecting '334 VXNlcm5hbWU6'
	            callback(this._formatError('Invalid login sequence while waiting for "334 VXNlcm5hbWU6"', 'EAUTH', str, 'AUTH LOGIN'));
	            return;
	        }

	        this._responseActions.push(str => {
	            this._actionAUTH_LOGIN_PASS(str, callback);
	        });

	        this._sendCommand(Buffer.from(this._auth.credentials.user + '', 'utf-8').toString('base64'));
	    }

	    /**
	     * Handle the response for AUTH CRAM-MD5 command. We are expecting
	     * '334 <challenge string>'. Data to be sent as response needs to be
	     * base64 decoded challenge string, MD5 hashed using the password as
	     * a HMAC key, prefixed by the username and a space, and finally all
	     * base64 encoded again.
	     *
	     * @param {String} str Message from the server
	     */
	    _actionAUTH_CRAM_MD5(str, callback) {
	        let challengeMatch = str.match(/^334\s+(.+)$/);
	        let challengeString = '';

	        if (!challengeMatch) {
	            return callback(this._formatError('Invalid login sequence while waiting for server challenge string', 'EAUTH', str, 'AUTH CRAM-MD5'));
	        } else {
	            challengeString = challengeMatch[1];
	        }

	        // Decode from base64
	        let base64decoded = Buffer.from(challengeString, 'base64').toString('ascii'),
	            hmacMD5 = crypto.createHmac('md5', this._auth.credentials.pass);

	        hmacMD5.update(base64decoded);

	        let prepended = this._auth.credentials.user + ' ' + hmacMD5.digest('hex');

	        this._responseActions.push(str => {
	            this._actionAUTH_CRAM_MD5_PASS(str, callback);
	        });

	        this._sendCommand(
	            Buffer.from(prepended).toString('base64'),
	            // hidden hash for logs
	            Buffer.from(this._auth.credentials.user + ' /* secret */').toString('base64')
	        );
	    }

	    /**
	     * Handles the response to CRAM-MD5 authentication, if there's no error,
	     * the user can be considered logged in. Start waiting for a message to send
	     *
	     * @param {String} str Message from the server
	     */
	    _actionAUTH_CRAM_MD5_PASS(str, callback) {
	        if (!str.match(/^235\s+/)) {
	            return callback(this._formatError('Invalid login sequence while waiting for "235"', 'EAUTH', str, 'AUTH CRAM-MD5'));
	        }

	        this.logger.info(
	            {
	                tnx: 'smtp',
	                username: this._auth.user,
	                action: 'authenticated',
	                method: this._authMethod
	            },
	            'User %s authenticated',
	            JSON.stringify(this._auth.user)
	        );
	        this.authenticated = true;
	        callback(null, true);
	    }

	    /**
	     * Handle the response for AUTH LOGIN command. We are expecting
	     * '334 UGFzc3dvcmQ6' (base64 for 'Password:'). Data to be sent as
	     * response needs to be base64 encoded password.
	     *
	     * @param {String} str Message from the server
	     */
	    _actionAUTH_LOGIN_PASS(str, callback) {
	        if (!/^334[ -]/.test(str)) {
	            // expecting '334 UGFzc3dvcmQ6'
	            return callback(this._formatError('Invalid login sequence while waiting for "334 UGFzc3dvcmQ6"', 'EAUTH', str, 'AUTH LOGIN'));
	        }

	        this._responseActions.push(str => {
	            this._actionAUTHComplete(str, callback);
	        });

	        this._sendCommand(
	            Buffer.from((this._auth.credentials.pass || '').toString(), 'utf-8').toString('base64'),
	            // Hidden pass for logs
	            Buffer.from('/* secret */', 'utf-8').toString('base64')
	        );
	    }

	    /**
	     * Handles the response for authentication, if there's no error,
	     * the user can be considered logged in. Start waiting for a message to send
	     *
	     * @param {String} str Message from the server
	     */
	    _actionAUTHComplete(str, isRetry, callback) {
	        if (!callback && typeof isRetry === 'function') {
	            callback = isRetry;
	            isRetry = false;
	        }

	        if (str.substr(0, 3) === '334') {
	            this._responseActions.push(str => {
	                if (isRetry || this._authMethod !== 'XOAUTH2') {
	                    this._actionAUTHComplete(str, true, callback);
	                } else {
	                    // fetch a new OAuth2 access token
	                    setImmediate(() => this._handleXOauth2Token(true, callback));
	                }
	            });
	            this._sendCommand('');
	            return;
	        }

	        if (str.charAt(0) !== '2') {
	            this.logger.info(
	                {
	                    tnx: 'smtp',
	                    username: this._auth.user,
	                    action: 'authfail',
	                    method: this._authMethod
	                },
	                'User %s failed to authenticate',
	                JSON.stringify(this._auth.user)
	            );
	            return callback(this._formatError('Invalid login', 'EAUTH', str, 'AUTH ' + this._authMethod));
	        }

	        this.logger.info(
	            {
	                tnx: 'smtp',
	                username: this._auth.user,
	                action: 'authenticated',
	                method: this._authMethod
	            },
	            'User %s authenticated',
	            JSON.stringify(this._auth.user)
	        );
	        this.authenticated = true;
	        callback(null, true);
	    }

	    /**
	     * Handle response for a MAIL FROM: command
	     *
	     * @param {String} str Message from the server
	     */
	    _actionMAIL(str, callback) {
	        let message, curRecipient;
	        if (Number(str.charAt(0)) !== 2) {
	            if (this._usingSmtpUtf8 && /^550 /.test(str) && /[\x80-\uFFFF]/.test(this._envelope.from)) {
	                message = 'Internationalized mailbox name not allowed';
	            } else {
	                message = 'Mail command failed';
	            }
	            return callback(this._formatError(message, 'EENVELOPE', str, 'MAIL FROM'));
	        }

	        if (!this._envelope.rcptQueue.length) {
	            return callback(this._formatError('Can\x27t send mail - no recipients defined', 'EENVELOPE', false, 'API'));
	        } else {
	            this._recipientQueue = [];

	            if (this._supportedExtensions.includes('PIPELINING')) {
	                while (this._envelope.rcptQueue.length) {
	                    curRecipient = this._envelope.rcptQueue.shift();
	                    this._recipientQueue.push(curRecipient);
	                    this._responseActions.push(str => {
	                        this._actionRCPT(str, callback);
	                    });
	                    this._sendCommand('RCPT TO:<' + curRecipient + '>' + this._getDsnRcptToArgs());
	                }
	            } else {
	                curRecipient = this._envelope.rcptQueue.shift();
	                this._recipientQueue.push(curRecipient);
	                this._responseActions.push(str => {
	                    this._actionRCPT(str, callback);
	                });
	                this._sendCommand('RCPT TO:<' + curRecipient + '>' + this._getDsnRcptToArgs());
	            }
	        }
	    }

	    /**
	     * Handle response for a RCPT TO: command
	     *
	     * @param {String} str Message from the server
	     */
	    _actionRCPT(str, callback) {
	        let message,
	            err,
	            curRecipient = this._recipientQueue.shift();
	        if (Number(str.charAt(0)) !== 2) {
	            // this is a soft error
	            if (this._usingSmtpUtf8 && /^553 /.test(str) && /[\x80-\uFFFF]/.test(curRecipient)) {
	                message = 'Internationalized mailbox name not allowed';
	            } else {
	                message = 'Recipient command failed';
	            }
	            this._envelope.rejected.push(curRecipient);
	            // store error for the failed recipient
	            err = this._formatError(message, 'EENVELOPE', str, 'RCPT TO');
	            err.recipient = curRecipient;
	            this._envelope.rejectedErrors.push(err);
	        } else {
	            this._envelope.accepted.push(curRecipient);
	        }

	        if (!this._envelope.rcptQueue.length && !this._recipientQueue.length) {
	            if (this._envelope.rejected.length < this._envelope.to.length) {
	                this._responseActions.push(str => {
	                    this._actionDATA(str, callback);
	                });
	                this._sendCommand('DATA');
	            } else {
	                err = this._formatError('Can\x27t send mail - all recipients were rejected', 'EENVELOPE', str, 'RCPT TO');
	                err.rejected = this._envelope.rejected;
	                err.rejectedErrors = this._envelope.rejectedErrors;
	                return callback(err);
	            }
	        } else if (this._envelope.rcptQueue.length) {
	            curRecipient = this._envelope.rcptQueue.shift();
	            this._recipientQueue.push(curRecipient);
	            this._responseActions.push(str => {
	                this._actionRCPT(str, callback);
	            });
	            this._sendCommand('RCPT TO:<' + curRecipient + '>' + this._getDsnRcptToArgs());
	        }
	    }

	    /**
	     * Handle response for a DATA command
	     *
	     * @param {String} str Message from the server
	     */
	    _actionDATA(str, callback) {
	        // response should be 354 but according to this issue https://github.com/eleith/emailjs/issues/24
	        // some servers might use 250 instead, so lets check for 2 or 3 as the first digit
	        if (!/^[23]/.test(str)) {
	            return callback(this._formatError('Data command failed', 'EENVELOPE', str, 'DATA'));
	        }

	        let response = {
	            accepted: this._envelope.accepted,
	            rejected: this._envelope.rejected
	        };

	        if (this._ehloLines && this._ehloLines.length) {
	            response.ehlo = this._ehloLines;
	        }

	        if (this._envelope.rejectedErrors.length) {
	            response.rejectedErrors = this._envelope.rejectedErrors;
	        }

	        callback(null, response);
	    }

	    /**
	     * Handle response for a DATA stream when using SMTP
	     * We expect a single response that defines if the sending succeeded or failed
	     *
	     * @param {String} str Message from the server
	     */
	    _actionSMTPStream(str, callback) {
	        if (Number(str.charAt(0)) !== 2) {
	            // Message failed
	            return callback(this._formatError('Message failed', 'EMESSAGE', str, 'DATA'));
	        } else {
	            // Message sent succesfully
	            return callback(null, str);
	        }
	    }

	    /**
	     * Handle response for a DATA stream
	     * We expect a separate response for every recipient. All recipients can either
	     * succeed or fail separately
	     *
	     * @param {String} recipient The recipient this response applies to
	     * @param {Boolean} final Is this the final recipient?
	     * @param {String} str Message from the server
	     */
	    _actionLMTPStream(recipient, final, str, callback) {
	        let err;
	        if (Number(str.charAt(0)) !== 2) {
	            // Message failed
	            err = this._formatError('Message failed for recipient ' + recipient, 'EMESSAGE', str, 'DATA');
	            err.recipient = recipient;
	            this._envelope.rejected.push(recipient);
	            this._envelope.rejectedErrors.push(err);
	            for (let i = 0, len = this._envelope.accepted.length; i < len; i++) {
	                if (this._envelope.accepted[i] === recipient) {
	                    this._envelope.accepted.splice(i, 1);
	                }
	            }
	        }
	        if (final) {
	            return callback(null, str);
	        }
	    }

	    _handleXOauth2Token(isRetry, callback) {
	        this._auth.oauth2.getToken(isRetry, (err, accessToken) => {
	            if (err) {
	                this.logger.info(
	                    {
	                        tnx: 'smtp',
	                        username: this._auth.user,
	                        action: 'authfail',
	                        method: this._authMethod
	                    },
	                    'User %s failed to authenticate',
	                    JSON.stringify(this._auth.user)
	                );
	                return callback(this._formatError(err, 'EAUTH', false, 'AUTH XOAUTH2'));
	            }
	            this._responseActions.push(str => {
	                this._actionAUTHComplete(str, isRetry, callback);
	            });
	            this._sendCommand(
	                'AUTH XOAUTH2 ' + this._auth.oauth2.buildXOAuth2Token(accessToken),
	                //  Hidden for logs
	                'AUTH XOAUTH2 ' + this._auth.oauth2.buildXOAuth2Token('/* secret */')
	            );
	        });
	    }

	    /**
	     *
	     * @param {string} command
	     * @private
	     */
	    _isDestroyedMessage(command) {
	        if (this._destroyed) {
	            return 'Cannot ' + command + ' - smtp connection is already destroyed.';
	        }

	        if (this._socket) {
	            if (this._socket.destroyed) {
	                return 'Cannot ' + command + ' - smtp connection socket is already destroyed.';
	            }

	            if (!this._socket.writable) {
	                return 'Cannot ' + command + ' - smtp connection socket is already half-closed.';
	            }
	        }
	    }

	    _getHostname() {
	        // defaul hostname is machine hostname or [IP]
	        let defaultHostname;
	        try {
	            defaultHostname = os.hostname() || '';
	        } catch (err) {
	            // fails on windows 7
	            defaultHostname = 'localhost';
	        }

	        // ignore if not FQDN
	        if (!defaultHostname || defaultHostname.indexOf('.') < 0) {
	            defaultHostname = '[127.0.0.1]';
	        }

	        // IP should be enclosed in []
	        if (defaultHostname.match(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)) {
	            defaultHostname = '[' + defaultHostname + ']';
	        }

	        return defaultHostname;
	    }
	}

	smtpConnection = SMTPConnection;
	return smtpConnection;
}

var xoauth2;
var hasRequiredXoauth2;

function requireXoauth2 () {
	if (hasRequiredXoauth2) return xoauth2;
	hasRequiredXoauth2 = 1;

	const Stream = require$$0$3.Stream;
	const nmfetch = requireFetch();
	const crypto = require$$5;
	const shared = requireShared();

	/**
	 * XOAUTH2 access_token generator for Gmail.
	 * Create client ID for web applications in Google API console to use it.
	 * See Offline Access for receiving the needed refreshToken for an user
	 * https://developers.google.com/accounts/docs/OAuth2WebServer#offline
	 *
	 * Usage for generating access tokens with a custom method using provisionCallback:
	 * provisionCallback(user, renew, callback)
	 *   * user is the username to get the token for
	 *   * renew is a boolean that if true indicates that existing token failed and needs to be renewed
	 *   * callback is the callback to run with (error, accessToken [, expires])
	 *     * accessToken is a string
	 *     * expires is an optional expire time in milliseconds
	 * If provisionCallback is used, then Nodemailer does not try to attempt generating the token by itself
	 *
	 * @constructor
	 * @param {Object} options Client information for token generation
	 * @param {String} options.user User e-mail address
	 * @param {String} options.clientId Client ID value
	 * @param {String} options.clientSecret Client secret value
	 * @param {String} options.refreshToken Refresh token for an user
	 * @param {String} options.accessUrl Endpoint for token generation, defaults to 'https://accounts.google.com/o/oauth2/token'
	 * @param {String} options.accessToken An existing valid accessToken
	 * @param {String} options.privateKey Private key for JSW
	 * @param {Number} options.expires Optional Access Token expire time in ms
	 * @param {Number} options.timeout Optional TTL for Access Token in seconds
	 * @param {Function} options.provisionCallback Function to run when a new access token is required
	 */
	class XOAuth2 extends Stream {
	    constructor(options, logger) {
	        super();

	        this.options = options || {};

	        if (options && options.serviceClient) {
	            if (!options.privateKey || !options.user) {
	                setImmediate(() => this.emit('error', new Error('Options "privateKey" and "user" are required for service account!')));
	                return;
	            }

	            let serviceRequestTimeout = Math.min(Math.max(Number(this.options.serviceRequestTimeout) || 0, 0), 3600);
	            this.options.serviceRequestTimeout = serviceRequestTimeout || 5 * 60;
	        }

	        this.logger = shared.getLogger(
	            {
	                logger
	            },
	            {
	                component: this.options.component || 'OAuth2'
	            }
	        );

	        this.provisionCallback = typeof this.options.provisionCallback === 'function' ? this.options.provisionCallback : false;

	        this.options.accessUrl = this.options.accessUrl || 'https://accounts.google.com/o/oauth2/token';
	        this.options.customHeaders = this.options.customHeaders || {};
	        this.options.customParams = this.options.customParams || {};

	        this.accessToken = this.options.accessToken || false;

	        if (this.options.expires && Number(this.options.expires)) {
	            this.expires = this.options.expires;
	        } else {
	            let timeout = Math.max(Number(this.options.timeout) || 0, 0);
	            this.expires = (timeout && Date.now() + timeout * 1000) || 0;
	        }
	    }

	    /**
	     * Returns or generates (if previous has expired) a XOAuth2 token
	     *
	     * @param {Boolean} renew If false then use cached access token (if available)
	     * @param {Function} callback Callback function with error object and token string
	     */
	    getToken(renew, callback) {
	        if (!renew && this.accessToken && (!this.expires || this.expires > Date.now())) {
	            return callback(null, this.accessToken);
	        }

	        let generateCallback = (...args) => {
	            if (args[0]) {
	                this.logger.error(
	                    {
	                        err: args[0],
	                        tnx: 'OAUTH2',
	                        user: this.options.user,
	                        action: 'renew'
	                    },
	                    'Failed generating new Access Token for %s',
	                    this.options.user
	                );
	            } else {
	                this.logger.info(
	                    {
	                        tnx: 'OAUTH2',
	                        user: this.options.user,
	                        action: 'renew'
	                    },
	                    'Generated new Access Token for %s',
	                    this.options.user
	                );
	            }
	            callback(...args);
	        };

	        if (this.provisionCallback) {
	            this.provisionCallback(this.options.user, !!renew, (err, accessToken, expires) => {
	                if (!err && accessToken) {
	                    this.accessToken = accessToken;
	                    this.expires = expires || 0;
	                }
	                generateCallback(err, accessToken);
	            });
	        } else {
	            this.generateToken(generateCallback);
	        }
	    }

	    /**
	     * Updates token values
	     *
	     * @param {String} accessToken New access token
	     * @param {Number} timeout Access token lifetime in seconds
	     *
	     * Emits 'token': { user: User email-address, accessToken: the new accessToken, timeout: TTL in seconds}
	     */
	    updateToken(accessToken, timeout) {
	        this.accessToken = accessToken;
	        timeout = Math.max(Number(timeout) || 0, 0);
	        this.expires = (timeout && Date.now() + timeout * 1000) || 0;

	        this.emit('token', {
	            user: this.options.user,
	            accessToken: accessToken || '',
	            expires: this.expires
	        });
	    }

	    /**
	     * Generates a new XOAuth2 token with the credentials provided at initialization
	     *
	     * @param {Function} callback Callback function with error object and token string
	     */
	    generateToken(callback) {
	        let urlOptions;
	        let loggedUrlOptions;
	        if (this.options.serviceClient) {
	            // service account - https://developers.google.com/identity/protocols/OAuth2ServiceAccount
	            let iat = Math.floor(Date.now() / 1000); // unix time
	            let tokenData = {
	                iss: this.options.serviceClient,
	                scope: this.options.scope || 'https://mail.google.com/',
	                sub: this.options.user,
	                aud: this.options.accessUrl,
	                iat,
	                exp: iat + this.options.serviceRequestTimeout
	            };
	            let token;
	            try {
	                token = this.jwtSignRS256(tokenData);
	            } catch (err) {
	                return callback(new Error('Can\x27t generate token. Check your auth options'));
	            }

	            urlOptions = {
	                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
	                assertion: token
	            };

	            loggedUrlOptions = {
	                grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
	                assertion: tokenData
	            };
	        } else {
	            if (!this.options.refreshToken) {
	                return callback(new Error('Can\x27t create new access token for user'));
	            }

	            // web app - https://developers.google.com/identity/protocols/OAuth2WebServer
	            urlOptions = {
	                client_id: this.options.clientId || '',
	                client_secret: this.options.clientSecret || '',
	                refresh_token: this.options.refreshToken,
	                grant_type: 'refresh_token'
	            };

	            loggedUrlOptions = {
	                client_id: this.options.clientId || '',
	                client_secret: (this.options.clientSecret || '').substr(0, 6) + '...',
	                refresh_token: (this.options.refreshToken || '').substr(0, 6) + '...',
	                grant_type: 'refresh_token'
	            };
	        }

	        Object.keys(this.options.customParams).forEach(key => {
	            urlOptions[key] = this.options.customParams[key];
	            loggedUrlOptions[key] = this.options.customParams[key];
	        });

	        this.logger.debug(
	            {
	                tnx: 'OAUTH2',
	                user: this.options.user,
	                action: 'generate'
	            },
	            'Requesting token using: %s',
	            JSON.stringify(loggedUrlOptions)
	        );

	        this.postRequest(this.options.accessUrl, urlOptions, this.options, (error, body) => {
	            let data;

	            if (error) {
	                return callback(error);
	            }

	            try {
	                data = JSON.parse(body.toString());
	            } catch (E) {
	                return callback(E);
	            }

	            if (!data || typeof data !== 'object') {
	                this.logger.debug(
	                    {
	                        tnx: 'OAUTH2',
	                        user: this.options.user,
	                        action: 'post'
	                    },
	                    'Response: %s',
	                    (body || '').toString()
	                );
	                return callback(new Error('Invalid authentication response'));
	            }

	            let logData = {};
	            Object.keys(data).forEach(key => {
	                if (key !== 'access_token') {
	                    logData[key] = data[key];
	                } else {
	                    logData[key] = (data[key] || '').toString().substr(0, 6) + '...';
	                }
	            });

	            this.logger.debug(
	                {
	                    tnx: 'OAUTH2',
	                    user: this.options.user,
	                    action: 'post'
	                },
	                'Response: %s',
	                JSON.stringify(logData)
	            );

	            if (data.error) {
	                // Error Response : https://tools.ietf.org/html/rfc6749#section-5.2
	                let errorMessage = data.error;
	                if (data.error_description) {
	                    errorMessage += ': ' + data.error_description;
	                }
	                if (data.error_uri) {
	                    errorMessage += ' (' + data.error_uri + ')';
	                }
	                return callback(new Error(errorMessage));
	            }

	            if (data.access_token) {
	                this.updateToken(data.access_token, data.expires_in);
	                return callback(null, this.accessToken);
	            }

	            return callback(new Error('No access token'));
	        });
	    }

	    /**
	     * Converts an access_token and user id into a base64 encoded XOAuth2 token
	     *
	     * @param {String} [accessToken] Access token string
	     * @return {String} Base64 encoded token for IMAP or SMTP login
	     */
	    buildXOAuth2Token(accessToken) {
	        let authData = ['user=' + (this.options.user || ''), 'auth=Bearer ' + (accessToken || this.accessToken), '', ''];
	        return Buffer.from(authData.join('\x01'), 'utf-8').toString('base64');
	    }

	    /**
	     * Custom POST request handler.
	     * This is only needed to keep paths short in Windows – usually this module
	     * is a dependency of a dependency and if it tries to require something
	     * like the request module the paths get way too long to handle for Windows.
	     * As we do only a simple POST request we do not actually require complicated
	     * logic support (no redirects, no nothing) anyway.
	     *
	     * @param {String} url Url to POST to
	     * @param {String|Buffer} payload Payload to POST
	     * @param {Function} callback Callback function with (err, buff)
	     */
	    postRequest(url, payload, params, callback) {
	        let returned = false;

	        let chunks = [];
	        let chunklen = 0;

	        let req = nmfetch(url, {
	            method: 'post',
	            headers: params.customHeaders,
	            body: payload,
	            allowErrorResponse: true
	        });

	        req.on('readable', () => {
	            let chunk;
	            while ((chunk = req.read()) !== null) {
	                chunks.push(chunk);
	                chunklen += chunk.length;
	            }
	        });

	        req.once('error', err => {
	            if (returned) {
	                return;
	            }
	            returned = true;
	            return callback(err);
	        });

	        req.once('end', () => {
	            if (returned) {
	                return;
	            }
	            returned = true;
	            return callback(null, Buffer.concat(chunks, chunklen));
	        });
	    }

	    /**
	     * Encodes a buffer or a string into Base64url format
	     *
	     * @param {Buffer|String} data The data to convert
	     * @return {String} The encoded string
	     */
	    toBase64URL(data) {
	        if (typeof data === 'string') {
	            data = Buffer.from(data);
	        }

	        return data
	            .toString('base64')
	            .replace(/[=]+/g, '') // remove '='s
	            .replace(/\+/g, '-') // '+' → '-'
	            .replace(/\//g, '_'); // '/' → '_'
	    }

	    /**
	     * Creates a JSON Web Token signed with RS256 (SHA256 + RSA)
	     *
	     * @param {Object} payload The payload to include in the generated token
	     * @return {String} The generated and signed token
	     */
	    jwtSignRS256(payload) {
	        payload = ['{"alg":"RS256","typ":"JWT"}', JSON.stringify(payload)].map(val => this.toBase64URL(val)).join('.');
	        let signature = crypto.createSign('RSA-SHA256').update(payload).sign(this.options.privateKey);
	        return payload + '.' + this.toBase64URL(signature);
	    }
	}

	xoauth2 = XOAuth2;
	return xoauth2;
}

var poolResource;
var hasRequiredPoolResource;

function requirePoolResource () {
	if (hasRequiredPoolResource) return poolResource;
	hasRequiredPoolResource = 1;

	const SMTPConnection = requireSmtpConnection();
	const assign = requireShared().assign;
	const XOAuth2 = requireXoauth2();
	const EventEmitter = require$$0$4;

	/**
	 * Creates an element for the pool
	 *
	 * @constructor
	 * @param {Object} options SMTPPool instance
	 */
	class PoolResource extends EventEmitter {
	    constructor(pool) {
	        super();

	        this.pool = pool;
	        this.options = pool.options;
	        this.logger = this.pool.logger;

	        if (this.options.auth) {
	            switch ((this.options.auth.type || '').toString().toUpperCase()) {
	                case 'OAUTH2': {
	                    let oauth2 = new XOAuth2(this.options.auth, this.logger);
	                    oauth2.provisionCallback = (this.pool.mailer && this.pool.mailer.get('oauth2_provision_cb')) || oauth2.provisionCallback;
	                    this.auth = {
	                        type: 'OAUTH2',
	                        user: this.options.auth.user,
	                        oauth2,
	                        method: 'XOAUTH2'
	                    };
	                    oauth2.on('token', token => this.pool.mailer.emit('token', token));
	                    oauth2.on('error', err => this.emit('error', err));
	                    break;
	                }
	                default:
	                    if (!this.options.auth.user && !this.options.auth.pass) {
	                        break;
	                    }
	                    this.auth = {
	                        type: (this.options.auth.type || '').toString().toUpperCase() || 'LOGIN',
	                        user: this.options.auth.user,
	                        credentials: {
	                            user: this.options.auth.user || '',
	                            pass: this.options.auth.pass,
	                            options: this.options.auth.options
	                        },
	                        method: (this.options.auth.method || '').trim().toUpperCase() || this.options.authMethod || false
	                    };
	            }
	        }

	        this._connection = false;
	        this._connected = false;

	        this.messages = 0;
	        this.available = true;
	    }

	    /**
	     * Initiates a connection to the SMTP server
	     *
	     * @param {Function} callback Callback function to run once the connection is established or failed
	     */
	    connect(callback) {
	        this.pool.getSocket(this.options, (err, socketOptions) => {
	            if (err) {
	                return callback(err);
	            }

	            let returned = false;
	            let options = this.options;
	            if (socketOptions && socketOptions.connection) {
	                this.logger.info(
	                    {
	                        tnx: 'proxy',
	                        remoteAddress: socketOptions.connection.remoteAddress,
	                        remotePort: socketOptions.connection.remotePort,
	                        destHost: options.host || '',
	                        destPort: options.port || '',
	                        action: 'connected'
	                    },
	                    'Using proxied socket from %s:%s to %s:%s',
	                    socketOptions.connection.remoteAddress,
	                    socketOptions.connection.remotePort,
	                    options.host || '',
	                    options.port || ''
	                );

	                options = assign(false, options);
	                Object.keys(socketOptions).forEach(key => {
	                    options[key] = socketOptions[key];
	                });
	            }

	            this.connection = new SMTPConnection(options);

	            this.connection.once('error', err => {
	                this.emit('error', err);
	                if (returned) {
	                    return;
	                }
	                returned = true;
	                return callback(err);
	            });

	            this.connection.once('end', () => {
	                this.close();
	                if (returned) {
	                    return;
	                }
	                returned = true;

	                let timer = setTimeout(() => {
	                    if (returned) {
	                        return;
	                    }
	                    // still have not returned, this means we have an unexpected connection close
	                    let err = new Error('Unexpected socket close');
	                    if (this.connection && this.connection._socket && this.connection._socket.upgrading) {
	                        // starttls connection errors
	                        err.code = 'ETLS';
	                    }
	                    callback(err);
	                }, 1000);

	                try {
	                    timer.unref();
	                } catch (E) {
	                    // Ignore. Happens on envs with non-node timer implementation
	                }
	            });

	            this.connection.connect(() => {
	                if (returned) {
	                    return;
	                }

	                if (this.auth && (this.connection.allowsAuth || options.forceAuth)) {
	                    this.connection.login(this.auth, err => {
	                        if (returned) {
	                            return;
	                        }
	                        returned = true;

	                        if (err) {
	                            this.connection.close();
	                            this.emit('error', err);
	                            return callback(err);
	                        }

	                        this._connected = true;
	                        callback(null, true);
	                    });
	                } else {
	                    returned = true;
	                    this._connected = true;
	                    return callback(null, true);
	                }
	            });
	        });
	    }

	    /**
	     * Sends an e-mail to be sent using the selected settings
	     *
	     * @param {Object} mail Mail object
	     * @param {Function} callback Callback function
	     */
	    send(mail, callback) {
	        if (!this._connected) {
	            return this.connect(err => {
	                if (err) {
	                    return callback(err);
	                }
	                return this.send(mail, callback);
	            });
	        }

	        let envelope = mail.message.getEnvelope();
	        let messageId = mail.message.messageId();

	        let recipients = [].concat(envelope.to || []);
	        if (recipients.length > 3) {
	            recipients.push('...and ' + recipients.splice(2).length + ' more');
	        }
	        this.logger.info(
	            {
	                tnx: 'send',
	                messageId,
	                cid: this.id
	            },
	            'Sending message %s using #%s to <%s>',
	            messageId,
	            this.id,
	            recipients.join(', ')
	        );

	        if (mail.data.dsn) {
	            envelope.dsn = mail.data.dsn;
	        }

	        this.connection.send(envelope, mail.message.createReadStream(), (err, info) => {
	            this.messages++;

	            if (err) {
	                this.connection.close();
	                this.emit('error', err);
	                return callback(err);
	            }

	            info.envelope = {
	                from: envelope.from,
	                to: envelope.to
	            };
	            info.messageId = messageId;

	            setImmediate(() => {
	                let err;
	                if (this.messages >= this.options.maxMessages) {
	                    err = new Error('Resource exhausted');
	                    err.code = 'EMAXLIMIT';
	                    this.connection.close();
	                    this.emit('error', err);
	                } else {
	                    this.pool._checkRateLimit(() => {
	                        this.available = true;
	                        this.emit('available');
	                    });
	                }
	            });

	            callback(null, info);
	        });
	    }

	    /**
	     * Closes the connection
	     */
	    close() {
	        this._connected = false;
	        if (this.auth && this.auth.oauth2) {
	            this.auth.oauth2.removeAllListeners();
	        }
	        if (this.connection) {
	            this.connection.close();
	        }
	        this.emit('close');
	    }
	}

	poolResource = PoolResource;
	return poolResource;
}

var Aliyun = {
	domains: [
		"aliyun.com"
	],
	host: "smtp.aliyun.com",
	port: 465,
	secure: true
};
var AOL = {
	domains: [
		"aol.com"
	],
	host: "smtp.aol.com",
	port: 587
};
var Bluewin = {
	host: "smtpauths.bluewin.ch",
	domains: [
		"bluewin.ch"
	],
	port: 465
};
var DebugMail = {
	host: "debugmail.io",
	port: 25
};
var DynectEmail = {
	aliases: [
		"Dynect"
	],
	host: "smtp.dynect.net",
	port: 25
};
var Ethereal = {
	aliases: [
		"ethereal.email"
	],
	host: "smtp.ethereal.email",
	port: 587
};
var FastMail = {
	domains: [
		"fastmail.fm"
	],
	host: "smtp.fastmail.com",
	port: 465,
	secure: true
};
var GandiMail = {
	aliases: [
		"Gandi",
		"Gandi Mail"
	],
	host: "mail.gandi.net",
	port: 587
};
var Gmail = {
	aliases: [
		"Google Mail"
	],
	domains: [
		"gmail.com",
		"googlemail.com"
	],
	host: "smtp.gmail.com",
	port: 465,
	secure: true
};
var Godaddy = {
	host: "smtpout.secureserver.net",
	port: 25
};
var GodaddyAsia = {
	host: "smtp.asia.secureserver.net",
	port: 25
};
var GodaddyEurope = {
	host: "smtp.europe.secureserver.net",
	port: 25
};
var Hotmail = {
	aliases: [
		"Outlook",
		"Outlook.com",
		"Hotmail.com"
	],
	domains: [
		"hotmail.com",
		"outlook.com"
	],
	host: "smtp-mail.outlook.com",
	port: 587
};
var iCloud = {
	aliases: [
		"Me",
		"Mac"
	],
	domains: [
		"me.com",
		"mac.com"
	],
	host: "smtp.mail.me.com",
	port: 587
};
var Infomaniak = {
	host: "mail.infomaniak.com",
	domains: [
		"ik.me",
		"ikmail.com",
		"etik.com"
	],
	port: 587
};
var Maildev = {
	port: 1025,
	ignoreTLS: true
};
var Mailgun = {
	host: "smtp.mailgun.org",
	port: 465,
	secure: true
};
var Mailjet = {
	host: "in.mailjet.com",
	port: 587
};
var Mailosaur = {
	host: "mailosaur.io",
	port: 25
};
var Mailtrap = {
	host: "smtp.mailtrap.io",
	port: 2525
};
var Mandrill = {
	host: "smtp.mandrillapp.com",
	port: 587
};
var Naver = {
	host: "smtp.naver.com",
	port: 587
};
var One = {
	host: "send.one.com",
	port: 465,
	secure: true
};
var OpenMailBox = {
	aliases: [
		"OMB",
		"openmailbox.org"
	],
	host: "smtp.openmailbox.org",
	port: 465,
	secure: true
};
var Outlook365 = {
	host: "smtp.office365.com",
	port: 587,
	secure: false
};
var OhMySMTP = {
	host: "smtp.ohmysmtp.com",
	port: 587,
	secure: false
};
var Postmark = {
	aliases: [
		"PostmarkApp"
	],
	host: "smtp.postmarkapp.com",
	port: 2525
};
var QQ = {
	domains: [
		"qq.com"
	],
	host: "smtp.qq.com",
	port: 465,
	secure: true
};
var QQex = {
	aliases: [
		"QQ Enterprise"
	],
	domains: [
		"exmail.qq.com"
	],
	host: "smtp.exmail.qq.com",
	port: 465,
	secure: true
};
var SendCloud = {
	host: "smtp.sendcloud.net",
	port: 2525
};
var SendGrid = {
	host: "smtp.sendgrid.net",
	port: 587
};
var SendinBlue = {
	aliases: [
		"Brevo"
	],
	host: "smtp-relay.brevo.com",
	port: 587
};
var SendPulse = {
	host: "smtp-pulse.com",
	port: 465,
	secure: true
};
var SES = {
	host: "email-smtp.us-east-1.amazonaws.com",
	port: 465,
	secure: true
};
var Sparkpost = {
	aliases: [
		"SparkPost",
		"SparkPost Mail"
	],
	domains: [
		"sparkpost.com"
	],
	host: "smtp.sparkpostmail.com",
	port: 587,
	secure: false
};
var Tipimail = {
	host: "smtp.tipimail.com",
	port: 587
};
var Yahoo = {
	domains: [
		"yahoo.com"
	],
	host: "smtp.mail.yahoo.com",
	port: 465,
	secure: true
};
var Yandex = {
	domains: [
		"yandex.ru"
	],
	host: "smtp.yandex.ru",
	port: 465,
	secure: true
};
var Zoho = {
	host: "smtp.zoho.com",
	port: 465,
	secure: true,
	authMethod: "LOGIN"
};
var require$$0 = {
	"126": {
	host: "smtp.126.com",
	port: 465,
	secure: true
},
	"163": {
	host: "smtp.163.com",
	port: 465,
	secure: true
},
	"1und1": {
	host: "smtp.1und1.de",
	port: 465,
	secure: true,
	authMethod: "LOGIN"
},
	Aliyun: Aliyun,
	AOL: AOL,
	Bluewin: Bluewin,
	DebugMail: DebugMail,
	DynectEmail: DynectEmail,
	Ethereal: Ethereal,
	FastMail: FastMail,
	"Forward Email": {
	aliases: [
		"FE",
		"ForwardEmail"
	],
	domains: [
		"forwardemail.net"
	],
	host: "smtp.forwardemail.net",
	port: 465,
	secure: true
},
	GandiMail: GandiMail,
	Gmail: Gmail,
	Godaddy: Godaddy,
	GodaddyAsia: GodaddyAsia,
	GodaddyEurope: GodaddyEurope,
	"hot.ee": {
	host: "mail.hot.ee"
},
	Hotmail: Hotmail,
	iCloud: iCloud,
	Infomaniak: Infomaniak,
	"mail.ee": {
	host: "smtp.mail.ee"
},
	"Mail.ru": {
	host: "smtp.mail.ru",
	port: 465,
	secure: true
},
	Maildev: Maildev,
	Mailgun: Mailgun,
	Mailjet: Mailjet,
	Mailosaur: Mailosaur,
	Mailtrap: Mailtrap,
	Mandrill: Mandrill,
	Naver: Naver,
	One: One,
	OpenMailBox: OpenMailBox,
	Outlook365: Outlook365,
	OhMySMTP: OhMySMTP,
	Postmark: Postmark,
	"qiye.aliyun": {
	host: "smtp.mxhichina.com",
	port: "465",
	secure: true
},
	QQ: QQ,
	QQex: QQex,
	SendCloud: SendCloud,
	SendGrid: SendGrid,
	SendinBlue: SendinBlue,
	SendPulse: SendPulse,
	SES: SES,
	"SES-US-EAST-1": {
	host: "email-smtp.us-east-1.amazonaws.com",
	port: 465,
	secure: true
},
	"SES-US-WEST-2": {
	host: "email-smtp.us-west-2.amazonaws.com",
	port: 465,
	secure: true
},
	"SES-EU-WEST-1": {
	host: "email-smtp.eu-west-1.amazonaws.com",
	port: 465,
	secure: true
},
	"SES-AP-SOUTH-1": {
	host: "email-smtp.ap-south-1.amazonaws.com",
	port: 465,
	secure: true
},
	"SES-AP-NORTHEAST-1": {
	host: "email-smtp.ap-northeast-1.amazonaws.com",
	port: 465,
	secure: true
},
	"SES-AP-NORTHEAST-2": {
	host: "email-smtp.ap-northeast-2.amazonaws.com",
	port: 465,
	secure: true
},
	"SES-AP-NORTHEAST-3": {
	host: "email-smtp.ap-northeast-3.amazonaws.com",
	port: 465,
	secure: true
},
	"SES-AP-SOUTHEAST-1": {
	host: "email-smtp.ap-southeast-1.amazonaws.com",
	port: 465,
	secure: true
},
	"SES-AP-SOUTHEAST-2": {
	host: "email-smtp.ap-southeast-2.amazonaws.com",
	port: 465,
	secure: true
},
	Sparkpost: Sparkpost,
	Tipimail: Tipimail,
	Yahoo: Yahoo,
	Yandex: Yandex,
	Zoho: Zoho
};

var wellKnown;
var hasRequiredWellKnown;

function requireWellKnown () {
	if (hasRequiredWellKnown) return wellKnown;
	hasRequiredWellKnown = 1;

	const services = require$$0;
	const normalized = {};

	Object.keys(services).forEach(key => {
	    let service = services[key];

	    normalized[normalizeKey(key)] = normalizeService(service);

	    [].concat(service.aliases || []).forEach(alias => {
	        normalized[normalizeKey(alias)] = normalizeService(service);
	    });

	    [].concat(service.domains || []).forEach(domain => {
	        normalized[normalizeKey(domain)] = normalizeService(service);
	    });
	});

	function normalizeKey(key) {
	    return key.replace(/[^a-zA-Z0-9.-]/g, '').toLowerCase();
	}

	function normalizeService(service) {
	    let filter = ['domains', 'aliases'];
	    let response = {};

	    Object.keys(service).forEach(key => {
	        if (filter.indexOf(key) < 0) {
	            response[key] = service[key];
	        }
	    });

	    return response;
	}

	/**
	 * Resolves SMTP config for given key. Key can be a name (like 'Gmail'), alias (like 'Google Mail') or
	 * an email address (like 'test@googlemail.com').
	 *
	 * @param {String} key [description]
	 * @returns {Object} SMTP config or false if not found
	 */
	wellKnown = function (key) {
	    key = normalizeKey(key.split('@').pop());
	    return normalized[key] || false;
	};
	return wellKnown;
}

var smtpPool;
var hasRequiredSmtpPool;

function requireSmtpPool () {
	if (hasRequiredSmtpPool) return smtpPool;
	hasRequiredSmtpPool = 1;

	const EventEmitter = require$$0$4;
	const PoolResource = requirePoolResource();
	const SMTPConnection = requireSmtpConnection();
	const wellKnown = requireWellKnown();
	const shared = requireShared();
	const packageData = require$$9;

	/**
	 * Creates a SMTP pool transport object for Nodemailer
	 *
	 * @constructor
	 * @param {Object} options SMTP Connection options
	 */
	class SMTPPool extends EventEmitter {
	    constructor(options) {
	        super();

	        options = options || {};
	        if (typeof options === 'string') {
	            options = {
	                url: options
	            };
	        }

	        let urlData;
	        let service = options.service;

	        if (typeof options.getSocket === 'function') {
	            this.getSocket = options.getSocket;
	        }

	        if (options.url) {
	            urlData = shared.parseConnectionUrl(options.url);
	            service = service || urlData.service;
	        }

	        this.options = shared.assign(
	            false, // create new object
	            options, // regular options
	            urlData, // url options
	            service && wellKnown(service) // wellknown options
	        );

	        this.options.maxConnections = this.options.maxConnections || 5;
	        this.options.maxMessages = this.options.maxMessages || 100;

	        this.logger = shared.getLogger(this.options, {
	            component: this.options.component || 'smtp-pool'
	        });

	        // temporary object
	        let connection = new SMTPConnection(this.options);

	        this.name = 'SMTP (pool)';
	        this.version = packageData.version + '[client:' + connection.version + ']';

	        this._rateLimit = {
	            counter: 0,
	            timeout: null,
	            waiting: [],
	            checkpoint: false,
	            delta: Number(this.options.rateDelta) || 1000,
	            limit: Number(this.options.rateLimit) || 0
	        };
	        this._closed = false;
	        this._queue = [];
	        this._connections = [];
	        this._connectionCounter = 0;

	        this.idling = true;

	        setImmediate(() => {
	            if (this.idling) {
	                this.emit('idle');
	            }
	        });
	    }

	    /**
	     * Placeholder function for creating proxy sockets. This method immediatelly returns
	     * without a socket
	     *
	     * @param {Object} options Connection options
	     * @param {Function} callback Callback function to run with the socket keys
	     */
	    getSocket(options, callback) {
	        // return immediatelly
	        return setImmediate(() => callback(null, false));
	    }

	    /**
	     * Queues an e-mail to be sent using the selected settings
	     *
	     * @param {Object} mail Mail object
	     * @param {Function} callback Callback function
	     */
	    send(mail, callback) {
	        if (this._closed) {
	            return false;
	        }

	        this._queue.push({
	            mail,
	            requeueAttempts: 0,
	            callback
	        });

	        if (this.idling && this._queue.length >= this.options.maxConnections) {
	            this.idling = false;
	        }

	        setImmediate(() => this._processMessages());

	        return true;
	    }

	    /**
	     * Closes all connections in the pool. If there is a message being sent, the connection
	     * is closed later
	     */
	    close() {
	        let connection;
	        let len = this._connections.length;
	        this._closed = true;

	        // clear rate limit timer if it exists
	        clearTimeout(this._rateLimit.timeout);

	        if (!len && !this._queue.length) {
	            return;
	        }

	        // remove all available connections
	        for (let i = len - 1; i >= 0; i--) {
	            if (this._connections[i] && this._connections[i].available) {
	                connection = this._connections[i];
	                connection.close();
	                this.logger.info(
	                    {
	                        tnx: 'connection',
	                        cid: connection.id,
	                        action: 'removed'
	                    },
	                    'Connection #%s removed',
	                    connection.id
	                );
	            }
	        }

	        if (len && !this._connections.length) {
	            this.logger.debug(
	                {
	                    tnx: 'connection'
	                },
	                'All connections removed'
	            );
	        }

	        if (!this._queue.length) {
	            return;
	        }

	        // make sure that entire queue would be cleaned
	        let invokeCallbacks = () => {
	            if (!this._queue.length) {
	                this.logger.debug(
	                    {
	                        tnx: 'connection'
	                    },
	                    'Pending queue entries cleared'
	                );
	                return;
	            }
	            let entry = this._queue.shift();
	            if (entry && typeof entry.callback === 'function') {
	                try {
	                    entry.callback(new Error('Connection pool was closed'));
	                } catch (E) {
	                    this.logger.error(
	                        {
	                            err: E,
	                            tnx: 'callback',
	                            cid: connection.id
	                        },
	                        'Callback error for #%s: %s',
	                        connection.id,
	                        E.message
	                    );
	                }
	            }
	            setImmediate(invokeCallbacks);
	        };
	        setImmediate(invokeCallbacks);
	    }

	    /**
	     * Check the queue and available connections. If there is a message to be sent and there is
	     * an available connection, then use this connection to send the mail
	     */
	    _processMessages() {
	        let connection;
	        let i, len;

	        // do nothing if already closed
	        if (this._closed) {
	            return;
	        }

	        // do nothing if queue is empty
	        if (!this._queue.length) {
	            if (!this.idling) {
	                // no pending jobs
	                this.idling = true;
	                this.emit('idle');
	            }
	            return;
	        }

	        // find first available connection
	        for (i = 0, len = this._connections.length; i < len; i++) {
	            if (this._connections[i].available) {
	                connection = this._connections[i];
	                break;
	            }
	        }

	        if (!connection && this._connections.length < this.options.maxConnections) {
	            connection = this._createConnection();
	        }

	        if (!connection) {
	            // no more free connection slots available
	            this.idling = false;
	            return;
	        }

	        // check if there is free space in the processing queue
	        if (!this.idling && this._queue.length < this.options.maxConnections) {
	            this.idling = true;
	            this.emit('idle');
	        }

	        let entry = (connection.queueEntry = this._queue.shift());
	        entry.messageId = (connection.queueEntry.mail.message.getHeader('message-id') || '').replace(/[<>\s]/g, '');

	        connection.available = false;

	        this.logger.debug(
	            {
	                tnx: 'pool',
	                cid: connection.id,
	                messageId: entry.messageId,
	                action: 'assign'
	            },
	            'Assigned message <%s> to #%s (%s)',
	            entry.messageId,
	            connection.id,
	            connection.messages + 1
	        );

	        if (this._rateLimit.limit) {
	            this._rateLimit.counter++;
	            if (!this._rateLimit.checkpoint) {
	                this._rateLimit.checkpoint = Date.now();
	            }
	        }

	        connection.send(entry.mail, (err, info) => {
	            // only process callback if current handler is not changed
	            if (entry === connection.queueEntry) {
	                try {
	                    entry.callback(err, info);
	                } catch (E) {
	                    this.logger.error(
	                        {
	                            err: E,
	                            tnx: 'callback',
	                            cid: connection.id
	                        },
	                        'Callback error for #%s: %s',
	                        connection.id,
	                        E.message
	                    );
	                }
	                connection.queueEntry = false;
	            }
	        });
	    }

	    /**
	     * Creates a new pool resource
	     */
	    _createConnection() {
	        let connection = new PoolResource(this);

	        connection.id = ++this._connectionCounter;

	        this.logger.info(
	            {
	                tnx: 'pool',
	                cid: connection.id,
	                action: 'conection'
	            },
	            'Created new pool resource #%s',
	            connection.id
	        );

	        // resource comes available
	        connection.on('available', () => {
	            this.logger.debug(
	                {
	                    tnx: 'connection',
	                    cid: connection.id,
	                    action: 'available'
	                },
	                'Connection #%s became available',
	                connection.id
	            );

	            if (this._closed) {
	                // if already closed run close() that will remove this connections from connections list
	                this.close();
	            } else {
	                // check if there's anything else to send
	                this._processMessages();
	            }
	        });

	        // resource is terminated with an error
	        connection.once('error', err => {
	            if (err.code !== 'EMAXLIMIT') {
	                this.logger.error(
	                    {
	                        err,
	                        tnx: 'pool',
	                        cid: connection.id
	                    },
	                    'Pool Error for #%s: %s',
	                    connection.id,
	                    err.message
	                );
	            } else {
	                this.logger.debug(
	                    {
	                        tnx: 'pool',
	                        cid: connection.id,
	                        action: 'maxlimit'
	                    },
	                    'Max messages limit exchausted for #%s',
	                    connection.id
	                );
	            }

	            if (connection.queueEntry) {
	                try {
	                    connection.queueEntry.callback(err);
	                } catch (E) {
	                    this.logger.error(
	                        {
	                            err: E,
	                            tnx: 'callback',
	                            cid: connection.id
	                        },
	                        'Callback error for #%s: %s',
	                        connection.id,
	                        E.message
	                    );
	                }
	                connection.queueEntry = false;
	            }

	            // remove the erroneus connection from connections list
	            this._removeConnection(connection);

	            this._continueProcessing();
	        });

	        connection.once('close', () => {
	            this.logger.info(
	                {
	                    tnx: 'connection',
	                    cid: connection.id,
	                    action: 'closed'
	                },
	                'Connection #%s was closed',
	                connection.id
	            );

	            this._removeConnection(connection);

	            if (connection.queueEntry) {
	                // If the connection closed when sending, add the message to the queue again
	                // if max number of requeues is not reached yet
	                // Note that we must wait a bit.. because the callback of the 'error' handler might be called
	                // in the next event loop
	                setTimeout(() => {
	                    if (connection.queueEntry) {
	                        if (this._shouldRequeuOnConnectionClose(connection.queueEntry)) {
	                            this._requeueEntryOnConnectionClose(connection);
	                        } else {
	                            this._failDeliveryOnConnectionClose(connection);
	                        }
	                    }
	                    this._continueProcessing();
	                }, 50);
	            } else {
	                this._continueProcessing();
	            }
	        });

	        this._connections.push(connection);

	        return connection;
	    }

	    _shouldRequeuOnConnectionClose(queueEntry) {
	        if (this.options.maxRequeues === undefined || this.options.maxRequeues < 0) {
	            return true;
	        }

	        return queueEntry.requeueAttempts < this.options.maxRequeues;
	    }

	    _failDeliveryOnConnectionClose(connection) {
	        if (connection.queueEntry && connection.queueEntry.callback) {
	            try {
	                connection.queueEntry.callback(new Error('Reached maximum number of retries after connection was closed'));
	            } catch (E) {
	                this.logger.error(
	                    {
	                        err: E,
	                        tnx: 'callback',
	                        messageId: connection.queueEntry.messageId,
	                        cid: connection.id
	                    },
	                    'Callback error for #%s: %s',
	                    connection.id,
	                    E.message
	                );
	            }
	            connection.queueEntry = false;
	        }
	    }

	    _requeueEntryOnConnectionClose(connection) {
	        connection.queueEntry.requeueAttempts = connection.queueEntry.requeueAttempts + 1;
	        this.logger.debug(
	            {
	                tnx: 'pool',
	                cid: connection.id,
	                messageId: connection.queueEntry.messageId,
	                action: 'requeue'
	            },
	            'Re-queued message <%s> for #%s. Attempt: #%s',
	            connection.queueEntry.messageId,
	            connection.id,
	            connection.queueEntry.requeueAttempts
	        );
	        this._queue.unshift(connection.queueEntry);
	        connection.queueEntry = false;
	    }

	    /**
	     * Continue to process message if the pool hasn't closed
	     */
	    _continueProcessing() {
	        if (this._closed) {
	            this.close();
	        } else {
	            setTimeout(() => this._processMessages(), 100);
	        }
	    }

	    /**
	     * Remove resource from pool
	     *
	     * @param {Object} connection The PoolResource to remove
	     */
	    _removeConnection(connection) {
	        let index = this._connections.indexOf(connection);

	        if (index !== -1) {
	            this._connections.splice(index, 1);
	        }
	    }

	    /**
	     * Checks if connections have hit current rate limit and if so, queues the availability callback
	     *
	     * @param {Function} callback Callback function to run once rate limiter has been cleared
	     */
	    _checkRateLimit(callback) {
	        if (!this._rateLimit.limit) {
	            return callback();
	        }

	        let now = Date.now();

	        if (this._rateLimit.counter < this._rateLimit.limit) {
	            return callback();
	        }

	        this._rateLimit.waiting.push(callback);

	        if (this._rateLimit.checkpoint <= now - this._rateLimit.delta) {
	            return this._clearRateLimit();
	        } else if (!this._rateLimit.timeout) {
	            this._rateLimit.timeout = setTimeout(() => this._clearRateLimit(), this._rateLimit.delta - (now - this._rateLimit.checkpoint));
	            this._rateLimit.checkpoint = now;
	        }
	    }

	    /**
	     * Clears current rate limit limitation and runs paused callback
	     */
	    _clearRateLimit() {
	        clearTimeout(this._rateLimit.timeout);
	        this._rateLimit.timeout = null;
	        this._rateLimit.counter = 0;
	        this._rateLimit.checkpoint = false;

	        // resume all paused connections
	        while (this._rateLimit.waiting.length) {
	            let cb = this._rateLimit.waiting.shift();
	            setImmediate(cb);
	        }
	    }

	    /**
	     * Returns true if there are free slots in the queue
	     */
	    isIdle() {
	        return this.idling;
	    }

	    /**
	     * Verifies SMTP configuration
	     *
	     * @param {Function} callback Callback function
	     */
	    verify(callback) {
	        let promise;

	        if (!callback) {
	            promise = new Promise((resolve, reject) => {
	                callback = shared.callbackPromise(resolve, reject);
	            });
	        }

	        let auth = new PoolResource(this).auth;

	        this.getSocket(this.options, (err, socketOptions) => {
	            if (err) {
	                return callback(err);
	            }

	            let options = this.options;
	            if (socketOptions && socketOptions.connection) {
	                this.logger.info(
	                    {
	                        tnx: 'proxy',
	                        remoteAddress: socketOptions.connection.remoteAddress,
	                        remotePort: socketOptions.connection.remotePort,
	                        destHost: options.host || '',
	                        destPort: options.port || '',
	                        action: 'connected'
	                    },
	                    'Using proxied socket from %s:%s to %s:%s',
	                    socketOptions.connection.remoteAddress,
	                    socketOptions.connection.remotePort,
	                    options.host || '',
	                    options.port || ''
	                );
	                options = shared.assign(false, options);
	                Object.keys(socketOptions).forEach(key => {
	                    options[key] = socketOptions[key];
	                });
	            }

	            let connection = new SMTPConnection(options);
	            let returned = false;

	            connection.once('error', err => {
	                if (returned) {
	                    return;
	                }
	                returned = true;
	                connection.close();
	                return callback(err);
	            });

	            connection.once('end', () => {
	                if (returned) {
	                    return;
	                }
	                returned = true;
	                return callback(new Error('Connection closed'));
	            });

	            let finalize = () => {
	                if (returned) {
	                    return;
	                }
	                returned = true;
	                connection.quit();
	                return callback(null, true);
	            };

	            connection.connect(() => {
	                if (returned) {
	                    return;
	                }

	                if (auth && (connection.allowsAuth || options.forceAuth)) {
	                    connection.login(auth, err => {
	                        if (returned) {
	                            return;
	                        }

	                        if (err) {
	                            returned = true;
	                            connection.close();
	                            return callback(err);
	                        }

	                        finalize();
	                    });
	                } else if (!auth && connection.allowsAuth && options.forceAuth) {
	                    let err = new Error('Authentication info was not provided');
	                    err.code = 'NoAuth';

	                    returned = true;
	                    connection.close();
	                    return callback(err);
	                } else {
	                    finalize();
	                }
	            });
	        });

	        return promise;
	    }
	}

	// expose to the world
	smtpPool = SMTPPool;
	return smtpPool;
}

var smtpTransport;
var hasRequiredSmtpTransport;

function requireSmtpTransport () {
	if (hasRequiredSmtpTransport) return smtpTransport;
	hasRequiredSmtpTransport = 1;

	const EventEmitter = require$$0$4;
	const SMTPConnection = requireSmtpConnection();
	const wellKnown = requireWellKnown();
	const shared = requireShared();
	const XOAuth2 = requireXoauth2();
	const packageData = require$$9;

	/**
	 * Creates a SMTP transport object for Nodemailer
	 *
	 * @constructor
	 * @param {Object} options Connection options
	 */
	class SMTPTransport extends EventEmitter {
	    constructor(options) {
	        super();

	        options = options || {};

	        if (typeof options === 'string') {
	            options = {
	                url: options
	            };
	        }

	        let urlData;
	        let service = options.service;

	        if (typeof options.getSocket === 'function') {
	            this.getSocket = options.getSocket;
	        }

	        if (options.url) {
	            urlData = shared.parseConnectionUrl(options.url);
	            service = service || urlData.service;
	        }

	        this.options = shared.assign(
	            false, // create new object
	            options, // regular options
	            urlData, // url options
	            service && wellKnown(service) // wellknown options
	        );

	        this.logger = shared.getLogger(this.options, {
	            component: this.options.component || 'smtp-transport'
	        });

	        // temporary object
	        let connection = new SMTPConnection(this.options);

	        this.name = 'SMTP';
	        this.version = packageData.version + '[client:' + connection.version + ']';

	        if (this.options.auth) {
	            this.auth = this.getAuth({});
	        }
	    }

	    /**
	     * Placeholder function for creating proxy sockets. This method immediatelly returns
	     * without a socket
	     *
	     * @param {Object} options Connection options
	     * @param {Function} callback Callback function to run with the socket keys
	     */
	    getSocket(options, callback) {
	        // return immediatelly
	        return setImmediate(() => callback(null, false));
	    }

	    getAuth(authOpts) {
	        if (!authOpts) {
	            return this.auth;
	        }

	        let hasAuth = false;
	        let authData = {};

	        if (this.options.auth && typeof this.options.auth === 'object') {
	            Object.keys(this.options.auth).forEach(key => {
	                hasAuth = true;
	                authData[key] = this.options.auth[key];
	            });
	        }

	        if (authOpts && typeof authOpts === 'object') {
	            Object.keys(authOpts).forEach(key => {
	                hasAuth = true;
	                authData[key] = authOpts[key];
	            });
	        }

	        if (!hasAuth) {
	            return false;
	        }

	        switch ((authData.type || '').toString().toUpperCase()) {
	            case 'OAUTH2': {
	                if (!authData.service && !authData.user) {
	                    return false;
	                }
	                let oauth2 = new XOAuth2(authData, this.logger);
	                oauth2.provisionCallback = (this.mailer && this.mailer.get('oauth2_provision_cb')) || oauth2.provisionCallback;
	                oauth2.on('token', token => this.mailer.emit('token', token));
	                oauth2.on('error', err => this.emit('error', err));
	                return {
	                    type: 'OAUTH2',
	                    user: authData.user,
	                    oauth2,
	                    method: 'XOAUTH2'
	                };
	            }
	            default:
	                return {
	                    type: (authData.type || '').toString().toUpperCase() || 'LOGIN',
	                    user: authData.user,
	                    credentials: {
	                        user: authData.user || '',
	                        pass: authData.pass,
	                        options: authData.options
	                    },
	                    method: (authData.method || '').trim().toUpperCase() || this.options.authMethod || false
	                };
	        }
	    }

	    /**
	     * Sends an e-mail using the selected settings
	     *
	     * @param {Object} mail Mail object
	     * @param {Function} callback Callback function
	     */
	    send(mail, callback) {
	        this.getSocket(this.options, (err, socketOptions) => {
	            if (err) {
	                return callback(err);
	            }

	            let returned = false;
	            let options = this.options;
	            if (socketOptions && socketOptions.connection) {
	                this.logger.info(
	                    {
	                        tnx: 'proxy',
	                        remoteAddress: socketOptions.connection.remoteAddress,
	                        remotePort: socketOptions.connection.remotePort,
	                        destHost: options.host || '',
	                        destPort: options.port || '',
	                        action: 'connected'
	                    },
	                    'Using proxied socket from %s:%s to %s:%s',
	                    socketOptions.connection.remoteAddress,
	                    socketOptions.connection.remotePort,
	                    options.host || '',
	                    options.port || ''
	                );

	                // only copy options if we need to modify it
	                options = shared.assign(false, options);
	                Object.keys(socketOptions).forEach(key => {
	                    options[key] = socketOptions[key];
	                });
	            }

	            let connection = new SMTPConnection(options);

	            connection.once('error', err => {
	                if (returned) {
	                    return;
	                }
	                returned = true;
	                connection.close();
	                return callback(err);
	            });

	            connection.once('end', () => {
	                if (returned) {
	                    return;
	                }

	                let timer = setTimeout(() => {
	                    if (returned) {
	                        return;
	                    }
	                    returned = true;
	                    // still have not returned, this means we have an unexpected connection close
	                    let err = new Error('Unexpected socket close');
	                    if (connection && connection._socket && connection._socket.upgrading) {
	                        // starttls connection errors
	                        err.code = 'ETLS';
	                    }
	                    callback(err);
	                }, 1000);

	                try {
	                    timer.unref();
	                } catch (E) {
	                    // Ignore. Happens on envs with non-node timer implementation
	                }
	            });

	            let sendMessage = () => {
	                let envelope = mail.message.getEnvelope();
	                let messageId = mail.message.messageId();

	                let recipients = [].concat(envelope.to || []);
	                if (recipients.length > 3) {
	                    recipients.push('...and ' + recipients.splice(2).length + ' more');
	                }

	                if (mail.data.dsn) {
	                    envelope.dsn = mail.data.dsn;
	                }

	                this.logger.info(
	                    {
	                        tnx: 'send',
	                        messageId
	                    },
	                    'Sending message %s to <%s>',
	                    messageId,
	                    recipients.join(', ')
	                );

	                connection.send(envelope, mail.message.createReadStream(), (err, info) => {
	                    returned = true;
	                    connection.close();
	                    if (err) {
	                        this.logger.error(
	                            {
	                                err,
	                                tnx: 'send'
	                            },
	                            'Send error for %s: %s',
	                            messageId,
	                            err.message
	                        );
	                        return callback(err);
	                    }
	                    info.envelope = {
	                        from: envelope.from,
	                        to: envelope.to
	                    };
	                    info.messageId = messageId;
	                    try {
	                        return callback(null, info);
	                    } catch (E) {
	                        this.logger.error(
	                            {
	                                err: E,
	                                tnx: 'callback'
	                            },
	                            'Callback error for %s: %s',
	                            messageId,
	                            E.message
	                        );
	                    }
	                });
	            };

	            connection.connect(() => {
	                if (returned) {
	                    return;
	                }

	                let auth = this.getAuth(mail.data.auth);

	                if (auth && (connection.allowsAuth || options.forceAuth)) {
	                    connection.login(auth, err => {
	                        if (auth && auth !== this.auth && auth.oauth2) {
	                            auth.oauth2.removeAllListeners();
	                        }
	                        if (returned) {
	                            return;
	                        }

	                        if (err) {
	                            returned = true;
	                            connection.close();
	                            return callback(err);
	                        }

	                        sendMessage();
	                    });
	                } else {
	                    sendMessage();
	                }
	            });
	        });
	    }

	    /**
	     * Verifies SMTP configuration
	     *
	     * @param {Function} callback Callback function
	     */
	    verify(callback) {
	        let promise;

	        if (!callback) {
	            promise = new Promise((resolve, reject) => {
	                callback = shared.callbackPromise(resolve, reject);
	            });
	        }

	        this.getSocket(this.options, (err, socketOptions) => {
	            if (err) {
	                return callback(err);
	            }

	            let options = this.options;
	            if (socketOptions && socketOptions.connection) {
	                this.logger.info(
	                    {
	                        tnx: 'proxy',
	                        remoteAddress: socketOptions.connection.remoteAddress,
	                        remotePort: socketOptions.connection.remotePort,
	                        destHost: options.host || '',
	                        destPort: options.port || '',
	                        action: 'connected'
	                    },
	                    'Using proxied socket from %s:%s to %s:%s',
	                    socketOptions.connection.remoteAddress,
	                    socketOptions.connection.remotePort,
	                    options.host || '',
	                    options.port || ''
	                );

	                options = shared.assign(false, options);
	                Object.keys(socketOptions).forEach(key => {
	                    options[key] = socketOptions[key];
	                });
	            }

	            let connection = new SMTPConnection(options);
	            let returned = false;

	            connection.once('error', err => {
	                if (returned) {
	                    return;
	                }
	                returned = true;
	                connection.close();
	                return callback(err);
	            });

	            connection.once('end', () => {
	                if (returned) {
	                    return;
	                }
	                returned = true;
	                return callback(new Error('Connection closed'));
	            });

	            let finalize = () => {
	                if (returned) {
	                    return;
	                }
	                returned = true;
	                connection.quit();
	                return callback(null, true);
	            };

	            connection.connect(() => {
	                if (returned) {
	                    return;
	                }

	                let authData = this.getAuth({});

	                if (authData && (connection.allowsAuth || options.forceAuth)) {
	                    connection.login(authData, err => {
	                        if (returned) {
	                            return;
	                        }

	                        if (err) {
	                            returned = true;
	                            connection.close();
	                            return callback(err);
	                        }

	                        finalize();
	                    });
	                } else if (!authData && connection.allowsAuth && options.forceAuth) {
	                    let err = new Error('Authentication info was not provided');
	                    err.code = 'NoAuth';

	                    returned = true;
	                    connection.close();
	                    return callback(err);
	                } else {
	                    finalize();
	                }
	            });
	        });

	        return promise;
	    }

	    /**
	     * Releases resources
	     */
	    close() {
	        if (this.auth && this.auth.oauth2) {
	            this.auth.oauth2.removeAllListeners();
	        }
	        this.emit('close');
	    }
	}

	// expose to the world
	smtpTransport = SMTPTransport;
	return smtpTransport;
}

var sendmailTransport;
var hasRequiredSendmailTransport;

function requireSendmailTransport () {
	if (hasRequiredSendmailTransport) return sendmailTransport;
	hasRequiredSendmailTransport = 1;

	const spawn = require$$0$7.spawn;
	const packageData = require$$9;
	const shared = requireShared();

	/**
	 * Generates a Transport object for Sendmail
	 *
	 * Possible options can be the following:
	 *
	 *  * **path** optional path to sendmail binary
	 *  * **newline** either 'windows' or 'unix'
	 *  * **args** an array of arguments for the sendmail binary
	 *
	 * @constructor
	 * @param {Object} optional config parameter for Sendmail
	 */
	class SendmailTransport {
	    constructor(options) {
	        options = options || {};

	        // use a reference to spawn for mocking purposes
	        this._spawn = spawn;

	        this.options = options || {};

	        this.name = 'Sendmail';
	        this.version = packageData.version;

	        this.path = 'sendmail';
	        this.args = false;
	        this.winbreak = false;

	        this.logger = shared.getLogger(this.options, {
	            component: this.options.component || 'sendmail'
	        });

	        if (options) {
	            if (typeof options === 'string') {
	                this.path = options;
	            } else if (typeof options === 'object') {
	                if (options.path) {
	                    this.path = options.path;
	                }
	                if (Array.isArray(options.args)) {
	                    this.args = options.args;
	                }
	                this.winbreak = ['win', 'windows', 'dos', '\r\n'].includes((options.newline || '').toString().toLowerCase());
	            }
	        }
	    }

	    /**
	     * <p>Compiles a mailcomposer message and forwards it to handler that sends it.</p>
	     *
	     * @param {Object} emailMessage MailComposer object
	     * @param {Function} callback Callback function to run when the sending is completed
	     */
	    send(mail, done) {
	        // Sendmail strips this header line by itself
	        mail.message.keepBcc = true;

	        let envelope = mail.data.envelope || mail.message.getEnvelope();
	        let messageId = mail.message.messageId();
	        let args;
	        let sendmail;
	        let returned;

	        const hasInvalidAddresses = []
	            .concat(envelope.from || [])
	            .concat(envelope.to || [])
	            .some(addr => /^-/.test(addr));
	        if (hasInvalidAddresses) {
	            return done(new Error('Can not send mail. Invalid envelope addresses.'));
	        }

	        if (this.args) {
	            // force -i to keep single dots
	            args = ['-i'].concat(this.args).concat(envelope.to);
	        } else {
	            args = ['-i'].concat(envelope.from ? ['-f', envelope.from] : []).concat(envelope.to);
	        }

	        let callback = err => {
	            if (returned) {
	                // ignore any additional responses, already done
	                return;
	            }
	            returned = true;
	            if (typeof done === 'function') {
	                if (err) {
	                    return done(err);
	                } else {
	                    return done(null, {
	                        envelope: mail.data.envelope || mail.message.getEnvelope(),
	                        messageId,
	                        response: 'Messages queued for delivery'
	                    });
	                }
	            }
	        };

	        try {
	            sendmail = this._spawn(this.path, args);
	        } catch (E) {
	            this.logger.error(
	                {
	                    err: E,
	                    tnx: 'spawn',
	                    messageId
	                },
	                'Error occurred while spawning sendmail. %s',
	                E.message
	            );
	            return callback(E);
	        }

	        if (sendmail) {
	            sendmail.on('error', err => {
	                this.logger.error(
	                    {
	                        err,
	                        tnx: 'spawn',
	                        messageId
	                    },
	                    'Error occurred when sending message %s. %s',
	                    messageId,
	                    err.message
	                );
	                callback(err);
	            });

	            sendmail.once('exit', code => {
	                if (!code) {
	                    return callback();
	                }
	                let err;
	                if (code === 127) {
	                    err = new Error('Sendmail command not found, process exited with code ' + code);
	                } else {
	                    err = new Error('Sendmail exited with code ' + code);
	                }

	                this.logger.error(
	                    {
	                        err,
	                        tnx: 'stdin',
	                        messageId
	                    },
	                    'Error sending message %s to sendmail. %s',
	                    messageId,
	                    err.message
	                );
	                callback(err);
	            });
	            sendmail.once('close', callback);

	            sendmail.stdin.on('error', err => {
	                this.logger.error(
	                    {
	                        err,
	                        tnx: 'stdin',
	                        messageId
	                    },
	                    'Error occurred when piping message %s to sendmail. %s',
	                    messageId,
	                    err.message
	                );
	                callback(err);
	            });

	            let recipients = [].concat(envelope.to || []);
	            if (recipients.length > 3) {
	                recipients.push('...and ' + recipients.splice(2).length + ' more');
	            }
	            this.logger.info(
	                {
	                    tnx: 'send',
	                    messageId
	                },
	                'Sending message %s to <%s>',
	                messageId,
	                recipients.join(', ')
	            );

	            let sourceStream = mail.message.createReadStream();
	            sourceStream.once('error', err => {
	                this.logger.error(
	                    {
	                        err,
	                        tnx: 'stdin',
	                        messageId
	                    },
	                    'Error occurred when generating message %s. %s',
	                    messageId,
	                    err.message
	                );
	                sendmail.kill('SIGINT'); // do not deliver the message
	                callback(err);
	            });

	            sourceStream.pipe(sendmail.stdin);
	        } else {
	            return callback(new Error('sendmail was not found'));
	        }
	    }
	}

	sendmailTransport = SendmailTransport;
	return sendmailTransport;
}

var streamTransport;
var hasRequiredStreamTransport;

function requireStreamTransport () {
	if (hasRequiredStreamTransport) return streamTransport;
	hasRequiredStreamTransport = 1;

	const packageData = require$$9;
	const shared = requireShared();

	/**
	 * Generates a Transport object for streaming
	 *
	 * Possible options can be the following:
	 *
	 *  * **buffer** if true, then returns the message as a Buffer object instead of a stream
	 *  * **newline** either 'windows' or 'unix'
	 *
	 * @constructor
	 * @param {Object} optional config parameter
	 */
	class StreamTransport {
	    constructor(options) {
	        options = options || {};

	        this.options = options || {};

	        this.name = 'StreamTransport';
	        this.version = packageData.version;

	        this.logger = shared.getLogger(this.options, {
	            component: this.options.component || 'stream-transport'
	        });

	        this.winbreak = ['win', 'windows', 'dos', '\r\n'].includes((options.newline || '').toString().toLowerCase());
	    }

	    /**
	     * Compiles a mailcomposer message and forwards it to handler that sends it
	     *
	     * @param {Object} emailMessage MailComposer object
	     * @param {Function} callback Callback function to run when the sending is completed
	     */
	    send(mail, done) {
	        // We probably need this in the output
	        mail.message.keepBcc = true;

	        let envelope = mail.data.envelope || mail.message.getEnvelope();
	        let messageId = mail.message.messageId();

	        let recipients = [].concat(envelope.to || []);
	        if (recipients.length > 3) {
	            recipients.push('...and ' + recipients.splice(2).length + ' more');
	        }
	        this.logger.info(
	            {
	                tnx: 'send',
	                messageId
	            },
	            'Sending message %s to <%s> using %s line breaks',
	            messageId,
	            recipients.join(', '),
	            this.winbreak ? '<CR><LF>' : '<LF>'
	        );

	        setImmediate(() => {
	            let stream;

	            try {
	                stream = mail.message.createReadStream();
	            } catch (E) {
	                this.logger.error(
	                    {
	                        err: E,
	                        tnx: 'send',
	                        messageId
	                    },
	                    'Creating send stream failed for %s. %s',
	                    messageId,
	                    E.message
	                );
	                return done(E);
	            }

	            if (!this.options.buffer) {
	                stream.once('error', err => {
	                    this.logger.error(
	                        {
	                            err,
	                            tnx: 'send',
	                            messageId
	                        },
	                        'Failed creating message for %s. %s',
	                        messageId,
	                        err.message
	                    );
	                });
	                return done(null, {
	                    envelope: mail.data.envelope || mail.message.getEnvelope(),
	                    messageId,
	                    message: stream
	                });
	            }

	            let chunks = [];
	            let chunklen = 0;
	            stream.on('readable', () => {
	                let chunk;
	                while ((chunk = stream.read()) !== null) {
	                    chunks.push(chunk);
	                    chunklen += chunk.length;
	                }
	            });

	            stream.once('error', err => {
	                this.logger.error(
	                    {
	                        err,
	                        tnx: 'send',
	                        messageId
	                    },
	                    'Failed creating message for %s. %s',
	                    messageId,
	                    err.message
	                );
	                return done(err);
	            });

	            stream.on('end', () =>
	                done(null, {
	                    envelope: mail.data.envelope || mail.message.getEnvelope(),
	                    messageId,
	                    message: Buffer.concat(chunks, chunklen)
	                })
	            );
	        });
	    }
	}

	streamTransport = StreamTransport;
	return streamTransport;
}

var jsonTransport;
var hasRequiredJsonTransport;

function requireJsonTransport () {
	if (hasRequiredJsonTransport) return jsonTransport;
	hasRequiredJsonTransport = 1;

	const packageData = require$$9;
	const shared = requireShared();

	/**
	 * Generates a Transport object to generate JSON output
	 *
	 * @constructor
	 * @param {Object} optional config parameter
	 */
	class JSONTransport {
	    constructor(options) {
	        options = options || {};

	        this.options = options || {};

	        this.name = 'JSONTransport';
	        this.version = packageData.version;

	        this.logger = shared.getLogger(this.options, {
	            component: this.options.component || 'json-transport'
	        });
	    }

	    /**
	     * <p>Compiles a mailcomposer message and forwards it to handler that sends it.</p>
	     *
	     * @param {Object} emailMessage MailComposer object
	     * @param {Function} callback Callback function to run when the sending is completed
	     */
	    send(mail, done) {
	        // Sendmail strips this header line by itself
	        mail.message.keepBcc = true;

	        let envelope = mail.data.envelope || mail.message.getEnvelope();
	        let messageId = mail.message.messageId();

	        let recipients = [].concat(envelope.to || []);
	        if (recipients.length > 3) {
	            recipients.push('...and ' + recipients.splice(2).length + ' more');
	        }
	        this.logger.info(
	            {
	                tnx: 'send',
	                messageId
	            },
	            'Composing JSON structure of %s to <%s>',
	            messageId,
	            recipients.join(', ')
	        );

	        setImmediate(() => {
	            mail.normalize((err, data) => {
	                if (err) {
	                    this.logger.error(
	                        {
	                            err,
	                            tnx: 'send',
	                            messageId
	                        },
	                        'Failed building JSON structure for %s. %s',
	                        messageId,
	                        err.message
	                    );
	                    return done(err);
	                }

	                delete data.envelope;
	                delete data.normalizedHeaders;

	                return done(null, {
	                    envelope,
	                    messageId,
	                    message: this.options.skipEncoding ? data : JSON.stringify(data)
	                });
	            });
	        });
	    }
	}

	jsonTransport = JSONTransport;
	return jsonTransport;
}

var sesTransport;
var hasRequiredSesTransport;

function requireSesTransport () {
	if (hasRequiredSesTransport) return sesTransport;
	hasRequiredSesTransport = 1;

	const EventEmitter = require$$0$4;
	const packageData = require$$9;
	const shared = requireShared();
	const LeWindows = requireLeWindows();

	/**
	 * Generates a Transport object for AWS SES
	 *
	 * Possible options can be the following:
	 *
	 *  * **sendingRate** optional Number specifying how many messages per second should be delivered to SES
	 *  * **maxConnections** optional Number specifying max number of parallel connections to SES
	 *
	 * @constructor
	 * @param {Object} optional config parameter
	 */
	class SESTransport extends EventEmitter {
	    constructor(options) {
	        super();
	        options = options || {};

	        this.options = options || {};
	        this.ses = this.options.SES;

	        this.name = 'SESTransport';
	        this.version = packageData.version;

	        this.logger = shared.getLogger(this.options, {
	            component: this.options.component || 'ses-transport'
	        });

	        // parallel sending connections
	        this.maxConnections = Number(this.options.maxConnections) || Infinity;
	        this.connections = 0;

	        // max messages per second
	        this.sendingRate = Number(this.options.sendingRate) || Infinity;
	        this.sendingRateTTL = null;
	        this.rateInterval = 1000; // milliseconds
	        this.rateMessages = [];

	        this.pending = [];

	        this.idling = true;

	        setImmediate(() => {
	            if (this.idling) {
	                this.emit('idle');
	            }
	        });
	    }

	    /**
	     * Schedules a sending of a message
	     *
	     * @param {Object} emailMessage MailComposer object
	     * @param {Function} callback Callback function to run when the sending is completed
	     */
	    send(mail, callback) {
	        if (this.connections >= this.maxConnections) {
	            this.idling = false;
	            return this.pending.push({
	                mail,
	                callback
	            });
	        }

	        if (!this._checkSendingRate()) {
	            this.idling = false;
	            return this.pending.push({
	                mail,
	                callback
	            });
	        }

	        this._send(mail, (...args) => {
	            setImmediate(() => callback(...args));
	            this._sent();
	        });
	    }

	    _checkRatedQueue() {
	        if (this.connections >= this.maxConnections || !this._checkSendingRate()) {
	            return;
	        }

	        if (!this.pending.length) {
	            if (!this.idling) {
	                this.idling = true;
	                this.emit('idle');
	            }
	            return;
	        }

	        let next = this.pending.shift();
	        this._send(next.mail, (...args) => {
	            setImmediate(() => next.callback(...args));
	            this._sent();
	        });
	    }

	    _checkSendingRate() {
	        clearTimeout(this.sendingRateTTL);

	        let now = Date.now();
	        let oldest = false;
	        // delete older messages
	        for (let i = this.rateMessages.length - 1; i >= 0; i--) {
	            if (this.rateMessages[i].ts >= now - this.rateInterval && (!oldest || this.rateMessages[i].ts < oldest)) {
	                oldest = this.rateMessages[i].ts;
	            }

	            if (this.rateMessages[i].ts < now - this.rateInterval && !this.rateMessages[i].pending) {
	                this.rateMessages.splice(i, 1);
	            }
	        }

	        if (this.rateMessages.length < this.sendingRate) {
	            return true;
	        }

	        let delay = Math.max(oldest + 1001, now + 20);
	        this.sendingRateTTL = setTimeout(() => this._checkRatedQueue(), now - delay);

	        try {
	            this.sendingRateTTL.unref();
	        } catch (E) {
	            // Ignore. Happens on envs with non-node timer implementation
	        }

	        return false;
	    }

	    _sent() {
	        this.connections--;
	        this._checkRatedQueue();
	    }

	    /**
	     * Returns true if there are free slots in the queue
	     */
	    isIdle() {
	        return this.idling;
	    }

	    /**
	     * Compiles a mailcomposer message and forwards it to SES
	     *
	     * @param {Object} emailMessage MailComposer object
	     * @param {Function} callback Callback function to run when the sending is completed
	     */
	    _send(mail, callback) {
	        let statObject = {
	            ts: Date.now(),
	            pending: true
	        };
	        this.connections++;
	        this.rateMessages.push(statObject);

	        let envelope = mail.data.envelope || mail.message.getEnvelope();
	        let messageId = mail.message.messageId();

	        let recipients = [].concat(envelope.to || []);
	        if (recipients.length > 3) {
	            recipients.push('...and ' + recipients.splice(2).length + ' more');
	        }
	        this.logger.info(
	            {
	                tnx: 'send',
	                messageId
	            },
	            'Sending message %s to <%s>',
	            messageId,
	            recipients.join(', ')
	        );

	        let getRawMessage = next => {
	            // do not use Message-ID and Date in DKIM signature
	            if (!mail.data._dkim) {
	                mail.data._dkim = {};
	            }
	            if (mail.data._dkim.skipFields && typeof mail.data._dkim.skipFields === 'string') {
	                mail.data._dkim.skipFields += ':date:message-id';
	            } else {
	                mail.data._dkim.skipFields = 'date:message-id';
	            }

	            let sourceStream = mail.message.createReadStream();
	            let stream = sourceStream.pipe(new LeWindows());
	            let chunks = [];
	            let chunklen = 0;

	            stream.on('readable', () => {
	                let chunk;
	                while ((chunk = stream.read()) !== null) {
	                    chunks.push(chunk);
	                    chunklen += chunk.length;
	                }
	            });

	            sourceStream.once('error', err => stream.emit('error', err));

	            stream.once('error', err => {
	                next(err);
	            });

	            stream.once('end', () => next(null, Buffer.concat(chunks, chunklen)));
	        };

	        setImmediate(() =>
	            getRawMessage((err, raw) => {
	                if (err) {
	                    this.logger.error(
	                        {
	                            err,
	                            tnx: 'send',
	                            messageId
	                        },
	                        'Failed creating message for %s. %s',
	                        messageId,
	                        err.message
	                    );
	                    statObject.pending = false;
	                    return callback(err);
	                }

	                let sesMessage = {
	                    RawMessage: {
	                        // required
	                        Data: raw // required
	                    },
	                    Source: envelope.from,
	                    Destinations: envelope.to
	                };

	                Object.keys(mail.data.ses || {}).forEach(key => {
	                    sesMessage[key] = mail.data.ses[key];
	                });

	                let ses = (this.ses.aws ? this.ses.ses : this.ses) || {};
	                let aws = this.ses.aws || {};

	                let getRegion = cb => {
	                    if (ses.config && typeof ses.config.region === 'function') {
	                        // promise
	                        return ses.config
	                            .region()
	                            .then(region => cb(null, region))
	                            .catch(err => cb(err));
	                    }
	                    return cb(null, (ses.config && ses.config.region) || 'us-east-1');
	                };

	                getRegion((err, region) => {
	                    if (err || !region) {
	                        region = 'us-east-1';
	                    }

	                    let sendPromise;
	                    if (typeof ses.send === 'function' && aws.SendRawEmailCommand) {
	                        // v3 API
	                        sendPromise = ses.send(new aws.SendRawEmailCommand(sesMessage));
	                    } else {
	                        // v2 API
	                        sendPromise = ses.sendRawEmail(sesMessage).promise();
	                    }

	                    sendPromise
	                        .then(data => {
	                            if (region === 'us-east-1') {
	                                region = 'email';
	                            }

	                            statObject.pending = false;
	                            callback(null, {
	                                envelope: {
	                                    from: envelope.from,
	                                    to: envelope.to
	                                },
	                                messageId: '<' + data.MessageId + (!/@/.test(data.MessageId) ? '@' + region + '.amazonses.com' : '') + '>',
	                                response: data.MessageId,
	                                raw
	                            });
	                        })
	                        .catch(err => {
	                            this.logger.error(
	                                {
	                                    err,
	                                    tnx: 'send'
	                                },
	                                'Send error for %s: %s',
	                                messageId,
	                                err.message
	                            );
	                            statObject.pending = false;
	                            callback(err);
	                        });
	                });
	            })
	        );
	    }

	    /**
	     * Verifies SES configuration
	     *
	     * @param {Function} callback Callback function
	     */
	    verify(callback) {
	        let promise;
	        let ses = (this.ses.aws ? this.ses.ses : this.ses) || {};
	        let aws = this.ses.aws || {};

	        const sesMessage = {
	            RawMessage: {
	                // required
	                Data: 'From: invalid@invalid\r\nTo: invalid@invalid\r\n Subject: Invalid\r\n\r\nInvalid'
	            },
	            Source: 'invalid@invalid',
	            Destinations: ['invalid@invalid']
	        };

	        if (!callback) {
	            promise = new Promise((resolve, reject) => {
	                callback = shared.callbackPromise(resolve, reject);
	            });
	        }
	        const cb = err => {
	            if (err && (err.code || err.Code) !== 'InvalidParameterValue') {
	                return callback(err);
	            }
	            return callback(null, true);
	        };

	        if (typeof ses.send === 'function' && aws.SendRawEmailCommand) {
	            // v3 API
	            sesMessage.RawMessage.Data = Buffer.from(sesMessage.RawMessage.Data);
	            ses.send(new aws.SendRawEmailCommand(sesMessage), cb);
	        } else {
	            // v2 API
	            ses.sendRawEmail(sesMessage, cb);
	        }

	        return promise;
	    }
	}

	sesTransport = SESTransport;
	return sesTransport;
}

var hasRequiredNodemailer;

function requireNodemailer () {
	if (hasRequiredNodemailer) return nodemailer$1;
	hasRequiredNodemailer = 1;

	const Mailer = requireMailer();
	const shared = requireShared();
	const SMTPPool = requireSmtpPool();
	const SMTPTransport = requireSmtpTransport();
	const SendmailTransport = requireSendmailTransport();
	const StreamTransport = requireStreamTransport();
	const JSONTransport = requireJsonTransport();
	const SESTransport = requireSesTransport();
	const nmfetch = requireFetch();
	const packageData = require$$9;

	const ETHEREAL_API = (process.env.ETHEREAL_API || 'https://api.nodemailer.com').replace(/\/+$/, '');
	const ETHEREAL_WEB = (process.env.ETHEREAL_WEB || 'https://ethereal.email').replace(/\/+$/, '');
	const ETHEREAL_CACHE = ['true', 'yes', 'y', '1'].includes((process.env.ETHEREAL_CACHE || 'yes').toString().trim().toLowerCase());

	let testAccount = false;

	nodemailer$1.createTransport = function (transporter, defaults) {
	    let urlConfig;
	    let options;
	    let mailer;

	    if (
	        // provided transporter is a configuration object, not transporter plugin
	        (typeof transporter === 'object' && typeof transporter.send !== 'function') ||
	        // provided transporter looks like a connection url
	        (typeof transporter === 'string' && /^(smtps?|direct):/i.test(transporter))
	    ) {
	        if ((urlConfig = typeof transporter === 'string' ? transporter : transporter.url)) {
	            // parse a configuration URL into configuration options
	            options = shared.parseConnectionUrl(urlConfig);
	        } else {
	            options = transporter;
	        }

	        if (options.pool) {
	            transporter = new SMTPPool(options);
	        } else if (options.sendmail) {
	            transporter = new SendmailTransport(options);
	        } else if (options.streamTransport) {
	            transporter = new StreamTransport(options);
	        } else if (options.jsonTransport) {
	            transporter = new JSONTransport(options);
	        } else if (options.SES) {
	            transporter = new SESTransport(options);
	        } else {
	            transporter = new SMTPTransport(options);
	        }
	    }

	    mailer = new Mailer(transporter, options, defaults);

	    return mailer;
	};

	nodemailer$1.createTestAccount = function (apiUrl, callback) {
	    let promise;

	    if (!callback && typeof apiUrl === 'function') {
	        callback = apiUrl;
	        apiUrl = false;
	    }

	    if (!callback) {
	        promise = new Promise((resolve, reject) => {
	            callback = shared.callbackPromise(resolve, reject);
	        });
	    }

	    if (ETHEREAL_CACHE && testAccount) {
	        setImmediate(() => callback(null, testAccount));
	        return promise;
	    }

	    apiUrl = apiUrl || ETHEREAL_API;

	    let chunks = [];
	    let chunklen = 0;

	    let req = nmfetch(apiUrl + '/user', {
	        contentType: 'application/json',
	        method: 'POST',
	        body: Buffer.from(
	            JSON.stringify({
	                requestor: packageData.name,
	                version: packageData.version
	            })
	        )
	    });

	    req.on('readable', () => {
	        let chunk;
	        while ((chunk = req.read()) !== null) {
	            chunks.push(chunk);
	            chunklen += chunk.length;
	        }
	    });

	    req.once('error', err => callback(err));

	    req.once('end', () => {
	        let res = Buffer.concat(chunks, chunklen);
	        let data;
	        let err;
	        try {
	            data = JSON.parse(res.toString());
	        } catch (E) {
	            err = E;
	        }
	        if (err) {
	            return callback(err);
	        }
	        if (data.status !== 'success' || data.error) {
	            return callback(new Error(data.error || 'Request failed'));
	        }
	        delete data.status;
	        testAccount = data;
	        callback(null, testAccount);
	    });

	    return promise;
	};

	nodemailer$1.getTestMessageUrl = function (info) {
	    if (!info || !info.response) {
	        return false;
	    }

	    let infoProps = new Map();
	    info.response.replace(/\[([^\]]+)\]$/, (m, props) => {
	        props.replace(/\b([A-Z0-9]+)=([^\s]+)/g, (m, key, value) => {
	            infoProps.set(key, value);
	        });
	    });

	    if (infoProps.has('STATUS') && infoProps.has('MSGID')) {
	        return (testAccount.web || ETHEREAL_WEB) + '/message/' + infoProps.get('MSGID');
	    }

	    return false;
	};
	return nodemailer$1;
}

var nodemailerExports = requireNodemailer();
var nodemailer = /*@__PURE__*/getDefaultExportFromCjs(nodemailerExports);

/**
 * A specialized version of `_.forEach` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns `array`.
 */

var _arrayEach;
var hasRequired_arrayEach;

function require_arrayEach () {
	if (hasRequired_arrayEach) return _arrayEach;
	hasRequired_arrayEach = 1;
	function arrayEach(array, iteratee) {
	  var index = -1,
	      length = array == null ? 0 : array.length;

	  while (++index < length) {
	    if (iteratee(array[index], index, array) === false) {
	      break;
	    }
	  }
	  return array;
	}

	_arrayEach = arrayEach;
	return _arrayEach;
}

var _defineProperty;
var hasRequired_defineProperty;

function require_defineProperty () {
	if (hasRequired_defineProperty) return _defineProperty;
	hasRequired_defineProperty = 1;
	var getNative = require_getNative();

	var defineProperty = (function() {
	  try {
	    var func = getNative(Object, 'defineProperty');
	    func({}, '', {});
	    return func;
	  } catch (e) {}
	}());

	_defineProperty = defineProperty;
	return _defineProperty;
}

var _baseAssignValue;
var hasRequired_baseAssignValue;

function require_baseAssignValue () {
	if (hasRequired_baseAssignValue) return _baseAssignValue;
	hasRequired_baseAssignValue = 1;
	var defineProperty = require_defineProperty();

	/**
	 * The base implementation of `assignValue` and `assignMergeValue` without
	 * value checks.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function baseAssignValue(object, key, value) {
	  if (key == '__proto__' && defineProperty) {
	    defineProperty(object, key, {
	      'configurable': true,
	      'enumerable': true,
	      'value': value,
	      'writable': true
	    });
	  } else {
	    object[key] = value;
	  }
	}

	_baseAssignValue = baseAssignValue;
	return _baseAssignValue;
}

var _assignValue;
var hasRequired_assignValue;

function require_assignValue () {
	if (hasRequired_assignValue) return _assignValue;
	hasRequired_assignValue = 1;
	var baseAssignValue = require_baseAssignValue(),
	    eq = requireEq();

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Assigns `value` to `key` of `object` if the existing value is not equivalent
	 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
	 * for equality comparisons.
	 *
	 * @private
	 * @param {Object} object The object to modify.
	 * @param {string} key The key of the property to assign.
	 * @param {*} value The value to assign.
	 */
	function assignValue(object, key, value) {
	  var objValue = object[key];
	  if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) ||
	      (value === undefined && !(key in object))) {
	    baseAssignValue(object, key, value);
	  }
	}

	_assignValue = assignValue;
	return _assignValue;
}

var _copyObject;
var hasRequired_copyObject;

function require_copyObject () {
	if (hasRequired_copyObject) return _copyObject;
	hasRequired_copyObject = 1;
	var assignValue = require_assignValue(),
	    baseAssignValue = require_baseAssignValue();

	/**
	 * Copies properties of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy properties from.
	 * @param {Array} props The property identifiers to copy.
	 * @param {Object} [object={}] The object to copy properties to.
	 * @param {Function} [customizer] The function to customize copied values.
	 * @returns {Object} Returns `object`.
	 */
	function copyObject(source, props, object, customizer) {
	  var isNew = !object;
	  object || (object = {});

	  var index = -1,
	      length = props.length;

	  while (++index < length) {
	    var key = props[index];

	    var newValue = customizer
	      ? customizer(object[key], source[key], key, object, source)
	      : undefined;

	    if (newValue === undefined) {
	      newValue = source[key];
	    }
	    if (isNew) {
	      baseAssignValue(object, key, newValue);
	    } else {
	      assignValue(object, key, newValue);
	    }
	  }
	  return object;
	}

	_copyObject = copyObject;
	return _copyObject;
}

var _baseAssign;
var hasRequired_baseAssign;

function require_baseAssign () {
	if (hasRequired_baseAssign) return _baseAssign;
	hasRequired_baseAssign = 1;
	var copyObject = require_copyObject(),
	    keys = requireKeys();

	/**
	 * The base implementation of `_.assign` without support for multiple sources
	 * or `customizer` functions.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @returns {Object} Returns `object`.
	 */
	function baseAssign(object, source) {
	  return object && copyObject(source, keys(source), object);
	}

	_baseAssign = baseAssign;
	return _baseAssign;
}

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */

var _nativeKeysIn;
var hasRequired_nativeKeysIn;

function require_nativeKeysIn () {
	if (hasRequired_nativeKeysIn) return _nativeKeysIn;
	hasRequired_nativeKeysIn = 1;
	function nativeKeysIn(object) {
	  var result = [];
	  if (object != null) {
	    for (var key in Object(object)) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	_nativeKeysIn = nativeKeysIn;
	return _nativeKeysIn;
}

var _baseKeysIn;
var hasRequired_baseKeysIn;

function require_baseKeysIn () {
	if (hasRequired_baseKeysIn) return _baseKeysIn;
	hasRequired_baseKeysIn = 1;
	var isObject = requireIsObject(),
	    isPrototype = require_isPrototype(),
	    nativeKeysIn = require_nativeKeysIn();

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function baseKeysIn(object) {
	  if (!isObject(object)) {
	    return nativeKeysIn(object);
	  }
	  var isProto = isPrototype(object),
	      result = [];

	  for (var key in object) {
	    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	_baseKeysIn = baseKeysIn;
	return _baseKeysIn;
}

var keysIn_1;
var hasRequiredKeysIn;

function requireKeysIn () {
	if (hasRequiredKeysIn) return keysIn_1;
	hasRequiredKeysIn = 1;
	var arrayLikeKeys = require_arrayLikeKeys(),
	    baseKeysIn = require_baseKeysIn(),
	    isArrayLike = requireIsArrayLike();

	/**
	 * Creates an array of the own and inherited enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Object
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 * @example
	 *
	 * function Foo() {
	 *   this.a = 1;
	 *   this.b = 2;
	 * }
	 *
	 * Foo.prototype.c = 3;
	 *
	 * _.keysIn(new Foo);
	 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	 */
	function keysIn(object) {
	  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
	}

	keysIn_1 = keysIn;
	return keysIn_1;
}

var _baseAssignIn;
var hasRequired_baseAssignIn;

function require_baseAssignIn () {
	if (hasRequired_baseAssignIn) return _baseAssignIn;
	hasRequired_baseAssignIn = 1;
	var copyObject = require_copyObject(),
	    keysIn = requireKeysIn();

	/**
	 * The base implementation of `_.assignIn` without support for multiple sources
	 * or `customizer` functions.
	 *
	 * @private
	 * @param {Object} object The destination object.
	 * @param {Object} source The source object.
	 * @returns {Object} Returns `object`.
	 */
	function baseAssignIn(object, source) {
	  return object && copyObject(source, keysIn(source), object);
	}

	_baseAssignIn = baseAssignIn;
	return _baseAssignIn;
}

var _cloneBuffer = {exports: {}};

_cloneBuffer.exports;

var hasRequired_cloneBuffer;

function require_cloneBuffer () {
	if (hasRequired_cloneBuffer) return _cloneBuffer.exports;
	hasRequired_cloneBuffer = 1;
	(function (module, exports) {
		var root = require_root();

		/** Detect free variable `exports`. */
		var freeExports = exports && !exports.nodeType && exports;

		/** Detect free variable `module`. */
		var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

		/** Detect the popular CommonJS extension `module.exports`. */
		var moduleExports = freeModule && freeModule.exports === freeExports;

		/** Built-in value references. */
		var Buffer = moduleExports ? root.Buffer : undefined,
		    allocUnsafe = Buffer ? Buffer.allocUnsafe : undefined;

		/**
		 * Creates a clone of  `buffer`.
		 *
		 * @private
		 * @param {Buffer} buffer The buffer to clone.
		 * @param {boolean} [isDeep] Specify a deep clone.
		 * @returns {Buffer} Returns the cloned buffer.
		 */
		function cloneBuffer(buffer, isDeep) {
		  if (isDeep) {
		    return buffer.slice();
		  }
		  var length = buffer.length,
		      result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);

		  buffer.copy(result);
		  return result;
		}

		module.exports = cloneBuffer; 
	} (_cloneBuffer, _cloneBuffer.exports));
	return _cloneBuffer.exports;
}

var _copySymbols;
var hasRequired_copySymbols;

function require_copySymbols () {
	if (hasRequired_copySymbols) return _copySymbols;
	hasRequired_copySymbols = 1;
	var copyObject = require_copyObject(),
	    getSymbols = require_getSymbols();

	/**
	 * Copies own symbols of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy symbols from.
	 * @param {Object} [object={}] The object to copy symbols to.
	 * @returns {Object} Returns `object`.
	 */
	function copySymbols(source, object) {
	  return copyObject(source, getSymbols(source), object);
	}

	_copySymbols = copySymbols;
	return _copySymbols;
}

var _getPrototype;
var hasRequired_getPrototype;

function require_getPrototype () {
	if (hasRequired_getPrototype) return _getPrototype;
	hasRequired_getPrototype = 1;
	var overArg = require_overArg();

	/** Built-in value references. */
	var getPrototype = overArg(Object.getPrototypeOf, Object);

	_getPrototype = getPrototype;
	return _getPrototype;
}

var _getSymbolsIn;
var hasRequired_getSymbolsIn;

function require_getSymbolsIn () {
	if (hasRequired_getSymbolsIn) return _getSymbolsIn;
	hasRequired_getSymbolsIn = 1;
	var arrayPush = require_arrayPush(),
	    getPrototype = require_getPrototype(),
	    getSymbols = require_getSymbols(),
	    stubArray = requireStubArray();

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeGetSymbols = Object.getOwnPropertySymbols;

	/**
	 * Creates an array of the own and inherited enumerable symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of symbols.
	 */
	var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
	  var result = [];
	  while (object) {
	    arrayPush(result, getSymbols(object));
	    object = getPrototype(object);
	  }
	  return result;
	};

	_getSymbolsIn = getSymbolsIn;
	return _getSymbolsIn;
}

var _copySymbolsIn;
var hasRequired_copySymbolsIn;

function require_copySymbolsIn () {
	if (hasRequired_copySymbolsIn) return _copySymbolsIn;
	hasRequired_copySymbolsIn = 1;
	var copyObject = require_copyObject(),
	    getSymbolsIn = require_getSymbolsIn();

	/**
	 * Copies own and inherited symbols of `source` to `object`.
	 *
	 * @private
	 * @param {Object} source The object to copy symbols from.
	 * @param {Object} [object={}] The object to copy symbols to.
	 * @returns {Object} Returns `object`.
	 */
	function copySymbolsIn(source, object) {
	  return copyObject(source, getSymbolsIn(source), object);
	}

	_copySymbolsIn = copySymbolsIn;
	return _copySymbolsIn;
}

var _getAllKeysIn;
var hasRequired_getAllKeysIn;

function require_getAllKeysIn () {
	if (hasRequired_getAllKeysIn) return _getAllKeysIn;
	hasRequired_getAllKeysIn = 1;
	var baseGetAllKeys = require_baseGetAllKeys(),
	    getSymbolsIn = require_getSymbolsIn(),
	    keysIn = requireKeysIn();

	/**
	 * Creates an array of own and inherited enumerable property names and
	 * symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names and symbols.
	 */
	function getAllKeysIn(object) {
	  return baseGetAllKeys(object, keysIn, getSymbolsIn);
	}

	_getAllKeysIn = getAllKeysIn;
	return _getAllKeysIn;
}

/** Used for built-in method references. */

var _initCloneArray;
var hasRequired_initCloneArray;

function require_initCloneArray () {
	if (hasRequired_initCloneArray) return _initCloneArray;
	hasRequired_initCloneArray = 1;
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Initializes an array clone.
	 *
	 * @private
	 * @param {Array} array The array to clone.
	 * @returns {Array} Returns the initialized clone.
	 */
	function initCloneArray(array) {
	  var length = array.length,
	      result = new array.constructor(length);

	  // Add properties assigned by `RegExp#exec`.
	  if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
	    result.index = array.index;
	    result.input = array.input;
	  }
	  return result;
	}

	_initCloneArray = initCloneArray;
	return _initCloneArray;
}

var _cloneArrayBuffer;
var hasRequired_cloneArrayBuffer;

function require_cloneArrayBuffer () {
	if (hasRequired_cloneArrayBuffer) return _cloneArrayBuffer;
	hasRequired_cloneArrayBuffer = 1;
	var Uint8Array = require_Uint8Array();

	/**
	 * Creates a clone of `arrayBuffer`.
	 *
	 * @private
	 * @param {ArrayBuffer} arrayBuffer The array buffer to clone.
	 * @returns {ArrayBuffer} Returns the cloned array buffer.
	 */
	function cloneArrayBuffer(arrayBuffer) {
	  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
	  new Uint8Array(result).set(new Uint8Array(arrayBuffer));
	  return result;
	}

	_cloneArrayBuffer = cloneArrayBuffer;
	return _cloneArrayBuffer;
}

var _cloneDataView;
var hasRequired_cloneDataView;

function require_cloneDataView () {
	if (hasRequired_cloneDataView) return _cloneDataView;
	hasRequired_cloneDataView = 1;
	var cloneArrayBuffer = require_cloneArrayBuffer();

	/**
	 * Creates a clone of `dataView`.
	 *
	 * @private
	 * @param {Object} dataView The data view to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the cloned data view.
	 */
	function cloneDataView(dataView, isDeep) {
	  var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
	  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
	}

	_cloneDataView = cloneDataView;
	return _cloneDataView;
}

/** Used to match `RegExp` flags from their coerced string values. */

var _cloneRegExp;
var hasRequired_cloneRegExp;

function require_cloneRegExp () {
	if (hasRequired_cloneRegExp) return _cloneRegExp;
	hasRequired_cloneRegExp = 1;
	var reFlags = /\w*$/;

	/**
	 * Creates a clone of `regexp`.
	 *
	 * @private
	 * @param {Object} regexp The regexp to clone.
	 * @returns {Object} Returns the cloned regexp.
	 */
	function cloneRegExp(regexp) {
	  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
	  result.lastIndex = regexp.lastIndex;
	  return result;
	}

	_cloneRegExp = cloneRegExp;
	return _cloneRegExp;
}

var _cloneSymbol;
var hasRequired_cloneSymbol;

function require_cloneSymbol () {
	if (hasRequired_cloneSymbol) return _cloneSymbol;
	hasRequired_cloneSymbol = 1;
	var Symbol = require_Symbol();

	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol ? Symbol.prototype : undefined,
	    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

	/**
	 * Creates a clone of the `symbol` object.
	 *
	 * @private
	 * @param {Object} symbol The symbol object to clone.
	 * @returns {Object} Returns the cloned symbol object.
	 */
	function cloneSymbol(symbol) {
	  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
	}

	_cloneSymbol = cloneSymbol;
	return _cloneSymbol;
}

var _cloneTypedArray;
var hasRequired_cloneTypedArray;

function require_cloneTypedArray () {
	if (hasRequired_cloneTypedArray) return _cloneTypedArray;
	hasRequired_cloneTypedArray = 1;
	var cloneArrayBuffer = require_cloneArrayBuffer();

	/**
	 * Creates a clone of `typedArray`.
	 *
	 * @private
	 * @param {Object} typedArray The typed array to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the cloned typed array.
	 */
	function cloneTypedArray(typedArray, isDeep) {
	  var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
	  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
	}

	_cloneTypedArray = cloneTypedArray;
	return _cloneTypedArray;
}

var _initCloneByTag;
var hasRequired_initCloneByTag;

function require_initCloneByTag () {
	if (hasRequired_initCloneByTag) return _initCloneByTag;
	hasRequired_initCloneByTag = 1;
	var cloneArrayBuffer = require_cloneArrayBuffer(),
	    cloneDataView = require_cloneDataView(),
	    cloneRegExp = require_cloneRegExp(),
	    cloneSymbol = require_cloneSymbol(),
	    cloneTypedArray = require_cloneTypedArray();

	/** `Object#toString` result references. */
	var boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
	    symbolTag = '[object Symbol]';

	var arrayBufferTag = '[object ArrayBuffer]',
	    dataViewTag = '[object DataView]',
	    float32Tag = '[object Float32Array]',
	    float64Tag = '[object Float64Array]',
	    int8Tag = '[object Int8Array]',
	    int16Tag = '[object Int16Array]',
	    int32Tag = '[object Int32Array]',
	    uint8Tag = '[object Uint8Array]',
	    uint8ClampedTag = '[object Uint8ClampedArray]',
	    uint16Tag = '[object Uint16Array]',
	    uint32Tag = '[object Uint32Array]';

	/**
	 * Initializes an object clone based on its `toStringTag`.
	 *
	 * **Note:** This function only supports cloning values with tags of
	 * `Boolean`, `Date`, `Error`, `Map`, `Number`, `RegExp`, `Set`, or `String`.
	 *
	 * @private
	 * @param {Object} object The object to clone.
	 * @param {string} tag The `toStringTag` of the object to clone.
	 * @param {boolean} [isDeep] Specify a deep clone.
	 * @returns {Object} Returns the initialized clone.
	 */
	function initCloneByTag(object, tag, isDeep) {
	  var Ctor = object.constructor;
	  switch (tag) {
	    case arrayBufferTag:
	      return cloneArrayBuffer(object);

	    case boolTag:
	    case dateTag:
	      return new Ctor(+object);

	    case dataViewTag:
	      return cloneDataView(object, isDeep);

	    case float32Tag: case float64Tag:
	    case int8Tag: case int16Tag: case int32Tag:
	    case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
	      return cloneTypedArray(object, isDeep);

	    case mapTag:
	      return new Ctor;

	    case numberTag:
	    case stringTag:
	      return new Ctor(object);

	    case regexpTag:
	      return cloneRegExp(object);

	    case setTag:
	      return new Ctor;

	    case symbolTag:
	      return cloneSymbol(object);
	  }
	}

	_initCloneByTag = initCloneByTag;
	return _initCloneByTag;
}

var _baseCreate;
var hasRequired_baseCreate;

function require_baseCreate () {
	if (hasRequired_baseCreate) return _baseCreate;
	hasRequired_baseCreate = 1;
	var isObject = requireIsObject();

	/** Built-in value references. */
	var objectCreate = Object.create;

	/**
	 * The base implementation of `_.create` without support for assigning
	 * properties to the created object.
	 *
	 * @private
	 * @param {Object} proto The object to inherit from.
	 * @returns {Object} Returns the new object.
	 */
	var baseCreate = (function() {
	  function object() {}
	  return function(proto) {
	    if (!isObject(proto)) {
	      return {};
	    }
	    if (objectCreate) {
	      return objectCreate(proto);
	    }
	    object.prototype = proto;
	    var result = new object;
	    object.prototype = undefined;
	    return result;
	  };
	}());

	_baseCreate = baseCreate;
	return _baseCreate;
}

var _initCloneObject;
var hasRequired_initCloneObject;

function require_initCloneObject () {
	if (hasRequired_initCloneObject) return _initCloneObject;
	hasRequired_initCloneObject = 1;
	var baseCreate = require_baseCreate(),
	    getPrototype = require_getPrototype(),
	    isPrototype = require_isPrototype();

	/**
	 * Initializes an object clone.
	 *
	 * @private
	 * @param {Object} object The object to clone.
	 * @returns {Object} Returns the initialized clone.
	 */
	function initCloneObject(object) {
	  return (typeof object.constructor == 'function' && !isPrototype(object))
	    ? baseCreate(getPrototype(object))
	    : {};
	}

	_initCloneObject = initCloneObject;
	return _initCloneObject;
}

var _baseIsMap;
var hasRequired_baseIsMap;

function require_baseIsMap () {
	if (hasRequired_baseIsMap) return _baseIsMap;
	hasRequired_baseIsMap = 1;
	var getTag = require_getTag(),
	    isObjectLike = requireIsObjectLike();

	/** `Object#toString` result references. */
	var mapTag = '[object Map]';

	/**
	 * The base implementation of `_.isMap` without Node.js optimizations.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
	 */
	function baseIsMap(value) {
	  return isObjectLike(value) && getTag(value) == mapTag;
	}

	_baseIsMap = baseIsMap;
	return _baseIsMap;
}

var isMap_1;
var hasRequiredIsMap;

function requireIsMap () {
	if (hasRequiredIsMap) return isMap_1;
	hasRequiredIsMap = 1;
	var baseIsMap = require_baseIsMap(),
	    baseUnary = require_baseUnary(),
	    nodeUtil = require_nodeUtil();

	/* Node.js helper references. */
	var nodeIsMap = nodeUtil && nodeUtil.isMap;

	/**
	 * Checks if `value` is classified as a `Map` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.3.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a map, else `false`.
	 * @example
	 *
	 * _.isMap(new Map);
	 * // => true
	 *
	 * _.isMap(new WeakMap);
	 * // => false
	 */
	var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;

	isMap_1 = isMap;
	return isMap_1;
}

var _baseIsSet;
var hasRequired_baseIsSet;

function require_baseIsSet () {
	if (hasRequired_baseIsSet) return _baseIsSet;
	hasRequired_baseIsSet = 1;
	var getTag = require_getTag(),
	    isObjectLike = requireIsObjectLike();

	/** `Object#toString` result references. */
	var setTag = '[object Set]';

	/**
	 * The base implementation of `_.isSet` without Node.js optimizations.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
	 */
	function baseIsSet(value) {
	  return isObjectLike(value) && getTag(value) == setTag;
	}

	_baseIsSet = baseIsSet;
	return _baseIsSet;
}

var isSet_1;
var hasRequiredIsSet;

function requireIsSet () {
	if (hasRequiredIsSet) return isSet_1;
	hasRequiredIsSet = 1;
	var baseIsSet = require_baseIsSet(),
	    baseUnary = require_baseUnary(),
	    nodeUtil = require_nodeUtil();

	/* Node.js helper references. */
	var nodeIsSet = nodeUtil && nodeUtil.isSet;

	/**
	 * Checks if `value` is classified as a `Set` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.3.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a set, else `false`.
	 * @example
	 *
	 * _.isSet(new Set);
	 * // => true
	 *
	 * _.isSet(new WeakSet);
	 * // => false
	 */
	var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;

	isSet_1 = isSet;
	return isSet_1;
}

var _baseClone;
var hasRequired_baseClone;

function require_baseClone () {
	if (hasRequired_baseClone) return _baseClone;
	hasRequired_baseClone = 1;
	var Stack = require_Stack(),
	    arrayEach = require_arrayEach(),
	    assignValue = require_assignValue(),
	    baseAssign = require_baseAssign(),
	    baseAssignIn = require_baseAssignIn(),
	    cloneBuffer = require_cloneBuffer(),
	    copyArray = require_copyArray(),
	    copySymbols = require_copySymbols(),
	    copySymbolsIn = require_copySymbolsIn(),
	    getAllKeys = require_getAllKeys(),
	    getAllKeysIn = require_getAllKeysIn(),
	    getTag = require_getTag(),
	    initCloneArray = require_initCloneArray(),
	    initCloneByTag = require_initCloneByTag(),
	    initCloneObject = require_initCloneObject(),
	    isArray = requireIsArray(),
	    isBuffer = requireIsBuffer(),
	    isMap = requireIsMap(),
	    isObject = requireIsObject(),
	    isSet = requireIsSet(),
	    keys = requireKeys(),
	    keysIn = requireKeysIn();

	/** Used to compose bitmasks for cloning. */
	var CLONE_DEEP_FLAG = 1,
	    CLONE_FLAT_FLAG = 2,
	    CLONE_SYMBOLS_FLAG = 4;

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    objectTag = '[object Object]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
	    symbolTag = '[object Symbol]',
	    weakMapTag = '[object WeakMap]';

	var arrayBufferTag = '[object ArrayBuffer]',
	    dataViewTag = '[object DataView]',
	    float32Tag = '[object Float32Array]',
	    float64Tag = '[object Float64Array]',
	    int8Tag = '[object Int8Array]',
	    int16Tag = '[object Int16Array]',
	    int32Tag = '[object Int32Array]',
	    uint8Tag = '[object Uint8Array]',
	    uint8ClampedTag = '[object Uint8ClampedArray]',
	    uint16Tag = '[object Uint16Array]',
	    uint32Tag = '[object Uint32Array]';

	/** Used to identify `toStringTag` values supported by `_.clone`. */
	var cloneableTags = {};
	cloneableTags[argsTag] = cloneableTags[arrayTag] =
	cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] =
	cloneableTags[boolTag] = cloneableTags[dateTag] =
	cloneableTags[float32Tag] = cloneableTags[float64Tag] =
	cloneableTags[int8Tag] = cloneableTags[int16Tag] =
	cloneableTags[int32Tag] = cloneableTags[mapTag] =
	cloneableTags[numberTag] = cloneableTags[objectTag] =
	cloneableTags[regexpTag] = cloneableTags[setTag] =
	cloneableTags[stringTag] = cloneableTags[symbolTag] =
	cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
	cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
	cloneableTags[errorTag] = cloneableTags[funcTag] =
	cloneableTags[weakMapTag] = false;

	/**
	 * The base implementation of `_.clone` and `_.cloneDeep` which tracks
	 * traversed objects.
	 *
	 * @private
	 * @param {*} value The value to clone.
	 * @param {boolean} bitmask The bitmask flags.
	 *  1 - Deep clone
	 *  2 - Flatten inherited properties
	 *  4 - Clone symbols
	 * @param {Function} [customizer] The function to customize cloning.
	 * @param {string} [key] The key of `value`.
	 * @param {Object} [object] The parent object of `value`.
	 * @param {Object} [stack] Tracks traversed objects and their clone counterparts.
	 * @returns {*} Returns the cloned value.
	 */
	function baseClone(value, bitmask, customizer, key, object, stack) {
	  var result,
	      isDeep = bitmask & CLONE_DEEP_FLAG,
	      isFlat = bitmask & CLONE_FLAT_FLAG,
	      isFull = bitmask & CLONE_SYMBOLS_FLAG;

	  if (customizer) {
	    result = object ? customizer(value, key, object, stack) : customizer(value);
	  }
	  if (result !== undefined) {
	    return result;
	  }
	  if (!isObject(value)) {
	    return value;
	  }
	  var isArr = isArray(value);
	  if (isArr) {
	    result = initCloneArray(value);
	    if (!isDeep) {
	      return copyArray(value, result);
	    }
	  } else {
	    var tag = getTag(value),
	        isFunc = tag == funcTag || tag == genTag;

	    if (isBuffer(value)) {
	      return cloneBuffer(value, isDeep);
	    }
	    if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
	      result = (isFlat || isFunc) ? {} : initCloneObject(value);
	      if (!isDeep) {
	        return isFlat
	          ? copySymbolsIn(value, baseAssignIn(result, value))
	          : copySymbols(value, baseAssign(result, value));
	      }
	    } else {
	      if (!cloneableTags[tag]) {
	        return object ? value : {};
	      }
	      result = initCloneByTag(value, tag, isDeep);
	    }
	  }
	  // Check for circular references and return its corresponding clone.
	  stack || (stack = new Stack);
	  var stacked = stack.get(value);
	  if (stacked) {
	    return stacked;
	  }
	  stack.set(value, result);

	  if (isSet(value)) {
	    value.forEach(function(subValue) {
	      result.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
	    });
	  } else if (isMap(value)) {
	    value.forEach(function(subValue, key) {
	      result.set(key, baseClone(subValue, bitmask, customizer, key, value, stack));
	    });
	  }

	  var keysFunc = isFull
	    ? (isFlat ? getAllKeysIn : getAllKeys)
	    : (isFlat ? keysIn : keys);

	  var props = isArr ? undefined : keysFunc(value);
	  arrayEach(props || value, function(subValue, key) {
	    if (props) {
	      key = subValue;
	      subValue = value[key];
	    }
	    // Recursively populate clone (susceptible to call stack limits).
	    assignValue(result, key, baseClone(subValue, bitmask, customizer, key, value, stack));
	  });
	  return result;
	}

	_baseClone = baseClone;
	return _baseClone;
}

var cloneDeep_1;
var hasRequiredCloneDeep;

function requireCloneDeep () {
	if (hasRequiredCloneDeep) return cloneDeep_1;
	hasRequiredCloneDeep = 1;
	var baseClone = require_baseClone();

	/** Used to compose bitmasks for cloning. */
	var CLONE_DEEP_FLAG = 1,
	    CLONE_SYMBOLS_FLAG = 4;

	/**
	 * This method is like `_.clone` except that it recursively clones `value`.
	 *
	 * @static
	 * @memberOf _
	 * @since 1.0.0
	 * @category Lang
	 * @param {*} value The value to recursively clone.
	 * @returns {*} Returns the deep cloned value.
	 * @see _.clone
	 * @example
	 *
	 * var objects = [{ 'a': 1 }, { 'b': 2 }];
	 *
	 * var deep = _.cloneDeep(objects);
	 * console.log(deep[0] === objects[0]);
	 * // => false
	 */
	function cloneDeep(value) {
	  return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
	}

	cloneDeep_1 = cloneDeep;
	return cloneDeep_1;
}

var cloneDeepExports = requireCloneDeep();
var cloneDeep = /*@__PURE__*/getDefaultExportFromCjs(cloneDeepExports);

const GLOBAL_WEB_SOCKET_SERVER_KEY = Symbol.for("sveltekit.web-socket-server");
const getGlobalWebSocketServer = () => {
  const webSocketServer = globalThis[GLOBAL_WEB_SOCKET_SERVER_KEY];
  if (!webSocketServer)
    throw new Error("There is no global WebSocket server");
  return webSocketServer;
};
const sendMessageToUsers = ({
  gameId,
  message,
  excludeUserIds = []
}) => {
  [...getGlobalWebSocketServer().clients].filter((client) => client.gameId === gameId && !excludeUserIds.includes(client.userId)).forEach((client) => {
    client.send(JSON.stringify(message));
  });
};
const SUMMARY_MAIL_FROM = "noreply@unibw.de";
const SUMMARY_MAIL_TO = "manfred.hofmeier@unibw.de";
const DEV_AUTO_CONFIGURE_PLAYERS = "false";
const createDefaultDefender = (hostUserId, id) => ({
  id,
  userId: hostUserId,
  faceId: 0,
  character: "order-manager",
  isConfigured: envBool(DEV_AUTO_CONFIGURE_PLAYERS)
});
const createDefaultAttacker = (hostUserId) => ({
  id: "attacker",
  userId: hostUserId,
  faceId: 0,
  character: "frustrated",
  isConfigured: envBool(DEV_AUTO_CONFIGURE_PLAYERS)
});
const machine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5RQIYFswGUwCcBuuAdAOLpiEByA9gC4AEsNKONkAxAK6y50BWVASwB2kANoAGALqJQAByqwBNAVSEyQAD0QAmAOzbCAFl0A2Qyd3iArIfEBGbQBoQAT0T6AzIQCchgBx2drYeht7ipgC+Ec6oGNj4RKQYlLQMTCzsKLCKUEIMAhBgEtJIIPKKyqrqWggeHn6Euv4eugF1emZWzm4Idt7ehFZDZpa6YeLmdlExZPEEOCRkKfSMzKwQbFk5eSgQaMLF6uVKKmqlNX4mjU0h2jbGAeLe3Yh9A0NWJnafYyZ+urppiBYlhcPNFslqCt0utCABBbICXLCKB0Li4WBsQ6lY6VM6gGoeOy6QjaOz-eyGKwefp+awvBDUryfbTGXSBSzeKbRYGzMGJJZQtJrSCEABKYF2LjoNCowpYbFWLAYYBoHFk2LkChOVXOiBMdUINOsXzqumpTlciAthHEJlZAI8EypBqBILmAuSSTAdEwMPYYA0YAAxhxWHQQXQUMG8Zqytq8dUdFYGsYJt9vDS9F0rb0rBNBuF7do7X5jJm3XyEgtvRCfX6RRscFQADYtgBG0YA1hGyFGY6c47jTkmEHdU5ZDBms+bxB4GXY6nYfDYy3dQvmrICee7+TWlt7ff6NkOEyO9b1AgZM+TLn5vH4yw+F99lyXySZ899H0NK3E93WhDYGqsibIiuR0M2LZFFIRxnrqBKIJcVikvYBr6Hakx2AyeiGKSgT9EERIpo+hh-qC1aAcB6rwuBQgopBrZwFisE4vB+KaIgD7Lga2gmJ+3hmIYHhfAyNjLiybIck83IzP+lG1tRsjwm2jHQbAUZ0ewABmwgCLAAAWKogaeFTnohvQmoQfh8TSnyfAa865pYBgmA+IlDPUYQ2eRHr7skADyOCFDgxnqoqqp0MGBnMNGrChVQwW4KZOocTUBoSRMZh0kE2j1LoDL9F44hli0bKWJcvkAbWQUhWFoFKvQIIpYmF63oQQm2FOfy+HYEwLuEKGhFlG4WH0HhVZRACq7YCAAjhwShUFwEVCBAdBgGgVC8AILXmZxCAALSWOIjR0hlVgPgEQwMp+JLeCWRXOqVk3gjN82LbKK3oqFED6cGqgiDGYisVqZkIQdh3mF4n7iNofgtGafF2CYt3w4QKOkdSZZlsSr1EO9C1Ld93ChTgIaAyG6x7RDNSHfUMNWNoviGIY8PWJcDL1MuTwlh4Vjjd4+YTPjCyE59y2Yj9UWU8DEA02liCHYEJWDC0AImHaTP6AVuZbqdFLEnOZLePoZFAkIVCFPApS7tWcHg4rR2BJ8asAqYWt6HoOF4R8XzCfe9T3lYot1g7qWjszL4GNYnzfHOVIMxNO5VuCtZCo1kDh61Fn9FzAS2vaVL2B4zPiE8Icp-JaeCqkmcQLR2wMT9NtgxHbXGGJpeDEXnS2BYydyRRNeQnXx7ipKEDSrK8o0Nn+01FOBhOtDQzEmM-xdwYkl93a+jeKHtaHg2GQQPPtPWlutpXf8G7lyJA39BjoRjOSc59PDh9LEp59O6YDQlRTN8Jm-EJhOR6LYBoklWalX+EEL+yQlKNyRPRIQqIoJwF-qOAIVxAHXRAZrYSYlbA91ZOMP4eUhYIPIEguEqkMEaS2CgrObFHajj6qYRoH5y5wxsiJPwxDTqSWNIuPqroq7D09OQWqPBuAgSwReAEDJ7wGwcFSXQpd2SLgPhIvygEABielDIsLbjnA6i4CxvBRgLB6xhsK5ivFcd8XI9D8zZn4UO4tiat3jGwi8h0HpXA0WWO6Ik2Z3AZKzZerR+h3BCP0EqUQohAA */
  id: "gameServer",
  context: ({ input }) => ({
    timestamp: Date.now(),
    gameId: input.gameId,
    hostUserId: input.host.id,
    finishedAssigningSides: false,
    globalAttackScenario: shuffle([...GLOBAL_ATTACK_SCENARIOS.keys()])[0],
    targetedAttacks: shuffle([...TARGETED_ATTACKS.keys()]).slice(0, 12),
    defense: {
      finishedAssigning: false,
      defenders: [
        createDefaultDefender(input.host.id, "defender0"),
        createDefaultDefender(input.host.id, "defender1"),
        createDefaultDefender(input.host.id, "defender2"),
        createDefaultDefender(input.host.id, "defender3")
      ]
    },
    attack: {
      finishedAssigning: false,
      attacker: createDefaultAttacker(input.host.id)
    },
    users: [input.host],
    events: []
  }),
  types: {
    // typegen: {} as import('./machine.typegen').Typegen0,
    context: {},
    events: {}
  },
  states: {
    Game: {
      initial: "Assigning sides",
      states: {
        "Assigning sides": {
          description: "All users are in the lobby, and the admins can define which side (attacker, defender or admin) a user belongs to.",
          initial: "Incomplete",
          states: {
            Incomplete: {
              always: {
                target: "Ready",
                guard: "allSidesAssigned",
                reenter: false
              }
            },
            Ready: {
              on: {
                "user: next step": {
                  target: "#gameServer.Game.Assigning roles",
                  guard: "isAdmin",
                  actions: [
                    {
                      type: "setAssigningSidesFinished"
                    },
                    {
                      type: "setAdminsForPlayers"
                    }
                  ]
                }
              }
            }
          },
          on: {
            "user joined": {
              target: "Assigning sides",
              actions: {
                type: "storeNewUser"
              },
              reenter: false
            },
            "user: assign side": {
              target: "Assigning sides",
              guard: "isAdmin",
              actions: {
                type: "assignSide"
              },
              reenter: false
            }
          }
        },
        Playing: {
          description: "The game is active and started. Now the server only waits for the game events from the users.",
          always: {
            target: "Finished",
            guard: "gameFinished"
          },
          on: {
            "user: apply game event": {
              target: "Playing",
              guard: "isValidGameEvent",
              actions: {
                type: "addOrUpdateGameEvent"
              },
              reenter: false
            },
            "user: rollback game event": {
              target: "Playing",
              guard: "isAdmin",
              actions: {
                type: "rollbackGameEvent"
              },
              reenter: false
            },
            "user: cancel game event": {
              target: "Playing",
              guard: "isAllowedToCancel",
              actions: {
                type: "cancelGameEvent"
              },
              reenter: false
            },
            "user: switch sides": {
              target: "Playing",
              guard: "isAdmin",
              actions: {
                type: "switchSides"
              },
              reenter: false
            }
          }
        },
        "Assigning roles": {
          description: "The users have been separated, and the defenders choose their role.",
          initial: "Incomplete",
          states: {
            Incomplete: {
              always: {
                target: "Ready",
                guard: "allRolesAssigned",
                reenter: false
              }
            },
            Ready: {
              always: {
                target: "#gameServer.Game.Playing",
                guard: "finishedAssigningRoles"
              }
            }
          },
          on: {
            "user: assign role": {
              target: "Assigning roles",
              guard: "isAdmin",
              actions: {
                type: "updatePlayer"
              },
              description: "Defines which user controls a player, which role they are and how they look.\n\nThis event can update a defender and an attacker.",
              reenter: false
            },
            "user: start editing player": {
              target: "Assigning roles",
              guard: "isAdmin",
              actions: {
                type: "setEditingPlayer"
              },
              reenter: false
            },
            "user: stop editing player": {
              target: "Assigning roles",
              guard: "isAdmin",
              actions: {
                type: "setEditingPlayer"
              },
              reenter: false
            },
            "user: next step": {
              target: "Assigning roles",
              guard: "isAdmin",
              actions: {
                type: "setAssigningRolesFinished"
              },
              reenter: false
            }
          }
        },
        Finished: {
          initial: "Sending summary",
          states: {
            "Sending summary": {
              invoke: {
                src: "sendSummary",
                id: "invoke-vcyw6",
                input: ({ context }) => {
                  return { sharedContext: getSharedGameContext(context) };
                },
                onDone: [
                  {
                    target: "Success"
                  }
                ],
                onError: [
                  {
                    target: "Error"
                  }
                ]
              }
            },
            Success: {},
            Error: {}
          }
        }
      }
    },
    Ubiquitous: {
      description: "✨ This state only serves to group events that can happen at any time during the whole game lifecycle.",
      on: {
        "user: send emoji": {
          target: "Ubiquitous",
          actions: {
            type: "sendEmojiToOtherUsers"
          }
        },
        "user disconnected": {
          target: "Ubiquitous",
          actions: {
            type: "updateUserConnectionState"
          }
        },
        "user reconnected": {
          target: "Ubiquitous",
          actions: {
            type: "updateUserConnectionState"
          }
        },
        "user connected": {
          target: "Ubiquitous",
          actions: {
            type: "updateUserConnectionState"
          }
        }
      },
      type: "parallel"
    }
  },
  type: "parallel"
});
const transporter = nodemailer.createTransport({
  sendmail: true,
  newline: "unix",
  path: "/usr/sbin/sendmail"
});
const sendSummaryEmail = async (context) => new Promise((resolve, reject) => {
  try {
    transporter.sendMail(
      {
        from: SUMMARY_MAIL_FROM,
        to: SUMMARY_MAIL_TO,
        subject: "The Hidden Threat",
        text: "Im Anhang befindet sich das JSON mit allen Informationen zum Spiel.",
        attachments: [
          {
            filename: getGameSummaryFilename(context),
            contentType: "application/json",
            content: JSON.stringify(getGameSummary(context), null, 2)
          }
        ]
      },
      (err, info) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          resolve(info);
        }
      }
    );
  } catch (e) {
    console.error(e);
    reject(e);
  }
});
setAutoFreeze(false);
const serverGameMachine = machine.provide({
  actions: {
    setAssigningSidesFinished: assign(() => ({ finishedAssigningSides: true })),
    setAdminsForPlayers: assign(({ context }) => {
      const attackAdmin = context.users.find((user) => user.isAdmin && user.side === "attack");
      const defenseAdmin = context.users.find((user) => user.isAdmin && user.side === "defense");
      if (!attackAdmin || !defenseAdmin)
        return {};
      return {
        attack: produce(context.attack, (attack) => {
          attack.attacker.userId = attackAdmin.id;
        }),
        defense: produce(context.defense, (defense) => {
          defense.defenders.forEach((defender) => {
            defender.userId = defenseAdmin.id;
          });
        })
      };
    }),
    setAssigningRolesFinished: assign(({ context, event: e }) => {
      const { userId } = e;
      const side = context.users.find((user) => user.id === userId)?.side;
      if (side === "attack") {
        return {
          attack: {
            ...context.attack,
            finishedAssigning: true
          }
        };
      } else if (side === "defense") {
        return {
          defense: {
            ...context.defense,
            finishedAssigning: true
          }
        };
      } else {
        return {};
      }
    }),
    setEditingPlayer: assign(({ context, event: e }) => {
      const event = e;
      const side = event.type === "user: stop editing player" ? event.side : getPlayerSide(event.playerId);
      if (side === "attack") {
        return {
          attack: {
            ...context.attack,
            editingPlayerId: event.type === "user: start editing player" ? "attacker" : void 0
          }
        };
      } else if (side === "defense") {
        return {
          defense: {
            ...context.defense,
            editingPlayerId: event.type === "user: stop editing player" ? void 0 : event.playerId
          }
        };
      } else {
        return {};
      }
    }),
    addOrUpdateGameEvent: assign(({ context, event: e }) => {
      const event = e;
      const gameEvent = {
        ...event.gameEvent,
        timestamp: Date.now(),
        userId: event.userId
      };
      return {
        events: produce(context.events, (events) => {
          const lastPlayerEvent = events.filter(isPlayerGameEvent).pop();
          if (lastPlayerEvent && !lastPlayerEvent.finalized) {
            events[events.indexOf(lastPlayerEvent)] = gameEvent;
          } else {
            events.push(gameEvent);
          }
        })
      };
    }),
    cancelGameEvent: assign(({ context }) => {
      return {
        events: produce(context.events, (events) => {
          const lastPlayerEvent = events.filter(isPlayerGameEvent).pop();
          if (lastPlayerEvent && !lastPlayerEvent.finalized) {
            events.splice(context.events.indexOf(lastPlayerEvent), 1);
          }
        })
      };
    }),
    rollbackGameEvent: assign(({ context, event: e }) => {
      const event = e;
      return {
        events: produce(context.events, (events) => {
          if (events[events.length - 1].type === event.gameEventType) {
            events.pop();
          }
        })
      };
    }),
    switchSides: assign(({ context, event: e }) => {
      const event = e;
      const userId = event.userId;
      return {
        users: produce(context.users, (users) => {
          const user = users.find((user2) => user2.id === userId);
          if (user) {
            user.side = user?.side === "attack" ? "defense" : "attack";
          }
        })
      };
    }),
    updatePlayer: assign(({ context, event: e }) => {
      const event = e;
      const playerId = event.playerId;
      if (isDefenderId(playerId)) {
        return {
          defense: produce(context.defense, (defense) => {
            const player = defense.defenders.find((player2) => player2.id === playerId);
            if (!player)
              throw new Error(`Player ${playerId} not found in context`);
            player.faceId = event.faceId;
            player.character = event.character;
            player.userId = event.playingUserId;
            player.isConfigured = true;
          })
        };
      } else {
        return {
          attack: produce(context.attack, (attack) => {
            attack.attacker.faceId = event.faceId;
            attack.attacker.character = event.character;
            attack.attacker.userId = event.playingUserId;
            attack.attacker.isConfigured = true;
          })
        };
      }
    }),
    updateUserConnectionState: assign(({ context, event: e }) => {
      const event = e;
      const existingUserIndex = context.users.findIndex((user) => user.id === event.userId);
      if (existingUserIndex !== -1) {
        return {
          users: produce(context.users, (users) => {
            users[existingUserIndex].isConnected = event.type === "user connected" || event.type === "user reconnected";
          })
        };
      } else {
        console.warn("Got a connection update for a user that has not joined", event.userId);
        return {};
      }
    }),
    storeNewUser: assign(({ context, event: e }) => {
      const event = e;
      const existingUser = context.users.find((user) => user.id === event.userId);
      if (!existingUser) {
        return {
          users: [
            ...context.users,
            {
              id: event.userId,
              name: event.userName,
              isAdmin: false,
              isConnected: false,
              side: "defense",
              isSideAssigned: false
            }
          ]
        };
      } else {
        console.warn("User already joined", event.userId);
        return {};
      }
    }),
    // sendUsersUpdate: ({ context }) => {
    //   sendMessageToUsers({
    //     gameId: context.gameId,
    //     message: {
    //       type: 'shared game context update',
    //       users: [...context.users],
    //     },
    //   })
    // },
    sendEmojiToOtherUsers: ({ context, event: e }) => {
      const event = e;
      sendMessageToUsers({
        gameId: context.gameId,
        message: {
          type: "show emoji",
          emoji: event.emoji,
          userId: event.userId
        },
        excludeUserIds: [event.userId]
      });
    },
    assignSide: assign(({ context, event: e }) => {
      const event = e;
      const userIndex = findUserIndex(event.otherUserId, context);
      if (userIndex === void 0)
        return {};
      return {
        users: produce(context.users, (users) => {
          const user = users[userIndex];
          user.side = event.side;
          user.isAdmin = event.userId === user.id ? true : event.isAdmin;
          user.isSideAssigned = true;
        })
      };
    })
  },
  guards: {
    isAdmin: ({ context, event }) => context.users.find((user) => user.id === event.userId)?.isAdmin ?? false,
    isAllowedToCancel: ({ context, event: e }) => {
      const event = e;
      const gameState = GameState.fromContext(context);
      return !!gameState.lastEvent && !gameState.lastEvent.finalized && userControlsPlayerId(event.userId, gameState.lastEvent.playerId, context);
    },
    isValidGameEvent: ({ context, event: e }) => {
      const event = e;
      const gameState = GameState.fromContext(context);
      if (event.gameEvent.type === "system") {
        return userIsAdmin(event.userId, context);
      }
      const activePlayer = gameState.activePlayer;
      if (!userControlsPlayer(event.userId, activePlayer, context))
        return false;
      if (activePlayer.id !== event.gameEvent.playerId)
        return false;
      if (gameState.nextEventType !== event.gameEvent.type)
        return false;
      const character = getCharacter(gameState.activePlayer.character);
      switch (event.gameEvent.type) {
        case "placement":
          break;
        case "move":
          if (!gameState.isValidMove(event.gameEvent.to))
            return false;
          break;
        case "reaction":
          if (event.gameEvent.finalized && event.gameEvent.useJoker === void 0)
            return false;
          break;
        case "action":
          switch (event.gameEvent.action) {
            case "collect":
              if (event.gameEvent.itemId === void 0 && event.gameEvent.finalized) {
                console.error("Finalized collect item must have an itemId");
                return false;
              }
              if (event.gameEvent.itemId) {
                const collectableItemIds = gameState.getItemsForCoordinate(gameState.activePlayerPosition).filter((item) => isItemIdOfSide(item.item.id, gameState.activeSide)).map((item) => item.item.id);
                if (!collectableItemIds.includes(event.gameEvent.itemId)) {
                  console.error("Tried to collect an item that is not collectable");
                  return false;
                }
              }
              break;
            case "attack": {
              if (!isAttackerId(activePlayer.id))
                return false;
              const position = event.gameEvent.position;
              if (!position && event.gameEvent.finalized) {
                return false;
              } else if (!position) {
                if (gameState.attackableStages.length === 0)
                  return false;
              } else if (!gameState.attackableStages.find((stage) => isEqual$1(stage.coordinate, position))) {
                return false;
              }
              break;
            }
            case "defend": {
              if (!isDefenderId(activePlayer.id))
                return false;
              const position = event.gameEvent.position;
              if (!isEqual$1(position, gameState.activePlayerPosition))
                return false;
              if (!gameState.canDefendStage)
                return false;
              break;
            }
            case "exchange-joker": {
              const itemId = event.gameEvent.itemId;
              if (!isAttackerId(activePlayer.id))
                return false;
              if (gameState.jokers <= 0)
                return false;
              if (!itemId && event.gameEvent.finalized)
                return false;
              if (itemId && !isAttackItemId(itemId))
                return false;
              break;
            }
            case "ask-question": {
              const question = event.gameEvent.question;
              if (!isDefenderId(activePlayer.id))
                return false;
              if (!question && event.gameEvent.finalized)
                return false;
              if (question === "has-collected-items" && !!findStageAt(event.gameEvent.position))
                return false;
              break;
            }
            case "exchange-digital-footprint": {
              if (!isDefenseCharacter(character))
                return false;
              if (character.ability !== "exchange-digital-footprint")
                return false;
              const itemId = event.gameEvent.item;
              if (!itemId && event.gameEvent.finalized)
                return false;
              if (itemId && (!isDefenseItemId(itemId) || itemId === "digital-footprint"))
                return false;
              if (gameState.defenseInventory["digital-footprint"] <= 0)
                return false;
              break;
            }
            case "is-attacking-stage": {
              if (!isDefenseCharacter(character))
                return false;
              if (character.ability !== "is-attacking-stage")
                return false;
              if (event.gameEvent.position) {
                if (!findStageAt(event.gameEvent.position))
                  return false;
                if (!isEqual$1(event.gameEvent.position, gameState.activePlayerPosition))
                  return false;
              }
              if (!event.gameEvent.position && event.gameEvent.finalized)
                return false;
              break;
            }
            case "is-next-to-attacker": {
              if (!isDefenseCharacter(character))
                return false;
              if (character.ability !== "is-next-to-attacker")
                return false;
              if (!event.gameEvent.position && event.gameEvent.finalized)
                return false;
              if (event.gameEvent.position) {
                if (!isEqual$1(event.gameEvent.position, gameState.activePlayerPosition))
                  return false;
              }
              break;
            }
            case "quarter-reveal": {
              if (!isDefenseCharacter(character))
                return false;
              if (character.ability !== "quarter-reveal")
                return false;
              break;
            }
          }
          break;
      }
      return true;
    },
    ...sharedGuards
  },
  actors: {
    sendSummary: fromPromise(async (context) => {
      await sendSummaryEmail(context.input.sharedContext);
    })
  }
});
const createGame = ({ host }) => {
  const id = shortUuid.generate();
  const machine2 = interpret(serverGameMachine, {
    input: { gameId: id, host }
  }).start();
  let prevSharedGameContext = void 0;
  machine2.subscribe({
    next: (state) => {
      const newSharedGameContext = getSharedGameContext(state.context);
      if (!isEqual$1(prevSharedGameContext, newSharedGameContext)) {
        prevSharedGameContext = cloneDeep(newSharedGameContext);
        sendMessageToUsers({
          gameId: id,
          message: {
            type: "shared game context update",
            sharedGameContext: newSharedGameContext
          }
        });
      }
      console.log("State:", state.value);
    },
    complete: () => console.log(`Game machine ${id} completed`),
    error: (error) => console.error(`
ERROR: `, error, "\n")
  });
  const game = { id, machine: machine2 };
  addGame(game);
  return game;
};
const sendMessageToMachine = (gameId, event) => {
  const game = getGame(gameId);
  if (!game) {
    console.error(`Game ${gameId} not found`);
    return;
  }
  game.machine.send(event);
};

export { sendMessageToUsers as a, createGame as c, getGlobalWebSocketServer as g, sendMessageToMachine as s };
//# sourceMappingURL=index4-1f29ed2f.js.map
