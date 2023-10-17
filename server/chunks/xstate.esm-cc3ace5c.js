import { c as commonjsGlobal, g as getDefaultExportFromCjs } from './_commonjsHelpers-24198af3.js';
import { I as ITEMS, b as isDefenseItemId, i as isAttackItemId } from './items-426393ab.js';

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */

var _listCacheClear;
var hasRequired_listCacheClear;

function require_listCacheClear () {
	if (hasRequired_listCacheClear) return _listCacheClear;
	hasRequired_listCacheClear = 1;
	function listCacheClear() {
	  this.__data__ = [];
	  this.size = 0;
	}

	_listCacheClear = listCacheClear;
	return _listCacheClear;
}

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */

var eq_1;
var hasRequiredEq;

function requireEq () {
	if (hasRequiredEq) return eq_1;
	hasRequiredEq = 1;
	function eq(value, other) {
	  return value === other || (value !== value && other !== other);
	}

	eq_1 = eq;
	return eq_1;
}

var _assocIndexOf;
var hasRequired_assocIndexOf;

function require_assocIndexOf () {
	if (hasRequired_assocIndexOf) return _assocIndexOf;
	hasRequired_assocIndexOf = 1;
	var eq = requireEq();

	/**
	 * Gets the index at which the `key` is found in `array` of key-value pairs.
	 *
	 * @private
	 * @param {Array} array The array to inspect.
	 * @param {*} key The key to search for.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function assocIndexOf(array, key) {
	  var length = array.length;
	  while (length--) {
	    if (eq(array[length][0], key)) {
	      return length;
	    }
	  }
	  return -1;
	}

	_assocIndexOf = assocIndexOf;
	return _assocIndexOf;
}

var _listCacheDelete;
var hasRequired_listCacheDelete;

function require_listCacheDelete () {
	if (hasRequired_listCacheDelete) return _listCacheDelete;
	hasRequired_listCacheDelete = 1;
	var assocIndexOf = require_assocIndexOf();

	/** Used for built-in method references. */
	var arrayProto = Array.prototype;

	/** Built-in value references. */
	var splice = arrayProto.splice;

	/**
	 * Removes `key` and its value from the list cache.
	 *
	 * @private
	 * @name delete
	 * @memberOf ListCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function listCacheDelete(key) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);

	  if (index < 0) {
	    return false;
	  }
	  var lastIndex = data.length - 1;
	  if (index == lastIndex) {
	    data.pop();
	  } else {
	    splice.call(data, index, 1);
	  }
	  --this.size;
	  return true;
	}

	_listCacheDelete = listCacheDelete;
	return _listCacheDelete;
}

var _listCacheGet;
var hasRequired_listCacheGet;

function require_listCacheGet () {
	if (hasRequired_listCacheGet) return _listCacheGet;
	hasRequired_listCacheGet = 1;
	var assocIndexOf = require_assocIndexOf();

	/**
	 * Gets the list cache value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf ListCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function listCacheGet(key) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);

	  return index < 0 ? undefined : data[index][1];
	}

	_listCacheGet = listCacheGet;
	return _listCacheGet;
}

var _listCacheHas;
var hasRequired_listCacheHas;

function require_listCacheHas () {
	if (hasRequired_listCacheHas) return _listCacheHas;
	hasRequired_listCacheHas = 1;
	var assocIndexOf = require_assocIndexOf();

	/**
	 * Checks if a list cache value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf ListCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function listCacheHas(key) {
	  return assocIndexOf(this.__data__, key) > -1;
	}

	_listCacheHas = listCacheHas;
	return _listCacheHas;
}

var _listCacheSet;
var hasRequired_listCacheSet;

function require_listCacheSet () {
	if (hasRequired_listCacheSet) return _listCacheSet;
	hasRequired_listCacheSet = 1;
	var assocIndexOf = require_assocIndexOf();

	/**
	 * Sets the list cache `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf ListCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the list cache instance.
	 */
	function listCacheSet(key, value) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);

	  if (index < 0) {
	    ++this.size;
	    data.push([key, value]);
	  } else {
	    data[index][1] = value;
	  }
	  return this;
	}

	_listCacheSet = listCacheSet;
	return _listCacheSet;
}

var _ListCache;
var hasRequired_ListCache;

function require_ListCache () {
	if (hasRequired_ListCache) return _ListCache;
	hasRequired_ListCache = 1;
	var listCacheClear = require_listCacheClear(),
	    listCacheDelete = require_listCacheDelete(),
	    listCacheGet = require_listCacheGet(),
	    listCacheHas = require_listCacheHas(),
	    listCacheSet = require_listCacheSet();

	/**
	 * Creates an list cache object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function ListCache(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `ListCache`.
	ListCache.prototype.clear = listCacheClear;
	ListCache.prototype['delete'] = listCacheDelete;
	ListCache.prototype.get = listCacheGet;
	ListCache.prototype.has = listCacheHas;
	ListCache.prototype.set = listCacheSet;

	_ListCache = ListCache;
	return _ListCache;
}

var _stackClear;
var hasRequired_stackClear;

function require_stackClear () {
	if (hasRequired_stackClear) return _stackClear;
	hasRequired_stackClear = 1;
	var ListCache = require_ListCache();

	/**
	 * Removes all key-value entries from the stack.
	 *
	 * @private
	 * @name clear
	 * @memberOf Stack
	 */
	function stackClear() {
	  this.__data__ = new ListCache;
	  this.size = 0;
	}

	_stackClear = stackClear;
	return _stackClear;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */

var _stackDelete;
var hasRequired_stackDelete;

function require_stackDelete () {
	if (hasRequired_stackDelete) return _stackDelete;
	hasRequired_stackDelete = 1;
	function stackDelete(key) {
	  var data = this.__data__,
	      result = data['delete'](key);

	  this.size = data.size;
	  return result;
	}

	_stackDelete = stackDelete;
	return _stackDelete;
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */

var _stackGet;
var hasRequired_stackGet;

function require_stackGet () {
	if (hasRequired_stackGet) return _stackGet;
	hasRequired_stackGet = 1;
	function stackGet(key) {
	  return this.__data__.get(key);
	}

	_stackGet = stackGet;
	return _stackGet;
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */

var _stackHas;
var hasRequired_stackHas;

function require_stackHas () {
	if (hasRequired_stackHas) return _stackHas;
	hasRequired_stackHas = 1;
	function stackHas(key) {
	  return this.__data__.has(key);
	}

	_stackHas = stackHas;
	return _stackHas;
}

/** Detect free variable `global` from Node.js. */

var _freeGlobal;
var hasRequired_freeGlobal;

function require_freeGlobal () {
	if (hasRequired_freeGlobal) return _freeGlobal;
	hasRequired_freeGlobal = 1;
	var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

	_freeGlobal = freeGlobal;
	return _freeGlobal;
}

var _root;
var hasRequired_root;

function require_root () {
	if (hasRequired_root) return _root;
	hasRequired_root = 1;
	var freeGlobal = require_freeGlobal();

	/** Detect free variable `self`. */
	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

	/** Used as a reference to the global object. */
	var root = freeGlobal || freeSelf || Function('return this')();

	_root = root;
	return _root;
}

var _Symbol;
var hasRequired_Symbol;

function require_Symbol () {
	if (hasRequired_Symbol) return _Symbol;
	hasRequired_Symbol = 1;
	var root = require_root();

	/** Built-in value references. */
	var Symbol = root.Symbol;

	_Symbol = Symbol;
	return _Symbol;
}

var _getRawTag;
var hasRequired_getRawTag;

function require_getRawTag () {
	if (hasRequired_getRawTag) return _getRawTag;
	hasRequired_getRawTag = 1;
	var Symbol = require_Symbol();

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto.toString;

	/** Built-in value references. */
	var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

	/**
	 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the raw `toStringTag`.
	 */
	function getRawTag(value) {
	  var isOwn = hasOwnProperty.call(value, symToStringTag),
	      tag = value[symToStringTag];

	  try {
	    value[symToStringTag] = undefined;
	    var unmasked = true;
	  } catch (e) {}

	  var result = nativeObjectToString.call(value);
	  if (unmasked) {
	    if (isOwn) {
	      value[symToStringTag] = tag;
	    } else {
	      delete value[symToStringTag];
	    }
	  }
	  return result;
	}

	_getRawTag = getRawTag;
	return _getRawTag;
}

/** Used for built-in method references. */

var _objectToString;
var hasRequired_objectToString;

function require_objectToString () {
	if (hasRequired_objectToString) return _objectToString;
	hasRequired_objectToString = 1;
	var objectProto = Object.prototype;

	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var nativeObjectToString = objectProto.toString;

	/**
	 * Converts `value` to a string using `Object.prototype.toString`.
	 *
	 * @private
	 * @param {*} value The value to convert.
	 * @returns {string} Returns the converted string.
	 */
	function objectToString(value) {
	  return nativeObjectToString.call(value);
	}

	_objectToString = objectToString;
	return _objectToString;
}

var _baseGetTag;
var hasRequired_baseGetTag;

function require_baseGetTag () {
	if (hasRequired_baseGetTag) return _baseGetTag;
	hasRequired_baseGetTag = 1;
	var Symbol = require_Symbol(),
	    getRawTag = require_getRawTag(),
	    objectToString = require_objectToString();

	/** `Object#toString` result references. */
	var nullTag = '[object Null]',
	    undefinedTag = '[object Undefined]';

	/** Built-in value references. */
	var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

	/**
	 * The base implementation of `getTag` without fallbacks for buggy environments.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	function baseGetTag(value) {
	  if (value == null) {
	    return value === undefined ? undefinedTag : nullTag;
	  }
	  return (symToStringTag && symToStringTag in Object(value))
	    ? getRawTag(value)
	    : objectToString(value);
	}

	_baseGetTag = baseGetTag;
	return _baseGetTag;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */

var isObject_1;
var hasRequiredIsObject;

function requireIsObject () {
	if (hasRequiredIsObject) return isObject_1;
	hasRequiredIsObject = 1;
	function isObject(value) {
	  var type = typeof value;
	  return value != null && (type == 'object' || type == 'function');
	}

	isObject_1 = isObject;
	return isObject_1;
}

var isFunction_1;
var hasRequiredIsFunction;

function requireIsFunction () {
	if (hasRequiredIsFunction) return isFunction_1;
	hasRequiredIsFunction = 1;
	var baseGetTag = require_baseGetTag(),
	    isObject = requireIsObject();

	/** `Object#toString` result references. */
	var asyncTag = '[object AsyncFunction]',
	    funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]',
	    proxyTag = '[object Proxy]';

	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  if (!isObject(value)) {
	    return false;
	  }
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 9 which returns 'object' for typed arrays and other constructors.
	  var tag = baseGetTag(value);
	  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
	}

	isFunction_1 = isFunction;
	return isFunction_1;
}

var _coreJsData;
var hasRequired_coreJsData;

function require_coreJsData () {
	if (hasRequired_coreJsData) return _coreJsData;
	hasRequired_coreJsData = 1;
	var root = require_root();

	/** Used to detect overreaching core-js shims. */
	var coreJsData = root['__core-js_shared__'];

	_coreJsData = coreJsData;
	return _coreJsData;
}

var _isMasked;
var hasRequired_isMasked;

function require_isMasked () {
	if (hasRequired_isMasked) return _isMasked;
	hasRequired_isMasked = 1;
	var coreJsData = require_coreJsData();

	/** Used to detect methods masquerading as native. */
	var maskSrcKey = (function() {
	  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
	  return uid ? ('Symbol(src)_1.' + uid) : '';
	}());

	/**
	 * Checks if `func` has its source masked.
	 *
	 * @private
	 * @param {Function} func The function to check.
	 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
	 */
	function isMasked(func) {
	  return !!maskSrcKey && (maskSrcKey in func);
	}

	_isMasked = isMasked;
	return _isMasked;
}

/** Used for built-in method references. */

var _toSource;
var hasRequired_toSource;

function require_toSource () {
	if (hasRequired_toSource) return _toSource;
	hasRequired_toSource = 1;
	var funcProto = Function.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;

	/**
	 * Converts `func` to its source code.
	 *
	 * @private
	 * @param {Function} func The function to convert.
	 * @returns {string} Returns the source code.
	 */
	function toSource(func) {
	  if (func != null) {
	    try {
	      return funcToString.call(func);
	    } catch (e) {}
	    try {
	      return (func + '');
	    } catch (e) {}
	  }
	  return '';
	}

	_toSource = toSource;
	return _toSource;
}

var _baseIsNative;
var hasRequired_baseIsNative;

function require_baseIsNative () {
	if (hasRequired_baseIsNative) return _baseIsNative;
	hasRequired_baseIsNative = 1;
	var isFunction = requireIsFunction(),
	    isMasked = require_isMasked(),
	    isObject = requireIsObject(),
	    toSource = require_toSource();

	/**
	 * Used to match `RegExp`
	 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
	 */
	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

	/** Used to detect host constructors (Safari). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;

	/** Used for built-in method references. */
	var funcProto = Function.prototype,
	    objectProto = Object.prototype;

	/** Used to resolve the decompiled source of functions. */
	var funcToString = funcProto.toString;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);

	/**
	 * The base implementation of `_.isNative` without bad shim checks.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function,
	 *  else `false`.
	 */
	function baseIsNative(value) {
	  if (!isObject(value) || isMasked(value)) {
	    return false;
	  }
	  var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
	  return pattern.test(toSource(value));
	}

	_baseIsNative = baseIsNative;
	return _baseIsNative;
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */

var _getValue;
var hasRequired_getValue;

function require_getValue () {
	if (hasRequired_getValue) return _getValue;
	hasRequired_getValue = 1;
	function getValue(object, key) {
	  return object == null ? undefined : object[key];
	}

	_getValue = getValue;
	return _getValue;
}

var _getNative;
var hasRequired_getNative;

function require_getNative () {
	if (hasRequired_getNative) return _getNative;
	hasRequired_getNative = 1;
	var baseIsNative = require_baseIsNative(),
	    getValue = require_getValue();

	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = getValue(object, key);
	  return baseIsNative(value) ? value : undefined;
	}

	_getNative = getNative;
	return _getNative;
}

var _Map;
var hasRequired_Map;

function require_Map () {
	if (hasRequired_Map) return _Map;
	hasRequired_Map = 1;
	var getNative = require_getNative(),
	    root = require_root();

	/* Built-in method references that are verified to be native. */
	var Map = getNative(root, 'Map');

	_Map = Map;
	return _Map;
}

var _nativeCreate;
var hasRequired_nativeCreate;

function require_nativeCreate () {
	if (hasRequired_nativeCreate) return _nativeCreate;
	hasRequired_nativeCreate = 1;
	var getNative = require_getNative();

	/* Built-in method references that are verified to be native. */
	var nativeCreate = getNative(Object, 'create');

	_nativeCreate = nativeCreate;
	return _nativeCreate;
}

var _hashClear;
var hasRequired_hashClear;

function require_hashClear () {
	if (hasRequired_hashClear) return _hashClear;
	hasRequired_hashClear = 1;
	var nativeCreate = require_nativeCreate();

	/**
	 * Removes all key-value entries from the hash.
	 *
	 * @private
	 * @name clear
	 * @memberOf Hash
	 */
	function hashClear() {
	  this.__data__ = nativeCreate ? nativeCreate(null) : {};
	  this.size = 0;
	}

	_hashClear = hashClear;
	return _hashClear;
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */

var _hashDelete;
var hasRequired_hashDelete;

function require_hashDelete () {
	if (hasRequired_hashDelete) return _hashDelete;
	hasRequired_hashDelete = 1;
	function hashDelete(key) {
	  var result = this.has(key) && delete this.__data__[key];
	  this.size -= result ? 1 : 0;
	  return result;
	}

	_hashDelete = hashDelete;
	return _hashDelete;
}

var _hashGet;
var hasRequired_hashGet;

function require_hashGet () {
	if (hasRequired_hashGet) return _hashGet;
	hasRequired_hashGet = 1;
	var nativeCreate = require_nativeCreate();

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Gets the hash value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Hash
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function hashGet(key) {
	  var data = this.__data__;
	  if (nativeCreate) {
	    var result = data[key];
	    return result === HASH_UNDEFINED ? undefined : result;
	  }
	  return hasOwnProperty.call(data, key) ? data[key] : undefined;
	}

	_hashGet = hashGet;
	return _hashGet;
}

var _hashHas;
var hasRequired_hashHas;

function require_hashHas () {
	if (hasRequired_hashHas) return _hashHas;
	hasRequired_hashHas = 1;
	var nativeCreate = require_nativeCreate();

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Checks if a hash value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Hash
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function hashHas(key) {
	  var data = this.__data__;
	  return nativeCreate ? (data[key] !== undefined) : hasOwnProperty.call(data, key);
	}

	_hashHas = hashHas;
	return _hashHas;
}

var _hashSet;
var hasRequired_hashSet;

function require_hashSet () {
	if (hasRequired_hashSet) return _hashSet;
	hasRequired_hashSet = 1;
	var nativeCreate = require_nativeCreate();

	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';

	/**
	 * Sets the hash `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Hash
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the hash instance.
	 */
	function hashSet(key, value) {
	  var data = this.__data__;
	  this.size += this.has(key) ? 0 : 1;
	  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
	  return this;
	}

	_hashSet = hashSet;
	return _hashSet;
}

var _Hash;
var hasRequired_Hash;

function require_Hash () {
	if (hasRequired_Hash) return _Hash;
	hasRequired_Hash = 1;
	var hashClear = require_hashClear(),
	    hashDelete = require_hashDelete(),
	    hashGet = require_hashGet(),
	    hashHas = require_hashHas(),
	    hashSet = require_hashSet();

	/**
	 * Creates a hash object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Hash(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `Hash`.
	Hash.prototype.clear = hashClear;
	Hash.prototype['delete'] = hashDelete;
	Hash.prototype.get = hashGet;
	Hash.prototype.has = hashHas;
	Hash.prototype.set = hashSet;

	_Hash = Hash;
	return _Hash;
}

var _mapCacheClear;
var hasRequired_mapCacheClear;

function require_mapCacheClear () {
	if (hasRequired_mapCacheClear) return _mapCacheClear;
	hasRequired_mapCacheClear = 1;
	var Hash = require_Hash(),
	    ListCache = require_ListCache(),
	    Map = require_Map();

	/**
	 * Removes all key-value entries from the map.
	 *
	 * @private
	 * @name clear
	 * @memberOf MapCache
	 */
	function mapCacheClear() {
	  this.size = 0;
	  this.__data__ = {
	    'hash': new Hash,
	    'map': new (Map || ListCache),
	    'string': new Hash
	  };
	}

	_mapCacheClear = mapCacheClear;
	return _mapCacheClear;
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */

var _isKeyable;
var hasRequired_isKeyable;

function require_isKeyable () {
	if (hasRequired_isKeyable) return _isKeyable;
	hasRequired_isKeyable = 1;
	function isKeyable(value) {
	  var type = typeof value;
	  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
	    ? (value !== '__proto__')
	    : (value === null);
	}

	_isKeyable = isKeyable;
	return _isKeyable;
}

var _getMapData;
var hasRequired_getMapData;

function require_getMapData () {
	if (hasRequired_getMapData) return _getMapData;
	hasRequired_getMapData = 1;
	var isKeyable = require_isKeyable();

	/**
	 * Gets the data for `map`.
	 *
	 * @private
	 * @param {Object} map The map to query.
	 * @param {string} key The reference key.
	 * @returns {*} Returns the map data.
	 */
	function getMapData(map, key) {
	  var data = map.__data__;
	  return isKeyable(key)
	    ? data[typeof key == 'string' ? 'string' : 'hash']
	    : data.map;
	}

	_getMapData = getMapData;
	return _getMapData;
}

var _mapCacheDelete;
var hasRequired_mapCacheDelete;

function require_mapCacheDelete () {
	if (hasRequired_mapCacheDelete) return _mapCacheDelete;
	hasRequired_mapCacheDelete = 1;
	var getMapData = require_getMapData();

	/**
	 * Removes `key` and its value from the map.
	 *
	 * @private
	 * @name delete
	 * @memberOf MapCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function mapCacheDelete(key) {
	  var result = getMapData(this, key)['delete'](key);
	  this.size -= result ? 1 : 0;
	  return result;
	}

	_mapCacheDelete = mapCacheDelete;
	return _mapCacheDelete;
}

var _mapCacheGet;
var hasRequired_mapCacheGet;

function require_mapCacheGet () {
	if (hasRequired_mapCacheGet) return _mapCacheGet;
	hasRequired_mapCacheGet = 1;
	var getMapData = require_getMapData();

	/**
	 * Gets the map value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf MapCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function mapCacheGet(key) {
	  return getMapData(this, key).get(key);
	}

	_mapCacheGet = mapCacheGet;
	return _mapCacheGet;
}

var _mapCacheHas;
var hasRequired_mapCacheHas;

function require_mapCacheHas () {
	if (hasRequired_mapCacheHas) return _mapCacheHas;
	hasRequired_mapCacheHas = 1;
	var getMapData = require_getMapData();

	/**
	 * Checks if a map value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf MapCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function mapCacheHas(key) {
	  return getMapData(this, key).has(key);
	}

	_mapCacheHas = mapCacheHas;
	return _mapCacheHas;
}

var _mapCacheSet;
var hasRequired_mapCacheSet;

function require_mapCacheSet () {
	if (hasRequired_mapCacheSet) return _mapCacheSet;
	hasRequired_mapCacheSet = 1;
	var getMapData = require_getMapData();

	/**
	 * Sets the map `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf MapCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the map cache instance.
	 */
	function mapCacheSet(key, value) {
	  var data = getMapData(this, key),
	      size = data.size;

	  data.set(key, value);
	  this.size += data.size == size ? 0 : 1;
	  return this;
	}

	_mapCacheSet = mapCacheSet;
	return _mapCacheSet;
}

var _MapCache;
var hasRequired_MapCache;

function require_MapCache () {
	if (hasRequired_MapCache) return _MapCache;
	hasRequired_MapCache = 1;
	var mapCacheClear = require_mapCacheClear(),
	    mapCacheDelete = require_mapCacheDelete(),
	    mapCacheGet = require_mapCacheGet(),
	    mapCacheHas = require_mapCacheHas(),
	    mapCacheSet = require_mapCacheSet();

	/**
	 * Creates a map cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function MapCache(entries) {
	  var index = -1,
	      length = entries == null ? 0 : entries.length;

	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}

	// Add methods to `MapCache`.
	MapCache.prototype.clear = mapCacheClear;
	MapCache.prototype['delete'] = mapCacheDelete;
	MapCache.prototype.get = mapCacheGet;
	MapCache.prototype.has = mapCacheHas;
	MapCache.prototype.set = mapCacheSet;

	_MapCache = MapCache;
	return _MapCache;
}

var _stackSet;
var hasRequired_stackSet;

function require_stackSet () {
	if (hasRequired_stackSet) return _stackSet;
	hasRequired_stackSet = 1;
	var ListCache = require_ListCache(),
	    Map = require_Map(),
	    MapCache = require_MapCache();

	/** Used as the size to enable large array optimizations. */
	var LARGE_ARRAY_SIZE = 200;

	/**
	 * Sets the stack `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Stack
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the stack cache instance.
	 */
	function stackSet(key, value) {
	  var data = this.__data__;
	  if (data instanceof ListCache) {
	    var pairs = data.__data__;
	    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
	      pairs.push([key, value]);
	      this.size = ++data.size;
	      return this;
	    }
	    data = this.__data__ = new MapCache(pairs);
	  }
	  data.set(key, value);
	  this.size = data.size;
	  return this;
	}

	_stackSet = stackSet;
	return _stackSet;
}

var _Stack;
var hasRequired_Stack;

function require_Stack () {
	if (hasRequired_Stack) return _Stack;
	hasRequired_Stack = 1;
	var ListCache = require_ListCache(),
	    stackClear = require_stackClear(),
	    stackDelete = require_stackDelete(),
	    stackGet = require_stackGet(),
	    stackHas = require_stackHas(),
	    stackSet = require_stackSet();

	/**
	 * Creates a stack cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Stack(entries) {
	  var data = this.__data__ = new ListCache(entries);
	  this.size = data.size;
	}

	// Add methods to `Stack`.
	Stack.prototype.clear = stackClear;
	Stack.prototype['delete'] = stackDelete;
	Stack.prototype.get = stackGet;
	Stack.prototype.has = stackHas;
	Stack.prototype.set = stackSet;

	_Stack = Stack;
	return _Stack;
}

/** Used to stand-in for `undefined` hash values. */

var _setCacheAdd;
var hasRequired_setCacheAdd;

function require_setCacheAdd () {
	if (hasRequired_setCacheAdd) return _setCacheAdd;
	hasRequired_setCacheAdd = 1;
	var HASH_UNDEFINED = '__lodash_hash_undefined__';

	/**
	 * Adds `value` to the array cache.
	 *
	 * @private
	 * @name add
	 * @memberOf SetCache
	 * @alias push
	 * @param {*} value The value to cache.
	 * @returns {Object} Returns the cache instance.
	 */
	function setCacheAdd(value) {
	  this.__data__.set(value, HASH_UNDEFINED);
	  return this;
	}

	_setCacheAdd = setCacheAdd;
	return _setCacheAdd;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */

var _setCacheHas;
var hasRequired_setCacheHas;

function require_setCacheHas () {
	if (hasRequired_setCacheHas) return _setCacheHas;
	hasRequired_setCacheHas = 1;
	function setCacheHas(value) {
	  return this.__data__.has(value);
	}

	_setCacheHas = setCacheHas;
	return _setCacheHas;
}

var _SetCache;
var hasRequired_SetCache;

function require_SetCache () {
	if (hasRequired_SetCache) return _SetCache;
	hasRequired_SetCache = 1;
	var MapCache = require_MapCache(),
	    setCacheAdd = require_setCacheAdd(),
	    setCacheHas = require_setCacheHas();

	/**
	 *
	 * Creates an array cache object to store unique values.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [values] The values to cache.
	 */
	function SetCache(values) {
	  var index = -1,
	      length = values == null ? 0 : values.length;

	  this.__data__ = new MapCache;
	  while (++index < length) {
	    this.add(values[index]);
	  }
	}

	// Add methods to `SetCache`.
	SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
	SetCache.prototype.has = setCacheHas;

	_SetCache = SetCache;
	return _SetCache;
}

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */

var _arraySome;
var hasRequired_arraySome;

function require_arraySome () {
	if (hasRequired_arraySome) return _arraySome;
	hasRequired_arraySome = 1;
	function arraySome(array, predicate) {
	  var index = -1,
	      length = array == null ? 0 : array.length;

	  while (++index < length) {
	    if (predicate(array[index], index, array)) {
	      return true;
	    }
	  }
	  return false;
	}

	_arraySome = arraySome;
	return _arraySome;
}

/**
 * Checks if a `cache` value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */

var _cacheHas;
var hasRequired_cacheHas;

function require_cacheHas () {
	if (hasRequired_cacheHas) return _cacheHas;
	hasRequired_cacheHas = 1;
	function cacheHas(cache, key) {
	  return cache.has(key);
	}

	_cacheHas = cacheHas;
	return _cacheHas;
}

var _equalArrays;
var hasRequired_equalArrays;

function require_equalArrays () {
	if (hasRequired_equalArrays) return _equalArrays;
	hasRequired_equalArrays = 1;
	var SetCache = require_SetCache(),
	    arraySome = require_arraySome(),
	    cacheHas = require_cacheHas();

	/** Used to compose bitmasks for value comparisons. */
	var COMPARE_PARTIAL_FLAG = 1,
	    COMPARE_UNORDERED_FLAG = 2;

	/**
	 * A specialized version of `baseIsEqualDeep` for arrays with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Array} array The array to compare.
	 * @param {Array} other The other array to compare.
	 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
	 * @param {Function} customizer The function to customize comparisons.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Object} stack Tracks traversed `array` and `other` objects.
	 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
	 */
	function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
	  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
	      arrLength = array.length,
	      othLength = other.length;

	  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
	    return false;
	  }
	  // Check that cyclic values are equal.
	  var arrStacked = stack.get(array);
	  var othStacked = stack.get(other);
	  if (arrStacked && othStacked) {
	    return arrStacked == other && othStacked == array;
	  }
	  var index = -1,
	      result = true,
	      seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

	  stack.set(array, other);
	  stack.set(other, array);

	  // Ignore non-index properties.
	  while (++index < arrLength) {
	    var arrValue = array[index],
	        othValue = other[index];

	    if (customizer) {
	      var compared = isPartial
	        ? customizer(othValue, arrValue, index, other, array, stack)
	        : customizer(arrValue, othValue, index, array, other, stack);
	    }
	    if (compared !== undefined) {
	      if (compared) {
	        continue;
	      }
	      result = false;
	      break;
	    }
	    // Recursively compare arrays (susceptible to call stack limits).
	    if (seen) {
	      if (!arraySome(other, function(othValue, othIndex) {
	            if (!cacheHas(seen, othIndex) &&
	                (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
	              return seen.push(othIndex);
	            }
	          })) {
	        result = false;
	        break;
	      }
	    } else if (!(
	          arrValue === othValue ||
	            equalFunc(arrValue, othValue, bitmask, customizer, stack)
	        )) {
	      result = false;
	      break;
	    }
	  }
	  stack['delete'](array);
	  stack['delete'](other);
	  return result;
	}

	_equalArrays = equalArrays;
	return _equalArrays;
}

var _Uint8Array;
var hasRequired_Uint8Array;

function require_Uint8Array () {
	if (hasRequired_Uint8Array) return _Uint8Array;
	hasRequired_Uint8Array = 1;
	var root = require_root();

	/** Built-in value references. */
	var Uint8Array = root.Uint8Array;

	_Uint8Array = Uint8Array;
	return _Uint8Array;
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */

var _mapToArray;
var hasRequired_mapToArray;

function require_mapToArray () {
	if (hasRequired_mapToArray) return _mapToArray;
	hasRequired_mapToArray = 1;
	function mapToArray(map) {
	  var index = -1,
	      result = Array(map.size);

	  map.forEach(function(value, key) {
	    result[++index] = [key, value];
	  });
	  return result;
	}

	_mapToArray = mapToArray;
	return _mapToArray;
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */

var _setToArray;
var hasRequired_setToArray;

function require_setToArray () {
	if (hasRequired_setToArray) return _setToArray;
	hasRequired_setToArray = 1;
	function setToArray(set) {
	  var index = -1,
	      result = Array(set.size);

	  set.forEach(function(value) {
	    result[++index] = value;
	  });
	  return result;
	}

	_setToArray = setToArray;
	return _setToArray;
}

var _equalByTag;
var hasRequired_equalByTag;

function require_equalByTag () {
	if (hasRequired_equalByTag) return _equalByTag;
	hasRequired_equalByTag = 1;
	var Symbol = require_Symbol(),
	    Uint8Array = require_Uint8Array(),
	    eq = requireEq(),
	    equalArrays = require_equalArrays(),
	    mapToArray = require_mapToArray(),
	    setToArray = require_setToArray();

	/** Used to compose bitmasks for value comparisons. */
	var COMPARE_PARTIAL_FLAG = 1,
	    COMPARE_UNORDERED_FLAG = 2;

	/** `Object#toString` result references. */
	var boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
	    symbolTag = '[object Symbol]';

	var arrayBufferTag = '[object ArrayBuffer]',
	    dataViewTag = '[object DataView]';

	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol ? Symbol.prototype : undefined,
	    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined;

	/**
	 * A specialized version of `baseIsEqualDeep` for comparing objects of
	 * the same `toStringTag`.
	 *
	 * **Note:** This function only supports comparing values with tags of
	 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {string} tag The `toStringTag` of the objects to compare.
	 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
	 * @param {Function} customizer The function to customize comparisons.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Object} stack Tracks traversed `object` and `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
	  switch (tag) {
	    case dataViewTag:
	      if ((object.byteLength != other.byteLength) ||
	          (object.byteOffset != other.byteOffset)) {
	        return false;
	      }
	      object = object.buffer;
	      other = other.buffer;

	    case arrayBufferTag:
	      if ((object.byteLength != other.byteLength) ||
	          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
	        return false;
	      }
	      return true;

	    case boolTag:
	    case dateTag:
	    case numberTag:
	      // Coerce booleans to `1` or `0` and dates to milliseconds.
	      // Invalid dates are coerced to `NaN`.
	      return eq(+object, +other);

	    case errorTag:
	      return object.name == other.name && object.message == other.message;

	    case regexpTag:
	    case stringTag:
	      // Coerce regexes to strings and treat strings, primitives and objects,
	      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
	      // for more details.
	      return object == (other + '');

	    case mapTag:
	      var convert = mapToArray;

	    case setTag:
	      var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
	      convert || (convert = setToArray);

	      if (object.size != other.size && !isPartial) {
	        return false;
	      }
	      // Assume cyclic values are equal.
	      var stacked = stack.get(object);
	      if (stacked) {
	        return stacked == other;
	      }
	      bitmask |= COMPARE_UNORDERED_FLAG;

	      // Recursively compare objects (susceptible to call stack limits).
	      stack.set(object, other);
	      var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
	      stack['delete'](object);
	      return result;

	    case symbolTag:
	      if (symbolValueOf) {
	        return symbolValueOf.call(object) == symbolValueOf.call(other);
	      }
	  }
	  return false;
	}

	_equalByTag = equalByTag;
	return _equalByTag;
}

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */

var _arrayPush;
var hasRequired_arrayPush;

function require_arrayPush () {
	if (hasRequired_arrayPush) return _arrayPush;
	hasRequired_arrayPush = 1;
	function arrayPush(array, values) {
	  var index = -1,
	      length = values.length,
	      offset = array.length;

	  while (++index < length) {
	    array[offset + index] = values[index];
	  }
	  return array;
	}

	_arrayPush = arrayPush;
	return _arrayPush;
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */

var isArray_1;
var hasRequiredIsArray;

function requireIsArray () {
	if (hasRequiredIsArray) return isArray_1;
	hasRequiredIsArray = 1;
	var isArray = Array.isArray;

	isArray_1 = isArray;
	return isArray_1;
}

var _baseGetAllKeys;
var hasRequired_baseGetAllKeys;

function require_baseGetAllKeys () {
	if (hasRequired_baseGetAllKeys) return _baseGetAllKeys;
	hasRequired_baseGetAllKeys = 1;
	var arrayPush = require_arrayPush(),
	    isArray = requireIsArray();

	/**
	 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
	 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
	 * symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Function} keysFunc The function to get the keys of `object`.
	 * @param {Function} symbolsFunc The function to get the symbols of `object`.
	 * @returns {Array} Returns the array of property names and symbols.
	 */
	function baseGetAllKeys(object, keysFunc, symbolsFunc) {
	  var result = keysFunc(object);
	  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
	}

	_baseGetAllKeys = baseGetAllKeys;
	return _baseGetAllKeys;
}

/**
 * A specialized version of `_.filter` for arrays without support for
 * iteratee shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */

var _arrayFilter;
var hasRequired_arrayFilter;

function require_arrayFilter () {
	if (hasRequired_arrayFilter) return _arrayFilter;
	hasRequired_arrayFilter = 1;
	function arrayFilter(array, predicate) {
	  var index = -1,
	      length = array == null ? 0 : array.length,
	      resIndex = 0,
	      result = [];

	  while (++index < length) {
	    var value = array[index];
	    if (predicate(value, index, array)) {
	      result[resIndex++] = value;
	    }
	  }
	  return result;
	}

	_arrayFilter = arrayFilter;
	return _arrayFilter;
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */

var stubArray_1;
var hasRequiredStubArray;

function requireStubArray () {
	if (hasRequiredStubArray) return stubArray_1;
	hasRequiredStubArray = 1;
	function stubArray() {
	  return [];
	}

	stubArray_1 = stubArray;
	return stubArray_1;
}

var _getSymbols;
var hasRequired_getSymbols;

function require_getSymbols () {
	if (hasRequired_getSymbols) return _getSymbols;
	hasRequired_getSymbols = 1;
	var arrayFilter = require_arrayFilter(),
	    stubArray = requireStubArray();

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Built-in value references. */
	var propertyIsEnumerable = objectProto.propertyIsEnumerable;

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeGetSymbols = Object.getOwnPropertySymbols;

	/**
	 * Creates an array of the own enumerable symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of symbols.
	 */
	var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
	  if (object == null) {
	    return [];
	  }
	  object = Object(object);
	  return arrayFilter(nativeGetSymbols(object), function(symbol) {
	    return propertyIsEnumerable.call(object, symbol);
	  });
	};

	_getSymbols = getSymbols;
	return _getSymbols;
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */

var _baseTimes;
var hasRequired_baseTimes;

function require_baseTimes () {
	if (hasRequired_baseTimes) return _baseTimes;
	hasRequired_baseTimes = 1;
	function baseTimes(n, iteratee) {
	  var index = -1,
	      result = Array(n);

	  while (++index < n) {
	    result[index] = iteratee(index);
	  }
	  return result;
	}

	_baseTimes = baseTimes;
	return _baseTimes;
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */

var isObjectLike_1;
var hasRequiredIsObjectLike;

function requireIsObjectLike () {
	if (hasRequiredIsObjectLike) return isObjectLike_1;
	hasRequiredIsObjectLike = 1;
	function isObjectLike(value) {
	  return value != null && typeof value == 'object';
	}

	isObjectLike_1 = isObjectLike;
	return isObjectLike_1;
}

var _baseIsArguments;
var hasRequired_baseIsArguments;

function require_baseIsArguments () {
	if (hasRequired_baseIsArguments) return _baseIsArguments;
	hasRequired_baseIsArguments = 1;
	var baseGetTag = require_baseGetTag(),
	    isObjectLike = requireIsObjectLike();

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]';

	/**
	 * The base implementation of `_.isArguments`.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 */
	function baseIsArguments(value) {
	  return isObjectLike(value) && baseGetTag(value) == argsTag;
	}

	_baseIsArguments = baseIsArguments;
	return _baseIsArguments;
}

var isArguments_1;
var hasRequiredIsArguments;

function requireIsArguments () {
	if (hasRequiredIsArguments) return isArguments_1;
	hasRequiredIsArguments = 1;
	var baseIsArguments = require_baseIsArguments(),
	    isObjectLike = requireIsObjectLike();

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/** Built-in value references. */
	var propertyIsEnumerable = objectProto.propertyIsEnumerable;

	/**
	 * Checks if `value` is likely an `arguments` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
	 *  else `false`.
	 * @example
	 *
	 * _.isArguments(function() { return arguments; }());
	 * // => true
	 *
	 * _.isArguments([1, 2, 3]);
	 * // => false
	 */
	var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
	  return isObjectLike(value) && hasOwnProperty.call(value, 'callee') &&
	    !propertyIsEnumerable.call(value, 'callee');
	};

	isArguments_1 = isArguments;
	return isArguments_1;
}

var isBuffer = {exports: {}};

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */

var stubFalse_1;
var hasRequiredStubFalse;

function requireStubFalse () {
	if (hasRequiredStubFalse) return stubFalse_1;
	hasRequiredStubFalse = 1;
	function stubFalse() {
	  return false;
	}

	stubFalse_1 = stubFalse;
	return stubFalse_1;
}

isBuffer.exports;

var hasRequiredIsBuffer;

function requireIsBuffer () {
	if (hasRequiredIsBuffer) return isBuffer.exports;
	hasRequiredIsBuffer = 1;
	(function (module, exports) {
		var root = require_root(),
		    stubFalse = requireStubFalse();

		/** Detect free variable `exports`. */
		var freeExports = exports && !exports.nodeType && exports;

		/** Detect free variable `module`. */
		var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

		/** Detect the popular CommonJS extension `module.exports`. */
		var moduleExports = freeModule && freeModule.exports === freeExports;

		/** Built-in value references. */
		var Buffer = moduleExports ? root.Buffer : undefined;

		/* Built-in method references for those with the same name as other `lodash` methods. */
		var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

		/**
		 * Checks if `value` is a buffer.
		 *
		 * @static
		 * @memberOf _
		 * @since 4.3.0
		 * @category Lang
		 * @param {*} value The value to check.
		 * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
		 * @example
		 *
		 * _.isBuffer(new Buffer(2));
		 * // => true
		 *
		 * _.isBuffer(new Uint8Array(2));
		 * // => false
		 */
		var isBuffer = nativeIsBuffer || stubFalse;

		module.exports = isBuffer; 
	} (isBuffer, isBuffer.exports));
	return isBuffer.exports;
}

/** Used as references for various `Number` constants. */

var _isIndex;
var hasRequired_isIndex;

function require_isIndex () {
	if (hasRequired_isIndex) return _isIndex;
	hasRequired_isIndex = 1;
	var MAX_SAFE_INTEGER = 9007199254740991;

	/** Used to detect unsigned integer values. */
	var reIsUint = /^(?:0|[1-9]\d*)$/;

	/**
	 * Checks if `value` is a valid array-like index.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	 */
	function isIndex(value, length) {
	  var type = typeof value;
	  length = length == null ? MAX_SAFE_INTEGER : length;

	  return !!length &&
	    (type == 'number' ||
	      (type != 'symbol' && reIsUint.test(value))) &&
	        (value > -1 && value % 1 == 0 && value < length);
	}

	_isIndex = isIndex;
	return _isIndex;
}

/** Used as references for various `Number` constants. */

var isLength_1;
var hasRequiredIsLength;

function requireIsLength () {
	if (hasRequiredIsLength) return isLength_1;
	hasRequiredIsLength = 1;
	var MAX_SAFE_INTEGER = 9007199254740991;

	/**
	 * Checks if `value` is a valid array-like length.
	 *
	 * **Note:** This method is loosely based on
	 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	 * @example
	 *
	 * _.isLength(3);
	 * // => true
	 *
	 * _.isLength(Number.MIN_VALUE);
	 * // => false
	 *
	 * _.isLength(Infinity);
	 * // => false
	 *
	 * _.isLength('3');
	 * // => false
	 */
	function isLength(value) {
	  return typeof value == 'number' &&
	    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	}

	isLength_1 = isLength;
	return isLength_1;
}

var _baseIsTypedArray;
var hasRequired_baseIsTypedArray;

function require_baseIsTypedArray () {
	if (hasRequired_baseIsTypedArray) return _baseIsTypedArray;
	hasRequired_baseIsTypedArray = 1;
	var baseGetTag = require_baseGetTag(),
	    isLength = requireIsLength(),
	    isObjectLike = requireIsObjectLike();

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    boolTag = '[object Boolean]',
	    dateTag = '[object Date]',
	    errorTag = '[object Error]',
	    funcTag = '[object Function]',
	    mapTag = '[object Map]',
	    numberTag = '[object Number]',
	    objectTag = '[object Object]',
	    regexpTag = '[object RegExp]',
	    setTag = '[object Set]',
	    stringTag = '[object String]',
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

	/** Used to identify `toStringTag` values of typed arrays. */
	var typedArrayTags = {};
	typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
	typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
	typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
	typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
	typedArrayTags[uint32Tag] = true;
	typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
	typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
	typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
	typedArrayTags[errorTag] = typedArrayTags[funcTag] =
	typedArrayTags[mapTag] = typedArrayTags[numberTag] =
	typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
	typedArrayTags[setTag] = typedArrayTags[stringTag] =
	typedArrayTags[weakMapTag] = false;

	/**
	 * The base implementation of `_.isTypedArray` without Node.js optimizations.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
	 */
	function baseIsTypedArray(value) {
	  return isObjectLike(value) &&
	    isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
	}

	_baseIsTypedArray = baseIsTypedArray;
	return _baseIsTypedArray;
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */

var _baseUnary;
var hasRequired_baseUnary;

function require_baseUnary () {
	if (hasRequired_baseUnary) return _baseUnary;
	hasRequired_baseUnary = 1;
	function baseUnary(func) {
	  return function(value) {
	    return func(value);
	  };
	}

	_baseUnary = baseUnary;
	return _baseUnary;
}

var _nodeUtil = {exports: {}};

_nodeUtil.exports;

var hasRequired_nodeUtil;

function require_nodeUtil () {
	if (hasRequired_nodeUtil) return _nodeUtil.exports;
	hasRequired_nodeUtil = 1;
	(function (module, exports) {
		var freeGlobal = require_freeGlobal();

		/** Detect free variable `exports`. */
		var freeExports = exports && !exports.nodeType && exports;

		/** Detect free variable `module`. */
		var freeModule = freeExports && 'object' == 'object' && module && !module.nodeType && module;

		/** Detect the popular CommonJS extension `module.exports`. */
		var moduleExports = freeModule && freeModule.exports === freeExports;

		/** Detect free variable `process` from Node.js. */
		var freeProcess = moduleExports && freeGlobal.process;

		/** Used to access faster Node.js helpers. */
		var nodeUtil = (function() {
		  try {
		    // Use `util.types` for Node.js 10+.
		    var types = freeModule && freeModule.require && freeModule.require('util').types;

		    if (types) {
		      return types;
		    }

		    // Legacy `process.binding('util')` for Node.js < 10.
		    return freeProcess && freeProcess.binding && freeProcess.binding('util');
		  } catch (e) {}
		}());

		module.exports = nodeUtil; 
	} (_nodeUtil, _nodeUtil.exports));
	return _nodeUtil.exports;
}

var isTypedArray_1;
var hasRequiredIsTypedArray;

function requireIsTypedArray () {
	if (hasRequiredIsTypedArray) return isTypedArray_1;
	hasRequiredIsTypedArray = 1;
	var baseIsTypedArray = require_baseIsTypedArray(),
	    baseUnary = require_baseUnary(),
	    nodeUtil = require_nodeUtil();

	/* Node.js helper references. */
	var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

	/**
	 * Checks if `value` is classified as a typed array.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
	 * @example
	 *
	 * _.isTypedArray(new Uint8Array);
	 * // => true
	 *
	 * _.isTypedArray([]);
	 * // => false
	 */
	var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

	isTypedArray_1 = isTypedArray;
	return isTypedArray_1;
}

var _arrayLikeKeys;
var hasRequired_arrayLikeKeys;

function require_arrayLikeKeys () {
	if (hasRequired_arrayLikeKeys) return _arrayLikeKeys;
	hasRequired_arrayLikeKeys = 1;
	var baseTimes = require_baseTimes(),
	    isArguments = requireIsArguments(),
	    isArray = requireIsArray(),
	    isBuffer = requireIsBuffer(),
	    isIndex = require_isIndex(),
	    isTypedArray = requireIsTypedArray();

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * Creates an array of the enumerable property names of the array-like `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @param {boolean} inherited Specify returning inherited property names.
	 * @returns {Array} Returns the array of property names.
	 */
	function arrayLikeKeys(value, inherited) {
	  var isArr = isArray(value),
	      isArg = !isArr && isArguments(value),
	      isBuff = !isArr && !isArg && isBuffer(value),
	      isType = !isArr && !isArg && !isBuff && isTypedArray(value),
	      skipIndexes = isArr || isArg || isBuff || isType,
	      result = skipIndexes ? baseTimes(value.length, String) : [],
	      length = result.length;

	  for (var key in value) {
	    if ((inherited || hasOwnProperty.call(value, key)) &&
	        !(skipIndexes && (
	           // Safari 9 has enumerable `arguments.length` in strict mode.
	           key == 'length' ||
	           // Node.js 0.10 has enumerable non-index properties on buffers.
	           (isBuff && (key == 'offset' || key == 'parent')) ||
	           // PhantomJS 2 has enumerable non-index properties on typed arrays.
	           (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
	           // Skip index properties.
	           isIndex(key, length)
	        ))) {
	      result.push(key);
	    }
	  }
	  return result;
	}

	_arrayLikeKeys = arrayLikeKeys;
	return _arrayLikeKeys;
}

/** Used for built-in method references. */

var _isPrototype;
var hasRequired_isPrototype;

function require_isPrototype () {
	if (hasRequired_isPrototype) return _isPrototype;
	hasRequired_isPrototype = 1;
	var objectProto = Object.prototype;

	/**
	 * Checks if `value` is likely a prototype object.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
	 */
	function isPrototype(value) {
	  var Ctor = value && value.constructor,
	      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

	  return value === proto;
	}

	_isPrototype = isPrototype;
	return _isPrototype;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */

var _overArg;
var hasRequired_overArg;

function require_overArg () {
	if (hasRequired_overArg) return _overArg;
	hasRequired_overArg = 1;
	function overArg(func, transform) {
	  return function(arg) {
	    return func(transform(arg));
	  };
	}

	_overArg = overArg;
	return _overArg;
}

var _nativeKeys;
var hasRequired_nativeKeys;

function require_nativeKeys () {
	if (hasRequired_nativeKeys) return _nativeKeys;
	hasRequired_nativeKeys = 1;
	var overArg = require_overArg();

	/* Built-in method references for those with the same name as other `lodash` methods. */
	var nativeKeys = overArg(Object.keys, Object);

	_nativeKeys = nativeKeys;
	return _nativeKeys;
}

var _baseKeys;
var hasRequired_baseKeys;

function require_baseKeys () {
	if (hasRequired_baseKeys) return _baseKeys;
	hasRequired_baseKeys = 1;
	var isPrototype = require_isPrototype(),
	    nativeKeys = require_nativeKeys();

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names.
	 */
	function baseKeys(object) {
	  if (!isPrototype(object)) {
	    return nativeKeys(object);
	  }
	  var result = [];
	  for (var key in Object(object)) {
	    if (hasOwnProperty.call(object, key) && key != 'constructor') {
	      result.push(key);
	    }
	  }
	  return result;
	}

	_baseKeys = baseKeys;
	return _baseKeys;
}

var isArrayLike_1;
var hasRequiredIsArrayLike;

function requireIsArrayLike () {
	if (hasRequiredIsArrayLike) return isArrayLike_1;
	hasRequiredIsArrayLike = 1;
	var isFunction = requireIsFunction(),
	    isLength = requireIsLength();

	/**
	 * Checks if `value` is array-like. A value is considered array-like if it's
	 * not a function and has a `value.length` that's an integer greater than or
	 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
	 * @example
	 *
	 * _.isArrayLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isArrayLike(document.body.children);
	 * // => true
	 *
	 * _.isArrayLike('abc');
	 * // => true
	 *
	 * _.isArrayLike(_.noop);
	 * // => false
	 */
	function isArrayLike(value) {
	  return value != null && isLength(value.length) && !isFunction(value);
	}

	isArrayLike_1 = isArrayLike;
	return isArrayLike_1;
}

var keys_1;
var hasRequiredKeys;

function requireKeys () {
	if (hasRequiredKeys) return keys_1;
	hasRequiredKeys = 1;
	var arrayLikeKeys = require_arrayLikeKeys(),
	    baseKeys = require_baseKeys(),
	    isArrayLike = requireIsArrayLike();

	/**
	 * Creates an array of the own enumerable property names of `object`.
	 *
	 * **Note:** Non-object values are coerced to objects. See the
	 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
	 * for more details.
	 *
	 * @static
	 * @since 0.1.0
	 * @memberOf _
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
	 * _.keys(new Foo);
	 * // => ['a', 'b'] (iteration order is not guaranteed)
	 *
	 * _.keys('hi');
	 * // => ['0', '1']
	 */
	function keys(object) {
	  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
	}

	keys_1 = keys;
	return keys_1;
}

var _getAllKeys;
var hasRequired_getAllKeys;

function require_getAllKeys () {
	if (hasRequired_getAllKeys) return _getAllKeys;
	hasRequired_getAllKeys = 1;
	var baseGetAllKeys = require_baseGetAllKeys(),
	    getSymbols = require_getSymbols(),
	    keys = requireKeys();

	/**
	 * Creates an array of own enumerable property names and symbols of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @returns {Array} Returns the array of property names and symbols.
	 */
	function getAllKeys(object) {
	  return baseGetAllKeys(object, keys, getSymbols);
	}

	_getAllKeys = getAllKeys;
	return _getAllKeys;
}

var _equalObjects;
var hasRequired_equalObjects;

function require_equalObjects () {
	if (hasRequired_equalObjects) return _equalObjects;
	hasRequired_equalObjects = 1;
	var getAllKeys = require_getAllKeys();

	/** Used to compose bitmasks for value comparisons. */
	var COMPARE_PARTIAL_FLAG = 1;

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * A specialized version of `baseIsEqualDeep` for objects with support for
	 * partial deep comparisons.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
	 * @param {Function} customizer The function to customize comparisons.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Object} stack Tracks traversed `object` and `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
	  var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
	      objProps = getAllKeys(object),
	      objLength = objProps.length,
	      othProps = getAllKeys(other),
	      othLength = othProps.length;

	  if (objLength != othLength && !isPartial) {
	    return false;
	  }
	  var index = objLength;
	  while (index--) {
	    var key = objProps[index];
	    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
	      return false;
	    }
	  }
	  // Check that cyclic values are equal.
	  var objStacked = stack.get(object);
	  var othStacked = stack.get(other);
	  if (objStacked && othStacked) {
	    return objStacked == other && othStacked == object;
	  }
	  var result = true;
	  stack.set(object, other);
	  stack.set(other, object);

	  var skipCtor = isPartial;
	  while (++index < objLength) {
	    key = objProps[index];
	    var objValue = object[key],
	        othValue = other[key];

	    if (customizer) {
	      var compared = isPartial
	        ? customizer(othValue, objValue, key, other, object, stack)
	        : customizer(objValue, othValue, key, object, other, stack);
	    }
	    // Recursively compare objects (susceptible to call stack limits).
	    if (!(compared === undefined
	          ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
	          : compared
	        )) {
	      result = false;
	      break;
	    }
	    skipCtor || (skipCtor = key == 'constructor');
	  }
	  if (result && !skipCtor) {
	    var objCtor = object.constructor,
	        othCtor = other.constructor;

	    // Non `Object` object instances with different constructors are not equal.
	    if (objCtor != othCtor &&
	        ('constructor' in object && 'constructor' in other) &&
	        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
	          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
	      result = false;
	    }
	  }
	  stack['delete'](object);
	  stack['delete'](other);
	  return result;
	}

	_equalObjects = equalObjects;
	return _equalObjects;
}

var _DataView;
var hasRequired_DataView;

function require_DataView () {
	if (hasRequired_DataView) return _DataView;
	hasRequired_DataView = 1;
	var getNative = require_getNative(),
	    root = require_root();

	/* Built-in method references that are verified to be native. */
	var DataView = getNative(root, 'DataView');

	_DataView = DataView;
	return _DataView;
}

var _Promise;
var hasRequired_Promise;

function require_Promise () {
	if (hasRequired_Promise) return _Promise;
	hasRequired_Promise = 1;
	var getNative = require_getNative(),
	    root = require_root();

	/* Built-in method references that are verified to be native. */
	var Promise = getNative(root, 'Promise');

	_Promise = Promise;
	return _Promise;
}

var _Set;
var hasRequired_Set;

function require_Set () {
	if (hasRequired_Set) return _Set;
	hasRequired_Set = 1;
	var getNative = require_getNative(),
	    root = require_root();

	/* Built-in method references that are verified to be native. */
	var Set = getNative(root, 'Set');

	_Set = Set;
	return _Set;
}

var _WeakMap;
var hasRequired_WeakMap;

function require_WeakMap () {
	if (hasRequired_WeakMap) return _WeakMap;
	hasRequired_WeakMap = 1;
	var getNative = require_getNative(),
	    root = require_root();

	/* Built-in method references that are verified to be native. */
	var WeakMap = getNative(root, 'WeakMap');

	_WeakMap = WeakMap;
	return _WeakMap;
}

var _getTag;
var hasRequired_getTag;

function require_getTag () {
	if (hasRequired_getTag) return _getTag;
	hasRequired_getTag = 1;
	var DataView = require_DataView(),
	    Map = require_Map(),
	    Promise = require_Promise(),
	    Set = require_Set(),
	    WeakMap = require_WeakMap(),
	    baseGetTag = require_baseGetTag(),
	    toSource = require_toSource();

	/** `Object#toString` result references. */
	var mapTag = '[object Map]',
	    objectTag = '[object Object]',
	    promiseTag = '[object Promise]',
	    setTag = '[object Set]',
	    weakMapTag = '[object WeakMap]';

	var dataViewTag = '[object DataView]';

	/** Used to detect maps, sets, and weakmaps. */
	var dataViewCtorString = toSource(DataView),
	    mapCtorString = toSource(Map),
	    promiseCtorString = toSource(Promise),
	    setCtorString = toSource(Set),
	    weakMapCtorString = toSource(WeakMap);

	/**
	 * Gets the `toStringTag` of `value`.
	 *
	 * @private
	 * @param {*} value The value to query.
	 * @returns {string} Returns the `toStringTag`.
	 */
	var getTag = baseGetTag;

	// Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
	if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
	    (Map && getTag(new Map) != mapTag) ||
	    (Promise && getTag(Promise.resolve()) != promiseTag) ||
	    (Set && getTag(new Set) != setTag) ||
	    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
	  getTag = function(value) {
	    var result = baseGetTag(value),
	        Ctor = result == objectTag ? value.constructor : undefined,
	        ctorString = Ctor ? toSource(Ctor) : '';

	    if (ctorString) {
	      switch (ctorString) {
	        case dataViewCtorString: return dataViewTag;
	        case mapCtorString: return mapTag;
	        case promiseCtorString: return promiseTag;
	        case setCtorString: return setTag;
	        case weakMapCtorString: return weakMapTag;
	      }
	    }
	    return result;
	  };
	}

	_getTag = getTag;
	return _getTag;
}

var _baseIsEqualDeep;
var hasRequired_baseIsEqualDeep;

function require_baseIsEqualDeep () {
	if (hasRequired_baseIsEqualDeep) return _baseIsEqualDeep;
	hasRequired_baseIsEqualDeep = 1;
	var Stack = require_Stack(),
	    equalArrays = require_equalArrays(),
	    equalByTag = require_equalByTag(),
	    equalObjects = require_equalObjects(),
	    getTag = require_getTag(),
	    isArray = requireIsArray(),
	    isBuffer = requireIsBuffer(),
	    isTypedArray = requireIsTypedArray();

	/** Used to compose bitmasks for value comparisons. */
	var COMPARE_PARTIAL_FLAG = 1;

	/** `Object#toString` result references. */
	var argsTag = '[object Arguments]',
	    arrayTag = '[object Array]',
	    objectTag = '[object Object]';

	/** Used for built-in method references. */
	var objectProto = Object.prototype;

	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;

	/**
	 * A specialized version of `baseIsEqual` for arrays and objects which performs
	 * deep comparisons and tracks traversed objects enabling objects with circular
	 * references to be compared.
	 *
	 * @private
	 * @param {Object} object The object to compare.
	 * @param {Object} other The other object to compare.
	 * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
	 * @param {Function} customizer The function to customize comparisons.
	 * @param {Function} equalFunc The function to determine equivalents of values.
	 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
	 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	 */
	function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
	  var objIsArr = isArray(object),
	      othIsArr = isArray(other),
	      objTag = objIsArr ? arrayTag : getTag(object),
	      othTag = othIsArr ? arrayTag : getTag(other);

	  objTag = objTag == argsTag ? objectTag : objTag;
	  othTag = othTag == argsTag ? objectTag : othTag;

	  var objIsObj = objTag == objectTag,
	      othIsObj = othTag == objectTag,
	      isSameTag = objTag == othTag;

	  if (isSameTag && isBuffer(object)) {
	    if (!isBuffer(other)) {
	      return false;
	    }
	    objIsArr = true;
	    objIsObj = false;
	  }
	  if (isSameTag && !objIsObj) {
	    stack || (stack = new Stack);
	    return (objIsArr || isTypedArray(object))
	      ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
	      : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
	  }
	  if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
	    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
	        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

	    if (objIsWrapped || othIsWrapped) {
	      var objUnwrapped = objIsWrapped ? object.value() : object,
	          othUnwrapped = othIsWrapped ? other.value() : other;

	      stack || (stack = new Stack);
	      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
	    }
	  }
	  if (!isSameTag) {
	    return false;
	  }
	  stack || (stack = new Stack);
	  return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
	}

	_baseIsEqualDeep = baseIsEqualDeep;
	return _baseIsEqualDeep;
}

var _baseIsEqual;
var hasRequired_baseIsEqual;

function require_baseIsEqual () {
	if (hasRequired_baseIsEqual) return _baseIsEqual;
	hasRequired_baseIsEqual = 1;
	var baseIsEqualDeep = require_baseIsEqualDeep(),
	    isObjectLike = requireIsObjectLike();

	/**
	 * The base implementation of `_.isEqual` which supports partial comparisons
	 * and tracks traversed objects.
	 *
	 * @private
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @param {boolean} bitmask The bitmask flags.
	 *  1 - Unordered comparison
	 *  2 - Partial comparison
	 * @param {Function} [customizer] The function to customize comparisons.
	 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 */
	function baseIsEqual(value, other, bitmask, customizer, stack) {
	  if (value === other) {
	    return true;
	  }
	  if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
	    return value !== value && other !== other;
	  }
	  return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
	}

	_baseIsEqual = baseIsEqual;
	return _baseIsEqual;
}

var isEqual_1;
var hasRequiredIsEqual;

function requireIsEqual () {
	if (hasRequiredIsEqual) return isEqual_1;
	hasRequiredIsEqual = 1;
	var baseIsEqual = require_baseIsEqual();

	/**
	 * Performs a deep comparison between two values to determine if they are
	 * equivalent.
	 *
	 * **Note:** This method supports comparing arrays, array buffers, booleans,
	 * date objects, error objects, maps, numbers, `Object` objects, regexes,
	 * sets, strings, symbols, and typed arrays. `Object` objects are compared
	 * by their own, not inherited, enumerable properties. Functions and DOM
	 * nodes are compared by strict equality, i.e. `===`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 * @example
	 *
	 * var object = { 'a': 1 };
	 * var other = { 'a': 1 };
	 *
	 * _.isEqual(object, other);
	 * // => true
	 *
	 * object === other;
	 * // => false
	 */
	function isEqual(value, other) {
	  return baseIsEqual(value, other);
	}

	isEqual_1 = isEqual;
	return isEqual_1;
}

var isEqualExports = requireIsEqual();
var isEqual = /*@__PURE__*/getDefaultExportFromCjs(isEqualExports);

const isDefenderId = (id) => id !== "attacker";
const isAttackerId = (id) => id === "attacker";
const isPlayerIdOfSide = (playerId, side) => side === "attack" ? isAttackerId(playerId) : isDefenderId(playerId);
const gameEventRequiresReaction = (event) => !![
  "ask-question",
  "quarter-reveal",
  "is-attacking-stage",
  "is-next-to-attacker"
].find((action) => isActionEventOf(event, action));
const isGameEventOf = (event, type) => event?.type === type;
const isActionEventOf = (event, action) => event?.type === "action" && event.action === action;
const isAdminActionEventOf = (event, action) => event?.type === "system" && event.action === action;
const guardForGameEventType = (type) => (event) => isGameEventOf(event, type);
const isPlayerGameEvent = (event) => event.type === "action" || event.type === "placement" || event.type === "move" || event.type === "reaction";
const guardForGameEventAction = (action) => (event) => isActionEventOf(event, action);
const guardForGameEventAdminAction = (action) => (event) => isAdminActionEventOf(event, action);
const objectEntries = (obj) => {
  return Object.entries(obj);
};
const throwIfNotFound = () => {
  throw "Invalid state";
};
const seededRandomGenerator = (seed) => () => {
  let t = seed += 1831565813;
  t = Math.imul(t ^ t >>> 15, t | 1);
  t ^= t + Math.imul(t ^ t >>> 7, t | 61);
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
};
const BOARD_ITEMS = [
  // Row 1
  { id: "certificate", position: [1, 0] },
  { id: "usb-stick", position: [1, 0] },
  { id: "virus", position: [3, 0] },
  { id: "binoculars", position: [3, 0] },
  { id: "lock", position: [4, 0] },
  { id: "data-exchange", position: [4, 0] },
  { id: "gps-tracker", position: [5, 0] },
  { id: "fake-identity-card", position: [5, 0] },
  { id: "encrypted-data", position: [6, 0] },
  { id: "dynamite", position: [6, 0] },
  { id: "license", position: [7, 0] },
  { id: "tools", position: [7, 0] },
  { id: "security-camera", position: [8, 0] },
  { id: "cloud", position: [8, 0] },
  // Row 2
  { id: "security-camera", position: [0, 1] },
  { id: "fake-identity-card", position: [0, 1] },
  { id: "alarm-system", position: [1, 1] },
  { id: "data-exchange", position: [1, 1] },
  { id: "gun", position: [2, 1] },
  { id: "blueprint", position: [2, 1] },
  { id: "extinguisher", position: [3, 1] },
  { id: "cloud", position: [3, 1] },
  { id: "usb-stick", position: [6, 1] },
  { id: "blueprint", position: [6, 1] },
  { id: "lock", position: [8, 1] },
  { id: "virus", position: [8, 1] },
  // Row 3
  { id: "insurance", position: [0, 2] },
  { id: "tools", position: [0, 2] },
  { id: "security-camera", position: [2, 2] },
  { id: "dynamite", position: [2, 2] },
  { id: "license", position: [3, 2] },
  { id: "usb-stick", position: [3, 2] },
  { id: "digital-footprint", position: [4, 2] },
  { id: "virus", position: [4, 2] },
  { id: "encrypted-data", position: [5, 2] },
  { id: "binoculars", position: [5, 2] },
  { id: "security-camera", position: [6, 2] },
  { id: "fake-identity-card", position: [6, 2] },
  { id: "firewall", position: [7, 2] },
  { id: "data-exchange", position: [7, 2] },
  { id: "gun", position: [8, 2] },
  { id: "dynamite", position: [8, 2] },
  // Row 4
  { id: "virus", position: [0, 3] },
  { id: "blueprint", position: [0, 3] },
  { id: "data-exchange", position: [3, 3] },
  { id: "insurance", position: [3, 3] },
  { id: "cloud", position: [5, 3] },
  { id: "alarm-system", position: [5, 3] },
  { id: "tools", position: [6, 3] },
  { id: "extinguisher", position: [6, 3] },
  { id: "binoculars", position: [7, 3] },
  { id: "digital-footprint", position: [7, 3] },
  // Row 5
  { id: "digital-footprint", position: [1, 4] },
  { id: "gun", position: [1, 4] },
  { id: "lock", position: [2, 4] },
  { id: "dynamite", position: [2, 4] },
  { id: "tools", position: [3, 4] },
  { id: "binoculars", position: [3, 4] },
  { id: "gun", position: [4, 4] },
  { id: "firewall", position: [4, 4] },
  { id: "usb-stick", position: [5, 4] },
  { id: "gps-tracker", position: [5, 4] },
  { id: "data-exchange", position: [6, 4] },
  { id: "insurance", position: [6, 4] },
  { id: "blueprint", position: [8, 4] },
  { id: "license", position: [8, 4] },
  // Row 6
  { id: "usb-stick", position: [0, 5] },
  { id: "blueprint", position: [0, 5] },
  { id: "alarm-system", position: [1, 5] },
  { id: "cloud", position: [1, 5] },
  { id: "extinguisher", position: [2, 5] },
  { id: "virus", position: [2, 5] },
  { id: "fake-identity-card", position: [3, 5] },
  { id: "certificate", position: [3, 5] },
  { id: "blueprint", position: [5, 5] },
  { id: "cloud", position: [5, 5] },
  { id: "lock", position: [6, 5] },
  { id: "virus", position: [6, 5] },
  { id: "encrypted-data", position: [7, 5] },
  { id: "dynamite", position: [7, 5] },
  { id: "fake-identity-card", position: [8, 5] },
  { id: "cloud", position: [8, 5] },
  // Row 7
  { id: "binoculars", position: [0, 6] },
  { id: "license", position: [0, 6] },
  { id: "usb-stick", position: [2, 6] },
  { id: "gun", position: [2, 6] },
  { id: "digital-footprint", position: [4, 6] },
  { id: "dynamite", position: [4, 6] },
  { id: "certificate", position: [7, 6] },
  { id: "binoculars", position: [7, 6] },
  { id: "extinguisher", position: [8, 6] },
  { id: "gun", position: [8, 6] },
  // Row 8
  { id: "data-exchange", position: [0, 7] },
  { id: "gun", position: [0, 7] },
  { id: "gps-tracker", position: [1, 7] },
  { id: "tools", position: [1, 7] },
  { id: "firewall", position: [2, 7] },
  { id: "fake-identity-card", position: [2, 7] },
  { id: "virus", position: [3, 7] },
  { id: "binoculars", position: [3, 7] },
  { id: "encrypted-data", position: [4, 7] },
  { id: "usb-stick", position: [4, 7] },
  { id: "dynamite", position: [6, 7] },
  { id: "tools", position: [6, 7] },
  { id: "cloud", position: [7, 7] },
  { id: "alarm-system", position: [7, 7] },
  { id: "blueprint", position: [8, 7] },
  { id: "insurance", position: [8, 7] }
];
const BOARD_SUPPLY_CHAINS = [
  [
    { supplyChainId: 0, id: "supply", coordinate: [2, 0] },
    { supplyChainId: 0, id: "production", coordinate: [0, 0] },
    { supplyChainId: 0, id: "storage", coordinate: [1, 2] },
    { supplyChainId: 0, id: "datacenter", coordinate: [1, 3] },
    { supplyChainId: 0, id: "logistics", coordinate: [2, 3] },
    { supplyChainId: 0, id: "sales", coordinate: [0, 4] }
  ],
  [
    { supplyChainId: 1, id: "supply", coordinate: [1, 6] },
    { supplyChainId: 1, id: "production", coordinate: [3, 6] },
    { supplyChainId: 1, id: "storage", coordinate: [4, 5] },
    { supplyChainId: 1, id: "datacenter", coordinate: [5, 6] },
    { supplyChainId: 1, id: "logistics", coordinate: [5, 7] },
    { supplyChainId: 1, id: "sales", coordinate: [6, 6] }
  ],
  [
    { supplyChainId: 2, id: "supply", coordinate: [7, 4] },
    { supplyChainId: 2, id: "production", coordinate: [8, 3] },
    { supplyChainId: 2, id: "storage", coordinate: [7, 1] },
    { supplyChainId: 2, id: "logistics", coordinate: [5, 1] },
    { supplyChainId: 2, id: "datacenter", coordinate: [4, 1] },
    { supplyChainId: 2, id: "sales", coordinate: [4, 3] }
  ]
];
const getStageAt = (coordinate) => findStageAt(coordinate) ?? throwIfNotFound();
const findStageAt = (coordinate) => BOARD_SUPPLY_CHAINS.flat().find((stage) => isEqual(stage.coordinate, coordinate));
const GLOBAL_ATTACK_SCENARIOS = [
  {
    name: `Unerwarteter Hackerangriff`,
    description: `Das Rechenzentrum ist von einem groß angelegten Hackerangriff betroffen. Auf dem zentralen Produktionsserver wurde schon eine potenzielle Sicherheitslücke identifiziert, über die sich die Hacker Zugang verschafft haben. Noch ist der Schaden übersehbar, aber es ist nicht abzusehen, worauf es die Angreifer genau abgesehen haben. So oder so, ihr müsst schnell handeln!`,
    attacks: [
      {
        targets: [{ stageId: "datacenter" }, { stageId: "production" }],
        description: `Den Hackern ist es gelungen, ins Netzwerk einzudringen, sensible Zugangsdaten zu stehlen und den zentralen Produktionsserver zu blockieren. Schützt ein Rechenzentrum eurer Wahl und die dazugehörige Produktion!`
      },
      {
        targets: [{ stageId: "production" }, { stageId: "supply" }],
        description: `Die Hacker haben eine Malware eingeschleust, die die Systeme in der Produktion deutlich verlangsamt. Auch die Mitarbeitenden in der Beschaffung können derzeit nicht auf die Cloud zugreifen. Schützt eine weitere Produktion eurer Wahl und eine Beschaffung!`
      },
      {
        targets: [{ stageId: "logistics" }, { stageId: "sales" }],
        description: `Die Angreifer haben die Logistik-Website gehackt und eine Hintertür eingebaut. Bis die Sicherheitslücke geschlossen ist, wird es zu Lieferverzögerungen entlang der gesamten Kette kommen. Schützt eine Logistik eurer Wahl und einen Händler!`
      },
      {
        targets: [{ stageId: "sales" }, { stageId: "datacenter" }],
        description: `Ein Ransomware-Angriff auf das System eures Zahlungsabwicklers führt dazu, dass eure Vertriebspartner keine Produkte bestellen und Zahlungen tätigen können. Schützt einen weiteren Händler eurer Wahl und das dazugehörige Rechenzentrum!`
      }
    ]
  },
  {
    name: "Cyberangriff auf Kunden und Warenwirtschaft",
    description: `Euer Unternehmen ist das Ziel eines Angriffs auf die Datenschutzsysteme geworden. Die Cyber-Terroristen haben es geschafft, in euer zentrales Datenspeichersystem einzudringen und an die personenbezogenen Daten von Kunden und Mitarbeitern zu kommen. Ihr seid euch bewusst, dass ihr aufgrund des Angriffs möglicherweise gegen Datenschutzgesetze verstoßen habt. Schließt das Leck schnellstmöglich, um hohe Geldbußen und rechtliche Konsequenzen zu vermeiden!`,
    attacks: [
      {
        targets: [{ stageId: "datacenter" }, { stageId: "sales" }],
        description: `Sichert die Daten, untersucht den Angriff und informiert eure Geschäftspartner über den Vorfall. Schützt ein Rechenzentrum eurer Wahl und den dazugehörigen Händler!`
      },
      {
        targets: [{ stageId: "logistics" }, { stageId: "storage" }],
        description: `Die Cyber-Terroristen haben weitere sensible Daten aus eurem System gestohlen und setzen diese für Angriffe gegen eure Lagerlogistik ein. Schützt eine Logistik eurer Wahl und die dazugehörige Lagerung!`
      },
      {
        targets: [{ stageId: "supply" }, { stageId: "logistics" }],
        description: `Die Cyber-Terroristen haben sich nun auch Zugang zum Warenwirtschaftssystem verschafft und sorgen für Chaos in der Beschaffung und Logistik. Schützt eine Beschaffung eurer Wahl und eine Logistik!`
      },
      {
        targets: [{ stageId: "datacenter" }, { stageId: "datacenter" }],
        description: `Es stellt sich heraus, dass die ersten Angriffe nur Ablenkungsmanöver waren. Die konzertierte Cyberattacke zielte letztendlich darauf ab, eure gesamte IT lahmzulegen. Schützt die anderen beiden Rechenzentren!`
      }
    ]
  },
  {
    name: "Probleme in Transport und Logistik",
    description: `Die Produktionsmethode eurer Firma ist stark nachfrage-orientiert. Ihr bestellt Materialien und Bauteile von verschiedenen Lieferanten und beginnt just-in-time mit der Produktion. Ein plötzlicher massiver Angriff auf mehrere Transport- und Logistikunternehmen stört eure Lieferkette. Ihr lauft Gefahr, die Nachfrage eurer Kunden nicht mehr bedienen zu können, was zu einem heftigen Verlust von Geschäft und Partnern führen könnte.`,
    attacks: [
      {
        targets: [{ stageId: "supply" }, { stageId: "storage" }],
        description: `Einige Lieferungen kommen verspätet an, die ersten gar nicht. Reklamationen häufen sich. Schützt eine Beschaffung eurer Wahl und eine Lagerung!`
      },
      {
        targets: [{ stageId: "logistics" }, { stageId: "production" }],
        description: `Wenige Tage später wird der Angriff auf weitere Zulieferer ausgeweitet. Ihr bekommt die dringend benötigten Bauteile gar nicht mehr und müsst die Produktion stoppen. Schützt eine Logistik eurer Wahl und eine Produktion!`
      },
      {
        targets: [{ stageId: "sales" }, { stageId: "logistics" }],
        description: `Bei euren Vertriebspartnern kommen seit Wochen keine Waren an und die ersten drohen mit Vertragsstrafen. Schützt einen Händler eurer Wahl und die dazugehörige Logistik!`
      },
      {
        targets: [{ stageId: "logistics" }, { stageId: "supply" }],
        description: `Um die Probleme endgültig in den Griff zu bekommen und den Schaden zu minimieren, müsst ihr alternative Lieferquellen erschließen und eure Logistik- und Transportprozesse diversifizieren. Schützt die dritte Logistik und eine weitere Beschaffung eurer Wahl!`
      }
    ]
  }
];
const STAGES = [
  {
    id: "supply",
    name: "Beschaffung",
    description: "",
    gender: "f",
    defenseItems: ["insurance", "license", "extinguisher"]
  },
  {
    id: "production",
    name: "Produktion",
    description: "",
    gender: "f",
    defenseItems: ["security-camera", "alarm-system", "lock"]
  },
  {
    id: "datacenter",
    name: "Rechenzentrum",
    description: "",
    gender: "n",
    defenseItems: ["encrypted-data", "firewall", "digital-footprint"]
  },
  {
    id: "storage",
    name: "Lagerung",
    description: "",
    gender: "f",
    defenseItems: ["security-camera", "alarm-system", "extinguisher"]
  },
  {
    id: "logistics",
    name: "Logistik",
    description: "",
    gender: "f",
    defenseItems: ["insurance", "digital-footprint", "gps-tracker"]
  },
  {
    id: "sales",
    name: "Handel",
    description: "",
    gender: "m",
    defenseItems: ["certificate", "insurance", "lock"]
  }
];
const TARGETED_ATTACKS = [
  {
    target: { supplyChainId: 0, stageId: "supply", requiredItems: ["usb-stick", "tools"] },
    description: `Schleust gefälschte und minderwertige Materialien in die Lieferkette ein und sorgt dadurch für Produktionsausfälle und Kundenbeschwerden.`
  },
  {
    target: { supplyChainId: 2, stageId: "supply", requiredItems: ["cloud", "virus"] },
    description: `Startet eine Cyberattacke auf das Beschaffungssystem, um den Zugriff auf Bestelldaten, Lieferpläne und Zahlungsinformationen zu blockieren.`
  },
  {
    target: {
      supplyChainId: 1,
      stageId: "supply",
      requiredItems: ["usb-stick", "fake-identity-card"]
    },
    description: `Infiltriert das Beschaffungssystem und manipuliert die Zahlungen. Der mangelnde Geldfluss wird zu Verzögerungen in den nachfolgenden Stufen führen.`
  },
  // ----
  {
    target: { supplyChainId: 1, stageId: "production", requiredItems: ["binoculars", "tools"] },
    description: `Brecht ungesehen in die Produktion ein und ladet Schadsoftware auf den Betriebsserver hoch, um für Qualitätsprobleme und Produktionsausfälle zu sorgen.`
  },
  {
    target: { supplyChainId: 2, stageId: "production", requiredItems: ["virus", "cloud"] },
    description: `Führt einen Malware-Angriff auf das Produktionssystem durch, um die Maschinen zu stoppen und die Produktion zu unterbrechen.`
  },
  {
    target: {
      supplyChainId: 0,
      stageId: "production",
      requiredItems: ["blueprint", "dynamite"]
    },
    description: `Unterbrecht gezielt den reibungslosen Ablauf der Lieferkette, indem ihr wichtige Bestellungen verzögert.`
  },
  // ----
  {
    target: { supplyChainId: 0, stageId: "logistics", requiredItems: ["binoculars", "gun"] },
    description: `Unterbrecht den Warentransport, indem ihr einen LKW entführt. Die „verschwundenen” Güter werden dafür sorgen, dass es zu Verzögerungen und Ausfällen kommt.`
  },
  {
    target: { supplyChainId: 2, stageId: "logistics", requiredItems: ["data-exchange", "cloud"] },
    description: `Verbreitet gefälschte Informationen über Liefertermine oder Transportrouten, um Verwirrung zu stiften und Engpässe oder Verzögerungen zu verursachen.`
  },
  {
    target: {
      supplyChainId: 1,
      stageId: "logistics",
      requiredItems: ["data-exchange", "cloud"]
    },
    description: `Führt einen DDoS-Angriff auf die Logistik-Website durch. Wenn Partner keinen Zugriff auf die Bestell- und Transportinformationen haben, verspäten sich Bestellungen.`
  },
  // ----
  {
    target: {
      supplyChainId: 0,
      stageId: "storage",
      requiredItems: ["fake-identity-card", "dynamite"]
    },
    description: `Umgeht die Sicherheitsvorkehrungen und beschädigt die lagernden Waren. Die Verluste werden zu Engpässen in der Lieferkette führen.`
  },
  {
    target: { supplyChainId: 1, stageId: "storage", requiredItems: ["data-exchange", "blueprint"] },
    description: `Manipuliert die Lagerbestände. Sobald der Bestand falsch angezeigt wird, kann die Logistik nicht mehr zuverlässig bedient werden.`
  },
  {
    target: {
      supplyChainId: 2,
      stageId: "storage",
      requiredItems: ["blueprint", "fake-identity-card"]
    },
    description: `Nutzt Sicherheitslücken aus, um unbefugten Zugriff auf Lagerbestände zu erhalten, und stehlt wertvolle Waren aus dem Lager.`
  },
  // ----
  {
    target: { supplyChainId: 1, stageId: "sales", requiredItems: ["fake-identity-card", "cloud"] },
    description: `Gebt falsche Bestellungen auf und tätigt gefälschte Zahlungen. Die Verzögerungen in der Lieferkette und die Umsatzverluste werden für das Unternehmen schmerzhaft sein.`
  },
  {
    target: { supplyChainId: 2, stageId: "sales", requiredItems: ["usb-stick", "virus"] },
    description: `Verbreitet einen bösartigen Computervirus in den Systemen der Vertriebspartner. Der Virus tarnt sich als legitime Software und infiziert unbemerkt die Systeme.`
  },
  {
    target: {
      supplyChainId: 0,
      stageId: "sales",
      requiredItems: ["gun", "tools"]
    },
    description: `Führt gezielte Diebstähle und Überfälle aus, um Warenbestände zu reduzieren und zu beschädigen.`
  },
  // ----
  {
    target: { supplyChainId: 2, stageId: "datacenter", requiredItems: ["data-exchange", "virus"] },
    description: `Führe einen Netzwerkangriff auf das Rechenzentrum durch, indem du die Server mit Traffic flutest. Die Überlastung wird zu Systemausfällen und Unterbrechungen führen.`
  },
  {
    target: { supplyChainId: 1, stageId: "datacenter", requiredItems: ["data-exchange", "cloud"] },
    description: `Sabotiert die Backup-Systeme, um Datenverluste zu verursachen und die Wiederherstellung der Systeme zu erschweren.`
  },
  {
    target: {
      supplyChainId: 0,
      stageId: "datacenter",
      requiredItems: ["fake-identity-card", "cloud"]
    },
    description: `Versendet eine Phishing-E-Mail an einen Rechenzentrumsmitarbeiter, um Zugang zu seinen Anmeldedaten zu erhalten und das Rechenzentrum zu sabotieren.`
  }
];
const isDefenseCharacter = (character) => Object.hasOwn(character, "ability");
const ABILITIES = {
  "quarter-reveal": "Darf fragen, auf welchem Viertel des Spielbretts sich der/die Angreifer:in befindet.",
  "is-attacking-stage": "Darf fragen, ob der/die Angreifer:in, eine Stufe angreift, wenn sie sich auf dieser Stufe oder auf einem angrenzenden Feld zu dazu befindet.",
  "is-next-to-attacker": "Darf fragen, ob der/die Angreifer:in sich auf seinem oder einem angrenzenden Feld, befindet.",
  "exchange-digital-footprint": "Darf den Gegenstand „Digital Footprint“ als Joker für einen beliebigen Gegenstand einsetzen."
};
const CHARACTERS = [
  {
    id: "order-manager",
    name: "Auftragsmanagement",
    description: "Die Auftragsmanager:innen sind für die Koordination und Überwachung des Bestell- und Lieferprozesses eines Unternehmens zuständig und kümmern sich auch um die Beauftragung von Großhandel und Lieferanten.",
    ability: "quarter-reveal",
    side: "defense"
  },
  {
    id: "dispatch-manager",
    name: "Speditionsleitung",
    description: "Die Leiter:innen in der Spedition müssen sicherstellen, das alle Produkte den hohen Qualitätsstandards entsprechen.",
    ability: "is-attacking-stage",
    side: "defense"
  },
  {
    id: "quality-manager",
    name: "Qualitätsmanagement",
    description: "Die Qualitätsmanager:innen sind für die Sicherstellung der Qualität der Produkte verantwortlich. Sie stellen sicher, dass alle Standards eingehalten werden",
    ability: "is-next-to-attacker",
    side: "defense"
  },
  {
    id: "it-specialist",
    name: "IT Fachkraft",
    description: "Die IT-Spezialist:innen sind für die Sicherstellung von Informations-Systeme zuständig. Sie kümmern sich auch um den Schutz der Systeme gegen Cyberangriffe",
    ability: "exchange-digital-footprint",
    side: "defense"
  },
  {
    id: "frustrated",
    name: "Frustration",
    description: "Du wurdest bei der letzten Beförderungsrunde übergangen – schon wieder! Frustriert über diese andauernde Ungerechtigkeit ziehst du den Schlussstrich und verlässt deine Firma; aber nicht, ohne dich vorher durch einen Sabotageakt bei ihr zu „bedanken“ – als ihr ehemaliger Risikomanager weißt du schließlich über die Schwachstellen im System Bescheid",
    side: "attack"
  },
  {
    id: "disappointed",
    name: "Enttäuscht",
    description: "Als System-Administratorin hast du Zugriff auf die sensibelsten Daten. Durch einen Blick in die interne Kommunikation der Geschäftsführung erfährt deine Kollegin, dass länger geplant ist, eure Abteilung demnächst zu outsourcen. Zutiefst enttäuscht darüber, dass man euch vor vollendete Tatsachen stellen wird. Jetzt willst du ihnen einen Denkzettel verpassen",
    side: "attack"
  }
];
const getPlayer = (playerId, context) => {
  if (isDefenderId(playerId)) {
    const player = context.defense.defenders.find((player2) => player2.id === playerId);
    if (!player)
      throw new Error(`Player ${playerId} not found in context`);
    return player;
  } else {
    return context.attack.attacker;
  }
};
const getPlayerSide = (playerId) => isDefenderId(playerId) ? "defense" : "attack";
const getCharacter = (characterId) => (
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  CHARACTERS.find((character) => character.id === characterId)
);
const findUserIndex = (userId, context) => {
  const index = context.users.findIndex((user) => user.id === userId);
  return index === -1 ? void 0 : index;
};
const getUser = (userId, context) => {
  const user = context.users.find((user2) => user2.id === userId);
  if (!user)
    throw new Error(`The user with id ${userId} was not found.`);
  return user;
};
const userControlsPlayerId = (userId, playerId, context) => userControlsPlayer(userId, getPlayer(playerId, context), context);
const userControlsPlayer = (userId, player, context) => {
  if (player.userId === userId)
    return true;
  return userIsAdmin(userId, context);
};
const userIsAdmin = (userId, context) => {
  const user = getUser(userId, context);
  return user.isAdmin;
};
const TOTAL_ROUNDS = 12;
const COLUMN_COUNT = 9;
const ROW_COUNT = 8;
const NEW_GLOBAL_ATTACK_ROUNDS = [0, 3, 6, 9];
const ATTACKER_REVEAL_ROUNDS = [4, 9];
class GameState {
  /** Use GameState.fromContext() to create a GameState */
  constructor(context) {
    this.context = context;
    const numberGenerator = seededRandomGenerator(context.timestamp);
    this.randomNumbers = Array.from({ length: 23 }, () => numberGenerator());
    this.playersInOrder = [
      context.attack.attacker,
      context.defense.defenders[0],
      context.defense.defenders[1],
      context.attack.attacker,
      context.defense.defenders[2],
      context.defense.defenders[3]
    ];
    this.playerEvents = this.context.events.filter(isPlayerGameEvent);
    this.finalizedEvents = this.playerEvents.filter((event) => event.finalized);
    this.finalizedPlacementEvents = this.finalizedEvents.filter(guardForGameEventType("placement"));
    this.finalizedActionEvents = this.finalizedEvents.filter(guardForGameEventType("action"));
    this.finalizedMoveEvents = this.finalizedEvents.filter(guardForGameEventType("move"));
    this.finalizedReactionEvents = this.finalizedEvents.filter(guardForGameEventType("reaction"));
    this.finalizedActionEventsRequiringReaction = this.finalizedActionEvents.filter(gameEventRequiresReaction);
    this.finalizedMoveOrActionEvents = this.finalizedEvents.filter(
      (event) => isGameEventOf(event, "move") || isGameEventOf(event, "action")
    );
    this.finalizedPlayerEvents = this.finalizedEvents.filter(
      (event) => isGameEventOf(event, "move") || isGameEventOf(event, "action") || isGameEventOf(event, "placement") || isGameEventOf(event, "reaction")
    );
    this.lastEvent = this.playerEvents[this.playerEvents.length - 1];
    this.lastFinalizedEvent = this.finalizedEvents[this.finalizedEvents.length - 1];
    const finalizedAndReactedActionEventCount = this.finalizedActionEvents.length - (this.finalizedActionEventsRequiringReaction.length - this.finalizedReactionEvents.length);
    this.currentRound = Math.floor(finalizedAndReactedActionEventCount / this.playersInOrder.length);
    this.nextEventType = this.finalizedPlacementEvents.length < 5 ? "placement" : this.lastFinalizedEvent && this.lastFinalizedEvent.type === "move" ? "action" : this.finalizedActionEventsRequiringReaction.length > this.finalizedReactionEvents.length ? "reaction" : "move";
    if (this.nextEventType === "reaction") {
      this.activePlayer = context.attack.attacker;
    } else if (this.nextEventType === "placement") {
      if (this.finalizedPlacementEvents.length < 4) {
        this.activePlayer = context.defense.defenders[this.finalizedPlacementEvents.length];
      } else {
        this.activePlayer = context.attack.attacker;
      }
    } else {
      this.activePlayer = this.playersInOrder[Math.floor(this.finalizedMoveOrActionEvents.length / 2) % this.playersInOrder.length];
    }
    this.activeSide = getPlayerSide(this.activePlayer.id);
    this.activePlayerPosition = this.playerPositions[this.activePlayer.id];
  }
  playersInOrder;
  randomNumbers;
  playerEvents;
  finalizedEvents;
  finalizedPlacementEvents;
  finalizedActionEvents;
  finalizedMoveEvents;
  finalizedReactionEvents;
  finalizedPlayerEvents;
  finalizedActionEventsRequiringReaction;
  finalizedMoveOrActionEvents;
  currentRound;
  activePlayer;
  activeSide;
  activePlayerPosition;
  lastEvent;
  lastFinalizedEvent;
  nextEventType;
  static previousState;
  static fromContext(context) {
    if (this.previousState && isEqual(this.previousState.context, context)) {
      return this.previousState.state;
    }
    const state = new GameState(context);
    this.previousState = { state, context };
    return state;
  }
  get isFinished() {
    return this.nextEventType !== "reaction" && this.finalizedActionEvents.length >= this.playersInOrder.length * TOTAL_ROUNDS;
  }
  get playerPositions() {
    const playerPositions = {
      attacker: [0, 0],
      defender0: [0, 0],
      defender1: [0, 0],
      defender2: [0, 0],
      defender3: [0, 0]
    };
    this.context.events.filter(guardForGameEventType("placement")).filter((event) => event.finalized).forEach((event) => playerPositions[event.playerId] = event.coordinate);
    this.context.events.filter(guardForGameEventType("move")).filter((event) => event.finalized).forEach((event) => playerPositions[event.playerId] = event.to);
    return playerPositions;
  }
  get jokers() {
    return 2 - this.finalizedEvents.filter(
      (event) => event.type === "action" && event.action === "exchange-joker" || event.type === "reaction" && event.action === "joker"
    ).length;
  }
  get defenseInventory() {
    const defenseInventoryIds = Object.values(ITEMS).map((item) => item.id).filter(isDefenseItemId);
    let initialAmount = 0;
    if (this.context.events.find(guardForGameEventAdminAction("fill-inventory"))) {
      initialAmount = 50;
    }
    const inventory = Object.fromEntries(
      defenseInventoryIds.map((id) => [id, initialAmount])
    );
    this.finalizedActionEvents.filter(guardForGameEventAction("collect")).forEach((event) => {
      if (event.itemId && isDefenseItemId(event.itemId)) {
        inventory[event.itemId] += 1;
      }
    });
    return inventory;
  }
  get attackInventory() {
    const attackInventoryIds = Object.values(ITEMS).map((item) => item.id).filter(isAttackItemId);
    let initialAmount = 0;
    if (this.context.events.find(guardForGameEventAdminAction("fill-inventory"))) {
      initialAmount = 50;
    }
    const inventory = Object.fromEntries(
      attackInventoryIds.map((id) => [id, initialAmount])
    );
    this.finalizedActionEvents.filter(guardForGameEventAction("collect")).forEach((event) => {
      if (event.itemId && isAttackItemId(event.itemId)) {
        inventory[event.itemId] += 1;
      }
    });
    this.finalizedActionEvents.filter(guardForGameEventAction("exchange-joker")).forEach((event) => {
      if (event.itemId) {
        inventory[event.itemId] += 1;
      }
    });
    return inventory;
  }
  getItemsForCoordinate(coordinate) {
    const items = BOARD_ITEMS.filter((item) => isEqual(item.position, coordinate));
    return items.map((item) => {
      const collectedCount = this.context.events.filter(guardForGameEventAction("collect")).filter((event) => isEqual(event.position, coordinate)).filter((event) => event.itemId === item.id).length;
      return {
        item,
        collectedCount
      };
    });
  }
  /** Check if this is a valid target destination for the active player */
  isValidMove(to) {
    if (to[0] < 0 || to[0] > 8 || to[1] < 0 || to[1] > 7)
      return false;
    for (const playerPosition of Object.keys(this.playerPositions).filter((playerId) => isPlayerIdOfSide(playerId, this.activeSide)).map((playerId) => this.playerPositions[playerId])) {
      if (isEqual(playerPosition, to))
        return false;
    }
    const currentPosition = this.activePlayerPosition;
    const xDiff = Math.abs(currentPosition[0] - to[0]);
    const yDiff = Math.abs(currentPosition[1] - to[1]);
    return xDiff + yDiff <= 2 && xDiff + yDiff != 0;
  }
  isValidPlacement(coordinate) {
    if (coordinate[0] < 0 || coordinate[0] > 8 || coordinate[1] < 0 || coordinate[1] > 7)
      return false;
    if (this.activePlayer.id === "attacker")
      return true;
    for (const [playerId, position] of objectEntries(this.playerPositions)) {
      if (isEqual(position, coordinate) && this.isPlaced(playerId))
        return false;
    }
    let stageIds;
    switch (this.activePlayer.character) {
      case "dispatch-manager":
        stageIds = ["logistics", "storage"];
        break;
      case "it-specialist":
        stageIds = ["datacenter"];
        break;
      case "order-manager":
        stageIds = ["sales", "supply"];
        break;
      case "quality-manager":
        stageIds = ["production"];
        break;
    }
    let allValidCoordinates = BOARD_SUPPLY_CHAINS.flat().filter((stage) => stageIds.includes(stage.id)).map((stage) => stage.coordinate).filter((stageCoordinate) => {
      for (const [playerId, position] of objectEntries(this.playerPositions)) {
        if (isEqual(position, stageCoordinate) && this.isPlaced(playerId))
          return false;
      }
      return true;
    });
    if (allValidCoordinates.length === 0) {
      allValidCoordinates = BOARD_SUPPLY_CHAINS.flat().map((stage) => stage.coordinate);
    }
    for (const stageCoordinate of allValidCoordinates) {
      if (isEqual(stageCoordinate, coordinate))
        return true;
    }
    return false;
  }
  isPlaced(playerId) {
    return this.context.events.filter(guardForGameEventType("placement")).filter((event) => event.playerId === playerId && event.finalized).length > 0;
  }
  get defendedStages() {
    return this.attackedAndDefendedStages.defended;
  }
  get attackedStages() {
    return this.attackedAndDefendedStages.attacked;
  }
  // Returns a random number, but always the same for i
  getRandomNumber(i) {
    return this.randomNumbers[Math.round(i) % this.randomNumbers.length];
  }
  attackedAndDefendedStagesCache;
  get attackedAndDefendedStages() {
    if (this.attackedAndDefendedStagesCache)
      return this.attackedAndDefendedStagesCache;
    const attackedStages = [];
    const defendedStages = [];
    let defendedStagesInSection = [];
    this.finalizedActionEvents.forEach((event, i) => {
      const round = Math.floor(i / this.playersInOrder.length);
      if (isActionEventOf(event, "attack")) {
        attackedStages.push(getStageAt(event.position));
      } else if (isActionEventOf(event, "defend")) {
        defendedStages.push(getStageAt(event.position));
        defendedStagesInSection.push(getStageAt(event.position).id);
      }
      if ((i + 1) % (this.playersInOrder.length * 3) === 0 && this.nextEventType !== "reaction") {
        const section = Math.floor(round / 3);
        const globalAttack = this.globalAttackScenario.attacks[section];
        globalAttack.targets.forEach((attackedStage) => {
          if (!defendedStagesInSection.includes(attackedStage.stageId)) {
            const allAvailableStages = BOARD_SUPPLY_CHAINS.flat().filter((stage) => stage.id === attackedStage.stageId).filter(
              (stage) => ![...defendedStages, ...attackedStages].find(
                (s) => isEqual(s.coordinate, stage.coordinate)
              )
            );
            if (allAvailableStages.length > 0) {
              attackedStages.push(
                allAvailableStages[Math.floor(allAvailableStages.length * this.getRandomNumber(i))]
              );
            }
          }
        });
        defendedStagesInSection = [];
      }
      const chainAttackCounts = [
        attackedStages.filter((stage) => stage.supplyChainId === 0).length,
        attackedStages.filter((stage) => stage.supplyChainId === 1).length,
        attackedStages.filter((stage) => stage.supplyChainId === 2).length
      ];
      chainAttackCounts.forEach((count, chainId) => {
        if (count >= 3) {
          const otherStages = BOARD_SUPPLY_CHAINS[chainId].filter((stage) => ![...attackedStages, ...defendedStages].includes(stage));
          attackedStages.push(...otherStages);
        }
      });
    });
    return this.attackedAndDefendedStagesCache = {
      attacked: attackedStages,
      defended: defendedStages
    };
  }
  isDefended(position) {
    return !!this.defendedStages.find((stage) => isEqual(stage.coordinate, position));
  }
  isAttacked(position) {
    return !!this.attackedStages.find((stage) => isEqual(stage.coordinate, position));
  }
  get activeTargetedAttacks() {
    const attackCount = 3 * (Math.floor(this.currentRound / 3) + 1);
    return this.context.targetedAttacks.slice(0, attackCount).map((attackIndex) => TARGETED_ATTACKS[attackIndex]);
  }
  get activeGlobalAttackIndex() {
    return Math.floor(this.currentRound / 3);
  }
  get activeGlobalAttack() {
    return this.globalAttackScenario.attacks[this.activeGlobalAttackIndex];
  }
  get globalAttackScenario() {
    return GLOBAL_ATTACK_SCENARIOS[this.context.globalAttackScenario];
  }
  /** All targeted attacks for which the user has all required items. */
  get executableAttacks() {
    return this.activeTargetedAttacks.filter(
      (attack) => attack.target.requiredItems.every((item) => this.attackInventory[item] > 0)
    );
  }
  get executableDefenseStages() {
    return STAGES.filter(
      (stage) => stage.defenseItems.every((item) => this.defenseInventory[item] > 0)
    );
  }
  static isReachable(a, b) {
    return a[0] === b[0] && Math.abs(a[1] - b[1]) <= 1 || a[1] === b[1] && Math.abs(a[0] - b[0]) <= 1;
  }
  /** Stages that are reachable by the attacker. */
  get reachableStages() {
    return BOARD_SUPPLY_CHAINS.flat().filter(
      (stage) => GameState.isReachable(stage.coordinate, this.activePlayerPosition)
    );
  }
  /** All stages that are reachable and can be attacked. */
  get attackableStages() {
    return this.reachableStages.filter(
      (stage) => !this.isAttacked(stage.coordinate) && !this.isDefended(stage.coordinate) && this.executableAttacks.find(
        (attack) => attack.target.stageId === stage.id && attack.target.supplyChainId === stage.supplyChainId
      )
    );
  }
  /** Returns the stage of the player position if all required conditions are met. */
  get canDefendStage() {
    const currentStage = findStageAt(this.activePlayerPosition);
    if (!currentStage)
      return false;
    if (this.isAttacked(currentStage.coordinate) || this.isDefended(currentStage.coordinate)) {
      return false;
    }
    return !!this.executableDefenseStages.find((stage) => stage.id === currentStage.id);
  }
  get score() {
    const attack = this.attackedStages.length;
    const defense = this.defendedStages.length;
    return {
      attack,
      defense
    };
  }
  /**
   * Returns the "active" question, meaning: if the last *finalized* action was
   * an action that requires a reaction.
   */
  get activeQuestion() {
    const lastEvent = this.finalizedActionEvents.at(-1);
    if (lastEvent) {
      if (lastEvent.action === "ask-question")
        return lastEvent.question;
      if (gameEventRequiresReaction(lastEvent)) {
        return lastEvent.action;
      }
    }
    return void 0;
  }
}
const sharedGuards = {
  // TODO
  gameFinished: ({ context }) => GameState.fromContext(context).isFinished,
  /** All users have been assigned a side, and there is at least one admin on both sides */
  allSidesAssigned: ({ context }) => context.users.every((user) => user.isSideAssigned) && !!context.users.find((user) => user.side === "defense" && user.isAdmin) && !!context.users.find((user) => user.side === "attack" && user.isAdmin),
  /** The admin said that they finished assigning the sides */
  finishedAssigningSides: ({ context }) => context.finishedAssigningSides,
  /** Both, defense and attack has all players configured */
  allRolesAssigned: ({ context }) => context.attack.attacker.isConfigured && context.defense.defenders.every((defender) => defender.isConfigured),
  // TODO
  finishedAssigningRoles: ({ context }) => context.attack.finishedAssigning && context.defense.finishedAssigning,
  attackerShouldBeVisible: () => false,
  attackerShouldBeInvisible: () => false
};

// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis
function getGlobal() {
  if (typeof globalThis !== 'undefined') {
    return globalThis;
  }
  if (typeof self !== 'undefined') {
    return self;
  }
  if (typeof window !== 'undefined') {
    return window;
  }
  if (typeof global !== 'undefined') {
    return global;
  }
}
function getDevTools() {
  const w = getGlobal();
  if (!!w.__xstate__) {
    return w.__xstate__;
  }
  return undefined;
}
const devToolsAdapter = service => {
  if (typeof window === 'undefined') {
    return;
  }
  const devTools = getDevTools();
  if (devTools) {
    devTools.register(service);
  }
};

// https://github.com/microsoft/TypeScript/issues/23182#issuecomment-379091887

// TODO: replace in v5 with:
// export type IndexByType<T extends { type: string }> = { [E in T as E['type']]: E; };

/**
 * The full definition of an event, with a string `type`.
 */

// TODO: do not accept machines without all implementations
// we should also accept a raw machine as actor logic here
// or just make machine actor logic

// TODO: narrow this to logic from machine

/**
 * The string or object representing the state value relative to the parent state node.
 *
 * - For a child atomic state node, this is a string, e.g., `"pending"`.
 * - For complex state nodes, this is an object, e.g., `{ success: "someChildState" }`.
 */

// TODO: remove once TS fixes this type-widening issue

// TODO: possibly refactor this somehow, use even a simpler type, and maybe even make `machine.options` private or something

let ConstantPrefix = /*#__PURE__*/function (ConstantPrefix) {
  ConstantPrefix["After"] = "xstate.after";
  ConstantPrefix["DoneState"] = "done.state";
  ConstantPrefix["DoneInvoke"] = "done.invoke";
  ConstantPrefix["ErrorExecution"] = "error.execution";
  ConstantPrefix["ErrorCommunication"] = "error.communication";
  ConstantPrefix["ErrorPlatform"] = "error.platform";
  ConstantPrefix["ErrorCustom"] = "xstate.error";
  return ConstantPrefix;
}({});

ConstantPrefix.After;
ConstantPrefix.DoneState;
const errorExecution = ConstantPrefix.ErrorExecution;
const errorPlatform = ConstantPrefix.ErrorPlatform;
ConstantPrefix.ErrorCustom;

const STATE_DELIMITER = '.';
const TARGETLESS_KEY = '';
const NULL_EVENT = '';
const STATE_IDENTIFIER$1 = '#';
const WILDCARD = '*';
const INIT_TYPE = 'xstate.init';

const cache = new WeakMap();
function memo(object, key, fn) {
  let memoizedData = cache.get(object);
  if (!memoizedData) {
    memoizedData = {
      [key]: fn()
    };
    cache.set(object, memoizedData);
  } else if (!(key in memoizedData)) {
    memoizedData[key] = fn();
  }
  return memoizedData[key];
}

function resolve$7(_, state, actionArgs, {
  sendId
}) {
  const resolvedSendId = typeof sendId === 'function' ? sendId(actionArgs) : sendId;
  return [state, resolvedSendId];
}
function execute$4(actorContext, resolvedSendId) {
  actorContext.self.cancel(resolvedSendId);
}

/**
 * Cancels an in-flight `send(...)` action. A canceled sent action will not
 * be executed, nor will its event be sent, unless it has already been sent
 * (e.g., if `cancel(...)` is called after the `send(...)` action's `delay`).
 *
 * @param sendId The `id` of the `send(...)` action to cancel.
 */
function cancel(sendId) {
  function cancel(_) {
  }
  cancel.type = 'xstate.cancel';
  cancel.sendId = sendId;
  cancel.resolve = resolve$7;
  cancel.execute = execute$4;
  return cancel;
}

class Mailbox {
  constructor(_process) {
    this._process = _process;
    this._active = false;
    this._current = null;
    this._last = null;
  }
  start() {
    this._active = true;
    this.flush();
  }
  clear() {
    // we can't set _current to null because we might be currently processing
    // and enqueue following clear shouldnt start processing the enqueued item immediately
    if (this._current) {
      this._current.next = null;
      this._last = this._current;
    }
  }

  // TODO: rethink this design
  prepend(event) {
    if (!this._current) {
      this.enqueue(event);
      return;
    }

    // we know that something is already queued up
    // so the mailbox is already flushing or it's inactive
    // therefore the only thing that we need to do is to reassign `this._current`
    this._current = {
      value: event,
      next: this._current
    };
  }
  enqueue(event) {
    const enqueued = {
      value: event,
      next: null
    };
    if (this._current) {
      this._last.next = enqueued;
      this._last = enqueued;
      return;
    }
    this._current = enqueued;
    this._last = enqueued;
    if (this._active) {
      this.flush();
    }
  }
  flush() {
    while (this._current) {
      // atm the given _process is responsible for implementing proper try/catch handling
      // we assume here that this won't throw in a way that can affect this mailbox
      const consumed = this._current;
      this._process(consumed.value);
      // something could have been prepended in the meantime
      // so we need to be defensive here to avoid skipping over a prepended item
      if (consumed === this._current) {
        this._current = this._current.next;
      }
    }
    this._last = null;
  }
}

const symbolObservable = (() => typeof Symbol === 'function' && Symbol.observable || '@@observable')();

const resolveEventType = '$$xstate.resolve';
const rejectEventType = '$$xstate.reject';
function fromPromise(
// TODO: add types
promiseCreator) {
  // TODO: add event types, consider making the `PromiseEvent` a private type or smth alike
  const logic = {
    config: promiseCreator,
    transition: (state, event) => {
      if (state.status !== 'active') {
        return state;
      }
      switch (event.type) {
        case resolveEventType:
          return {
            ...state,
            status: 'done',
            data: event.data,
            input: undefined
          };
        case rejectEventType:
          return {
            ...state,
            status: 'error',
            data: event.data,
            input: undefined
          };
        case stopSignalType:
          return {
            ...state,
            status: 'canceled',
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
        system
      }));
      resolvedPromise.then(response => {
        // TODO: remove this condition once dead letter queue lands
        if (self._state.status !== 'active') {
          return;
        }
        self.send({
          type: resolveEventType,
          data: response
        });
      }, errorData => {
        // TODO: remove this condition once dead letter queue lands
        if (self._state.status !== 'active') {
          return;
        }
        self.send({
          type: rejectEventType,
          data: errorData
        });
      });
    },
    getInitialState: (_, input) => {
      return {
        status: 'active',
        data: undefined,
        input
      };
    },
    getSnapshot: state => state.data,
    getStatus: state => state,
    getPersistedState: state => state,
    restoreState: state => state
  };
  return logic;
}

function matchesState(parentStateId, childStateId) {
  const parentStateValue = toStateValue(parentStateId);
  const childStateValue = toStateValue(childStateId);
  if (typeof childStateValue === 'string') {
    if (typeof parentStateValue === 'string') {
      return childStateValue === parentStateValue;
    }

    // Parent more specific than child
    return false;
  }
  if (typeof parentStateValue === 'string') {
    return parentStateValue in childStateValue;
  }
  return Object.keys(parentStateValue).every(key => {
    if (!(key in childStateValue)) {
      return false;
    }
    return matchesState(parentStateValue[key], childStateValue[key]);
  });
}
function toStatePath(stateId) {
  try {
    if (isArray(stateId)) {
      return stateId;
    }
    return stateId.toString().split(STATE_DELIMITER);
  } catch (e) {
    throw new Error(`'${stateId}' is not a valid state path.`);
  }
}
function isStateLike(state) {
  return typeof state === 'object' && 'value' in state && 'context' in state && 'event' in state;
}
function toStateValue(stateValue) {
  if (isStateLike(stateValue)) {
    return stateValue.value;
  }
  if (isArray(stateValue)) {
    return pathToStateValue(stateValue);
  }
  if (typeof stateValue !== 'string') {
    return stateValue;
  }
  const statePath = toStatePath(stateValue);
  return pathToStateValue(statePath);
}
function pathToStateValue(statePath) {
  if (statePath.length === 1) {
    return statePath[0];
  }
  const value = {};
  let marker = value;
  for (let i = 0; i < statePath.length - 1; i++) {
    if (i === statePath.length - 2) {
      marker[statePath[i]] = statePath[i + 1];
    } else {
      const previous = marker;
      marker = {};
      previous[statePath[i]] = marker;
    }
  }
  return value;
}
function mapValues(collection, iteratee) {
  const result = {};
  const collectionKeys = Object.keys(collection);
  for (let i = 0; i < collectionKeys.length; i++) {
    const key = collectionKeys[i];
    result[key] = iteratee(collection[key], key, collection, i);
  }
  return result;
}
function flatten(array) {
  return [].concat(...array);
}
function toArrayStrict(value) {
  if (isArray(value)) {
    return value;
  }
  return [value];
}
function toArray(value) {
  if (value === undefined) {
    return [];
  }
  return toArrayStrict(value);
}
function mapContext(mapper, context, event) {
  if (typeof mapper === 'function') {
    return mapper({
      context,
      event
    });
  }
  const result = {};
  const args = {
    context,
    event
  };
  for (const key of Object.keys(mapper)) {
    const subMapper = mapper[key];
    if (typeof subMapper === 'function') {
      result[key] = subMapper(args);
    } else {
      result[key] = subMapper;
    }
  }
  return result;
}
function isArray(value) {
  return Array.isArray(value);
}
function isErrorEvent(event) {
  return typeof event.type === 'string' && (event.type === errorExecution || event.type.startsWith(errorPlatform));
}
function toTransitionConfigArray(configLike) {
  return toArrayStrict(configLike).map(transitionLike => {
    if (typeof transitionLike === 'undefined' || typeof transitionLike === 'string') {
      return {
        target: transitionLike
      };
    }
    return transitionLike;
  });
}
function normalizeTarget(target) {
  if (target === undefined || target === TARGETLESS_KEY) {
    return undefined;
  }
  return toArray(target);
}
function toInvokeConfig(invocable, id) {
  if (typeof invocable === 'object') {
    if ('src' in invocable) {
      return invocable;
    }
    if ('transition' in invocable) {
      return {
        id,
        src: invocable
      };
    }
  }
  return {
    id,
    src: invocable
  };
}
function toObserver(nextHandler, errorHandler, completionHandler) {
  const noop = () => {};
  const isObserver = typeof nextHandler === 'object';
  const self = isObserver ? nextHandler : null;
  return {
    next: ((isObserver ? nextHandler.next : nextHandler) || noop).bind(self),
    error: ((isObserver ? nextHandler.error : errorHandler) || noop).bind(self),
    complete: ((isObserver ? nextHandler.complete : completionHandler) || noop).bind(self)
  };
}
function createInvokeId(stateNodeId, index) {
  return `${stateNodeId}:invocation[${index}]`;
}
function resolveReferencedActor(referenced) {
  return referenced ? 'transition' in referenced ? {
    src: referenced,
    input: undefined
  } : referenced : undefined;
}
const stopSignalType = 'xstate.stop';

function createSystem() {
  let sessionIdCounter = 0;
  const children = new Map();
  const keyedActors = new Map();
  const reverseKeyedActors = new WeakMap();
  const system = {
    _bookId: () => `x:${sessionIdCounter++}`,
    _register: (sessionId, actorRef) => {
      children.set(sessionId, actorRef);
      return sessionId;
    },
    _unregister: actorRef => {
      children.delete(actorRef.sessionId);
      const systemId = reverseKeyedActors.get(actorRef);
      if (systemId !== undefined) {
        keyedActors.delete(systemId);
        reverseKeyedActors.delete(actorRef);
      }
    },
    get: systemId => {
      return keyedActors.get(systemId);
    },
    _set: (systemId, actorRef) => {
      const existing = keyedActors.get(systemId);
      if (existing && existing !== actorRef) {
        throw new Error(`Actor with system ID '${systemId}' already exists.`);
      }
      keyedActors.set(systemId, actorRef);
      reverseKeyedActors.set(actorRef, systemId);
    }
  };
  return system;
}

let ActorStatus = /*#__PURE__*/function (ActorStatus) {
  ActorStatus[ActorStatus["NotStarted"] = 0] = "NotStarted";
  ActorStatus[ActorStatus["Running"] = 1] = "Running";
  ActorStatus[ActorStatus["Stopped"] = 2] = "Stopped";
  return ActorStatus;
}({});
const defaultOptions = {
  deferEvents: true,
  clock: {
    setTimeout: (fn, ms) => {
      return setTimeout(fn, ms);
    },
    clearTimeout: id => {
      return clearTimeout(id);
    }
  },
  logger: console.log.bind(console),
  devTools: false
};
class Interpreter {
  /**
   * The current state of the interpreted logic.
   */

  /**
   * The clock that is responsible for setting and clearing timeouts, such as delayed events and transitions.
   */

  /**
   * The unique identifier for this actor relative to its parent.
   */

  /**
   * Whether the service is started.
   */

  // Actor Ref

  // TODO: add typings for system

  /**
   * The globally unique process ID for this invocation.
   */

  /**
   * Creates a new Interpreter instance (i.e., service) for the given logic with the provided options, if any.
   *
   * @param logic The logic to be interpreted
   * @param options Interpreter options
   */
  constructor(logic, options) {
    this.logic = logic;
    this._state = void 0;
    this.clock = void 0;
    this.options = void 0;
    this.id = void 0;
    this.mailbox = new Mailbox(this._process.bind(this));
    this.delayedEventsMap = {};
    this.observers = new Set();
    this.logger = void 0;
    this.status = ActorStatus.NotStarted;
    this._parent = void 0;
    this.ref = void 0;
    this._actorContext = void 0;
    this._systemId = void 0;
    this.sessionId = void 0;
    this.system = void 0;
    this._doneEvent = void 0;
    this.src = void 0;
    this._deferred = [];
    const resolvedOptions = {
      ...defaultOptions,
      ...options
    };
    const {
      clock,
      logger,
      parent,
      id,
      systemId
    } = resolvedOptions;
    const self = this;
    this.system = parent?.system ?? createSystem();
    if (systemId) {
      this._systemId = systemId;
      this.system._set(systemId, this);
    }
    this.sessionId = this.system._bookId();
    this.id = id ?? this.sessionId;
    this.logger = logger;
    this.clock = clock;
    this._parent = parent;
    this.options = resolvedOptions;
    this.src = resolvedOptions.src;
    this.ref = this;
    this._actorContext = {
      self,
      id: this.id,
      sessionId: this.sessionId,
      logger: this.logger,
      defer: fn => {
        this._deferred.push(fn);
      },
      system: this.system,
      stopChild: child => {
        if (child._parent !== this) {
          throw new Error(`Cannot stop child actor ${child.id} of ${this.id} because it is not a child`);
        }
        child._stop();
      }
    };

    // Ensure that the send method is bound to this interpreter instance
    // if destructured
    this.send = this.send.bind(this);
    this._initState();
  }
  _initState() {
    this._state = this.options.state ? this.logic.restoreState ? this.logic.restoreState(this.options.state, this._actorContext) : this.options.state : this.logic.getInitialState(this._actorContext, this.options?.input);
  }

  // array of functions to defer

  update(state) {
    // Update state
    this._state = state;
    const snapshot = this.getSnapshot();

    // Execute deferred effects
    let deferredFn;
    while (deferredFn = this._deferred.shift()) {
      deferredFn();
    }
    for (const observer of this.observers) {
      observer.next?.(snapshot);
    }
    const status = this.logic.getStatus?.(state);
    switch (status?.status) {
      case 'done':
        this._stopProcedure();
        this._doneEvent = doneInvoke(this.id, status.data);
        this._parent?.send(this._doneEvent);
        this._complete();
        break;
      case 'error':
        this._stopProcedure();
        this._parent?.send(error(this.id, status.data));
        this._error(status.data);
        break;
    }
  }
  subscribe(nextListenerOrObserver, errorListener, completeListener) {
    const observer = toObserver(nextListenerOrObserver, errorListener, completeListener);
    this.observers.add(observer);
    if (this.status === ActorStatus.Stopped) {
      observer.complete?.();
      this.observers.delete(observer);
    }
    return {
      unsubscribe: () => {
        this.observers.delete(observer);
      }
    };
  }

  /**
   * Starts the interpreter from the initial state
   */
  start() {
    if (this.status === ActorStatus.Running) {
      // Do not restart the service if it is already started
      return this;
    }
    this.system._register(this.sessionId, this);
    if (this._systemId) {
      this.system._set(this._systemId, this);
    }
    this.status = ActorStatus.Running;
    if (this.logic.start) {
      this.logic.start(this._state, this._actorContext);
    }

    // TODO: this notifies all subscribers but usually this is redundant
    // there is no real change happening here
    // we need to rethink if this needs to be refactored
    this.update(this._state);
    if (this.options.devTools) {
      this.attachDevTools();
    }
    this.mailbox.start();
    return this;
  }
  _process(event) {
    try {
      const nextState = this.logic.transition(this._state, event, this._actorContext);
      this.update(nextState);
      if (event.type === stopSignalType) {
        this._stopProcedure();
        this._complete();
      }
    } catch (err) {
      // TODO: properly handle errors
      if (this.observers.size > 0) {
        this.observers.forEach(observer => {
          observer.error?.(err);
        });
        this.stop();
      } else {
        throw err;
      }
    }
  }
  _stop() {
    if (this.status === ActorStatus.Stopped) {
      return this;
    }
    this.mailbox.clear();
    if (this.status === ActorStatus.NotStarted) {
      this.status = ActorStatus.Stopped;
      return this;
    }
    this.mailbox.enqueue({
      type: stopSignalType
    });
    return this;
  }

  /**
   * Stops the interpreter and unsubscribe all listeners.
   */
  stop() {
    if (this._parent) {
      throw new Error('A non-root actor cannot be stopped directly.');
    }
    return this._stop();
  }
  _complete() {
    for (const observer of this.observers) {
      observer.complete?.();
    }
    this.observers.clear();
  }
  _error(data) {
    for (const observer of this.observers) {
      observer.error?.(data);
    }
    this.observers.clear();
  }
  _stopProcedure() {
    if (this.status !== ActorStatus.Running) {
      // Interpreter already stopped; do nothing
      return this;
    }

    // Cancel all delayed events
    for (const key of Object.keys(this.delayedEventsMap)) {
      this.clock.clearTimeout(this.delayedEventsMap[key]);
    }

    // TODO: mailbox.reset
    this.mailbox.clear();
    // TODO: after `stop` we must prepare ourselves for receiving events again
    // events sent *after* stop signal must be queued
    // it seems like this should be the common behavior for all of our consumers
    // so perhaps this should be unified somehow for all of them
    this.mailbox = new Mailbox(this._process.bind(this));
    this.status = ActorStatus.Stopped;
    this.system._unregister(this);
    return this;
  }

  /**
   * Sends an event to the running interpreter to trigger a transition.
   *
   * @param event The event to send
   */
  send(event) {
    if (typeof event === 'string') {
      throw new Error(`Only event objects may be sent to actors; use .send({ type: "${event}" }) instead`);
    }
    if (this.status === ActorStatus.Stopped) {
      return;
    }
    if (this.status !== ActorStatus.Running && !this.options.deferEvents) {
      throw new Error(`Event "${event.type}" was sent to uninitialized actor "${this.id
      // tslint:disable-next-line:max-line-length
      }". Make sure .start() is called for this actor, or set { deferEvents: true } in the actor options.\nEvent: ${JSON.stringify(event)}`);
    }
    this.mailbox.enqueue(event);
  }

  // TODO: make private (and figure out a way to do this within the machine)
  delaySend({
    event,
    id,
    delay,
    to
  }) {
    const timerId = this.clock.setTimeout(() => {
      if (to) {
        to.send(event);
      } else {
        this.send(event);
      }
    }, delay);

    // TODO: consider the rehydration story here
    if (id) {
      this.delayedEventsMap[id] = timerId;
    }
  }

  // TODO: make private (and figure out a way to do this within the machine)
  cancel(sendId) {
    this.clock.clearTimeout(this.delayedEventsMap[sendId]);
    delete this.delayedEventsMap[sendId];
  }
  attachDevTools() {
    const {
      devTools
    } = this.options;
    if (devTools) {
      const resolvedDevToolsAdapter = typeof devTools === 'function' ? devTools : devToolsAdapter;
      resolvedDevToolsAdapter(this);
    }
  }
  toJSON() {
    return {
      id: this.id
    };
  }
  getPersistedState() {
    return this.logic.getPersistedState?.(this._state);
  }
  [symbolObservable]() {
    return this;
  }
  getSnapshot() {
    return this.logic.getSnapshot ? this.logic.getSnapshot(this._state) : this._state;
  }
}

/**
 * Creates a new Interpreter instance for the given machine with the provided options, if any.
 *
 * @param machine The machine to interpret
 * @param options Interpreter options
 */

function interpret(logic, options) {
  const interpreter = new Interpreter(logic, options);
  return interpreter;
}

function resolve$6(actorContext, state, actionArgs, {
  id,
  systemId,
  src,
  input
}) {
  const referenced = resolveReferencedActor(state.machine.implementations.actors[src]);
  let actorRef;
  if (referenced) {
    // TODO: inline `input: undefined` should win over the referenced one
    const configuredInput = input || referenced.input;
    actorRef = interpret(referenced.src, {
      id,
      src,
      parent: actorContext?.self,
      systemId,
      input: typeof configuredInput === 'function' ? configuredInput({
        context: state.context,
        event: actionArgs.event,
        self: actorContext?.self
      }) : configuredInput
    });
  }
  return [cloneState(state, {
    children: {
      ...state.children,
      [id]: actorRef
    }
  }), {
    id,
    actorRef
  }];
}
function execute$3(actorContext, {
  id,
  actorRef
}) {
  if (!actorRef) {
    return;
  }
  actorContext.defer(() => {
    if (actorRef.status === ActorStatus.Stopped) {
      return;
    }
    try {
      actorRef.start?.();
    } catch (err) {
      actorContext.self.send(error(id, err));
      return;
    }
  });
}
function invoke({
  id,
  systemId,
  src,
  input
}) {
  function invoke(_) {
  }
  invoke.type = 'xstate.invoke';
  invoke.id = id;
  invoke.systemId = systemId;
  invoke.src = src;
  invoke.input = input;
  invoke.resolve = resolve$6;
  invoke.execute = execute$3;
  return invoke;
}
function not(guard) {
  return {
    type: 'xstate.boolean',
    params: {
      op: 'not'
    },
    children: [toGuardDefinition(guard)],
    predicate: ({
      evaluate,
      guard,
      context,
      event,
      state
    }) => {
      return !evaluate(guard.children[0], context, event, state);
    }
  };
}
function and(guards) {
  return {
    type: 'xstate.boolean',
    params: {
      op: 'and'
    },
    children: guards.map(guard => toGuardDefinition(guard)),
    predicate: ({
      evaluate,
      guard,
      context,
      event,
      state
    }) => {
      return guard.children.every(childGuard => {
        return evaluate(childGuard, context, event, state);
      });
    }
  };
}
function evaluateGuard(guard, context, event, state) {
  const {
    machine
  } = state;
  const predicate = machine?.implementations?.guards?.[guard.type] ?? guard.predicate;
  if (!predicate) {
    throw new Error(`Guard '${guard.type}' is not implemented.'.`);
  }
  return predicate({
    context,
    event,
    state,
    guard,
    evaluate: evaluateGuard
  });
}
function toGuardDefinition(guardConfig, getPredicate) {
  // TODO: check for cycles and consider a refactor to more lazily evaluated guards
  // TODO: resolve this more recursively: https://github.com/statelyai/xstate/pull/4064#discussion_r1229915724
  if (typeof guardConfig === 'string') {
    const predicateOrDef = getPredicate?.(guardConfig);
    if (typeof predicateOrDef === 'function') {
      return {
        type: guardConfig,
        predicate: predicateOrDef,
        params: {
          type: guardConfig
        }
      };
    } else if (predicateOrDef) {
      return predicateOrDef;
    } else {
      return {
        type: guardConfig,
        params: {
          type: guardConfig
        }
      };
    }
  }
  if (typeof guardConfig === 'function') {
    return {
      type: guardConfig.name,
      predicate: guardConfig,
      params: {
        type: guardConfig.name,
        name: guardConfig.name
      }
    };
  }
  const predicateOrDef = getPredicate?.(guardConfig.type);
  if (typeof predicateOrDef === 'function') {
    return {
      type: guardConfig.type,
      params: guardConfig.params || guardConfig,
      children: guardConfig.children?.map(childGuard => toGuardDefinition(childGuard, getPredicate)),
      predicate: getPredicate?.(guardConfig.type) || guardConfig.predicate
    };
  } else if (predicateOrDef) {
    return predicateOrDef;
  } else {
    return {
      type: guardConfig.type,
      params: guardConfig.params || guardConfig,
      children: guardConfig.children?.map(childGuard => toGuardDefinition(childGuard, getPredicate)),
      predicate: guardConfig.predicate
    };
  }
}

function getOutput(configuration, context, event) {
  const machine = configuration[0].machine;
  const finalChildStateNode = configuration.find(stateNode => stateNode.type === 'final' && stateNode.parent === machine.root);
  return finalChildStateNode && finalChildStateNode.output ? mapContext(finalChildStateNode.output, context, event) : undefined;
}
const isAtomicStateNode = stateNode => stateNode.type === 'atomic' || stateNode.type === 'final';
function getChildren(stateNode) {
  return Object.values(stateNode.states).filter(sn => sn.type !== 'history');
}
function getProperAncestors(stateNode, toStateNode) {
  const ancestors = [];

  // add all ancestors
  let m = stateNode.parent;
  while (m && m !== toStateNode) {
    ancestors.push(m);
    m = m.parent;
  }
  return ancestors;
}
function getConfiguration(stateNodes) {
  const configuration = new Set(stateNodes);
  const configurationSet = new Set(stateNodes);
  const adjList = getAdjList(configurationSet);

  // add descendants
  for (const s of configuration) {
    // if previously active, add existing child nodes
    if (s.type === 'compound' && (!adjList.get(s) || !adjList.get(s).length)) {
      getInitialStateNodes(s).forEach(sn => configurationSet.add(sn));
    } else {
      if (s.type === 'parallel') {
        for (const child of getChildren(s)) {
          if (child.type === 'history') {
            continue;
          }
          if (!configurationSet.has(child)) {
            for (const initialStateNode of getInitialStateNodes(child)) {
              configurationSet.add(initialStateNode);
            }
          }
        }
      }
    }
  }

  // add all ancestors
  for (const s of configurationSet) {
    let m = s.parent;
    while (m) {
      configurationSet.add(m);
      m = m.parent;
    }
  }
  return configurationSet;
}
function getValueFromAdj(baseNode, adjList) {
  const childStateNodes = adjList.get(baseNode);
  if (!childStateNodes) {
    return {}; // todo: fix?
  }

  if (baseNode.type === 'compound') {
    const childStateNode = childStateNodes[0];
    if (childStateNode) {
      if (isAtomicStateNode(childStateNode)) {
        return childStateNode.key;
      }
    } else {
      return {};
    }
  }
  const stateValue = {};
  for (const childStateNode of childStateNodes) {
    stateValue[childStateNode.key] = getValueFromAdj(childStateNode, adjList);
  }
  return stateValue;
}
function getAdjList(configuration) {
  const adjList = new Map();
  for (const s of configuration) {
    if (!adjList.has(s)) {
      adjList.set(s, []);
    }
    if (s.parent) {
      if (!adjList.has(s.parent)) {
        adjList.set(s.parent, []);
      }
      adjList.get(s.parent).push(s);
    }
  }
  return adjList;
}
function getStateValue(rootNode, configuration) {
  const config = getConfiguration(configuration);
  return getValueFromAdj(rootNode, getAdjList(config));
}
function isInFinalState(configuration, stateNode = configuration[0].machine.root) {
  if (stateNode.type === 'compound') {
    return getChildren(stateNode).some(s => s.type === 'final' && configuration.includes(s));
  }
  if (stateNode.type === 'parallel') {
    return getChildren(stateNode).every(sn => isInFinalState(configuration, sn));
  }
  return false;
}
const isStateId = str => str[0] === STATE_IDENTIFIER$1;
function getCandidates(stateNode, receivedEventType) {
  const candidates = stateNode.transitions.get(receivedEventType) || [...stateNode.transitions.keys()].filter(descriptor => {
    // check if transition is a wildcard transition,
    // which matches any non-transient events
    if (descriptor === WILDCARD) {
      return true;
    }
    if (!descriptor.endsWith('.*')) {
      return false;
    }
    const partialEventTokens = descriptor.split('.');
    const eventTokens = receivedEventType.split('.');
    for (let tokenIndex = 0; tokenIndex < partialEventTokens.length; tokenIndex++) {
      const partialEventToken = partialEventTokens[tokenIndex];
      const eventToken = eventTokens[tokenIndex];
      if (partialEventToken === '*') {
        const isLastToken = tokenIndex === partialEventTokens.length - 1;
        return isLastToken;
      }
      if (partialEventToken !== eventToken) {
        return false;
      }
    }
    return true;
  }).sort((a, b) => b.length - a.length).flatMap(key => stateNode.transitions.get(key));
  return candidates;
}

/**
 * All delayed transitions from the config.
 */
function getDelayedTransitions(stateNode) {
  const afterConfig = stateNode.config.after;
  if (!afterConfig) {
    return [];
  }
  const mutateEntryExit = (delay, i) => {
    const delayRef = typeof delay === 'function' ? `${stateNode.id}:delay[${i}]` : delay;
    const eventType = after(delayRef, stateNode.id);
    stateNode.entry.push(raise({
      type: eventType
    }, {
      id: eventType,
      delay
    }));
    stateNode.exit.push(cancel(eventType));
    return eventType;
  };
  const delayedTransitions = isArray(afterConfig) ? afterConfig.map((transition, i) => {
    const eventType = mutateEntryExit(transition.delay, i);
    return {
      ...transition,
      event: eventType
    };
  }) : Object.keys(afterConfig).flatMap((delay, i) => {
    const configTransition = afterConfig[delay];
    const resolvedTransition = typeof configTransition === 'string' ? {
      target: configTransition
    } : configTransition;
    const resolvedDelay = !isNaN(+delay) ? +delay : delay;
    const eventType = mutateEntryExit(resolvedDelay, i);
    return toArray(resolvedTransition).map(transition => ({
      ...transition,
      event: eventType,
      delay: resolvedDelay
    }));
  });
  return delayedTransitions.map(delayedTransition => {
    const {
      delay
    } = delayedTransition;
    return {
      ...formatTransition(stateNode, delayedTransition.event, delayedTransition),
      delay
    };
  });
}
function formatTransition(stateNode, descriptor, transitionConfig) {
  const normalizedTarget = normalizeTarget(transitionConfig.target);
  const reenter = transitionConfig.reenter ?? false;
  const {
    guards
  } = stateNode.machine.implementations;
  const target = resolveTarget(stateNode, normalizedTarget);
  const transition = {
    ...transitionConfig,
    actions: toArray(transitionConfig.actions),
    guard: transitionConfig.guard ? toGuardDefinition(transitionConfig.guard, guardType => guards[guardType]) : undefined,
    target,
    source: stateNode,
    reenter,
    eventType: descriptor,
    toJSON: () => ({
      ...transition,
      source: `#${stateNode.id}`,
      target: target ? target.map(t => `#${t.id}`) : undefined
    })
  };
  return transition;
}
function formatTransitions(stateNode) {
  const transitions = new Map();
  if (stateNode.config.on) {
    for (const descriptor of Object.keys(stateNode.config.on)) {
      if (descriptor === NULL_EVENT) {
        throw new Error('Null events ("") cannot be specified as a transition key. Use `always: { ... }` instead.');
      }
      const transitionsConfig = stateNode.config.on[descriptor];
      transitions.set(descriptor, toTransitionConfigArray(transitionsConfig).map(t => formatTransition(stateNode, descriptor, t)));
    }
  }
  if (stateNode.config.onDone) {
    const descriptor = String(done(stateNode.id));
    transitions.set(descriptor, toTransitionConfigArray(stateNode.config.onDone).map(t => formatTransition(stateNode, descriptor, t)));
  }
  for (const invokeDef of stateNode.invoke) {
    if (invokeDef.onDone) {
      const descriptor = `done.invoke.${invokeDef.id}`;
      transitions.set(descriptor, toTransitionConfigArray(invokeDef.onDone).map(t => formatTransition(stateNode, descriptor, t)));
    }
    if (invokeDef.onError) {
      const descriptor = `error.platform.${invokeDef.id}`;
      transitions.set(descriptor, toTransitionConfigArray(invokeDef.onError).map(t => formatTransition(stateNode, descriptor, t)));
    }
    if (invokeDef.onSnapshot) {
      const descriptor = `xstate.snapshot.${invokeDef.id}`;
      transitions.set(descriptor, toTransitionConfigArray(invokeDef.onSnapshot).map(t => formatTransition(stateNode, descriptor, t)));
    }
  }
  for (const delayedTransition of stateNode.after) {
    let existing = transitions.get(delayedTransition.eventType);
    if (!existing) {
      existing = [];
      transitions.set(delayedTransition.eventType, existing);
    }
    existing.push(delayedTransition);
  }
  return transitions;
}
function formatInitialTransition(stateNode, _target) {
  if (typeof _target === 'string' || isArray(_target)) {
    const targets = toArray(_target).map(t => {
      // Resolve state string keys (which represent children)
      // to their state node
      const descStateNode = typeof t === 'string' ? isStateId(t) ? stateNode.machine.getStateNodeById(t) : stateNode.states[t] : t;
      if (!descStateNode) {
        throw new Error(`Initial state node "${t}" not found on parent state node #${stateNode.id}`);
      }
      if (!isDescendant(descStateNode, stateNode)) {
        throw new Error(`Invalid initial target: state node #${descStateNode.id} is not a descendant of #${stateNode.id}`);
      }
      return descStateNode;
    });
    const resolvedTarget = resolveTarget(stateNode, targets);
    const transition = {
      source: stateNode,
      actions: [],
      eventType: null,
      reenter: false,
      target: resolvedTarget,
      toJSON: () => ({
        ...transition,
        source: `#${stateNode.id}`,
        target: resolvedTarget ? resolvedTarget.map(t => `#${t.id}`) : undefined
      })
    };
    return transition;
  }
  return formatTransition(stateNode, '__INITIAL__', {
    target: toArray(_target.target).map(t => {
      if (typeof t === 'string') {
        return isStateId(t) ? t : `${STATE_DELIMITER}${t}`;
      }
      return t;
    }),
    actions: _target.actions
  });
}
function resolveTarget(stateNode, targets) {
  if (targets === undefined) {
    // an undefined target signals that the state node should not transition from that state when receiving that event
    return undefined;
  }
  return targets.map(target => {
    if (typeof target !== 'string') {
      return target;
    }
    if (isStateId(target)) {
      return stateNode.machine.getStateNodeById(target);
    }
    const isInternalTarget = target[0] === STATE_DELIMITER;
    // If internal target is defined on machine,
    // do not include machine key on target
    if (isInternalTarget && !stateNode.parent) {
      return getStateNodeByPath(stateNode, target.slice(1));
    }
    const resolvedTarget = isInternalTarget ? stateNode.key + target : target;
    if (stateNode.parent) {
      try {
        const targetStateNode = getStateNodeByPath(stateNode.parent, resolvedTarget);
        return targetStateNode;
      } catch (err) {
        throw new Error(`Invalid transition definition for state node '${stateNode.id}':\n${err.message}`);
      }
    } else {
      throw new Error(`Invalid target: "${target}" is not a valid target from the root node. Did you mean ".${target}"?`);
    }
  });
}
function resolveHistoryTarget(stateNode) {
  const normalizedTarget = normalizeTarget(stateNode.target);
  if (!normalizedTarget) {
    return stateNode.parent.initial.target;
  }
  return normalizedTarget.map(t => typeof t === 'string' ? getStateNodeByPath(stateNode.parent, t) : t);
}
function isHistoryNode(stateNode) {
  return stateNode.type === 'history';
}
function getInitialStateNodes(stateNode) {
  const set = new Set();
  function iter(descStateNode) {
    if (set.has(descStateNode)) {
      return;
    }
    set.add(descStateNode);
    if (descStateNode.type === 'compound') {
      for (const targetStateNode of descStateNode.initial.target) {
        for (const a of getProperAncestors(targetStateNode, stateNode)) {
          set.add(a);
        }
        iter(targetStateNode);
      }
    } else if (descStateNode.type === 'parallel') {
      for (const child of getChildren(descStateNode)) {
        iter(child);
      }
    }
  }
  iter(stateNode);
  return [...set];
}
/**
 * Returns the child state node from its relative `stateKey`, or throws.
 */
function getStateNode(stateNode, stateKey) {
  if (isStateId(stateKey)) {
    return stateNode.machine.getStateNodeById(stateKey);
  }
  if (!stateNode.states) {
    throw new Error(`Unable to retrieve child state '${stateKey}' from '${stateNode.id}'; no child states exist.`);
  }
  const result = stateNode.states[stateKey];
  if (!result) {
    throw new Error(`Child state '${stateKey}' does not exist on '${stateNode.id}'`);
  }
  return result;
}

/**
 * Returns the relative state node from the given `statePath`, or throws.
 *
 * @param statePath The string or string array relative path to the state node.
 */
function getStateNodeByPath(stateNode, statePath) {
  if (typeof statePath === 'string' && isStateId(statePath)) {
    try {
      return stateNode.machine.getStateNodeById(statePath);
    } catch (e) {
      // try individual paths
      // throw e;
    }
  }
  const arrayStatePath = toStatePath(statePath).slice();
  let currentStateNode = stateNode;
  while (arrayStatePath.length) {
    const key = arrayStatePath.shift();
    if (!key.length) {
      break;
    }
    currentStateNode = getStateNode(currentStateNode, key);
  }
  return currentStateNode;
}

/**
 * Returns the state nodes represented by the current state value.
 *
 * @param state The state value or State instance
 */
function getStateNodes(stateNode, state) {
  const stateValue = state instanceof State ? state.value : toStateValue(state);
  if (typeof stateValue === 'string') {
    return [stateNode, stateNode.states[stateValue]];
  }
  const childStateKeys = Object.keys(stateValue);
  const childStateNodes = childStateKeys.map(subStateKey => getStateNode(stateNode, subStateKey)).filter(Boolean);
  return [stateNode.machine.root, stateNode].concat(childStateNodes, childStateKeys.reduce((allSubStateNodes, subStateKey) => {
    const subStateNode = getStateNode(stateNode, subStateKey);
    if (!subStateNode) {
      return allSubStateNodes;
    }
    const subStateNodes = getStateNodes(subStateNode, stateValue[subStateKey]);
    return allSubStateNodes.concat(subStateNodes);
  }, []));
}
function transitionAtomicNode(stateNode, stateValue, state, event) {
  const childStateNode = getStateNode(stateNode, stateValue);
  const next = childStateNode.next(state, event);
  if (!next || !next.length) {
    return stateNode.next(state, event);
  }
  return next;
}
function transitionCompoundNode(stateNode, stateValue, state, event) {
  const subStateKeys = Object.keys(stateValue);
  const childStateNode = getStateNode(stateNode, subStateKeys[0]);
  const next = transitionNode(childStateNode, stateValue[subStateKeys[0]], state, event);
  if (!next || !next.length) {
    return stateNode.next(state, event);
  }
  return next;
}
function transitionParallelNode(stateNode, stateValue, state, event) {
  const allInnerTransitions = [];
  for (const subStateKey of Object.keys(stateValue)) {
    const subStateValue = stateValue[subStateKey];
    if (!subStateValue) {
      continue;
    }
    const subStateNode = getStateNode(stateNode, subStateKey);
    const innerTransitions = transitionNode(subStateNode, subStateValue, state, event);
    if (innerTransitions) {
      allInnerTransitions.push(...innerTransitions);
    }
  }
  if (!allInnerTransitions.length) {
    return stateNode.next(state, event);
  }
  return allInnerTransitions;
}
function transitionNode(stateNode, stateValue, state, event) {
  // leaf node
  if (typeof stateValue === 'string') {
    return transitionAtomicNode(stateNode, stateValue, state, event);
  }

  // compound node
  if (Object.keys(stateValue).length === 1) {
    return transitionCompoundNode(stateNode, stateValue, state, event);
  }

  // parallel node
  return transitionParallelNode(stateNode, stateValue, state, event);
}
function getHistoryNodes(stateNode) {
  return Object.keys(stateNode.states).map(key => stateNode.states[key]).filter(sn => sn.type === 'history');
}
function isDescendant(childStateNode, parentStateNode) {
  let marker = childStateNode;
  while (marker.parent && marker.parent !== parentStateNode) {
    marker = marker.parent;
  }
  return marker.parent === parentStateNode;
}
function getPathFromRootToNode(stateNode) {
  const path = [];
  let marker = stateNode.parent;
  while (marker) {
    path.unshift(marker);
    marker = marker.parent;
  }
  return path;
}
function hasIntersection(s1, s2) {
  const set1 = new Set(s1);
  const set2 = new Set(s2);
  for (const item of set1) {
    if (set2.has(item)) {
      return true;
    }
  }
  for (const item of set2) {
    if (set1.has(item)) {
      return true;
    }
  }
  return false;
}
function removeConflictingTransitions(enabledTransitions, configuration, historyValue) {
  const filteredTransitions = new Set();
  for (const t1 of enabledTransitions) {
    let t1Preempted = false;
    const transitionsToRemove = new Set();
    for (const t2 of filteredTransitions) {
      if (hasIntersection(computeExitSet([t1], configuration, historyValue), computeExitSet([t2], configuration, historyValue))) {
        if (isDescendant(t1.source, t2.source)) {
          transitionsToRemove.add(t2);
        } else {
          t1Preempted = true;
          break;
        }
      }
    }
    if (!t1Preempted) {
      for (const t3 of transitionsToRemove) {
        filteredTransitions.delete(t3);
      }
      filteredTransitions.add(t1);
    }
  }
  return Array.from(filteredTransitions);
}
function findLCCA(stateNodes) {
  const [head] = stateNodes;
  let current = getPathFromRootToNode(head);
  let candidates = [];
  for (const stateNode of stateNodes) {
    const path = getPathFromRootToNode(stateNode);
    candidates = current.filter(sn => path.includes(sn));
    current = candidates;
    candidates = [];
  }
  return current[current.length - 1];
}
function getEffectiveTargetStates(transition, historyValue) {
  if (!transition.target) {
    return [];
  }
  const targets = new Set();
  for (const targetNode of transition.target) {
    if (isHistoryNode(targetNode)) {
      if (historyValue[targetNode.id]) {
        for (const node of historyValue[targetNode.id]) {
          targets.add(node);
        }
      } else {
        for (const node of getEffectiveTargetStates({
          target: resolveHistoryTarget(targetNode)
        }, historyValue)) {
          targets.add(node);
        }
      }
    } else {
      targets.add(targetNode);
    }
  }
  return [...targets];
}
function getTransitionDomain(transition, historyValue) {
  const targetStates = getEffectiveTargetStates(transition, historyValue);
  if (!targetStates) {
    return null;
  }
  if (!transition.reenter && transition.source.type !== 'parallel' && targetStates.every(targetStateNode => isDescendant(targetStateNode, transition.source))) {
    return transition.source;
  }
  const lcca = findLCCA(targetStates.concat(transition.source));
  return lcca;
}
function computeExitSet(transitions, configuration, historyValue) {
  const statesToExit = new Set();
  for (const t of transitions) {
    if (t.target?.length) {
      const domain = getTransitionDomain(t, historyValue);
      for (const stateNode of configuration) {
        if (isDescendant(stateNode, domain)) {
          statesToExit.add(stateNode);
        }
      }
    }
  }
  return [...statesToExit];
}

/**
 * https://www.w3.org/TR/scxml/#microstepProcedure
 *
 * @private
 * @param transitions
 * @param currentState
 * @param mutConfiguration
 */

function microstep(transitions, currentState, actorCtx, event, isInitial) {
  const mutConfiguration = new Set(currentState.configuration);
  if (!transitions.length) {
    return currentState;
  }
  const microstate = microstepProcedure(transitions, currentState, mutConfiguration, event, actorCtx, isInitial);
  return cloneState(microstate, {
    value: {} // TODO: make optional
  });
}

function microstepProcedure(transitions, currentState, mutConfiguration, event, actorCtx, isInitial) {
  const actions = [];
  const historyValue = {
    ...currentState.historyValue
  };
  const filteredTransitions = removeConflictingTransitions(transitions, mutConfiguration, historyValue);
  const internalQueue = [...currentState._internalQueue];

  // Exit states
  if (!isInitial) {
    exitStates(filteredTransitions, mutConfiguration, historyValue, actions);
  }

  // Execute transition content
  actions.push(...filteredTransitions.flatMap(t => t.actions));

  // Enter states
  enterStates(event, filteredTransitions, mutConfiguration, actions, internalQueue, currentState, historyValue, isInitial);
  const nextConfiguration = [...mutConfiguration];
  const done = isInFinalState(nextConfiguration);
  if (done) {
    const finalActions = nextConfiguration.sort((a, b) => b.order - a.order).flatMap(state => state.exit);
    actions.push(...finalActions);
  }
  try {
    const nextState = resolveActionsAndContext(actions, event, currentState, actorCtx);
    const output = done ? getOutput(nextConfiguration, nextState.context, event) : undefined;
    internalQueue.push(...nextState._internalQueue);
    return cloneState(currentState, {
      configuration: nextConfiguration,
      historyValue,
      _internalQueue: internalQueue,
      context: nextState.context,
      done,
      output,
      children: nextState.children
    });
  } catch (e) {
    // TODO: Refactor this once proper error handling is implemented.
    // See https://github.com/statelyai/rfcs/pull/4
    throw e;
  }
}
function enterStates(event, filteredTransitions, mutConfiguration, actions, internalQueue, currentState, historyValue, isInitial) {
  const statesToEnter = new Set();
  const statesForDefaultEntry = new Set();
  computeEntrySet(filteredTransitions, historyValue, statesForDefaultEntry, statesToEnter);

  // In the initial state, the root state node is "entered".
  if (isInitial) {
    statesForDefaultEntry.add(currentState.machine.root);
  }
  for (const stateNodeToEnter of [...statesToEnter].sort((a, b) => a.order - b.order)) {
    mutConfiguration.add(stateNodeToEnter);
    for (const invokeDef of stateNodeToEnter.invoke) {
      actions.push(invoke(invokeDef));
    }

    // Add entry actions
    actions.push(...stateNodeToEnter.entry);
    if (statesForDefaultEntry.has(stateNodeToEnter)) {
      for (const stateNode of statesForDefaultEntry) {
        const initialActions = stateNode.initial.actions;
        actions.push(...initialActions);
      }
    }
    if (stateNodeToEnter.type === 'final') {
      const parent = stateNodeToEnter.parent;
      if (!parent.parent) {
        continue;
      }
      internalQueue.push(done(parent.id, stateNodeToEnter.output ? mapContext(stateNodeToEnter.output, currentState.context, event) : undefined));
      if (parent.parent) {
        const grandparent = parent.parent;
        if (grandparent.type === 'parallel') {
          if (getChildren(grandparent).every(parentNode => isInFinalState([...mutConfiguration], parentNode))) {
            internalQueue.push(done(grandparent.id));
          }
        }
      }
    }
  }
}
function computeEntrySet(transitions, historyValue, statesForDefaultEntry, statesToEnter) {
  for (const t of transitions) {
    for (const s of t.target || []) {
      addDescendantStatesToEnter(s, historyValue, statesForDefaultEntry, statesToEnter);
    }
    const ancestor = getTransitionDomain(t, historyValue);
    const targetStates = getEffectiveTargetStates(t, historyValue);
    for (const s of targetStates) {
      addAncestorStatesToEnter(s, ancestor, statesToEnter, historyValue, statesForDefaultEntry);
    }
  }
}
function addDescendantStatesToEnter(stateNode, historyValue, statesForDefaultEntry, statesToEnter) {
  if (isHistoryNode(stateNode)) {
    if (historyValue[stateNode.id]) {
      const historyStateNodes = historyValue[stateNode.id];
      for (const s of historyStateNodes) {
        addDescendantStatesToEnter(s, historyValue, statesForDefaultEntry, statesToEnter);
      }
      for (const s of historyStateNodes) {
        addAncestorStatesToEnter(s, stateNode.parent, statesToEnter, historyValue, statesForDefaultEntry);
        for (const stateForDefaultEntry of statesForDefaultEntry) {
          statesForDefaultEntry.add(stateForDefaultEntry);
        }
      }
    } else {
      const targets = resolveHistoryTarget(stateNode);
      for (const s of targets) {
        addDescendantStatesToEnter(s, historyValue, statesForDefaultEntry, statesToEnter);
      }
      for (const s of targets) {
        addAncestorStatesToEnter(s, stateNode, statesToEnter, historyValue, statesForDefaultEntry);
        for (const stateForDefaultEntry of statesForDefaultEntry) {
          statesForDefaultEntry.add(stateForDefaultEntry);
        }
      }
    }
  } else {
    statesToEnter.add(stateNode);
    if (stateNode.type === 'compound') {
      statesForDefaultEntry.add(stateNode);
      const initialStates = stateNode.initial.target;
      for (const initialState of initialStates) {
        addDescendantStatesToEnter(initialState, historyValue, statesForDefaultEntry, statesToEnter);
      }
      for (const initialState of initialStates) {
        addAncestorStatesToEnter(initialState, stateNode, statesToEnter, historyValue, statesForDefaultEntry);
      }
    } else {
      if (stateNode.type === 'parallel') {
        for (const child of getChildren(stateNode).filter(sn => !isHistoryNode(sn))) {
          if (![...statesToEnter].some(s => isDescendant(s, child))) {
            addDescendantStatesToEnter(child, historyValue, statesForDefaultEntry, statesToEnter);
          }
        }
      }
    }
  }
}
function addAncestorStatesToEnter(stateNode, toStateNode, statesToEnter, historyValue, statesForDefaultEntry) {
  const properAncestors = getProperAncestors(stateNode, toStateNode);
  for (const anc of properAncestors) {
    statesToEnter.add(anc);
    if (anc.type === 'parallel') {
      for (const child of getChildren(anc).filter(sn => !isHistoryNode(sn))) {
        if (![...statesToEnter].some(s => isDescendant(s, child))) {
          addDescendantStatesToEnter(child, historyValue, statesForDefaultEntry, statesToEnter);
        }
      }
    }
  }
}
function exitStates(transitions, mutConfiguration, historyValue, actions) {
  const statesToExit = computeExitSet(transitions, mutConfiguration, historyValue);
  statesToExit.sort((a, b) => b.order - a.order);

  // From SCXML algorithm: https://www.w3.org/TR/scxml/#exitStates
  for (const exitStateNode of statesToExit) {
    for (const historyNode of getHistoryNodes(exitStateNode)) {
      let predicate;
      if (historyNode.history === 'deep') {
        predicate = sn => isAtomicStateNode(sn) && isDescendant(sn, exitStateNode);
      } else {
        predicate = sn => {
          return sn.parent === exitStateNode;
        };
      }
      historyValue[historyNode.id] = Array.from(mutConfiguration).filter(predicate);
    }
  }
  for (const s of statesToExit) {
    actions.push(...s.exit, ...s.invoke.map(def => stop(def.id)));
    mutConfiguration.delete(s);
  }
}
function resolveActionsAndContext(actions, event, currentState, actorCtx) {
  const {
    machine
  } = currentState;
  // TODO: this `cloneState` is really just a hack to prevent infinite loops
  // we need to take another look at how internal queue is managed
  let intermediateState = cloneState(currentState, {
    _internalQueue: []
  });
  for (const action of actions) {
    const resolved = typeof action === 'function' ? action : machine.implementations.actions[typeof action === 'string' ? action : action.type];
    if (!resolved) {
      continue;
    }
    const args = {
      context: intermediateState.context,
      event,
      self: actorCtx?.self,
      system: actorCtx?.system,
      // TODO: figure out story for `action` and inline actions
      // what those ones should receive?
      //
      // entry: ({ action }) => {}
      // exit: assign(({ action }) => {})
      action: typeof action === 'string' ? {
        type: action
      } : action
    };
    if (!('resolve' in resolved)) {
      if (actorCtx?.self.status === ActorStatus.Running) {
        resolved(args);
      } else {
        actorCtx?.defer(() => resolved(args));
      }
      continue;
    }
    const builtinAction = resolved;
    const [nextState, params, actions] = builtinAction.resolve(actorCtx, intermediateState, args, resolved // this holds all params
    );

    intermediateState = nextState;
    if ('execute' in resolved) {
      if (actorCtx?.self.status === ActorStatus.Running) {
        builtinAction.execute(actorCtx, params);
      } else {
        actorCtx?.defer(builtinAction.execute.bind(null, actorCtx, params));
      }
    }
    if (actions) {
      intermediateState = resolveActionsAndContext(actions, event, intermediateState, actorCtx);
    }
  }
  return intermediateState;
}
function macrostep(state, event, actorCtx) {
  let nextState = state;
  const states = [];

  // Handle stop event
  if (event.type === stopSignalType) {
    nextState = stopStep(event, nextState, actorCtx);
    states.push(nextState);
    return {
      state: nextState,
      microstates: states
    };
  }
  let nextEvent = event;

  // Assume the state is at rest (no raised events)
  // Determine the next state based on the next microstep
  if (nextEvent.type !== INIT_TYPE) {
    const transitions = selectTransitions(nextEvent, nextState);
    nextState = microstep(transitions, state, actorCtx, nextEvent, false);
    states.push(nextState);
  }
  while (!nextState.done) {
    let enabledTransitions = selectEventlessTransitions(nextState, nextEvent);
    if (!enabledTransitions.length) {
      if (!nextState._internalQueue.length) {
        break;
      } else {
        nextEvent = nextState._internalQueue[0];
        const transitions = selectTransitions(nextEvent, nextState);
        nextState = microstep(transitions, nextState, actorCtx, nextEvent, false);
        nextState._internalQueue.shift();
        states.push(nextState);
      }
    } else {
      nextState = microstep(enabledTransitions, nextState, actorCtx, nextEvent, false);
      states.push(nextState);
    }
  }
  if (nextState.done) {
    // Perform the stop step to ensure that child actors are stopped
    stopStep(nextEvent, nextState, actorCtx);
  }
  return {
    state: nextState,
    microstates: states
  };
}
function stopStep(event, nextState, actorCtx) {
  const actions = [];
  for (const stateNode of nextState.configuration.sort((a, b) => b.order - a.order)) {
    actions.push(...stateNode.exit);
  }
  for (const child of Object.values(nextState.children)) {
    actions.push(stop(child));
  }
  return resolveActionsAndContext(actions, event, nextState, actorCtx);
}
function selectTransitions(event, nextState) {
  return nextState.machine.getTransitionData(nextState, event);
}
function selectEventlessTransitions(nextState, event) {
  const enabledTransitionSet = new Set();
  const atomicStates = nextState.configuration.filter(isAtomicStateNode);
  for (const stateNode of atomicStates) {
    loop: for (const s of [stateNode].concat(getProperAncestors(stateNode, null))) {
      if (!s.always) {
        continue;
      }
      for (const transition of s.always) {
        if (transition.guard === undefined || evaluateGuard(transition.guard, nextState.context, event, nextState)) {
          enabledTransitionSet.add(transition);
          break loop;
        }
      }
    }
  }
  return removeConflictingTransitions(Array.from(enabledTransitionSet), new Set(nextState.configuration), nextState.historyValue);
}

/**
 * Resolves a partial state value with its full representation in the state node's machine.
 *
 * @param stateValue The partial state value to resolve.
 */
function resolveStateValue(rootNode, stateValue) {
  const configuration = getConfiguration(getStateNodes(rootNode, stateValue));
  return getStateValue(rootNode, [...configuration]);
}
function getInitialConfiguration(rootNode) {
  const configuration = [];
  const initialTransition = rootNode.initial;
  const statesToEnter = new Set();
  const statesForDefaultEntry = new Set([rootNode]);
  computeEntrySet([initialTransition], {}, statesForDefaultEntry, statesToEnter);
  for (const stateNodeToEnter of [...statesToEnter].sort((a, b) => a.order - b.order)) {
    configuration.push(stateNodeToEnter);
  }
  return configuration;
}

class State {
  /**
   * Indicates whether the state is a final state.
   */

  /**
   * The done data of the top-level finite state.
   */
  // TODO: add an explicit type for `output`

  /**
   * The enabled state nodes representative of the state value.
   */

  /**
   * An object mapping actor names to spawned/invoked actors.
   */

  /**
   * Creates a new State instance for the given `stateValue` and `context`.
   * @param stateValue
   * @param context
   */
  static from(stateValue, context = {}, machine) {
    if (stateValue instanceof State) {
      if (stateValue.context !== context) {
        return new State({
          value: stateValue.value,
          context,
          meta: {},
          configuration: [],
          // TODO: fix,
          children: {}
        }, machine);
      }
      return stateValue;
    }
    const configuration = getConfiguration(getStateNodes(machine.root, stateValue));
    return new State({
      value: stateValue,
      context,
      meta: undefined,
      configuration: Array.from(configuration),
      children: {}
    }, machine);
  }

  /**
   * Creates a new `State` instance that represents the current state of a running machine.
   *
   * @param config
   */
  constructor(config, machine) {
    this.machine = machine;
    this.tags = void 0;
    this.value = void 0;
    this.done = void 0;
    this.output = void 0;
    this.context = void 0;
    this.historyValue = {};
    this._internalQueue = void 0;
    this.configuration = void 0;
    this.children = void 0;
    this.context = config.context;
    this._internalQueue = config._internalQueue ?? [];
    this.historyValue = config.historyValue || {};
    this.matches = this.matches.bind(this);
    this.toStrings = this.toStrings.bind(this);
    this.configuration = config.configuration ?? Array.from(getConfiguration(getStateNodes(machine.root, config.value)));
    this.children = config.children;
    this.value = getStateValue(machine.root, this.configuration);
    this.tags = new Set(flatten(this.configuration.map(sn => sn.tags)));
    this.done = config.done ?? false;
    this.output = config.output;
  }

  /**
   * Returns an array of all the string leaf state node paths.
   * @param stateValue
   * @param delimiter The character(s) that separate each subpath in the string state node path.
   */
  toStrings(stateValue = this.value) {
    if (typeof stateValue === 'string') {
      return [stateValue];
    }
    const valueKeys = Object.keys(stateValue);
    return valueKeys.concat(...valueKeys.map(key => this.toStrings(stateValue[key]).map(s => key + STATE_DELIMITER + s)));
  }
  toJSON() {
    const {
      configuration,
      tags,
      machine,
      ...jsonValues
    } = this;
    return {
      ...jsonValues,
      tags: Array.from(tags),
      meta: this.meta
    };
  }

  /**
   * Whether the current state value is a subset of the given parent state value.
   * @param parentStateValue
   */
  matches(parentStateValue) {
    return matchesState(parentStateValue, this.value);
  }

  /**
   * Whether the current state configuration has a state node with the specified `tag`.
   * @param tag
   */
  hasTag(tag) {
    return this.tags.has(tag);
  }

  /**
   * Determines whether sending the `event` will cause a non-forbidden transition
   * to be selected, even if the transitions have no actions nor
   * change the state value.
   *
   * @param event The event to test
   * @returns Whether the event will cause a transition
   */
  can(event) {
    const transitionData = this.machine.getTransitionData(this, event);
    return !!transitionData?.length &&
    // Check that at least one transition is not forbidden
    transitionData.some(t => t.target !== undefined || t.actions.length);
  }

  /**
   * The next events that will cause a transition from the current state.
   */
  get nextEvents() {
    return memo(this, 'nextEvents', () => {
      return [...new Set(flatten([...this.configuration.map(sn => sn.ownEvents)]))];
    });
  }
  get meta() {
    return this.configuration.reduce((acc, stateNode) => {
      if (stateNode.meta !== undefined) {
        acc[stateNode.id] = stateNode.meta;
      }
      return acc;
    }, {});
  }
}
function cloneState(state, config = {}) {
  return new State({
    ...state,
    ...config
  }, state.machine);
}
function getPersistedState(state) {
  const {
    configuration,
    tags,
    machine,
    children,
    ...jsonValues
  } = state;
  const childrenJson = {};
  for (const id in children) {
    childrenJson[id] = {
      state: children[id].getPersistedState?.(),
      src: children[id].src
    };
  }
  return {
    ...jsonValues,
    children: childrenJson
  };
}

function resolve$5(_, state, args, {
  actorRef
}) {
  const actorRefOrString = typeof actorRef === 'function' ? actorRef(args) : actorRef;
  const resolvedActorRef = typeof actorRefOrString === 'string' ? state.children[actorRefOrString] : actorRefOrString;
  let children = state.children;
  if (resolvedActorRef) {
    children = {
      ...children
    };
    delete children[resolvedActorRef.id];
  }
  return [cloneState(state, {
    children
  }), resolvedActorRef];
}
function execute$2(actorContext, actorRef) {
  if (!actorRef) {
    return;
  }
  if (actorRef.status !== ActorStatus.Running) {
    actorContext.stopChild(actorRef);
    return;
  }
  // TODO: recheck why this one has to be deferred
  actorContext.defer(() => {
    actorContext.stopChild(actorRef);
  });
}

/**
 * Stops an actor.
 *
 * @param actorRef The actor to stop.
 */

function stop(actorRef) {
  function stop(_) {
  }
  stop.type = 'xstate.stop';
  stop.actorRef = actorRef;
  stop.resolve = resolve$5;
  stop.execute = execute$2;
  return stop;
}

function createSpawner(actorContext, {
  machine,
  context
}, event, spawnedChildren) {
  const spawn = (src, options = {}) => {
    const {
      systemId
    } = options;
    if (typeof src === 'string') {
      const referenced = resolveReferencedActor(machine.implementations.actors[src]);
      if (!referenced) {
        throw new Error(`Actor logic '${src}' not implemented in machine '${machine.id}'`);
      }
      const input = 'input' in options ? options.input : referenced.input;

      // TODO: this should also receive `src`
      const actor = interpret(referenced.src, {
        id: options.id,
        parent: actorContext.self,
        input: typeof input === 'function' ? input({
          context,
          event,
          self: actorContext.self
        }) : input,
        systemId
      });
      spawnedChildren[actor.id] = actor;
      return actor;
    } else {
      // TODO: this should also receive `src`
      return interpret(src, {
        id: options.id,
        parent: actorContext.self,
        input: options.input,
        systemId
      });
    }
  };
  return (src, options) => {
    const actorRef = spawn(src, options);
    spawnedChildren[actorRef.id] = actorRef;
    actorContext.defer(() => {
      if (actorRef.status === ActorStatus.Stopped) {
        return;
      }
      try {
        actorRef.start?.();
      } catch (err) {
        actorContext.self.send(error(actorRef.id, err));
        return;
      }
    });
    return actorRef;
  };
}

function resolve$3(actorContext, state, actionArgs, {
  assignment
}) {
  if (!state.context) {
    throw new Error('Cannot assign to undefined `context`. Ensure that `context` is defined in the machine config.');
  }
  const spawnedChildren = {};
  const assignArgs = {
    context: state.context,
    event: actionArgs.event,
    action: actionArgs.action,
    spawn: createSpawner(actorContext, state, actionArgs.event, spawnedChildren),
    self: actorContext?.self,
    system: actorContext?.system
  };
  let partialUpdate = {};
  if (typeof assignment === 'function') {
    partialUpdate = assignment(assignArgs);
  } else {
    for (const key of Object.keys(assignment)) {
      const propAssignment = assignment[key];
      partialUpdate[key] = typeof propAssignment === 'function' ? propAssignment(assignArgs) : propAssignment;
    }
  }
  const updatedContext = Object.assign({}, state.context, partialUpdate);
  return [cloneState(state, {
    context: updatedContext,
    children: Object.keys(spawnedChildren).length ? {
      ...state.children,
      ...spawnedChildren
    } : state.children
  })];
}

/**
 * Updates the current context of the machine.
 *
 * @param assignment An object that represents the partial context to update.
 */
function assign(assignment) {
  function assign(_) {
  }
  assign.type = 'xstate.assign';
  assign.assignment = assignment;
  assign.resolve = resolve$3;
  return assign;
}

function resolve$2(_, state, args, {
  event: eventOrExpr,
  id,
  delay
}) {
  const delaysMap = state.machine.implementations.delays;
  if (typeof eventOrExpr === 'string') {
    throw new Error(`Only event objects may be used with raise; use raise({ type: "${eventOrExpr}" }) instead`);
  }
  const resolvedEvent = typeof eventOrExpr === 'function' ? eventOrExpr(args) : eventOrExpr;
  let resolvedDelay;
  if (typeof delay === 'string') {
    const configDelay = delaysMap && delaysMap[delay];
    resolvedDelay = typeof configDelay === 'function' ? configDelay(args) : configDelay;
  } else {
    resolvedDelay = typeof delay === 'function' ? delay(args) : delay;
  }
  return [typeof resolvedDelay !== 'number' ? cloneState(state, {
    _internalQueue: state._internalQueue.concat(resolvedEvent)
  }) : state, {
    event: resolvedEvent,
    id,
    delay: resolvedDelay
  }];
}
function execute(actorContext, params) {
  if (typeof params.delay === 'number') {
    actorContext.self.delaySend(params);
    return;
  }
}

/**
 * Raises an event. This places the event in the internal event queue, so that
 * the event is immediately consumed by the machine in the current step.
 *
 * @param eventType The event to raise.
 */

function raise(eventOrExpr, options) {
  function raise(_) {
  }
  raise.type = 'xstate.raise';
  raise.event = eventOrExpr;
  raise.id = options?.id;
  raise.delay = options?.delay;
  raise.resolve = resolve$2;
  raise.execute = execute;
  return raise;
}

/**
 * Returns an event type that represents an implicit event that
 * is sent after the specified `delay`.
 *
 * @param delayRef The delay in milliseconds
 * @param id The state node ID where this event is handled
 */
function after(delayRef, id) {
  const idSuffix = id ? `#${id}` : '';
  return `${ConstantPrefix.After}(${delayRef})${idSuffix}`;
}

/**
 * Returns an event that represents that a final state node
 * has been reached in the parent state node.
 *
 * @param id The final state node's parent state node `id`
 * @param output The data to pass into the event
 */
function done(id, output) {
  const type = `${ConstantPrefix.DoneState}.${id}`;
  const eventObject = {
    type,
    output
  };
  eventObject.toString = () => type;
  return eventObject;
}

/**
 * Returns an event that represents that an invoked service has terminated.
 *
 * An invoked service is terminated when it has reached a top-level final state node,
 * but not when it is canceled.
 *
 * @param invokeId The invoked service ID
 * @param output The data to pass into the event
 */
function doneInvoke(invokeId, output) {
  const type = `${ConstantPrefix.DoneInvoke}.${invokeId}`;
  const eventObject = {
    type,
    output
  };
  eventObject.toString = () => type;
  return eventObject;
}
function error(id, data) {
  const type = `${ConstantPrefix.ErrorPlatform}.${id}`;
  const eventObject = {
    type,
    data
  };
  eventObject.toString = () => type;
  return eventObject;
}
function createInitEvent(input) {
  return {
    type: INIT_TYPE,
    input
  };
}

const EMPTY_OBJECT = {};
const toSerializableActon = action => {
  if (typeof action === 'string') {
    return {
      type: action
    };
  }
  if (typeof action === 'function') {
    if ('resolve' in action) {
      return {
        type: action.type
      };
    }
    return {
      type: action.name
    };
  }
  return action;
};
class StateNode {
  /**
   * The relative key of the state node, which represents its location in the overall state value.
   */

  /**
   * The unique ID of the state node.
   */

  /**
   * The type of this state node:
   *
   *  - `'atomic'` - no child state nodes
   *  - `'compound'` - nested child state nodes (XOR)
   *  - `'parallel'` - orthogonal nested child state nodes (AND)
   *  - `'history'` - history state node
   *  - `'final'` - final state node
   */

  /**
   * The string path from the root machine node to this node.
   */

  /**
   * The child state nodes.
   */

  /**
   * The type of history on this state node. Can be:
   *
   *  - `'shallow'` - recalls only top-level historical state value
   *  - `'deep'` - recalls historical state value at all levels
   */

  /**
   * The action(s) to be executed upon entering the state node.
   */

  /**
   * The action(s) to be executed upon exiting the state node.
   */

  /**
   * The parent state node.
   */

  /**
   * The root machine node.
   */

  /**
   * The meta data associated with this state node, which will be returned in State instances.
   */

  /**
   * The output data sent with the "done.state._id_" event if this is a final state node.
   */

  /**
   * The order this state node appears. Corresponds to the implicit document order.
   */

  constructor(
  /**
   * The raw config used to create the machine.
   */
  config, options) {
    this.config = config;
    this.key = void 0;
    this.id = void 0;
    this.type = void 0;
    this.path = void 0;
    this.states = void 0;
    this.history = void 0;
    this.entry = void 0;
    this.exit = void 0;
    this.parent = void 0;
    this.machine = void 0;
    this.meta = void 0;
    this.output = void 0;
    this.order = -1;
    this.description = void 0;
    this.tags = [];
    this.transitions = void 0;
    this.always = void 0;
    this.parent = options._parent;
    this.key = options._key;
    this.machine = options._machine;
    this.path = this.parent ? this.parent.path.concat(this.key) : [];
    this.id = this.config.id || [this.machine.id, ...this.path].join(STATE_DELIMITER);
    this.type = this.config.type || (this.config.states && Object.keys(this.config.states).length ? 'compound' : this.config.history ? 'history' : 'atomic');
    this.description = this.config.description;
    this.order = this.machine.idMap.size;
    this.machine.idMap.set(this.id, this);
    this.states = this.config.states ? mapValues(this.config.states, (stateConfig, key) => {
      const stateNode = new StateNode(stateConfig, {
        _parent: this,
        _key: key,
        _machine: this.machine
      });
      return stateNode;
    }) : EMPTY_OBJECT;
    if (this.type === 'compound' && !this.config.initial) {
      throw new Error(`No initial state specified for compound state node "#${this.id}". Try adding { initial: "${Object.keys(this.states)[0]}" } to the state config.`);
    }

    // History config
    this.history = this.config.history === true ? 'shallow' : this.config.history || false;
    this.entry = toArray(this.config.entry);
    this.exit = toArray(this.config.exit);
    this.meta = this.config.meta;
    this.output = this.type === 'final' ? this.config.output : undefined;
    this.tags = toArray(config.tags);
  }
  _initialize() {
    this.transitions = formatTransitions(this);
    if (this.config.always) {
      this.always = toTransitionConfigArray(this.config.always).map(t => formatTransition(this, NULL_EVENT, t));
    }
    Object.keys(this.states).forEach(key => {
      this.states[key]._initialize();
    });
  }

  /**
   * The well-structured state node definition.
   */
  get definition() {
    return {
      id: this.id,
      key: this.key,
      version: this.machine.version,
      type: this.type,
      initial: this.initial ? {
        target: this.initial.target,
        source: this,
        actions: this.initial.actions.map(toSerializableActon),
        eventType: null,
        reenter: false,
        toJSON: () => ({
          target: this.initial.target.map(t => `#${t.id}`),
          source: `#${this.id}`,
          actions: this.initial.actions.map(toSerializableActon),
          eventType: null
        })
      } : undefined,
      history: this.history,
      states: mapValues(this.states, state => {
        return state.definition;
      }),
      on: this.on,
      transitions: [...this.transitions.values()].flat().map(t => ({
        ...t,
        actions: t.actions.map(toSerializableActon)
      })),
      entry: this.entry.map(toSerializableActon),
      exit: this.exit.map(toSerializableActon),
      meta: this.meta,
      order: this.order || -1,
      output: this.output,
      invoke: this.invoke,
      description: this.description,
      tags: this.tags
    };
  }
  toJSON() {
    return this.definition;
  }

  /**
   * The logic invoked as actors by this state node.
   */
  get invoke() {
    return memo(this, 'invoke', () => toArray(this.config.invoke).map((invocable, i) => {
      const generatedId = createInvokeId(this.id, i);
      const invokeConfig = toInvokeConfig(invocable, generatedId);
      const resolvedId = invokeConfig.id || generatedId;
      const src = invokeConfig.src;
      const {
        systemId
      } = invokeConfig;

      // TODO: resolving should not happen here
      const resolvedSrc = typeof src === 'string' ? src : !('type' in src) ? resolvedId : src;
      if (!this.machine.implementations.actors[resolvedId] && typeof src !== 'string' && !('type' in src)) {
        this.machine.implementations.actors = {
          ...this.machine.implementations.actors,
          // TODO: this should accept `src` as-is
          [resolvedId]: src
        };
      }
      return {
        type: 'xstate.invoke',
        ...invokeConfig,
        src: resolvedSrc,
        id: resolvedId,
        systemId: systemId,
        toJSON() {
          const {
            onDone,
            onError,
            ...invokeDefValues
          } = invokeConfig;
          return {
            ...invokeDefValues,
            type: 'xstate.invoke',
            src: resolvedSrc,
            id: resolvedId
          };
        }
      };
    }));
  }

  /**
   * The mapping of events to transitions.
   */
  get on() {
    return memo(this, 'on', () => {
      const transitions = this.transitions;
      return [...transitions].flatMap(([descriptor, t]) => t.map(t => [descriptor, t])).reduce((map, [descriptor, transition]) => {
        map[descriptor] = map[descriptor] || [];
        map[descriptor].push(transition);
        return map;
      }, {});
    });
  }
  get after() {
    return memo(this, 'delayedTransitions', () => getDelayedTransitions(this));
  }
  get initial() {
    return memo(this, 'initial', () => formatInitialTransition(this, this.config.initial || []));
  }
  next(state, event) {
    const eventType = event.type;
    const actions = [];
    let selectedTransition;
    const candidates = memo(this, `candidates-${eventType}`, () => getCandidates(this, eventType));
    for (const candidate of candidates) {
      const {
        guard
      } = candidate;
      const resolvedContext = state.context;
      let guardPassed = false;
      try {
        guardPassed = !guard || evaluateGuard(guard, resolvedContext, event, state);
      } catch (err) {
        throw new Error(`Unable to evaluate guard '${guard.type}' in transition for event '${eventType}' in state node '${this.id}':\n${err.message}`);
      }
      if (guardPassed) {
        actions.push(...candidate.actions);
        selectedTransition = candidate;
        break;
      }
    }
    return selectedTransition ? [selectedTransition] : undefined;
  }

  /**
   * The target state value of the history state node, if it exists. This represents the
   * default state value to transition to if no history value exists yet.
   */
  get target() {
    if (this.type === 'history') {
      const historyConfig = this.config;
      return historyConfig.target;
    }
    return undefined;
  }

  /**
   * All the state node IDs of this state node and its descendant state nodes.
   */
  get stateIds() {
    const childStateIds = flatten(Object.keys(this.states).map(stateKey => {
      return this.states[stateKey].stateIds;
    }));
    return [this.id].concat(childStateIds);
  }

  /**
   * All the event types accepted by this state node and its descendants.
   */
  get events() {
    return memo(this, 'events', () => {
      const {
        states
      } = this;
      const events = new Set(this.ownEvents);
      if (states) {
        for (const stateId of Object.keys(states)) {
          const state = states[stateId];
          if (state.states) {
            for (const event of state.events) {
              events.add(`${event}`);
            }
          }
        }
      }
      return Array.from(events);
    });
  }

  /**
   * All the events that have transitions directly from this state node.
   *
   * Excludes any inert events.
   */
  get ownEvents() {
    const events = new Set([...this.transitions.keys()].filter(descriptor => {
      return this.transitions.get(descriptor).some(transition => !(!transition.target && !transition.actions.length && !transition.reenter));
    }));
    return Array.from(events);
  }
}

const STATE_IDENTIFIER = '#';
class StateMachine {
  /**
   * The machine's own version.
   */

  constructor(
  /**
   * The raw config used to create the machine.
   */
  config, implementations) {
    this.config = config;
    this.version = void 0;
    this.implementations = void 0;
    this.types = void 0;
    this.__xstatenode = true;
    this.idMap = new Map();
    this.root = void 0;
    this.id = void 0;
    this.states = void 0;
    this.events = void 0;
    this.__TContext = void 0;
    this.__TEvent = void 0;
    this.__TAction = void 0;
    this.__TActorMap = void 0;
    this.__TResolvedTypesMeta = void 0;
    this.id = config.id || '(machine)';
    this.implementations = {
      actors: implementations?.actors ?? {},
      actions: implementations?.actions ?? {},
      delays: implementations?.delays ?? {},
      guards: implementations?.guards ?? {}
    };
    this.version = this.config.version;
    this.types = this.config.types ?? {};
    this.transition = this.transition.bind(this);
    this.root = new StateNode(config, {
      _key: this.id,
      _machine: this
    });
    this.root._initialize();
    this.states = this.root.states; // TODO: remove!
    this.events = this.root.events;
  }

  /**
   * Clones this state machine with the provided implementations
   * and merges the `context` (if provided).
   *
   * @param implementations Options (`actions`, `guards`, `actors`, `delays`, `context`)
   *  to recursively merge with the existing options.
   *
   * @returns A new `StateMachine` instance with the provided implementations.
   */
  provide(implementations) {
    const {
      actions,
      guards,
      actors,
      delays
    } = this.implementations;
    return new StateMachine(this.config, {
      actions: {
        ...actions,
        ...implementations.actions
      },
      guards: {
        ...guards,
        ...implementations.guards
      },
      actors: {
        ...actors,
        ...implementations.actors
      },
      delays: {
        ...delays,
        ...implementations.delays
      }
    });
  }

  /**
   * Resolves the given `state` to a new `State` instance relative to this machine.
   *
   * This ensures that `.nextEvents` represent the correct values.
   *
   * @param state The state to resolve
   */
  resolveState(state) {
    const configurationSet = getConfiguration(getStateNodes(this.root, state.value));
    const configuration = Array.from(configurationSet);
    return this.createState({
      ...state,
      value: resolveStateValue(this.root, state.value),
      configuration,
      done: isInFinalState(configuration)
    });
  }
  resolveStateValue(stateValue, ...[context]) {
    const resolvedStateValue = resolveStateValue(this.root, stateValue);
    return this.resolveState(State.from(resolvedStateValue, context, this));
  }

  /**
   * Determines the next state given the current `state` and received `event`.
   * Calculates a full macrostep from all microsteps.
   *
   * @param state The current State instance or state value
   * @param event The received event
   */
  transition(state, event, actorCtx) {
    // TODO: handle error events in a better way
    if (isErrorEvent(event) && !state.nextEvents.some(nextEvent => nextEvent === event.type)) {
      throw event.data;
    }
    const {
      state: nextState
    } = macrostep(state, event, actorCtx);
    return nextState;
  }

  /**
   * Determines the next state given the current `state` and `event`.
   * Calculates a microstep.
   *
   * @param state The current state
   * @param event The received event
   */
  microstep(state, event, actorCtx) {
    return macrostep(state, event, actorCtx).microstates;
  }
  getTransitionData(state, event) {
    return transitionNode(this.root, state.value, state, event) || [];
  }

  /**
   * The initial state _before_ evaluating any microsteps.
   * This "pre-initial" state is provided to initial actions executed in the initial state.
   */
  getPreInitialState(actorCtx, initEvent) {
    const {
      context
    } = this.config;
    const preInitial = this.resolveState(this.createState({
      value: {},
      // TODO: this is computed in state constructor
      context: typeof context !== 'function' && context ? context : {},
      meta: undefined,
      configuration: getInitialConfiguration(this.root),
      children: {}
    }));
    if (typeof context === 'function') {
      const assignment = ({
        spawn,
        event
      }) => context({
        spawn,
        input: event.input
      });
      return resolveActionsAndContext([assign(assignment)], initEvent, preInitial, actorCtx);
    }
    return preInitial;
  }

  /**
   * Returns the initial `State` instance, with reference to `self` as an `ActorRef`.
   */
  getInitialState(actorCtx, input) {
    const initEvent = createInitEvent(input); // TODO: fix;

    const preInitialState = this.getPreInitialState(actorCtx, initEvent);
    const nextState = microstep([{
      target: [...preInitialState.configuration].filter(isAtomicStateNode),
      source: this.root,
      reenter: true,
      actions: [],
      eventType: null,
      toJSON: null // TODO: fix
    }], preInitialState, actorCtx, initEvent, true);
    const {
      state: macroState
    } = macrostep(nextState, initEvent, actorCtx);
    return macroState;
  }
  start(state, actorCtx) {
    Object.values(state.children).forEach(child => {
      if (child.status === 0) {
        try {
          child.start?.();
        } catch (err) {
          // TODO: unify error handling when child starts
          actorCtx.self.send(error(child.id, err));
        }
      }
    });
  }
  getStateNodeById(stateId) {
    const fullPath = stateId.split(STATE_DELIMITER);
    const relativePath = fullPath.slice(1);
    const resolvedStateId = isStateId(fullPath[0]) ? fullPath[0].slice(STATE_IDENTIFIER.length) : fullPath[0];
    const stateNode = this.idMap.get(resolvedStateId);
    if (!stateNode) {
      throw new Error(`Child state node '#${resolvedStateId}' does not exist on machine '${this.id}'`);
    }
    return getStateNodeByPath(stateNode, relativePath);
  }
  get definition() {
    return this.root.definition;
  }
  toJSON() {
    return this.definition;
  }
  getPersistedState(state) {
    return getPersistedState(state);
  }
  createState(stateConfig) {
    return stateConfig instanceof State ? stateConfig : new State(stateConfig, this);
  }
  getStatus(state) {
    return state.done ? {
      status: 'done',
      data: state.output
    } : {
      status: 'active'
    };
  }
  restoreState(state, _actorCtx) {
    const children = {};
    Object.keys(state.children).forEach(actorId => {
      const actorData = state.children[actorId];
      const childState = actorData.state;
      const src = actorData.src;
      const logic = src ? resolveReferencedActor(this.implementations.actors[src])?.src : undefined;
      if (!logic) {
        return;
      }
      const actorState = logic.restoreState?.(childState, _actorCtx);
      const actorRef = interpret(logic, {
        id: actorId,
        state: actorState
      });
      children[actorId] = actorRef;
    });
    const restoredState = this.createState(new State({
      ...state,
      children
    }, this));

    // TODO: DRY this up
    restoredState.configuration.forEach(stateNode => {
      if (stateNode.invoke) {
        stateNode.invoke.forEach(invokeConfig => {
          const {
            id,
            src
          } = invokeConfig;
          if (children[id]) {
            return;
          }
          const referenced = resolveReferencedActor(this.implementations.actors[src]);
          if (referenced) {
            const actorRef = interpret(referenced.src, {
              id,
              parent: _actorCtx?.self,
              input: 'input' in invokeConfig ? invokeConfig.input : referenced.input
            });
            children[id] = actorRef;
          }
        });
      }
    });
    return restoredState;
  }

  /**@deprecated an internal property acting as a "phantom" type, not meant to be used at runtime */
}

function createMachine(config, implementations) {
  return new StateMachine(config, implementations);
}

export { ATTACKER_REVEAL_ROUNDS as $, userIsAdmin as A, userControlsPlayer as B, isDefenderId as C, findStageAt as D, isAttackerId as E, isEqual as F, GameState as G, sharedGuards as H, fromPromise as I, GLOBAL_ATTACK_SCENARIOS as J, getPlayerSide as K, isPlayerGameEvent as L, findUserIndex as M, interpret as N, require_baseGetTag as O, not as P, and as Q, ROW_COUNT as R, COLUMN_COUNT as S, TARGETED_ATTACKS as T, getUser as U, getCharacter as V, isDefenseCharacter as W, getPlayer as X, isActionEventOf as Y, BOARD_SUPPLY_CHAINS as Z, NEW_GLOBAL_ATTACK_ROUNDS as _, requireIsArray as a, TOTAL_ROUNDS as a0, STAGES as a1, CHARACTERS as a2, ABILITIES as a3, BOARD_ITEMS as a4, objectEntries as a5, require_getNative as b, requireEq as c, requireIsObject as d, require_isPrototype as e, require_arrayLikeKeys as f, requireIsArrayLike as g, require_root as h, require_getSymbols as i, require_overArg as j, require_arrayPush as k, requireStubArray as l, require_baseGetAllKeys as m, require_Uint8Array as n, require_Symbol as o, require_getTag as p, requireIsObjectLike as q, requireKeys as r, require_nodeUtil as s, require_baseUnary as t, require_Stack as u, require_getAllKeys as v, requireIsBuffer as w, createMachine as x, assign as y, userControlsPlayerId as z };
//# sourceMappingURL=xstate.esm-cc3ace5c.js.map
