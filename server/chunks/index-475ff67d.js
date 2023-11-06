import { a as getAugmentedNamespace, g as getDefaultExportFromCjs } from './_commonjsHelpers-24198af3.js';
import require$$5 from 'crypto';

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    require$$5.randomFillSync(rnds8Pool);
    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

var REGEX = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

function validate(uuid) {
  return typeof uuid === 'string' && REGEX.test(uuid);
}

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!validate(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html

let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || rng)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || stringify(b);
}

function parse(uuid) {
  if (!validate(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
function v35 (name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = parse(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return stringify(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return require$$5.createHash('md5').update(bytes).digest();
}

const v3 = v35('v3', 0x30, md5);
var v3$1 = v3;

function v4(options, buf, offset) {
  options = options || {};
  const rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return stringify(rnds);
}

function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return require$$5.createHash('sha1').update(bytes).digest();
}

const v5 = v35('v5', 0x50, sha1);
var v5$1 = v5;

var nil = '00000000-0000-0000-0000-000000000000';

function version(uuid) {
  if (!validate(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

var esmNode = /*#__PURE__*/Object.freeze({
  __proto__: null,
  NIL: nil,
  parse: parse,
  stringify: stringify,
  v1: v1,
  v3: v3$1,
  v4: v4,
  v5: v5$1,
  validate: validate,
  version: version
});

var require$$0 = /*@__PURE__*/getAugmentedNamespace(esmNode);

var converter;
var hasRequiredConverter;

function requireConverter () {
	if (hasRequiredConverter) return converter;
	hasRequiredConverter = 1;

	/**
	 * Converter
	 *
	 * @param {string|Array} srcAlphabet
	 * @param {string|Array} dstAlphabet
	 * @constructor
	 */
	function Converter(srcAlphabet, dstAlphabet) {
	    if (!srcAlphabet || !dstAlphabet || !srcAlphabet.length || !dstAlphabet.length) {
	        throw new Error('Bad alphabet');
	    }
	    this.srcAlphabet = srcAlphabet;
	    this.dstAlphabet = dstAlphabet;
	}

	/**
	 * Convert number from source alphabet to destination alphabet
	 *
	 * @param {string|Array} number - number represented as a string or array of points
	 *
	 * @returns {string|Array}
	 */
	Converter.prototype.convert = function(number) {
	    var i, divide, newlen,
	    numberMap = {},
	    fromBase = this.srcAlphabet.length,
	    toBase = this.dstAlphabet.length,
	    length = number.length,
	    result = typeof number === 'string' ? '' : [];

	    if (!this.isValid(number)) {
	        throw new Error('Number "' + number + '" contains of non-alphabetic digits (' + this.srcAlphabet + ')');
	    }

	    if (this.srcAlphabet === this.dstAlphabet) {
	        return number;
	    }

	    for (i = 0; i < length; i++) {
	        numberMap[i] = this.srcAlphabet.indexOf(number[i]);
	    }
	    do {
	        divide = 0;
	        newlen = 0;
	        for (i = 0; i < length; i++) {
	            divide = divide * fromBase + numberMap[i];
	            if (divide >= toBase) {
	                numberMap[newlen++] = parseInt(divide / toBase, 10);
	                divide = divide % toBase;
	            } else if (newlen > 0) {
	                numberMap[newlen++] = 0;
	            }
	        }
	        length = newlen;
	        result = this.dstAlphabet.slice(divide, divide + 1).concat(result);
	    } while (newlen !== 0);

	    return result;
	};

	/**
	 * Valid number with source alphabet
	 *
	 * @param {number} number
	 *
	 * @returns {boolean}
	 */
	Converter.prototype.isValid = function(number) {
	    var i = 0;
	    for (; i < number.length; ++i) {
	        if (this.srcAlphabet.indexOf(number[i]) === -1) {
	            return false;
	        }
	    }
	    return true;
	};

	converter = Converter;
	return converter;
}

var anyBase_1;
var hasRequiredAnyBase;

function requireAnyBase () {
	if (hasRequiredAnyBase) return anyBase_1;
	hasRequiredAnyBase = 1;
	var Converter = requireConverter();

	/**
	 * Function get source and destination alphabet and return convert function
	 *
	 * @param {string|Array} srcAlphabet
	 * @param {string|Array} dstAlphabet
	 *
	 * @returns {function(number|Array)}
	 */
	function anyBase(srcAlphabet, dstAlphabet) {
	    var converter = new Converter(srcAlphabet, dstAlphabet);
	    /**
	     * Convert function
	     *
	     * @param {string|Array} number
	     *
	     * @return {string|Array} number
	     */
	    return function (number) {
	        return converter.convert(number);
	    }
	}
	anyBase.BIN = '01';
	anyBase.OCT = '01234567';
	anyBase.DEC = '0123456789';
	anyBase.HEX = '0123456789abcdef';

	anyBase_1 = anyBase;
	return anyBase_1;
}

/**
 * Created by Samuel on 6/4/2016.
 * Simple wrapper functions to produce shorter UUIDs for cookies, maybe everything?
 */

var shortUuid$1;
var hasRequiredShortUuid;

function requireShortUuid () {
	if (hasRequiredShortUuid) return shortUuid$1;
	hasRequiredShortUuid = 1;
	const { v4: uuidv4 } = require$$0;
	const anyBase = requireAnyBase();

	const flickrBase58 = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
	const cookieBase90 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!#$%&'()*+-./:<=>?@[]^_`{|}~";

	const baseOptions = {
	  consistentLength: true,
	};

	// A default generator, instantiated only if used.
	let toFlickr;

	/**
	 * Takes a UUID, strips the dashes, and translates.
	 * @param {string} longId
	 * @param {function(string)} translator
	 * @param {Object} [paddingParams]
	 * @returns {string}
	 */
	const shortenUUID = (longId, translator, paddingParams) => {
	  const translated = translator(longId.toLowerCase().replace(/-/g, ''));

	  if (!paddingParams || !paddingParams.consistentLength) return translated;

	  return translated.padStart(
	    paddingParams.shortIdLength,
	    paddingParams.paddingChar,
	  );
	};

	/**
	 * Translate back to hex and turn back into UUID format, with dashes
	 * @param {string} shortId
	 * @param {function(string)} translator
	 * @returns {string}
	 */
	const enlargeUUID = (shortId, translator) => {
	  const uu1 = translator(shortId).padStart(32, '0');

	  // Join the zero padding and the UUID and then slice it up with match
	  const m = uu1.match(/(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/);

	  // Accumulate the matches and join them.
	  return [m[1], m[2], m[3], m[4], m[5]].join('-');
	};

	// Calculate length for the shortened ID
	const getShortIdLength = (alphabetLength) => (
	  Math.ceil(Math.log(2 ** 128) / Math.log(alphabetLength)));

	shortUuid$1 = (() => {
	  /**
	   * @param {string} toAlphabet - Defaults to flickrBase58 if not provided
	   * @param {Object} [options]
	   *
	   * @returns {{new: (function()),
	   *  uuid: (function()),
	   *  fromUUID: (function(string)),
	   *  toUUID: (function(string)),
	   *  alphabet: (string)}}
	   */
	  const makeConvertor = (toAlphabet, options) => {
	    // Default to Flickr 58
	    const useAlphabet = toAlphabet || flickrBase58;

	    // Default to baseOptions
	    const selectedOptions = { ...baseOptions, ...options };

	    // Check alphabet for duplicate entries
	    if ([...new Set(Array.from(useAlphabet))].length !== useAlphabet.length) {
	      throw new Error('The provided Alphabet has duplicate characters resulting in unreliable results');
	    }

	    const shortIdLength = getShortIdLength(useAlphabet.length);

	    // Padding Params
	    const paddingParams = {
	      shortIdLength,
	      consistentLength: selectedOptions.consistentLength,
	      paddingChar: useAlphabet[0],
	    };

	    // UUIDs are in hex, so we translate to and from.
	    const fromHex = anyBase(anyBase.HEX, useAlphabet);
	    const toHex = anyBase(useAlphabet, anyBase.HEX);
	    const generate = () => shortenUUID(uuidv4(), fromHex, paddingParams);

	    const translator = {
	      new: generate,
	      generate,
	      uuid: uuidv4,
	      fromUUID: (uuid) => shortenUUID(uuid, fromHex, paddingParams),
	      toUUID: (shortUuid) => enlargeUUID(shortUuid, toHex),
	      alphabet: useAlphabet,
	      maxLength: shortIdLength,
	    };

	    Object.freeze(translator);

	    return translator;
	  };

	  // Expose the constants for other purposes.
	  makeConvertor.constants = {
	    flickrBase58,
	    cookieBase90,
	  };

	  // Expose the generic v4 UUID generator for convenience
	  makeConvertor.uuid = uuidv4;

	  // Provide a generic generator
	  makeConvertor.generate = () => {
	    if (!toFlickr) {
	      // Generate on first use;
	      toFlickr = makeConvertor(flickrBase58).generate;
	    }
	    return toFlickr();
	  };

	  return makeConvertor;
	})();
	return shortUuid$1;
}

var shortUuidExports = requireShortUuid();
var shortUuid = /*@__PURE__*/getDefaultExportFromCjs(shortUuidExports);

export { shortUuid as s };
//# sourceMappingURL=index-475ff67d.js.map
