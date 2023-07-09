var IS_PRODUCTION = process.env.NODE_ENV === 'production';

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
  if (!IS_PRODUCTION) {
    console.warn('XState could not find a global object in this environment. Please let the maintainers know and raise an issue here: https://github.com/statelyai/xstate/issues');
  }
}
function getDevTools() {
  var w = getGlobal();
  if (!!w.__xstate__) {
    return w.__xstate__;
  }
  return undefined;
}
var devToolsAdapter = function devToolsAdapter(service) {
  if (typeof window === 'undefined') {
    return;
  }
  var devTools = getDevTools();
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
// we should also accept a raw machine as a behavior here
// or just make machine a behavior

// TODO: narrow this to behaviors from machine

// TODO: fix last param

/**
 * Extracts action objects that have no extra properties.
 */

/**
 * The string or object representing the state value relative to the parent state node.
 *
 * - For a child atomic state node, this is a string, e.g., `"pending"`.
 * - For complex state nodes, this is an object, e.g., `{ success: "someChildState" }`.
 */

// TODO: remove once TS fixes this type-widening issue

// TODO: possibly refactor this somehow, use even a simpler type, and maybe even make `machine.options` private or something

var ActionTypes;
(function (ActionTypes) {
  ActionTypes["Stop"] = "xstate.stop";
  ActionTypes["Raise"] = "xstate.raise";
  ActionTypes["Send"] = "xstate.send";
  ActionTypes["Cancel"] = "xstate.cancel";
  ActionTypes["Assign"] = "xstate.assign";
  ActionTypes["After"] = "xstate.after";
  ActionTypes["DoneState"] = "done.state";
  ActionTypes["DoneInvoke"] = "done.invoke";
  ActionTypes["Log"] = "xstate.log";
  ActionTypes["Init"] = "xstate.init";
  ActionTypes["Invoke"] = "xstate.invoke";
  ActionTypes["ErrorExecution"] = "error.execution";
  ActionTypes["ErrorCommunication"] = "error.communication";
  ActionTypes["ErrorPlatform"] = "error.platform";
  ActionTypes["ErrorCustom"] = "xstate.error";
  ActionTypes["Pure"] = "xstate.pure";
  ActionTypes["Choose"] = "xstate.choose";
})(ActionTypes || (ActionTypes = {}));
var SpecialTargets;
(function (SpecialTargets) {
  SpecialTargets["Parent"] = "#_parent";
  SpecialTargets["Internal"] = "#_internal";
})(SpecialTargets || (SpecialTargets = {}));

// xstate-specific action types
var stop$1 = ActionTypes.Stop;
var raise$1 = ActionTypes.Raise;
var send$1 = ActionTypes.Send;
var cancel$1 = ActionTypes.Cancel;
var assign$1 = ActionTypes.Assign;
ActionTypes.After;
ActionTypes.DoneState;
ActionTypes.Log;
var init = ActionTypes.Init;
var invoke$1 = ActionTypes.Invoke;
var errorExecution = ActionTypes.ErrorExecution;
var errorPlatform = ActionTypes.ErrorPlatform;
ActionTypes.ErrorCustom;
ActionTypes.Choose;
var pure$1 = ActionTypes.Pure;

function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[Symbol.toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}

function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}

function _defineProperty(obj, key, value) {
  key = _toPropertyKey(key);
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }
  return target;
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
  if (null != _i) {
    var _s,
      _e,
      _x,
      _r,
      _arr = [],
      _n = !0,
      _d = !1;
    try {
      if (_x = (_i = _i.call(arr)).next, 0 === i) {
        if (Object(_i) !== _i) return;
        _n = !1;
      } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
    } catch (err) {
      _d = !0, _e = err;
    } finally {
      try {
        if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return;
      } finally {
        if (_d) throw _e;
      }
    }
    return _arr;
  }
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;
      var F = function () {};
      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var normalCompletion = true,
    didErr = false,
    err;
  return {
    s: function () {
      it = it.call(o);
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

var STATE_DELIMITER = '.';
var TARGETLESS_KEY = '';
var NULL_EVENT = '';
var STATE_IDENTIFIER$1 = '#';
var WILDCARD = '*';

function matchesState(parentStateId, childStateId) {
  var delimiter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : STATE_DELIMITER;
  var parentStateValue = toStateValue(parentStateId, delimiter);
  var childStateValue = toStateValue(childStateId, delimiter);
  if (isString(childStateValue)) {
    if (isString(parentStateValue)) {
      return childStateValue === parentStateValue;
    }

    // Parent more specific than child
    return false;
  }
  if (isString(parentStateValue)) {
    return parentStateValue in childStateValue;
  }
  return Object.keys(parentStateValue).every(function (key) {
    if (!(key in childStateValue)) {
      return false;
    }
    return matchesState(parentStateValue[key], childStateValue[key]);
  });
}
function toStatePath(stateId, delimiter) {
  try {
    if (isArray(stateId)) {
      return stateId;
    }
    return stateId.toString().split(delimiter);
  } catch (e) {
    throw new Error("'".concat(stateId, "' is not a valid state path."));
  }
}
function isStateLike(state) {
  return _typeof(state) === 'object' && 'value' in state && 'context' in state && 'event' in state;
}
function toStateValue(stateValue, delimiter) {
  if (isStateLike(stateValue)) {
    return stateValue.value;
  }
  if (isArray(stateValue)) {
    return pathToStateValue(stateValue);
  }
  if (typeof stateValue !== 'string') {
    return stateValue;
  }
  var statePath = toStatePath(stateValue, delimiter);
  return pathToStateValue(statePath);
}
function pathToStateValue(statePath) {
  if (statePath.length === 1) {
    return statePath[0];
  }
  var value = {};
  var marker = value;
  for (var _i = 0; _i < statePath.length - 1; _i++) {
    if (_i === statePath.length - 2) {
      marker[statePath[_i]] = statePath[_i + 1];
    } else {
      marker[statePath[_i]] = {};
      marker = marker[statePath[_i]];
    }
  }
  return value;
}
function mapValues(collection, iteratee) {
  var result = {};
  var collectionKeys = Object.keys(collection);
  for (var _i2 = 0; _i2 < collectionKeys.length; _i2++) {
    var _key = collectionKeys[_i2];
    result[_key] = iteratee(collection[_key], _key, collection, _i2);
  }
  return result;
}
function flatten(array) {
  var _ref;
  return (_ref = []).concat.apply(_ref, _toConsumableArray(array));
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
  if (isFunction(mapper)) {
    return mapper({
      context: context,
      event: event
    });
  }
  var result = {};
  var args = {
    context: context,
    event: event
  };
  for (var _i4 = 0, _Object$keys2 = Object.keys(mapper); _i4 < _Object$keys2.length; _i4++) {
    var _key3 = _Object$keys2[_i4];
    var subMapper = mapper[_key3];
    if (isFunction(subMapper)) {
      result[_key3] = subMapper(args);
    } else {
      result[_key3] = subMapper;
    }
  }
  return result;
}

// tslint:disable-next-line:no-empty
var warn = function warn() {};
if (!IS_PRODUCTION) {
  warn = function warn(condition, message) {
    var error = condition instanceof Error ? condition : undefined;
    if (!error && condition) {
      return;
    }
    if (console !== undefined) {
      var args = ["Warning: ".concat(message)];
      if (error) {
        args.push(error);
      }
      // tslint:disable-next-line:no-console
      console.warn.apply(console, args);
    }
  };
}
function isArray(value) {
  return Array.isArray(value);
}

// tslint:disable-next-line:ban-types
function isFunction(value) {
  return typeof value === 'function';
}
function isString(value) {
  return typeof value === 'string';
}
function isErrorEvent(event) {
  return typeof event.type === 'string' && (event.type === errorExecution || event.type.startsWith(errorPlatform));
}
function toTransitionConfigArray(event, configLike) {
  var transitions = toArrayStrict(configLike).map(function (transitionLike) {
    if (typeof transitionLike === 'undefined' || typeof transitionLike === 'string') {
      return {
        target: transitionLike,
        event: event
      };
    }
    return _objectSpread2(_objectSpread2({}, transitionLike), {}, {
      event: event
    });
  });
  return transitions;
}
function normalizeTarget(target) {
  if (target === undefined || target === TARGETLESS_KEY) {
    return undefined;
  }
  return toArray(target);
}
function toInvokeConfig(invocable, id) {
  if (_typeof(invocable) === 'object') {
    if ('src' in invocable) {
      return invocable;
    }
    if ('transition' in invocable) {
      return {
        id: id,
        src: invocable
      };
    }
  }
  return {
    id: id,
    src: invocable
  };
}
function toObserver(nextHandler, errorHandler, completionHandler) {
  var noop = function noop() {};
  var isObserver = _typeof(nextHandler) === 'object';
  var self = isObserver ? nextHandler : null;
  return {
    next: ((isObserver ? nextHandler.next : nextHandler) || noop).bind(self),
    error: ((isObserver ? nextHandler.error : errorHandler) || noop).bind(self),
    complete: ((isObserver ? nextHandler.complete : completionHandler) || noop).bind(self)
  };
}
function createInvokeId(stateNodeId, index) {
  return "".concat(stateNodeId, ":invocation[").concat(index, "]");
}
function resolveReferencedActor(referenced) {
  return referenced ? 'transition' in referenced ? {
    src: referenced,
    input: undefined
  } : referenced : undefined;
}

function createDynamicAction(action, resolve) {
  return {
    type: action.type,
    params: action.params,
    resolve: resolve
  };
}
function isDynamicAction(action) {
  return _typeof(action) === 'object' && action !== null && 'resolve' in action;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

var Mailbox = /*#__PURE__*/function () {
  function Mailbox(_process) {
    _classCallCheck(this, Mailbox);
    this._process = _process;
    _defineProperty(this, "_active", false);
    _defineProperty(this, "_current", null);
    _defineProperty(this, "_last", null);
  }
  _createClass(Mailbox, [{
    key: "start",
    value: function start() {
      this._active = true;
      this.flush();
    }
  }, {
    key: "clear",
    value: function clear() {
      // we can't set _current to null because we might be currently processing
      // and enqueue following clear shouldnt start processing the enqueued item immediately
      if (this._current) {
        this._current.next = null;
        this._last = this._current;
      }
    }

    // TODO: rethink this design
  }, {
    key: "prepend",
    value: function prepend(event) {
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
  }, {
    key: "enqueue",
    value: function enqueue(event) {
      var enqueued = {
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
  }, {
    key: "flush",
    value: function flush() {
      while (this._current) {
        // atm the given _process is responsible for implementing proper try/catch handling
        // we assume here that this won't throw in a way that can affect this mailbox
        var consumed = this._current;
        this._process(consumed.value);
        // something could have been prepended in the meantime
        // so we need to be defensive here to avoid skipping over a prepended item
        if (consumed === this._current) {
          this._current = this._current.next;
        }
      }
      this._last = null;
    }
  }]);
  return Mailbox;
}();

var symbolObservable = function () {
  return typeof Symbol === 'function' && Symbol.observable || '@@observable';
}();

function fromPromise(
// TODO: add types
promiseCreator) {
  var resolveEventType = '$$xstate.resolve';
  var rejectEventType = '$$xstate.reject';

  // TODO: add event types
  var behavior = {
    config: promiseCreator,
    transition: function transition(state, event) {
      if (state.status !== 'active') {
        return state;
      }
      switch (event.type) {
        case resolveEventType:
          return _objectSpread2(_objectSpread2({}, state), {}, {
            status: 'done',
            data: event.data,
            input: undefined
          });
        case rejectEventType:
          return _objectSpread2(_objectSpread2({}, state), {}, {
            status: 'error',
            data: event.data,
            input: undefined
          });
        case stopSignalType:
          return _objectSpread2(_objectSpread2({}, state), {}, {
            status: 'canceled',
            input: undefined
          });
        default:
          return state;
      }
    },
    start: function start(state, _ref) {
      var self = _ref.self;
      // TODO: determine how to allow customizing this so that promises
      // can be restarted if necessary
      if (state.status !== 'active') {
        return;
      }
      var resolvedPromise = Promise.resolve(promiseCreator({
        input: state.input
      }));
      resolvedPromise.then(function (response) {
        // TODO: remove this condition once dead letter queue lands
        if (self._state.status !== 'active') {
          return;
        }
        self.send({
          type: resolveEventType,
          data: response
        });
      }, function (errorData) {
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
    getInitialState: function getInitialState(_, input) {
      return {
        status: 'active',
        data: undefined,
        input: input
      };
    },
    getSnapshot: function getSnapshot(state) {
      return state.data;
    },
    getStatus: function getStatus(state) {
      return state;
    },
    getPersistedState: function getPersistedState(state) {
      return state;
    },
    restoreState: function restoreState(state) {
      return state;
    }
  };
  return behavior;
}
var stopSignalType = 'xstate.stop';
function isActorRef(item) {
  return !!item && _typeof(item) === 'object' && typeof item.send === 'function';
}

function createSystem() {
  var sessionIdCounter = 0;
  var children = new Map();
  var keyedActors = new Map();
  var reverseKeyedActors = new WeakMap();
  var system = {
    _bookId: function _bookId() {
      return "x:".concat(sessionIdCounter++);
    },
    _register: function _register(sessionId, actorRef) {
      children.set(sessionId, actorRef);
      return sessionId;
    },
    _unregister: function _unregister(actorRef) {
      children["delete"](actorRef.sessionId);
      var systemId = reverseKeyedActors.get(actorRef);
      if (systemId !== undefined) {
        keyedActors["delete"](systemId);
        reverseKeyedActors["delete"](actorRef);
      }
    },
    get: function get(systemId) {
      return keyedActors.get(systemId);
    },
    _set: function _set(systemId, actorRef) {
      var existing = keyedActors.get(systemId);
      if (existing && existing !== actorRef) {
        throw new Error("Actor with system ID '".concat(systemId, "' already exists."));
      }
      keyedActors.set(systemId, actorRef);
      reverseKeyedActors.set(actorRef, systemId);
    }
  };
  return system;
}

var ActorStatus;
(function (ActorStatus) {
  ActorStatus[ActorStatus["NotStarted"] = 0] = "NotStarted";
  ActorStatus[ActorStatus["Running"] = 1] = "Running";
  ActorStatus[ActorStatus["Stopped"] = 2] = "Stopped";
})(ActorStatus || (ActorStatus = {}));
var defaultOptions = {
  deferEvents: true,
  clock: {
    setTimeout: function (_setTimeout) {
      function setTimeout(_x, _x2) {
        return _setTimeout.apply(this, arguments);
      }
      setTimeout.toString = function () {
        return _setTimeout.toString();
      };
      return setTimeout;
    }(function (fn, ms) {
      return setTimeout(fn, ms);
    }),
    clearTimeout: function (_clearTimeout) {
      function clearTimeout(_x3) {
        return _clearTimeout.apply(this, arguments);
      }
      clearTimeout.toString = function () {
        return _clearTimeout.toString();
      };
      return clearTimeout;
    }(function (id) {
      return clearTimeout(id);
    })
  },
  logger: console.log.bind(console),
  devTools: false
};
var Interpreter = /*#__PURE__*/function () {
  /**
   * The current state of the interpreted behavior.
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
   * Creates a new Interpreter instance (i.e., service) for the given behavior with the provided options, if any.
   *
   * @param behavior The behavior to be interpreted
   * @param options Interpreter options
   */
  function Interpreter(behavior, options) {
    var _parent$system,
      _this = this;
    _classCallCheck(this, Interpreter);
    this.behavior = behavior;
    _defineProperty(this, "_state", void 0);
    _defineProperty(this, "clock", void 0);
    _defineProperty(this, "options", void 0);
    _defineProperty(this, "id", void 0);
    _defineProperty(this, "mailbox", new Mailbox(this._process.bind(this)));
    _defineProperty(this, "delayedEventsMap", {});
    _defineProperty(this, "observers", new Set());
    _defineProperty(this, "logger", void 0);
    _defineProperty(this, "status", ActorStatus.NotStarted);
    _defineProperty(this, "_parent", void 0);
    _defineProperty(this, "ref", void 0);
    _defineProperty(this, "_actorContext", void 0);
    _defineProperty(this, "_systemId", void 0);
    _defineProperty(this, "sessionId", void 0);
    _defineProperty(this, "system", void 0);
    _defineProperty(this, "_doneEvent", void 0);
    _defineProperty(this, "src", void 0);
    _defineProperty(this, "_deferred", []);
    var resolvedOptions = _objectSpread2(_objectSpread2({}, defaultOptions), options);
    var clock = resolvedOptions.clock,
      logger = resolvedOptions.logger,
      parent = resolvedOptions.parent,
      id = resolvedOptions.id,
      systemId = resolvedOptions.systemId;
    var self = this;
    this.system = (_parent$system = parent === null || parent === void 0 ? void 0 : parent.system) !== null && _parent$system !== void 0 ? _parent$system : createSystem();
    if (systemId) {
      this._systemId = systemId;
      this.system._set(systemId, this);
    }
    this.sessionId = this.system._bookId();
    this.id = id !== null && id !== void 0 ? id : this.sessionId;
    this.logger = logger;
    this.clock = clock;
    this._parent = parent;
    this.options = resolvedOptions;
    this.src = resolvedOptions.src;
    this.ref = this;
    this._actorContext = {
      self: self,
      id: this.id,
      sessionId: this.sessionId,
      logger: this.logger,
      defer: function defer(fn) {
        _this._deferred.push(fn);
      },
      system: this.system,
      stopChild: function stopChild(child) {
        if (child._parent !== _this) {
          throw new Error("Cannot stop child actor ".concat(child.id, " of ").concat(_this.id, " because it is not a child"));
        }
        child._stop();
      }
    };

    // Ensure that the send method is bound to this interpreter instance
    // if destructured
    this.send = this.send.bind(this);
    this._initState();
  }
  _createClass(Interpreter, [{
    key: "_initState",
    value: function _initState() {
      var _this$options;
      this._state = this.options.state ? this.behavior.restoreState ? this.behavior.restoreState(this.options.state, this._actorContext) : this.options.state : this.behavior.getInitialState(this._actorContext, (_this$options = this.options) === null || _this$options === void 0 ? void 0 : _this$options.input);
    }

    // array of functions to defer
  }, {
    key: "update",
    value: function update(state) {
      var _this$behavior$getSta, _this$behavior, _this$_parent, _this$_parent2;
      // Update state
      this._state = state;
      var snapshot = this.getSnapshot();

      // Execute deferred effects
      var deferredFn;
      while (deferredFn = this._deferred.shift()) {
        deferredFn(state);
      }
      var _iterator = _createForOfIteratorHelper(this.observers),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _observer$next;
          var _observer = _step.value;
          (_observer$next = _observer.next) === null || _observer$next === void 0 ? void 0 : _observer$next.call(_observer, snapshot);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      var status = (_this$behavior$getSta = (_this$behavior = this.behavior).getStatus) === null || _this$behavior$getSta === void 0 ? void 0 : _this$behavior$getSta.call(_this$behavior, state);
      switch (status === null || status === void 0 ? void 0 : status.status) {
        case 'done':
          this._stopProcedure();
          this._doneEvent = doneInvoke(this.id, status.data);
          (_this$_parent = this._parent) === null || _this$_parent === void 0 ? void 0 : _this$_parent.send(this._doneEvent);
          this._complete();
          break;
        case 'error':
          this._stopProcedure();
          (_this$_parent2 = this._parent) === null || _this$_parent2 === void 0 ? void 0 : _this$_parent2.send(error(this.id, status.data));
          this._error(status.data);
          break;
      }
    }
  }, {
    key: "subscribe",
    value: function subscribe(nextListenerOrObserver, errorListener, completeListener) {
      var _this2 = this;
      var observer = toObserver(nextListenerOrObserver, errorListener, completeListener);
      this.observers.add(observer);
      if (this.status === ActorStatus.Stopped) {
        var _observer$complete;
        (_observer$complete = observer.complete) === null || _observer$complete === void 0 ? void 0 : _observer$complete.call(observer);
        this.observers["delete"](observer);
      }
      return {
        unsubscribe: function unsubscribe() {
          _this2.observers["delete"](observer);
        }
      };
    }

    /**
     * Adds a state listener that is notified when the statechart has reached its final state.
     * @param listener The state listener
     */
  }, {
    key: "onDone",
    value: function onDone(listener) {
      var _this3 = this;
      if (this.status === ActorStatus.Stopped && this._doneEvent) {
        listener(this._doneEvent);
      } else {
        this.observers.add({
          complete: function complete() {
            if (_this3._doneEvent) {
              listener(_this3._doneEvent);
            }
          }
        });
      }
      return this;
    }

    /**
     * Starts the interpreter from the initial state
     */
  }, {
    key: "start",
    value: function start() {
      if (this.status === ActorStatus.Running) {
        // Do not restart the service if it is already started
        return this;
      }
      this.system._register(this.sessionId, this);
      if (this._systemId) {
        this.system._set(this._systemId, this);
      }
      this.status = ActorStatus.Running;
      if (this.behavior.start) {
        this.behavior.start(this._state, this._actorContext);
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
  }, {
    key: "_process",
    value: function _process(event) {
      try {
        var nextState = this.behavior.transition(this._state, event, this._actorContext);
        this.update(nextState);
        if (event.type === stopSignalType) {
          this._stopProcedure();
          this._complete();
        }
      } catch (err) {
        // TODO: properly handle errors
        if (this.observers.size > 0) {
          this.observers.forEach(function (observer) {
            var _observer$error;
            (_observer$error = observer.error) === null || _observer$error === void 0 ? void 0 : _observer$error.call(observer, err);
          });
          this.stop();
        } else {
          throw err;
        }
      }
    }
  }, {
    key: "_stop",
    value: function _stop() {
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
  }, {
    key: "stop",
    value: function stop() {
      if (this._parent) {
        throw new Error('A non-root actor cannot be stopped directly.');
      }
      return this._stop();
    }
  }, {
    key: "_complete",
    value: function _complete() {
      var _iterator2 = _createForOfIteratorHelper(this.observers),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var _observer2$complete;
          var _observer2 = _step2.value;
          (_observer2$complete = _observer2.complete) === null || _observer2$complete === void 0 ? void 0 : _observer2$complete.call(_observer2);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      this.observers.clear();
    }
  }, {
    key: "_error",
    value: function _error(data) {
      var _iterator3 = _createForOfIteratorHelper(this.observers),
        _step3;
      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var _observer3$error;
          var _observer3 = _step3.value;
          (_observer3$error = _observer3.error) === null || _observer3$error === void 0 ? void 0 : _observer3$error.call(_observer3, data);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }
      this.observers.clear();
    }
  }, {
    key: "_stopProcedure",
    value: function _stopProcedure() {
      if (this.status !== ActorStatus.Running) {
        // Interpreter already stopped; do nothing
        return this;
      }

      // Cancel all delayed events
      for (var _i = 0, _Object$keys = Object.keys(this.delayedEventsMap); _i < _Object$keys.length; _i++) {
        var key = _Object$keys[_i];
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
  }, {
    key: "send",
    value: function send(event) {
      if (typeof event === 'string') {
        throw new Error("Only event objects may be sent to actors; use .send({ type: \"".concat(event, "\" }) instead"));
      }
      if (this.status === ActorStatus.Stopped) {
        // do nothing
        if (!IS_PRODUCTION) {
          var eventString = JSON.stringify(event);
          warn(false, "Event \"".concat(event.type.toString(), "\" was sent to stopped actor \"").concat(this.id, " (").concat(this.sessionId, ")\". This actor has already reached its final state, and will not transition.\nEvent: ").concat(eventString));
        }
        return;
      }
      if (this.status !== ActorStatus.Running && !this.options.deferEvents) {
        throw new Error("Event \"".concat(event.type, "\" was sent to uninitialized actor \"").concat(this.id
        // tslint:disable-next-line:max-line-length
        , "\". Make sure .start() is called for this actor, or set { deferEvents: true } in the actor options.\nEvent: ").concat(JSON.stringify(event)));
      }
      this.mailbox.enqueue(event);
    }

    // TODO: make private (and figure out a way to do this within the machine)
  }, {
    key: "delaySend",
    value: function delaySend(sendAction) {
      var _this4 = this;
      this.delayedEventsMap[sendAction.params.id] = this.clock.setTimeout(function () {
        if ('to' in sendAction.params && sendAction.params.to) {
          sendAction.params.to.send(sendAction.params.event);
        } else {
          _this4.send(sendAction.params.event);
        }
      }, sendAction.params.delay);
    }

    // TODO: make private (and figure out a way to do this within the machine)
  }, {
    key: "cancel",
    value: function cancel(sendId) {
      this.clock.clearTimeout(this.delayedEventsMap[sendId]);
      delete this.delayedEventsMap[sendId];
    }
  }, {
    key: "attachDevTools",
    value: function attachDevTools() {
      var devTools = this.options.devTools;
      if (devTools) {
        var resolvedDevToolsAdapter = typeof devTools === 'function' ? devTools : devToolsAdapter;
        resolvedDevToolsAdapter(this);
      }
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return {
        id: this.id
      };
    }
  }, {
    key: "getPersistedState",
    value: function getPersistedState() {
      var _this$behavior$getPer, _this$behavior2;
      return (_this$behavior$getPer = (_this$behavior2 = this.behavior).getPersistedState) === null || _this$behavior$getPer === void 0 ? void 0 : _this$behavior$getPer.call(_this$behavior2, this._state);
    }
  }, {
    key: symbolObservable,
    value: function value() {
      return this;
    }
  }, {
    key: "getSnapshot",
    value: function getSnapshot() {
      return this.behavior.getSnapshot ? this.behavior.getSnapshot(this._state) : this._state;
    }
  }]);
  return Interpreter;
}();

/**
 * Creates a new Interpreter instance for the given machine with the provided options, if any.
 *
 * @param machine The machine to interpret
 * @param options Interpreter options
 */

function interpret(behavior, options) {
  var interpreter = new Interpreter(behavior, options);
  return interpreter;
}

/**
 * Stops an actor.
 *
 * @param actorRef The actor to stop.
 */

function stop(actorRef) {
  var actor = actorRef;
  return createDynamicAction({
    type: stop$1,
    params: {
      actor: actor
    }
  }, function (event, _ref) {
    var state = _ref.state;
    var actorRefOrString = isFunction(actor) ? actor({
      context: state.context,
      event: event
    }) : actor;
    var actorRef = typeof actorRefOrString === 'string' ? state.children[actorRefOrString] : actorRefOrString;
    return [state, {
      type: 'xstate.stop',
      params: {
        actor: actorRef
      },
      execute: function execute(actorCtx) {
        if (!actorRef) {
          return;
        }
        if (actorRef.status !== ActorStatus.Running) {
          actorCtx.stopChild(actorRef);
          return;
        }
        actorCtx.defer(function () {
          actorCtx.stopChild(actorRef);
        });
      }
    }];
  });
}

/**
 * Cancels an in-flight `send(...)` action. A canceled sent action will not
 * be executed, nor will its event be sent, unless it has already been sent
 * (e.g., if `cancel(...)` is called after the `send(...)` action's `delay`).
 *
 * @param sendId The `id` of the `send(...)` action to cancel.
 */

function cancel(sendId) {
  return createDynamicAction({
    type: cancel$1,
    params: {
      sendId: sendId
    }
  }, function (event, _ref) {
    var _actorContext$self;
    var state = _ref.state,
      actorContext = _ref.actorContext;
    var resolvedSendId = isFunction(sendId) ? sendId({
      context: state.context,
      event: event,
      self: (_actorContext$self = actorContext === null || actorContext === void 0 ? void 0 : actorContext.self) !== null && _actorContext$self !== void 0 ? _actorContext$self : {},
      system: actorContext === null || actorContext === void 0 ? void 0 : actorContext.system
    }) : sendId;
    return [state, {
      type: 'xstate.cancel',
      params: {
        sendId: resolvedSendId
      },
      execute: function execute(actorCtx) {
        var interpreter = actorCtx.self;
        interpreter.cancel(resolvedSendId);
      }
    }];
  });
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}

var cache = new WeakMap();
function memo(object, key, fn) {
  var memoizedData = cache.get(object);
  if (!memoizedData) {
    memoizedData = _defineProperty({}, key, fn());
    cache.set(object, memoizedData);
  } else if (!(key in memoizedData)) {
    memoizedData[key] = fn();
  }
  return memoizedData[key];
}
function evaluateGuard(guard, context, event, state) {
  var _machine$options$guar, _machine$options, _machine$options$guar2;
  var machine = state.machine;
  var predicate = (_machine$options$guar = machine === null || machine === void 0 ? void 0 : (_machine$options = machine.options) === null || _machine$options === void 0 ? void 0 : (_machine$options$guar2 = _machine$options.guards) === null || _machine$options$guar2 === void 0 ? void 0 : _machine$options$guar2[guard.type]) !== null && _machine$options$guar !== void 0 ? _machine$options$guar : guard.predicate;
  if (!predicate) {
    throw new Error("Guard '".concat(guard.type, "' is not implemented.'."));
  }
  return predicate({
    context: context,
    event: event,
    state: state,
    guard: guard,
    evaluate: evaluateGuard
  });
}
function toGuardDefinition(guardConfig, getPredicate) {
  var _guardConfig$children;
  if (isString(guardConfig)) {
    return {
      type: guardConfig,
      predicate: (getPredicate === null || getPredicate === void 0 ? void 0 : getPredicate(guardConfig)) || undefined,
      params: {
        type: guardConfig
      }
    };
  }
  if (isFunction(guardConfig)) {
    return {
      type: guardConfig.name,
      predicate: guardConfig,
      params: {
        type: guardConfig.name,
        name: guardConfig.name
      }
    };
  }
  return {
    type: guardConfig.type,
    params: guardConfig.params || guardConfig,
    children: (_guardConfig$children = guardConfig.children) === null || _guardConfig$children === void 0 ? void 0 : _guardConfig$children.map(function (childGuard) {
      return toGuardDefinition(childGuard, getPredicate);
    }),
    predicate: (getPredicate === null || getPredicate === void 0 ? void 0 : getPredicate(guardConfig.type)) || guardConfig.predicate
  };
}

function getOutput(configuration, context, event) {
  var machine = configuration[0].machine;
  var finalChildStateNode = configuration.find(function (stateNode) {
    return stateNode.type === 'final' && stateNode.parent === machine.root;
  });
  return finalChildStateNode && finalChildStateNode.output ? mapContext(finalChildStateNode.output, context, event) : undefined;
}
var isAtomicStateNode = function isAtomicStateNode(stateNode) {
  return stateNode.type === 'atomic' || stateNode.type === 'final';
};
function getChildren(stateNode) {
  return Object.values(stateNode.states).filter(function (sn) {
    return sn.type !== 'history';
  });
}
function getProperAncestors(stateNode, toStateNode) {
  var ancestors = [];

  // add all ancestors
  var m = stateNode.parent;
  while (m && m !== toStateNode) {
    ancestors.push(m);
    m = m.parent;
  }
  return ancestors;
}
function getConfiguration(stateNodes) {
  var configuration = new Set(stateNodes);
  var configurationSet = new Set(stateNodes);
  var adjList = getAdjList(configurationSet);

  // add descendants
  var _iterator = _createForOfIteratorHelper(configuration),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var s = _step.value;
      // if previously active, add existing child nodes
      if (s.type === 'compound' && (!adjList.get(s) || !adjList.get(s).length)) {
        getInitialStateNodes(s).forEach(function (sn) {
          return configurationSet.add(sn);
        });
      } else {
        if (s.type === 'parallel') {
          var _iterator3 = _createForOfIteratorHelper(getChildren(s)),
            _step3;
          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              var child = _step3.value;
              if (child.type === 'history') {
                continue;
              }
              if (!configurationSet.has(child)) {
                for (var _i = 0, _getInitialStateNodes = getInitialStateNodes(child); _i < _getInitialStateNodes.length; _i++) {
                  var initialStateNode = _getInitialStateNodes[_i];
                  configurationSet.add(initialStateNode);
                }
              }
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }
        }
      }
    }

    // add all ancestors
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  var _iterator2 = _createForOfIteratorHelper(configurationSet),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var _s = _step2.value;
      var m = _s.parent;
      while (m) {
        configurationSet.add(m);
        m = m.parent;
      }
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  return configurationSet;
}
function getValueFromAdj(baseNode, adjList) {
  var childStateNodes = adjList.get(baseNode);
  if (!childStateNodes) {
    return {}; // todo: fix?
  }

  if (baseNode.type === 'compound') {
    var childStateNode = childStateNodes[0];
    if (childStateNode) {
      if (isAtomicStateNode(childStateNode)) {
        return childStateNode.key;
      }
    } else {
      return {};
    }
  }
  var stateValue = {};
  var _iterator4 = _createForOfIteratorHelper(childStateNodes),
    _step4;
  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var _childStateNode = _step4.value;
      stateValue[_childStateNode.key] = getValueFromAdj(_childStateNode, adjList);
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
  return stateValue;
}
function getAdjList(configuration) {
  var adjList = new Map();
  var _iterator5 = _createForOfIteratorHelper(configuration),
    _step5;
  try {
    for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
      var s = _step5.value;
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
  } catch (err) {
    _iterator5.e(err);
  } finally {
    _iterator5.f();
  }
  return adjList;
}
function getStateValue(rootNode, configuration) {
  var config = getConfiguration(configuration);
  return getValueFromAdj(rootNode, getAdjList(config));
}
function isInFinalState(configuration) {
  var stateNode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : configuration[0].machine.root;
  if (stateNode.type === 'compound') {
    return getChildren(stateNode).some(function (s) {
      return s.type === 'final' && configuration.includes(s);
    });
  }
  if (stateNode.type === 'parallel') {
    return getChildren(stateNode).every(function (sn) {
      return isInFinalState(configuration, sn);
    });
  }
  return false;
}
var isStateId = function isStateId(str) {
  return str[0] === STATE_IDENTIFIER$1;
};
function getCandidates(stateNode, receivedEventType) {
  var candidates = stateNode.transitions.filter(function (transition) {
    var eventType = transition.eventType;
    // First, check the trivial case: event names are exactly equal
    if (eventType === receivedEventType) {
      return true;
    }

    // Then, check if transition is a wildcard transition,
    // which matches any non-transient events
    if (eventType === WILDCARD) {
      return true;
    }
    if (!eventType.endsWith('.*')) {
      return false;
    }
    if (!IS_PRODUCTION) {
      warn(!/.*\*.+/.test(eventType), "Wildcards can only be the last token of an event descriptor (e.g., \"event.*\") or the entire event descriptor (\"*\"). Check the \"".concat(eventType, "\" event."));
    }
    var partialEventTokens = eventType.split('.');
    var eventTokens = receivedEventType.split('.');
    for (var tokenIndex = 0; tokenIndex < partialEventTokens.length; tokenIndex++) {
      var partialEventToken = partialEventTokens[tokenIndex];
      var eventToken = eventTokens[tokenIndex];
      if (partialEventToken === '*') {
        var isLastToken = tokenIndex === partialEventTokens.length - 1;
        if (!IS_PRODUCTION) {
          warn(isLastToken, "Infix wildcards in transition events are not allowed. Check the \"".concat(eventType, "\" event."));
        }
        return isLastToken;
      }
      if (partialEventToken !== eventToken) {
        return false;
      }
    }
    return true;
  });
  return candidates;
}

/**
 * All delayed transitions from the config.
 */
function getDelayedTransitions(stateNode) {
  var afterConfig = stateNode.config.after;
  if (!afterConfig) {
    return [];
  }
  var mutateEntryExit = function mutateEntryExit(delay, i) {
    var delayRef = isFunction(delay) ? "".concat(stateNode.id, ":delay[").concat(i, "]") : delay;
    var eventType = after(delayRef, stateNode.id);
    stateNode.entry.push(raise({
      type: eventType
    }, {
      delay: delay
    }));
    stateNode.exit.push(cancel(eventType));
    return eventType;
  };
  var delayedTransitions = isArray(afterConfig) ? afterConfig.map(function (transition, i) {
    var eventType = mutateEntryExit(transition.delay, i);
    return _objectSpread2(_objectSpread2({}, transition), {}, {
      event: eventType
    });
  }) : Object.keys(afterConfig).flatMap(function (delay, i) {
    var configTransition = afterConfig[delay];
    var resolvedTransition = isString(configTransition) ? {
      target: configTransition
    } : configTransition;
    var resolvedDelay = !isNaN(+delay) ? +delay : delay;
    var eventType = mutateEntryExit(resolvedDelay, i);
    return toArray(resolvedTransition).map(function (transition) {
      return _objectSpread2(_objectSpread2({}, transition), {}, {
        event: eventType,
        delay: resolvedDelay
      });
    });
  });
  return delayedTransitions.map(function (delayedTransition) {
    var delay = delayedTransition.delay;
    return _objectSpread2(_objectSpread2({}, formatTransition(stateNode, delayedTransition)), {}, {
      delay: delay
    });
  });
}
function formatTransition(stateNode, transitionConfig) {
  var _transitionConfig$ree;
  var normalizedTarget = normalizeTarget(transitionConfig.target);
  var reenter = (_transitionConfig$ree = transitionConfig.reenter) !== null && _transitionConfig$ree !== void 0 ? _transitionConfig$ree : false;
  var guards = stateNode.machine.options.guards;
  var target = resolveTarget(stateNode, normalizedTarget);

  // TODO: should this be part of a lint rule instead?
  if (!IS_PRODUCTION && transitionConfig.cond) {
    throw new Error("State \"".concat(stateNode.id, "\" has declared `cond` for one of its transitions. This property has been renamed to `guard`. Please update your code."));
  }
  var transition = _objectSpread2(_objectSpread2({}, transitionConfig), {}, {
    actions: toActionObjects(toArray(transitionConfig.actions)),
    guard: transitionConfig.guard ? toGuardDefinition(transitionConfig.guard, function (guardType) {
      return guards[guardType];
    }) : undefined,
    target: target,
    source: stateNode,
    reenter: reenter,
    eventType: transitionConfig.event,
    toJSON: function toJSON() {
      return _objectSpread2(_objectSpread2({}, transition), {}, {
        source: "#".concat(stateNode.id),
        target: target ? target.map(function (t) {
          return "#".concat(t.id);
        }) : undefined
      });
    }
  });
  return transition;
}
function formatTransitions(stateNode) {
  var transitionConfigs = [];
  if (Array.isArray(stateNode.config.on)) {
    transitionConfigs.push.apply(transitionConfigs, _toConsumableArray(stateNode.config.on));
  } else if (stateNode.config.on) {
    var _stateNode$config$on = stateNode.config.on,
      _stateNode$config$on$ = _stateNode$config$on[WILDCARD],
      wildcardConfigs = _stateNode$config$on$ === void 0 ? [] : _stateNode$config$on$,
      namedTransitionConfigs = _objectWithoutProperties(_stateNode$config$on, [WILDCARD].map(_toPropertyKey));
    for (var _i2 = 0, _Object$keys = Object.keys(namedTransitionConfigs); _i2 < _Object$keys.length; _i2++) {
      var eventType = _Object$keys[_i2];
      if (eventType === NULL_EVENT) {
        throw new Error('Null events ("") cannot be specified as a transition key. Use `always: { ... }` instead.');
      }
      var eventTransitionConfigs = toTransitionConfigArray(eventType, namedTransitionConfigs[eventType]);
      transitionConfigs.push.apply(transitionConfigs, _toConsumableArray(eventTransitionConfigs));
      // TODO: add dev-mode validation for unreachable transitions
    }

    transitionConfigs.push.apply(transitionConfigs, _toConsumableArray(toTransitionConfigArray(WILDCARD, wildcardConfigs)));
  }
  var doneConfig = stateNode.config.onDone ? toTransitionConfigArray(String(done(stateNode.id)), stateNode.config.onDone) : [];
  var invokeConfig = stateNode.invoke.flatMap(function (invokeDef) {
    var settleTransitions = [];
    if (invokeDef.onDone) {
      settleTransitions.push.apply(settleTransitions, _toConsumableArray(toTransitionConfigArray("done.invoke.".concat(invokeDef.id), invokeDef.onDone)));
    }
    if (invokeDef.onError) {
      settleTransitions.push.apply(settleTransitions, _toConsumableArray(toTransitionConfigArray("error.platform.".concat(invokeDef.id), invokeDef.onError)));
    }
    if (invokeDef.onSnapshot) {
      settleTransitions.push.apply(settleTransitions, _toConsumableArray(toTransitionConfigArray("xstate.snapshot.".concat(invokeDef.id), invokeDef.onSnapshot)));
    }
    return settleTransitions;
  });
  var delayedTransitions = stateNode.after;
  var formattedTransitions = [].concat(_toConsumableArray(doneConfig), _toConsumableArray(invokeConfig), transitionConfigs).flatMap(function (transitionConfig) {
    return toArray(transitionConfig).map(function (transition) {
      return formatTransition(stateNode, transition);
    });
  });
  var _iterator6 = _createForOfIteratorHelper(delayedTransitions),
    _step6;
  try {
    for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
      var delayedTransition = _step6.value;
      formattedTransitions.push(delayedTransition);
    }
  } catch (err) {
    _iterator6.e(err);
  } finally {
    _iterator6.f();
  }
  return formattedTransitions;
}
function formatInitialTransition(stateNode, _target) {
  if (isString(_target) || isArray(_target)) {
    var targets = toArray(_target).map(function (t) {
      // Resolve state string keys (which represent children)
      // to their state node
      var descStateNode = isString(t) ? isStateId(t) ? stateNode.machine.getStateNodeById(t) : stateNode.states[t] : t;
      if (!descStateNode) {
        throw new Error("Initial state node \"".concat(t, "\" not found on parent state node #").concat(stateNode.id));
      }
      if (!isDescendant(descStateNode, stateNode)) {
        throw new Error("Invalid initial target: state node #".concat(descStateNode.id, " is not a descendant of #").concat(stateNode.id));
      }
      return descStateNode;
    });
    var resolvedTarget = resolveTarget(stateNode, targets);
    var transition = {
      source: stateNode,
      actions: [],
      eventType: null,
      reenter: false,
      target: resolvedTarget,
      toJSON: function toJSON() {
        return _objectSpread2(_objectSpread2({}, transition), {}, {
          source: "#".concat(stateNode.id),
          target: resolvedTarget ? resolvedTarget.map(function (t) {
            return "#".concat(t.id);
          }) : undefined
        });
      }
    };
    return transition;
  }
  return formatTransition(stateNode, {
    target: toArray(_target.target).map(function (t) {
      if (isString(t)) {
        return isStateId(t) ? t : "".concat(stateNode.machine.delimiter).concat(t);
      }
      return t;
    }),
    actions: _target.actions,
    event: null
  });
}
function resolveTarget(stateNode, targets) {
  if (targets === undefined) {
    // an undefined target signals that the state node should not transition from that state when receiving that event
    return undefined;
  }
  return targets.map(function (target) {
    if (!isString(target)) {
      return target;
    }
    if (isStateId(target)) {
      return stateNode.machine.getStateNodeById(target);
    }
    var isInternalTarget = target[0] === stateNode.machine.delimiter;
    // If internal target is defined on machine,
    // do not include machine key on target
    if (isInternalTarget && !stateNode.parent) {
      return getStateNodeByPath(stateNode, target.slice(1));
    }
    var resolvedTarget = isInternalTarget ? stateNode.key + target : target;
    if (stateNode.parent) {
      try {
        var targetStateNode = getStateNodeByPath(stateNode.parent, resolvedTarget);
        return targetStateNode;
      } catch (err) {
        throw new Error("Invalid transition definition for state node '".concat(stateNode.id, "':\n").concat(err.message));
      }
    } else {
      throw new Error("Invalid target: \"".concat(target, "\" is not a valid target from the root node. Did you mean \".").concat(target, "\"?"));
    }
  });
}
function resolveHistoryTarget(stateNode) {
  var normalizedTarget = normalizeTarget(stateNode.target);
  if (!normalizedTarget) {
    return stateNode.parent.initial.target;
  }
  return normalizedTarget.map(function (t) {
    return typeof t === 'string' ? getStateNodeByPath(stateNode.parent, t) : t;
  });
}
function isHistoryNode(stateNode) {
  return stateNode.type === 'history';
}
function getInitialStateNodes(stateNode) {
  var set = new Set();
  function iter(descStateNode) {
    if (set.has(descStateNode)) {
      return;
    }
    set.add(descStateNode);
    if (descStateNode.type === 'compound') {
      var _iterator7 = _createForOfIteratorHelper(descStateNode.initial.target),
        _step7;
      try {
        for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
          var targetStateNode = _step7.value;
          var _iterator8 = _createForOfIteratorHelper(getProperAncestors(targetStateNode, stateNode)),
            _step8;
          try {
            for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
              var a = _step8.value;
              set.add(a);
            }
          } catch (err) {
            _iterator8.e(err);
          } finally {
            _iterator8.f();
          }
          iter(targetStateNode);
        }
      } catch (err) {
        _iterator7.e(err);
      } finally {
        _iterator7.f();
      }
    } else if (descStateNode.type === 'parallel') {
      var _iterator9 = _createForOfIteratorHelper(getChildren(descStateNode)),
        _step9;
      try {
        for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
          var child = _step9.value;
          iter(child);
        }
      } catch (err) {
        _iterator9.e(err);
      } finally {
        _iterator9.f();
      }
    }
  }
  iter(stateNode);
  return _toConsumableArray(set);
}
/**
 * Returns the child state node from its relative `stateKey`, or throws.
 */
function getStateNode(stateNode, stateKey) {
  if (isStateId(stateKey)) {
    return stateNode.machine.getStateNodeById(stateKey);
  }
  if (!stateNode.states) {
    throw new Error("Unable to retrieve child state '".concat(stateKey, "' from '").concat(stateNode.id, "'; no child states exist."));
  }
  var result = stateNode.states[stateKey];
  if (!result) {
    throw new Error("Child state '".concat(stateKey, "' does not exist on '").concat(stateNode.id, "'"));
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
  var arrayStatePath = toStatePath(statePath, stateNode.machine.delimiter).slice();
  var currentStateNode = stateNode;
  while (arrayStatePath.length) {
    var key = arrayStatePath.shift();
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
  var stateValue = state instanceof State ? state.value : toStateValue(state, stateNode.machine.delimiter);
  if (isString(stateValue)) {
    return [stateNode, stateNode.states[stateValue]];
  }
  var childStateKeys = Object.keys(stateValue);
  var childStateNodes = childStateKeys.map(function (subStateKey) {
    return getStateNode(stateNode, subStateKey);
  }).filter(Boolean);
  return [stateNode.machine.root, stateNode].concat(childStateNodes, childStateKeys.reduce(function (allSubStateNodes, subStateKey) {
    var subStateNode = getStateNode(stateNode, subStateKey);
    if (!subStateNode) {
      return allSubStateNodes;
    }
    var subStateNodes = getStateNodes(subStateNode, stateValue[subStateKey]);
    return allSubStateNodes.concat(subStateNodes);
  }, []));
}
function transitionAtomicNode(stateNode, stateValue, state, event) {
  var childStateNode = getStateNode(stateNode, stateValue);
  var next = childStateNode.next(state, event);
  if (!next || !next.length) {
    return stateNode.next(state, event);
  }
  return next;
}
function transitionCompoundNode(stateNode, stateValue, state, event) {
  var subStateKeys = Object.keys(stateValue);
  var childStateNode = getStateNode(stateNode, subStateKeys[0]);
  var next = transitionNode(childStateNode, stateValue[subStateKeys[0]], state, event);
  if (!next || !next.length) {
    return stateNode.next(state, event);
  }
  return next;
}
function transitionParallelNode(stateNode, stateValue, state, event) {
  var allInnerTransitions = [];
  for (var _i3 = 0, _Object$keys2 = Object.keys(stateValue); _i3 < _Object$keys2.length; _i3++) {
    var subStateKey = _Object$keys2[_i3];
    var subStateValue = stateValue[subStateKey];
    if (!subStateValue) {
      continue;
    }
    var subStateNode = getStateNode(stateNode, subStateKey);
    var innerTransitions = transitionNode(subStateNode, subStateValue, state, event);
    if (innerTransitions) {
      allInnerTransitions.push.apply(allInnerTransitions, _toConsumableArray(innerTransitions));
    }
  }
  if (!allInnerTransitions.length) {
    return stateNode.next(state, event);
  }
  return allInnerTransitions;
}
function transitionNode(stateNode, stateValue, state, event) {
  // leaf node
  if (isString(stateValue)) {
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
  return Object.keys(stateNode.states).map(function (key) {
    return stateNode.states[key];
  }).filter(function (sn) {
    return sn.type === 'history';
  });
}
function isDescendant(childStateNode, parentStateNode) {
  var marker = childStateNode;
  while (marker.parent && marker.parent !== parentStateNode) {
    marker = marker.parent;
  }
  return marker.parent === parentStateNode;
}
function getPathFromRootToNode(stateNode) {
  var path = [];
  var marker = stateNode.parent;
  while (marker) {
    path.unshift(marker);
    marker = marker.parent;
  }
  return path;
}
function hasIntersection(s1, s2) {
  var set1 = new Set(s1);
  var set2 = new Set(s2);
  var _iterator10 = _createForOfIteratorHelper(set1),
    _step10;
  try {
    for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
      var item = _step10.value;
      if (set2.has(item)) {
        return true;
      }
    }
  } catch (err) {
    _iterator10.e(err);
  } finally {
    _iterator10.f();
  }
  var _iterator11 = _createForOfIteratorHelper(set2),
    _step11;
  try {
    for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
      var _item = _step11.value;
      if (set1.has(_item)) {
        return true;
      }
    }
  } catch (err) {
    _iterator11.e(err);
  } finally {
    _iterator11.f();
  }
  return false;
}
function removeConflictingTransitions(enabledTransitions, configuration, historyValue) {
  var filteredTransitions = new Set();
  var _iterator12 = _createForOfIteratorHelper(enabledTransitions),
    _step12;
  try {
    for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
      var t1 = _step12.value;
      var t1Preempted = false;
      var transitionsToRemove = new Set();
      var _iterator13 = _createForOfIteratorHelper(filteredTransitions),
        _step13;
      try {
        for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
          var t2 = _step13.value;
          if (hasIntersection(computeExitSet([t1], configuration, historyValue), computeExitSet([t2], configuration, historyValue))) {
            if (isDescendant(t1.source, t2.source)) {
              transitionsToRemove.add(t2);
            } else {
              t1Preempted = true;
              break;
            }
          }
        }
      } catch (err) {
        _iterator13.e(err);
      } finally {
        _iterator13.f();
      }
      if (!t1Preempted) {
        var _iterator14 = _createForOfIteratorHelper(transitionsToRemove),
          _step14;
        try {
          for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
            var t3 = _step14.value;
            filteredTransitions["delete"](t3);
          }
        } catch (err) {
          _iterator14.e(err);
        } finally {
          _iterator14.f();
        }
        filteredTransitions.add(t1);
      }
    }
  } catch (err) {
    _iterator12.e(err);
  } finally {
    _iterator12.f();
  }
  return Array.from(filteredTransitions);
}
function findLCCA(stateNodes) {
  var _stateNodes = _slicedToArray(stateNodes, 1),
    head = _stateNodes[0];
  var current = getPathFromRootToNode(head);
  var candidates = [];
  var _iterator15 = _createForOfIteratorHelper(stateNodes),
    _step15;
  try {
    var _loop = function _loop() {
      var stateNode = _step15.value;
      var path = getPathFromRootToNode(stateNode);
      candidates = current.filter(function (sn) {
        return path.includes(sn);
      });
      current = candidates;
      candidates = [];
    };
    for (_iterator15.s(); !(_step15 = _iterator15.n()).done;) {
      _loop();
    }
  } catch (err) {
    _iterator15.e(err);
  } finally {
    _iterator15.f();
  }
  return current[current.length - 1];
}
function getEffectiveTargetStates(transition, historyValue) {
  if (!transition.target) {
    return [];
  }
  var targets = new Set();
  var _iterator16 = _createForOfIteratorHelper(transition.target),
    _step16;
  try {
    for (_iterator16.s(); !(_step16 = _iterator16.n()).done;) {
      var targetNode = _step16.value;
      if (isHistoryNode(targetNode)) {
        if (historyValue[targetNode.id]) {
          var _iterator17 = _createForOfIteratorHelper(historyValue[targetNode.id]),
            _step17;
          try {
            for (_iterator17.s(); !(_step17 = _iterator17.n()).done;) {
              var node = _step17.value;
              targets.add(node);
            }
          } catch (err) {
            _iterator17.e(err);
          } finally {
            _iterator17.f();
          }
        } else {
          var _iterator18 = _createForOfIteratorHelper(getEffectiveTargetStates({
              target: resolveHistoryTarget(targetNode)
            }, historyValue)),
            _step18;
          try {
            for (_iterator18.s(); !(_step18 = _iterator18.n()).done;) {
              var _node = _step18.value;
              targets.add(_node);
            }
          } catch (err) {
            _iterator18.e(err);
          } finally {
            _iterator18.f();
          }
        }
      } else {
        targets.add(targetNode);
      }
    }
  } catch (err) {
    _iterator16.e(err);
  } finally {
    _iterator16.f();
  }
  return _toConsumableArray(targets);
}
function getTransitionDomain(transition, historyValue) {
  var targetStates = getEffectiveTargetStates(transition, historyValue);
  if (!targetStates) {
    return null;
  }
  if (!transition.reenter && transition.source.type !== 'parallel' && targetStates.every(function (targetStateNode) {
    return isDescendant(targetStateNode, transition.source);
  })) {
    return transition.source;
  }
  var lcca = findLCCA(targetStates.concat(transition.source));
  return lcca;
}
function computeExitSet(transitions, configuration, historyValue) {
  var statesToExit = new Set();
  var _iterator19 = _createForOfIteratorHelper(transitions),
    _step19;
  try {
    for (_iterator19.s(); !(_step19 = _iterator19.n()).done;) {
      var _t$target;
      var t = _step19.value;
      if ((_t$target = t.target) !== null && _t$target !== void 0 && _t$target.length) {
        var domain = getTransitionDomain(t, historyValue);
        var _iterator20 = _createForOfIteratorHelper(configuration),
          _step20;
        try {
          for (_iterator20.s(); !(_step20 = _iterator20.n()).done;) {
            var stateNode = _step20.value;
            if (isDescendant(stateNode, domain)) {
              statesToExit.add(stateNode);
            }
          }
        } catch (err) {
          _iterator20.e(err);
        } finally {
          _iterator20.f();
        }
      }
    }
  } catch (err) {
    _iterator19.e(err);
  } finally {
    _iterator19.f();
  }
  return _toConsumableArray(statesToExit);
}

/**
 * https://www.w3.org/TR/scxml/#microstepProcedure
 *
 * @private
 * @param transitions
 * @param currentState
 * @param mutConfiguration
 */

function microstep(transitions, currentState, actorCtx, event) {
  var machine = currentState.machine;
  // Transition will "apply" if:
  // - the state node is the initial state (there is no current state)
  // - OR there are transitions
  var willTransition = currentState._initial || transitions.length > 0;
  var mutConfiguration = new Set(currentState.configuration);
  if (!currentState._initial && !willTransition) {
    var inertState = cloneState(currentState, {
      event: event,
      actions: [],
      transitions: []
    });
    inertState.changed = false;
    return inertState;
  }
  var microstate = microstepProcedure(currentState._initial ? [{
    target: _toConsumableArray(currentState.configuration).filter(isAtomicStateNode),
    source: machine.root,
    reenter: true,
    actions: [],
    eventType: null,
    toJSON: null // TODO: fix
  }] : transitions, currentState, mutConfiguration, event, actorCtx);
  var context = microstate.context,
    nonRaisedActions = microstate.actions;
  var children = setChildren(currentState, nonRaisedActions);
  var nextState = cloneState(microstate, {
    value: {},
    // TODO: make optional
    transitions: transitions,
    children: children
  });
  nextState.changed = currentState._initial ? undefined : !stateValuesEqual(nextState.value, currentState.value) || nextState.actions.length > 0 || context !== currentState.context;
  return nextState;
}
function setChildren(currentState, nonRaisedActions) {
  var children = _objectSpread2({}, currentState.children);
  var _iterator21 = _createForOfIteratorHelper(nonRaisedActions),
    _step21;
  try {
    for (_iterator21.s(); !(_step21 = _iterator21.n()).done;) {
      var action = _step21.value;
      if (action.type === invoke$1 && action.params.ref) {
        var ref = action.params.ref;
        if (ref) {
          children[ref.id] = ref;
        }
      } else if (action.type === stop$1) {
        var _ref = action.params.actor;
        if (_ref) {
          delete children[_ref.id];
        }
      }
    }
  } catch (err) {
    _iterator21.e(err);
  } finally {
    _iterator21.f();
  }
  return children;
}
function microstepProcedure(transitions, currentState, mutConfiguration, event, actorCtx) {
  var actions = [];
  var historyValue = _objectSpread2({}, currentState.historyValue);
  var filteredTransitions = removeConflictingTransitions(transitions, mutConfiguration, historyValue);
  var internalQueue = _toConsumableArray(currentState._internalQueue);

  // Exit states
  if (!currentState._initial) {
    exitStates(filteredTransitions, mutConfiguration, historyValue, actions);
  }

  // Execute transition content
  actions.push.apply(actions, _toConsumableArray(filteredTransitions.flatMap(function (t) {
    return t.actions;
  })));

  // Enter states
  enterStates(filteredTransitions, mutConfiguration, actions, internalQueue, currentState, historyValue);
  var nextConfiguration = _toConsumableArray(mutConfiguration);
  var done = isInFinalState(nextConfiguration);
  if (done) {
    var finalActions = nextConfiguration.sort(function (a, b) {
      return b.order - a.order;
    }).flatMap(function (state) {
      return state.exit;
    });
    actions.push.apply(actions, _toConsumableArray(finalActions));
  }
  try {
    var _resolveActionsAndCon = resolveActionsAndContext(actions, event, currentState, actorCtx),
      nextState = _resolveActionsAndCon.nextState;
    var output = done ? getOutput(nextConfiguration, nextState.context, event) : undefined;
    internalQueue.push.apply(internalQueue, _toConsumableArray(nextState._internalQueue));
    return cloneState(currentState, {
      actions: nextState.actions,
      configuration: nextConfiguration,
      historyValue: historyValue,
      _internalQueue: internalQueue,
      context: nextState.context,
      event: event,
      done: done,
      output: output,
      children: nextState.children
    });
  } catch (e) {
    // TODO: Refactor this once proper error handling is implemented.
    // See https://github.com/statelyai/rfcs/pull/4
    throw e;
  }
}
function enterStates(filteredTransitions, mutConfiguration, actions, internalQueue, currentState, historyValue) {
  var statesToEnter = new Set();
  var statesForDefaultEntry = new Set();
  computeEntrySet(filteredTransitions, historyValue, statesForDefaultEntry, statesToEnter);

  // In the initial state, the root state node is "entered".
  if (currentState._initial) {
    statesForDefaultEntry.add(currentState.machine.root);
  }
  var _iterator22 = _createForOfIteratorHelper(_toConsumableArray(statesToEnter).sort(function (a, b) {
      return a.order - b.order;
    })),
    _step22;
  try {
    for (_iterator22.s(); !(_step22 = _iterator22.n()).done;) {
      var stateNodeToEnter = _step22.value;
      mutConfiguration.add(stateNodeToEnter);
      var _iterator23 = _createForOfIteratorHelper(stateNodeToEnter.invoke),
        _step23;
      try {
        for (_iterator23.s(); !(_step23 = _iterator23.n()).done;) {
          var invokeDef = _step23.value;
          actions.push(invoke(invokeDef));
        }

        // Add entry actions
      } catch (err) {
        _iterator23.e(err);
      } finally {
        _iterator23.f();
      }
      actions.push.apply(actions, _toConsumableArray(stateNodeToEnter.entry));
      if (statesForDefaultEntry.has(stateNodeToEnter)) {
        var _iterator24 = _createForOfIteratorHelper(statesForDefaultEntry),
          _step24;
        try {
          for (_iterator24.s(); !(_step24 = _iterator24.n()).done;) {
            var stateNode = _step24.value;
            var initialActions = stateNode.initial.actions;
            actions.push.apply(actions, _toConsumableArray(initialActions));
          }
        } catch (err) {
          _iterator24.e(err);
        } finally {
          _iterator24.f();
        }
      }
      if (stateNodeToEnter.type === 'final') {
        var parent = stateNodeToEnter.parent;
        if (!parent.parent) {
          continue;
        }
        internalQueue.push(done(parent.id, stateNodeToEnter.output ? mapContext(stateNodeToEnter.output, currentState.context, currentState.event) : undefined));
        if (parent.parent) {
          var grandparent = parent.parent;
          if (grandparent.type === 'parallel') {
            if (getChildren(grandparent).every(function (parentNode) {
              return isInFinalState(_toConsumableArray(mutConfiguration), parentNode);
            })) {
              internalQueue.push(done(grandparent.id));
            }
          }
        }
      }
    }
  } catch (err) {
    _iterator22.e(err);
  } finally {
    _iterator22.f();
  }
}
function computeEntrySet(transitions, historyValue, statesForDefaultEntry, statesToEnter) {
  var _iterator25 = _createForOfIteratorHelper(transitions),
    _step25;
  try {
    for (_iterator25.s(); !(_step25 = _iterator25.n()).done;) {
      var t = _step25.value;
      var _iterator26 = _createForOfIteratorHelper(t.target || []),
        _step26;
      try {
        for (_iterator26.s(); !(_step26 = _iterator26.n()).done;) {
          var s = _step26.value;
          addDescendantStatesToEnter(s, historyValue, statesForDefaultEntry, statesToEnter);
        }
      } catch (err) {
        _iterator26.e(err);
      } finally {
        _iterator26.f();
      }
      var ancestor = getTransitionDomain(t, historyValue);
      var targetStates = getEffectiveTargetStates(t, historyValue);
      var _iterator27 = _createForOfIteratorHelper(targetStates),
        _step27;
      try {
        for (_iterator27.s(); !(_step27 = _iterator27.n()).done;) {
          var _s2 = _step27.value;
          addAncestorStatesToEnter(_s2, ancestor, statesToEnter, historyValue, statesForDefaultEntry);
        }
      } catch (err) {
        _iterator27.e(err);
      } finally {
        _iterator27.f();
      }
    }
  } catch (err) {
    _iterator25.e(err);
  } finally {
    _iterator25.f();
  }
}
function addDescendantStatesToEnter(stateNode, historyValue, statesForDefaultEntry, statesToEnter) {
  if (isHistoryNode(stateNode)) {
    if (historyValue[stateNode.id]) {
      var historyStateNodes = historyValue[stateNode.id];
      var _iterator28 = _createForOfIteratorHelper(historyStateNodes),
        _step28;
      try {
        for (_iterator28.s(); !(_step28 = _iterator28.n()).done;) {
          var s = _step28.value;
          addDescendantStatesToEnter(s, historyValue, statesForDefaultEntry, statesToEnter);
        }
      } catch (err) {
        _iterator28.e(err);
      } finally {
        _iterator28.f();
      }
      var _iterator29 = _createForOfIteratorHelper(historyStateNodes),
        _step29;
      try {
        for (_iterator29.s(); !(_step29 = _iterator29.n()).done;) {
          var _s3 = _step29.value;
          addAncestorStatesToEnter(_s3, stateNode.parent, statesToEnter, historyValue, statesForDefaultEntry);
          var _iterator30 = _createForOfIteratorHelper(statesForDefaultEntry),
            _step30;
          try {
            for (_iterator30.s(); !(_step30 = _iterator30.n()).done;) {
              var stateForDefaultEntry = _step30.value;
              statesForDefaultEntry.add(stateForDefaultEntry);
            }
          } catch (err) {
            _iterator30.e(err);
          } finally {
            _iterator30.f();
          }
        }
      } catch (err) {
        _iterator29.e(err);
      } finally {
        _iterator29.f();
      }
    } else {
      var targets = resolveHistoryTarget(stateNode);
      var _iterator31 = _createForOfIteratorHelper(targets),
        _step31;
      try {
        for (_iterator31.s(); !(_step31 = _iterator31.n()).done;) {
          var _s4 = _step31.value;
          addDescendantStatesToEnter(_s4, historyValue, statesForDefaultEntry, statesToEnter);
        }
      } catch (err) {
        _iterator31.e(err);
      } finally {
        _iterator31.f();
      }
      var _iterator32 = _createForOfIteratorHelper(targets),
        _step32;
      try {
        for (_iterator32.s(); !(_step32 = _iterator32.n()).done;) {
          var _s5 = _step32.value;
          addAncestorStatesToEnter(_s5, stateNode, statesToEnter, historyValue, statesForDefaultEntry);
          var _iterator33 = _createForOfIteratorHelper(statesForDefaultEntry),
            _step33;
          try {
            for (_iterator33.s(); !(_step33 = _iterator33.n()).done;) {
              var _stateForDefaultEntry = _step33.value;
              statesForDefaultEntry.add(_stateForDefaultEntry);
            }
          } catch (err) {
            _iterator33.e(err);
          } finally {
            _iterator33.f();
          }
        }
      } catch (err) {
        _iterator32.e(err);
      } finally {
        _iterator32.f();
      }
    }
  } else {
    statesToEnter.add(stateNode);
    if (stateNode.type === 'compound') {
      statesForDefaultEntry.add(stateNode);
      var initialStates = stateNode.initial.target;
      var _iterator34 = _createForOfIteratorHelper(initialStates),
        _step34;
      try {
        for (_iterator34.s(); !(_step34 = _iterator34.n()).done;) {
          var initialState = _step34.value;
          addDescendantStatesToEnter(initialState, historyValue, statesForDefaultEntry, statesToEnter);
        }
      } catch (err) {
        _iterator34.e(err);
      } finally {
        _iterator34.f();
      }
      var _iterator35 = _createForOfIteratorHelper(initialStates),
        _step35;
      try {
        for (_iterator35.s(); !(_step35 = _iterator35.n()).done;) {
          var _initialState = _step35.value;
          addAncestorStatesToEnter(_initialState, stateNode, statesToEnter, historyValue, statesForDefaultEntry);
        }
      } catch (err) {
        _iterator35.e(err);
      } finally {
        _iterator35.f();
      }
    } else {
      if (stateNode.type === 'parallel') {
        var _iterator36 = _createForOfIteratorHelper(getChildren(stateNode).filter(function (sn) {
            return !isHistoryNode(sn);
          })),
          _step36;
        try {
          var _loop2 = function _loop2() {
            var child = _step36.value;
            if (!_toConsumableArray(statesToEnter).some(function (s) {
              return isDescendant(s, child);
            })) {
              addDescendantStatesToEnter(child, historyValue, statesForDefaultEntry, statesToEnter);
            }
          };
          for (_iterator36.s(); !(_step36 = _iterator36.n()).done;) {
            _loop2();
          }
        } catch (err) {
          _iterator36.e(err);
        } finally {
          _iterator36.f();
        }
      }
    }
  }
}
function addAncestorStatesToEnter(stateNode, toStateNode, statesToEnter, historyValue, statesForDefaultEntry) {
  var properAncestors = getProperAncestors(stateNode, toStateNode);
  var _iterator37 = _createForOfIteratorHelper(properAncestors),
    _step37;
  try {
    for (_iterator37.s(); !(_step37 = _iterator37.n()).done;) {
      var anc = _step37.value;
      statesToEnter.add(anc);
      if (anc.type === 'parallel') {
        var _iterator38 = _createForOfIteratorHelper(getChildren(anc).filter(function (sn) {
            return !isHistoryNode(sn);
          })),
          _step38;
        try {
          var _loop3 = function _loop3() {
            var child = _step38.value;
            if (!_toConsumableArray(statesToEnter).some(function (s) {
              return isDescendant(s, child);
            })) {
              addDescendantStatesToEnter(child, historyValue, statesForDefaultEntry, statesToEnter);
            }
          };
          for (_iterator38.s(); !(_step38 = _iterator38.n()).done;) {
            _loop3();
          }
        } catch (err) {
          _iterator38.e(err);
        } finally {
          _iterator38.f();
        }
      }
    }
  } catch (err) {
    _iterator37.e(err);
  } finally {
    _iterator37.f();
  }
}
function exitStates(transitions, mutConfiguration, historyValue, actions) {
  var statesToExit = computeExitSet(transitions, mutConfiguration, historyValue);
  statesToExit.sort(function (a, b) {
    return b.order - a.order;
  });

  // From SCXML algorithm: https://www.w3.org/TR/scxml/#exitStates
  var _iterator39 = _createForOfIteratorHelper(statesToExit),
    _step39;
  try {
    var _loop4 = function _loop4() {
      var exitStateNode = _step39.value;
      var _iterator41 = _createForOfIteratorHelper(getHistoryNodes(exitStateNode)),
        _step41;
      try {
        for (_iterator41.s(); !(_step41 = _iterator41.n()).done;) {
          var historyNode = _step41.value;
          var predicate = void 0;
          if (historyNode.history === 'deep') {
            predicate = function predicate(sn) {
              return isAtomicStateNode(sn) && isDescendant(sn, exitStateNode);
            };
          } else {
            predicate = function predicate(sn) {
              return sn.parent === exitStateNode;
            };
          }
          historyValue[historyNode.id] = Array.from(mutConfiguration).filter(predicate);
        }
      } catch (err) {
        _iterator41.e(err);
      } finally {
        _iterator41.f();
      }
    };
    for (_iterator39.s(); !(_step39 = _iterator39.n()).done;) {
      _loop4();
    }
  } catch (err) {
    _iterator39.e(err);
  } finally {
    _iterator39.f();
  }
  var _iterator40 = _createForOfIteratorHelper(statesToExit),
    _step40;
  try {
    for (_iterator40.s(); !(_step40 = _iterator40.n()).done;) {
      var s = _step40.value;
      actions.push.apply(actions, _toConsumableArray(s.exit.flat()).concat(_toConsumableArray(s.invoke.map(function (def) {
        return stop(def.id);
      }))));
      mutConfiguration["delete"](s);
    }
  } catch (err) {
    _iterator40.e(err);
  } finally {
    _iterator40.f();
  }
}
function resolveActionsAndContext(actions, event, currentState, actorCtx) {
  var machine = currentState.machine;
  var resolvedActions = [];
  var raiseActions = [];
  var intermediateState = currentState;
  function handleAction(action) {
    resolvedActions.push(action);
    if ((actorCtx === null || actorCtx === void 0 ? void 0 : actorCtx.self.status) === ActorStatus.Running) {
      var _action$execute;
      (_action$execute = action.execute) === null || _action$execute === void 0 ? void 0 : _action$execute.call(action, actorCtx);
      // TODO: this is hacky; re-evaluate
      delete action.execute;
    }
  }
  function resolveAction(actionObject) {
    var executableActionObject = resolveActionObject(actionObject, machine.options.actions);
    if (isDynamicAction(executableActionObject)) {
      var _resolvedAction$param;
      var _executableActionObje = executableActionObject.resolve(event, {
          state: intermediateState,
          action: actionObject,
          actorContext: actorCtx
        }),
        _executableActionObje2 = _slicedToArray(_executableActionObje, 2),
        nextState = _executableActionObje2[0],
        resolvedAction = _executableActionObje2[1];
      var matchedActions = (_resolvedAction$param = resolvedAction.params) === null || _resolvedAction$param === void 0 ? void 0 : _resolvedAction$param.actions;
      intermediateState = nextState;
      if ((resolvedAction.type === raise$1 || resolvedAction.type === send$1 && resolvedAction.params.internal) && typeof resolvedAction.params.delay !== 'number') {
        raiseActions.push(resolvedAction);
      }

      // TODO: remove the check; just handleAction
      if (resolvedAction.type !== pure$1) {
        handleAction(resolvedAction);
      }
      toActionObjects(matchedActions).forEach(resolveAction);
      return;
    }
    handleAction(executableActionObject);
  }
  var _iterator42 = _createForOfIteratorHelper(actions),
    _step42;
  try {
    for (_iterator42.s(); !(_step42 = _iterator42.n()).done;) {
      var actionObject = _step42.value;
      resolveAction(actionObject);
    }
  } catch (err) {
    _iterator42.e(err);
  } finally {
    _iterator42.f();
  }
  return {
    nextState: cloneState(intermediateState, {
      actions: resolvedActions,
      _internalQueue: raiseActions.map(function (a) {
        return a.params.event;
      })
    })
  };
}
function macrostep(state, event, actorCtx) {
  if (!IS_PRODUCTION && event.type === WILDCARD) {
    throw new Error("An event cannot have the wildcard type ('".concat(WILDCARD, "')"));
  }
  var nextState = state;
  var states = [];

  // Handle stop event
  if (event.type === stopSignalType) {
    nextState = stopStep(event, nextState, actorCtx);
    states.push(nextState);
    return {
      state: nextState,
      microstates: states
    };
  }

  // Assume the state is at rest (no raised events)
  // Determine the next state based on the next microstep
  if (event.type !== init) {
    var transitions = selectTransitions(event, nextState);
    nextState = microstep(transitions, state, actorCtx, event);
    states.push(nextState);
  }
  while (!nextState.done) {
    var enabledTransitions = selectEventlessTransitions(nextState);
    if (enabledTransitions.length === 0) {
      // TODO: this is a bit of a hack, we need to review this
      // this matches the behavior from v4 for eventless transitions
      // where for `hasAlwaysTransitions` we were always trying to resolve with a NULL event
      // and if a transition was not selected the `state.transitions` stayed empty
      // without this we get into an infinite loop in the dieHard test in `@xstate/test` for the `simplePathsTo`
      if (nextState.configuration.some(function (state) {
        return state.always;
      })) {
        nextState.transitions = [];
      }
      if (!nextState._internalQueue.length) {
        break;
      } else {
        var _nextState$actions;
        var currentActions = nextState.actions;
        var nextEvent = nextState._internalQueue[0];
        var _transitions = selectTransitions(nextEvent, nextState);
        nextState = microstep(_transitions, nextState, actorCtx, nextEvent);
        nextState._internalQueue.shift();
        (_nextState$actions = nextState.actions).unshift.apply(_nextState$actions, _toConsumableArray(currentActions));
        states.push(nextState);
      }
    }
    if (enabledTransitions.length) {
      var _nextState$actions2;
      var _currentActions = nextState.actions;
      nextState = microstep(enabledTransitions, nextState, actorCtx, nextState.event);
      (_nextState$actions2 = nextState.actions).unshift.apply(_nextState$actions2, _toConsumableArray(_currentActions));
      states.push(nextState);
    }
  }
  if (nextState.done) {
    // Perform the stop step to ensure that child actors are stopped
    stopStep(nextState.event, nextState, actorCtx);
  }
  return {
    state: nextState,
    microstates: states
  };
}
function stopStep(event, nextState, actorCtx) {
  var actions = [];
  var _iterator43 = _createForOfIteratorHelper(nextState.configuration.sort(function (a, b) {
      return b.order - a.order;
    })),
    _step43;
  try {
    for (_iterator43.s(); !(_step43 = _iterator43.n()).done;) {
      var stateNode = _step43.value;
      actions.push.apply(actions, _toConsumableArray(stateNode.exit));
    }
  } catch (err) {
    _iterator43.e(err);
  } finally {
    _iterator43.f();
  }
  for (var _i4 = 0, _Object$values = Object.values(nextState.children); _i4 < _Object$values.length; _i4++) {
    var child = _Object$values[_i4];
    actions.push(stop(child));
  }
  var _resolveActionsAndCon2 = resolveActionsAndContext(actions, event, nextState, actorCtx),
    stoppedState = _resolveActionsAndCon2.nextState;
  return stoppedState;
}
function selectTransitions(event, nextState) {
  return nextState.machine.getTransitionData(nextState, event);
}
function selectEventlessTransitions(nextState) {
  var enabledTransitionSet = new Set();
  var atomicStates = nextState.configuration.filter(isAtomicStateNode);
  var _iterator44 = _createForOfIteratorHelper(atomicStates),
    _step44;
  try {
    for (_iterator44.s(); !(_step44 = _iterator44.n()).done;) {
      var stateNode = _step44.value;
      var _iterator45 = _createForOfIteratorHelper([stateNode].concat(getProperAncestors(stateNode, null))),
        _step45;
      try {
        loop: for (_iterator45.s(); !(_step45 = _iterator45.n()).done;) {
          var s = _step45.value;
          if (!s.always) {
            continue;
          }
          var _iterator46 = _createForOfIteratorHelper(s.always),
            _step46;
          try {
            for (_iterator46.s(); !(_step46 = _iterator46.n()).done;) {
              var transition = _step46.value;
              if (transition.guard === undefined || evaluateGuard(transition.guard, nextState.context, nextState.event, nextState)) {
                enabledTransitionSet.add(transition);
                break loop;
              }
            }
          } catch (err) {
            _iterator46.e(err);
          } finally {
            _iterator46.f();
          }
        }
      } catch (err) {
        _iterator45.e(err);
      } finally {
        _iterator45.f();
      }
    }
  } catch (err) {
    _iterator44.e(err);
  } finally {
    _iterator44.f();
  }
  return removeConflictingTransitions(Array.from(enabledTransitionSet), new Set(nextState.configuration), nextState.historyValue);
}

/**
 * Resolves a partial state value with its full representation in the state node's machine.
 *
 * @param stateValue The partial state value to resolve.
 */
function resolveStateValue(rootNode, stateValue) {
  var configuration = getConfiguration(getStateNodes(rootNode, stateValue));
  return getStateValue(rootNode, _toConsumableArray(configuration));
}
function stateValuesEqual(a, b) {
  if (a === b) {
    return true;
  }
  if (a === undefined || b === undefined) {
    return false;
  }
  if (isString(a) || isString(b)) {
    return a === b;
  }
  var aKeys = Object.keys(a);
  var bKeys = Object.keys(b);
  return aKeys.length === bKeys.length && aKeys.every(function (key) {
    return stateValuesEqual(a[key], b[key]);
  });
}
function getInitialConfiguration(rootNode) {
  var configuration = [];
  var initialTransition = rootNode.initial;
  var statesToEnter = new Set();
  var statesForDefaultEntry = new Set([rootNode]);
  computeEntrySet([initialTransition], {}, statesForDefaultEntry, statesToEnter);
  var _iterator47 = _createForOfIteratorHelper(_toConsumableArray(statesToEnter).sort(function (a, b) {
      return a.order - b.order;
    })),
    _step47;
  try {
    for (_iterator47.s(); !(_step47 = _iterator47.n()).done;) {
      var stateNodeToEnter = _step47.value;
      configuration.push(stateNodeToEnter);
    }
  } catch (err) {
    _iterator47.e(err);
  } finally {
    _iterator47.f();
  }
  return configuration;
}

var _excluded$1 = ["configuration", "transitions", "tags", "machine"],
  _excluded2 = ["configuration", "transitions", "tags", "machine", "children"];
var State = /*#__PURE__*/function () {
  /**
   * Creates a new `State` instance that represents the current state of a running machine.
   *
   * @param config
   */
  function State(config, machine) {
    var _config$_internalQueu, _config$actions, _config$configuration, _config$done;
    _classCallCheck(this, State);
    this.machine = machine;
    _defineProperty(this, "tags", void 0);
    _defineProperty(this, "value", void 0);
    _defineProperty(this, "done", void 0);
    _defineProperty(this, "output", void 0);
    _defineProperty(this, "context", void 0);
    _defineProperty(this, "historyValue", {});
    _defineProperty(this, "actions", []);
    _defineProperty(this, "event", void 0);
    _defineProperty(this, "_internalQueue", void 0);
    _defineProperty(this, "_initial", false);
    _defineProperty(this, "changed", void 0);
    _defineProperty(this, "configuration", void 0);
    _defineProperty(this, "transitions", void 0);
    _defineProperty(this, "children", void 0);
    this.context = config.context;
    this._internalQueue = (_config$_internalQueu = config._internalQueue) !== null && _config$_internalQueu !== void 0 ? _config$_internalQueu : [];
    this.event = config.event;
    this.historyValue = config.historyValue || {};
    this.actions = (_config$actions = config.actions) !== null && _config$actions !== void 0 ? _config$actions : [];
    this.matches = this.matches.bind(this);
    this.toStrings = this.toStrings.bind(this);
    this.configuration = (_config$configuration = config.configuration) !== null && _config$configuration !== void 0 ? _config$configuration : Array.from(getConfiguration(getStateNodes(machine.root, config.value)));
    this.transitions = config.transitions;
    this.children = config.children;
    this.value = getStateValue(machine.root, this.configuration);
    this.tags = new Set(flatten(this.configuration.map(function (sn) {
      return sn.tags;
    })));
    this.done = (_config$done = config.done) !== null && _config$done !== void 0 ? _config$done : false;
    this.output = config.output;
  }

  /**
   * Returns an array of all the string leaf state node paths.
   * @param stateValue
   * @param delimiter The character(s) that separate each subpath in the string state node path.
   */
  _createClass(State, [{
    key: "toStrings",
    value: function toStrings() {
      var _this = this;
      var stateValue = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.value;
      var delimiter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '.';
      if (isString(stateValue)) {
        return [stateValue];
      }
      var valueKeys = Object.keys(stateValue);
      return valueKeys.concat.apply(valueKeys, _toConsumableArray(valueKeys.map(function (key) {
        return _this.toStrings(stateValue[key], delimiter).map(function (s) {
          return key + delimiter + s;
        });
      })));
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      this.configuration;
        this.transitions;
        var tags = this.tags;
        this.machine;
        var jsonValues = _objectWithoutProperties(this, _excluded$1);
      return _objectSpread2(_objectSpread2({}, jsonValues), {}, {
        tags: Array.from(tags),
        meta: this.meta
      });
    }

    /**
     * Whether the current state value is a subset of the given parent state value.
     * @param parentStateValue
     */
  }, {
    key: "matches",
    value: function matches(parentStateValue) {
      return matchesState(parentStateValue, this.value);
    }

    /**
     * Whether the current state configuration has a state node with the specified `tag`.
     * @param tag
     */
  }, {
    key: "hasTag",
    value: function hasTag(tag) {
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
  }, {
    key: "can",
    value: function can(event) {
      if (IS_PRODUCTION) {
        warn(!!this.machine, "state.can(...) used outside of a machine-created State object; this will always return false.");
      }
      var transitionData = this.machine.getTransitionData(this, event);
      return !!(transitionData !== null && transitionData !== void 0 && transitionData.length) &&
      // Check that at least one transition is not forbidden
      transitionData.some(function (t) {
        return t.target !== undefined || t.actions.length;
      });
    }

    /**
     * The next events that will cause a transition from the current state.
     */
  }, {
    key: "nextEvents",
    get: function get() {
      var _this2 = this;
      return memo(this, 'nextEvents', function () {
        return _toConsumableArray(new Set(flatten(_toConsumableArray(_this2.configuration.map(function (sn) {
          return sn.ownEvents;
        })))));
      });
    }
  }, {
    key: "meta",
    get: function get() {
      return this.configuration.reduce(function (acc, stateNode) {
        if (stateNode.meta !== undefined) {
          acc[stateNode.id] = stateNode.meta;
        }
        return acc;
      }, {});
    }
  }], [{
    key: "from",
    value:
    /**
     * Indicates whether the state is a final state.
     */

    /**
     * The done data of the top-level finite state.
     */
    // TODO: add an explicit type for `output`

    /**
     * Indicates whether the state has changed from the previous state. A state is considered "changed" if:
     *
     * - Its value is not equal to its previous value, or:
     * - It has any new actions (side-effects) to execute.
     *
     * An initial state (with no history) will return `undefined`.
     */

    /**
     * The enabled state nodes representative of the state value.
     */

    /**
     * The transition definitions that resulted in this state.
     */

    /**
     * An object mapping actor names to spawned/invoked actors.
     */

    /**
     * Creates a new State instance for the given `stateValue` and `context`.
     * @param stateValue
     * @param context
     */
    function from(stateValue) {
      var context = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var machine = arguments.length > 2 ? arguments[2] : undefined;
      if (stateValue instanceof State) {
        if (stateValue.context !== context) {
          return new State({
            value: stateValue.value,
            context: context,
            event: stateValue.event,
            actions: [],
            meta: {},
            configuration: [],
            // TODO: fix,
            transitions: [],
            children: {}
          }, machine);
        }
        return stateValue;
      }
      var event = createInitEvent({}); // TODO: fix

      var configuration = getConfiguration(getStateNodes(machine.root, stateValue));
      return new State({
        value: stateValue,
        context: context,
        event: event,
        actions: [],
        meta: undefined,
        configuration: Array.from(configuration),
        transitions: [],
        children: {}
      }, machine);
    }
  }]);
  return State;
}();
function cloneState(state) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return new State(_objectSpread2(_objectSpread2({}, state), config), state.machine);
}
function getPersistedState(state) {
  state.configuration;
    state.transitions;
    state.tags;
    state.machine;
    var children = state.children,
    jsonValues = _objectWithoutProperties(state, _excluded2);
  var childrenJson = {};
  for (var id in children) {
    var _children$id$getPersi, _children$id;
    childrenJson[id] = {
      state: (_children$id$getPersi = (_children$id = children[id]).getPersistedState) === null || _children$id$getPersi === void 0 ? void 0 : _children$id$getPersi.call(_children$id),
      src: children[id].src
    };
  }
  return _objectSpread2(_objectSpread2({}, jsonValues), {}, {
    children: childrenJson
  });
}

function invoke(invokeDef) {
  return createDynamicAction({
    type: invoke$1,
    params: invokeDef
  }, function (event, _ref) {
    var state = _ref.state,
      actorContext = _ref.actorContext;
    var type = invoke$1;
    var id = invokeDef.id,
      src = invokeDef.src;
    var resolvedInvokeAction;
    if (isActorRef(src)) {
      resolvedInvokeAction = {
        type: type,
        params: _objectSpread2(_objectSpread2({}, invokeDef), {}, {
          ref: src
        })
      };
    } else {
      var referenced = resolveReferencedActor(state.machine.options.actors[src]);
      if (!referenced) {
        resolvedInvokeAction = {
          type: type,
          params: invokeDef
        };
      } else {
        var input = 'input' in invokeDef ? invokeDef.input : referenced.input;
        var ref = interpret(referenced.src, {
          id: id,
          src: src,
          parent: actorContext === null || actorContext === void 0 ? void 0 : actorContext.self,
          systemId: invokeDef.systemId,
          input: typeof input === 'function' ? input({
            context: state.context,
            event: event,
            self: actorContext === null || actorContext === void 0 ? void 0 : actorContext.self
          }) : input
        });
        resolvedInvokeAction = {
          type: type,
          params: _objectSpread2(_objectSpread2({}, invokeDef), {}, {
            ref: ref
          })
        };
      }
    }
    var actorRef = resolvedInvokeAction.params.ref;
    var invokedState = cloneState(state, {
      children: _objectSpread2(_objectSpread2({}, state.children), {}, _defineProperty({}, id, actorRef))
    });
    resolvedInvokeAction.execute = function (actorCtx) {
      var parent = actorCtx.self;
      var _resolvedInvokeAction = resolvedInvokeAction.params,
        id = _resolvedInvokeAction.id,
        ref = _resolvedInvokeAction.ref;
      if (!ref) {
        if (!IS_PRODUCTION) {
          warn(false, "Actor type '".concat(resolvedInvokeAction.params.src, "' not found in machine '").concat(actorCtx.id, "'."));
        }
        return;
      }
      actorCtx.defer(function () {
        if (actorRef.status === ActorStatus.Stopped) {
          return;
        }
        try {
          var _actorRef$start;
          (_actorRef$start = actorRef.start) === null || _actorRef$start === void 0 ? void 0 : _actorRef$start.call(actorRef);
        } catch (err) {
          parent.send(error(id, err));
          return;
        }
      });
    };
    return [invokedState, resolvedInvokeAction];
  });
}

function createSpawner(self, machine, context, event, mutCapturedActions) {
  return function (src) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (isString(src)) {
      var referenced = resolveReferencedActor(machine.options.actors[src]);
      if (referenced) {
        var _options$id;
        var resolvedName = (_options$id = options.id) !== null && _options$id !== void 0 ? _options$id : 'anon'; // TODO: better name
        var input = 'input' in options ? options.input : referenced.input;

        // TODO: this should also receive `src`
        var actorRef = interpret(referenced.src, {
          id: resolvedName,
          parent: self,
          input: typeof input === 'function' ? input({
            context: context,
            event: event,
            self: self
          }) : input
        });
        mutCapturedActions.push(invoke({
          id: actorRef.id,
          // @ts-ignore TODO: fix types
          src: actorRef,
          // TODO
          ref: actorRef,
          meta: undefined,
          input: input
        }));
        return actorRef; // TODO: fix types
      }

      throw new Error("Behavior '".concat(src, "' not implemented in machine '").concat(machine.id, "'"));
    } else {
      // TODO: this should also receive `src`
      // TODO: instead of anonymous, it should be a unique stable ID
      var _actorRef = interpret(src, {
        id: options.id || 'anonymous',
        parent: self,
        input: options.input
      });
      mutCapturedActions.push(invoke({
        // @ts-ignore TODO: fix types
        src: _actorRef,
        ref: _actorRef,
        id: _actorRef.id,
        meta: undefined,
        input: options.input
      }));
      return _actorRef; // TODO: fix types
    }
  };
}

/**
 * Updates the current context of the machine.
 *
 * @param assignment An object that represents the partial context to update.
 */
function assign(assignment) {
  return createDynamicAction({
    type: assign$1,
    params: {
      assignment: assignment
    }
  }, function (event, _ref) {
    var _actorContext$self;
    var state = _ref.state,
      action = _ref.action,
      actorContext = _ref.actorContext;
    var capturedActions = [];
    if (!state.context) {
      throw new Error('Cannot assign to undefined `context`. Ensure that `context` is defined in the machine config.');
    }
    var args = {
      context: state.context,
      event: event,
      action: action,
      spawn: createSpawner(actorContext === null || actorContext === void 0 ? void 0 : actorContext.self, state.machine, state.context, event, capturedActions),
      self: (_actorContext$self = actorContext === null || actorContext === void 0 ? void 0 : actorContext.self) !== null && _actorContext$self !== void 0 ? _actorContext$self : {},
      system: actorContext === null || actorContext === void 0 ? void 0 : actorContext.system
    };
    var partialUpdate = {};
    if (isFunction(assignment)) {
      partialUpdate = assignment(args);
    } else {
      for (var _i = 0, _Object$keys = Object.keys(assignment); _i < _Object$keys.length; _i++) {
        var key = _Object$keys[_i];
        var propAssignment = assignment[key];
        partialUpdate[key] = isFunction(propAssignment) ? propAssignment(args) : propAssignment;
      }
    }
    var updatedContext = Object.assign({}, state.context, partialUpdate);
    return [cloneState(state, {
      context: updatedContext
    }), {
      type: assign$1,
      params: {
        context: updatedContext,
        actions: capturedActions
      }
    }];
  });
}

/**
 * Raises an event. This places the event in the internal event queue, so that
 * the event is immediately consumed by the machine in the current step.
 *
 * @param eventType The event to raise.
 */

function raise(eventOrExpr, options) {
  return createDynamicAction({
    type: raise$1,
    params: {
      delay: options ? options.delay : undefined,
      event: eventOrExpr,
      id: options && options.id !== undefined ? options.id : typeof eventOrExpr === 'function' ? eventOrExpr.name : eventOrExpr.type
    }
  }, function (event, _ref) {
    var _actorContext$self;
    var state = _ref.state,
      actorContext = _ref.actorContext;
    var params = {
      delay: options ? options.delay : undefined,
      event: eventOrExpr,
      id: options && options.id !== undefined ? options.id : typeof eventOrExpr === 'function' ? eventOrExpr.name : eventOrExpr.type
    };
    var args = {
      context: state.context,
      event: event,
      self: (_actorContext$self = actorContext === null || actorContext === void 0 ? void 0 : actorContext.self) !== null && _actorContext$self !== void 0 ? _actorContext$self : {},
      system: actorContext === null || actorContext === void 0 ? void 0 : actorContext.system
    };
    var delaysMap = state.machine.options.delays;

    // TODO: helper function for resolving Expr
    if (typeof eventOrExpr === 'string') {
      throw new Error("Only event objects may be used with raise; use raise({ type: \"".concat(eventOrExpr, "\" }) instead"));
    }
    var resolvedEvent = typeof eventOrExpr === 'function' ? eventOrExpr(args) : eventOrExpr;
    var resolvedDelay;
    if (typeof params.delay === 'string') {
      var configDelay = delaysMap && delaysMap[params.delay];
      resolvedDelay = typeof configDelay === 'function' ? configDelay(args) : configDelay;
    } else {
      resolvedDelay = typeof params.delay === 'function' ? params.delay(args) : params.delay;
    }
    var resolvedAction = {
      type: raise$1,
      params: _objectSpread2(_objectSpread2({}, params), {}, {
        event: resolvedEvent,
        delay: resolvedDelay
      }),
      execute: function execute(actorCtx) {
        if (typeof resolvedAction.params.delay === 'number') {
          actorCtx.self.delaySend(resolvedAction);
          return;
        }
      }
    };
    return [state, resolvedAction];
  });
}

var initEvent = {
  type: init
};
function resolveActionObject(actionObject, actionFunctionMap) {
  if (isDynamicAction(actionObject)) {
    return actionObject;
  }
  var dereferencedAction = actionFunctionMap[actionObject.type];
  if (typeof dereferencedAction === 'function') {
    var _actionObject$params;
    return createDynamicAction({
      type: 'xstate.function',
      params: (_actionObject$params = actionObject.params) !== null && _actionObject$params !== void 0 ? _actionObject$params : {}
    }, function (event, _ref) {
      var state = _ref.state;
      var a = {
        type: actionObject.type,
        params: actionObject.params,
        execute: function execute(actorCtx) {
          return dereferencedAction({
            context: state.context,
            event: event,
            action: a,
            system: actorCtx.system,
            self: actorCtx.self
          });
        }
      };
      return [state, a];
    });
  } else if (dereferencedAction) {
    return dereferencedAction;
  } else {
    return actionObject;
  }
}
function toActionObject(action) {
  if (isDynamicAction(action)) {
    return action;
  }
  if (typeof action === 'string') {
    return {
      type: action,
      params: {}
    };
  }
  if (typeof action === 'function') {
    var type = 'xstate.function';
    return createDynamicAction({
      type: type,
      params: {}
    }, function (event, _ref2) {
      var state = _ref2.state;
      var actionObject = {
        type: type,
        params: {
          "function": action
        },
        execute: function execute(actorCtx) {
          return action({
            context: state.context,
            event: event,
            action: actionObject,
            self: actorCtx.self,
            system: actorCtx.system
          });
        }
      };
      return [state, actionObject];
    });
  }

  // action is already a BaseActionObject
  return action;
}
var toActionObjects = function toActionObjects(action) {
  if (!action) {
    return [];
  }
  var actions = isArray(action) ? action : [action];
  return actions.map(toActionObject);
};

/**
 * Returns an event type that represents an implicit event that
 * is sent after the specified `delay`.
 *
 * @param delayRef The delay in milliseconds
 * @param id The state node ID where this event is handled
 */
function after(delayRef, id) {
  var idSuffix = id ? "#".concat(id) : '';
  return "".concat(ActionTypes.After, "(").concat(delayRef, ")").concat(idSuffix);
}

/**
 * Returns an event that represents that a final state node
 * has been reached in the parent state node.
 *
 * @param id The final state node's parent state node `id`
 * @param output The data to pass into the event
 */
function done(id, output) {
  var type = "".concat(ActionTypes.DoneState, ".").concat(id);
  var eventObject = {
    type: type,
    output: output
  };
  eventObject.toString = function () {
    return type;
  };
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
  var type = "".concat(ActionTypes.DoneInvoke, ".").concat(invokeId);
  var eventObject = {
    type: type,
    output: output
  };
  eventObject.toString = function () {
    return type;
  };
  return eventObject;
}
function error(id, data) {
  var type = "".concat(ActionTypes.ErrorPlatform, ".").concat(id);
  var eventObject = {
    type: type,
    data: data
  };
  eventObject.toString = function () {
    return type;
  };
  return eventObject;
}
function createInitEvent(input) {
  return {
    type: init,
    input: input
  };
}

var _excluded = ["onDone", "onError"];
var EMPTY_OBJECT = {};
var StateNode = /*#__PURE__*/function () {
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

  function StateNode(
  /**
   * The raw config used to create the machine.
   */
  config, options) {
    var _this = this;
    _classCallCheck(this, StateNode);
    this.config = config;
    _defineProperty(this, "key", void 0);
    _defineProperty(this, "id", void 0);
    _defineProperty(this, "type", void 0);
    _defineProperty(this, "path", void 0);
    _defineProperty(this, "states", void 0);
    _defineProperty(this, "history", void 0);
    _defineProperty(this, "entry", void 0);
    _defineProperty(this, "exit", void 0);
    _defineProperty(this, "parent", void 0);
    _defineProperty(this, "machine", void 0);
    _defineProperty(this, "meta", void 0);
    _defineProperty(this, "output", void 0);
    _defineProperty(this, "order", -1);
    _defineProperty(this, "description", void 0);
    _defineProperty(this, "tags", []);
    _defineProperty(this, "transitions", void 0);
    _defineProperty(this, "always", void 0);
    this.parent = options._parent;
    this.key = options._key;
    this.machine = options._machine;
    this.path = this.parent ? this.parent.path.concat(this.key) : [];
    this.id = this.config.id || [this.machine.id].concat(_toConsumableArray(this.path)).join(this.machine.delimiter);
    this.type = this.config.type || (this.config.states && Object.keys(this.config.states).length ? 'compound' : this.config.history ? 'history' : 'atomic');
    this.description = this.config.description;
    this.order = this.machine.idMap.size;
    this.machine.idMap.set(this.id, this);
    this.states = this.config.states ? mapValues(this.config.states, function (stateConfig, key) {
      var stateNode = new StateNode(stateConfig, {
        _parent: _this,
        _key: key,
        _machine: _this.machine
      });
      return stateNode;
    }) : EMPTY_OBJECT;
    if (this.type === 'compound' && !this.config.initial) {
      throw new Error("No initial state specified for compound state node \"#".concat(this.id, "\". Try adding { initial: \"").concat(Object.keys(this.states)[0], "\" } to the state config."));
    }

    // History config
    this.history = this.config.history === true ? 'shallow' : this.config.history || false;
    this.entry = toActionObjects(this.config.entry);
    this.exit = toActionObjects(this.config.exit);
    this.meta = this.config.meta;
    this.output = this.type === 'final' ? this.config.output : undefined;
    this.tags = toArray(config.tags);
  }
  _createClass(StateNode, [{
    key: "_initialize",
    value: function _initialize() {
      var _this2 = this;
      this.transitions = formatTransitions(this);
      if (this.config.always) {
        this.always = toTransitionConfigArray(NULL_EVENT, this.config.always).map(function (t) {
          return formatTransition(_this2, t);
        });
      }
      Object.keys(this.states).forEach(function (key) {
        _this2.states[key]._initialize();
      });
    }

    /**
     * The well-structured state node definition.
     */
  }, {
    key: "definition",
    get: function get() {
      var _this3 = this;
      return {
        id: this.id,
        key: this.key,
        version: this.machine.version,
        type: this.type,
        initial: this.initial ? {
          target: this.initial.target,
          source: this,
          actions: this.initial.actions,
          eventType: null,
          reenter: false,
          toJSON: function toJSON() {
            return {
              target: _this3.initial.target.map(function (t) {
                return "#".concat(t.id);
              }),
              source: "#".concat(_this3.id),
              actions: _this3.initial.actions,
              eventType: null
            };
          }
        } : undefined,
        history: this.history,
        states: mapValues(this.states, function (state) {
          return state.definition;
        }),
        on: this.on,
        transitions: this.transitions,
        entry: this.entry,
        exit: this.exit,
        meta: this.meta,
        order: this.order || -1,
        output: this.output,
        invoke: this.invoke,
        description: this.description,
        tags: this.tags
      };
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return this.definition;
    }

    /**
     * The behaviors invoked as actors by this state node.
     */
  }, {
    key: "invoke",
    get: function get() {
      var _this4 = this;
      return memo(this, 'invoke', function () {
        return toArray(_this4.config.invoke).map(function (invocable, i) {
          var generatedId = createInvokeId(_this4.id, i);
          var invokeConfig = toInvokeConfig(invocable, generatedId);
          var resolvedId = invokeConfig.id || generatedId;
          var src = invokeConfig.src,
            systemId = invokeConfig.systemId;
          var resolvedSrc = isString(src) ? src : !('type' in src) ? resolvedId : src;
          if (!_this4.machine.options.actors[resolvedId] && typeof src !== 'string' && !('type' in src)) {
            _this4.machine.options.actors = _objectSpread2(_objectSpread2({}, _this4.machine.options.actors), {}, _defineProperty({}, resolvedId, src));
          }
          return _objectSpread2(_objectSpread2({
            type: invoke$1
          }, invokeConfig), {}, {
            src: resolvedSrc,
            id: resolvedId,
            systemId: systemId,
            toJSON: function toJSON() {
              invokeConfig.onDone;
                invokeConfig.onError;
                var invokeDefValues = _objectWithoutProperties(invokeConfig, _excluded);
              return _objectSpread2(_objectSpread2({}, invokeDefValues), {}, {
                type: invoke$1,
                src: resolvedSrc,
                id: resolvedId
              });
            }
          });
        });
      });
    }

    /**
     * The mapping of events to transitions.
     */
  }, {
    key: "on",
    get: function get() {
      var _this5 = this;
      return memo(this, 'on', function () {
        var transitions = _this5.transitions;
        return transitions.reduce(function (map, transition) {
          map[transition.eventType] = map[transition.eventType] || [];
          map[transition.eventType].push(transition);
          return map;
        }, {});
      });
    }
  }, {
    key: "after",
    get: function get() {
      var _this6 = this;
      return memo(this, 'delayedTransitions', function () {
        return getDelayedTransitions(_this6);
      });
    }
  }, {
    key: "initial",
    get: function get() {
      var _this7 = this;
      return memo(this, 'initial', function () {
        return formatInitialTransition(_this7, _this7.config.initial || []);
      });
    }
  }, {
    key: "next",
    value: function next(state, event) {
      var _this8 = this;
      var eventType = event.type;
      var actions = [];
      var selectedTransition;
      var candidates = memo(this, "candidates-".concat(eventType), function () {
        return getCandidates(_this8, eventType);
      });
      var _iterator = _createForOfIteratorHelper(candidates),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var candidate = _step.value;
          var guard = candidate.guard;
          var resolvedContext = state.context;
          var guardPassed = false;
          try {
            guardPassed = !guard || evaluateGuard(guard, resolvedContext, event, state);
          } catch (err) {
            throw new Error("Unable to evaluate guard '".concat(guard.type, "' in transition for event '").concat(eventType, "' in state node '").concat(this.id, "':\n").concat(err.message));
          }
          if (guardPassed) {
            actions.push.apply(actions, _toConsumableArray(candidate.actions));
            selectedTransition = candidate;
            break;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return selectedTransition ? [selectedTransition] : undefined;
    }

    /**
     * The target state value of the history state node, if it exists. This represents the
     * default state value to transition to if no history value exists yet.
     */
  }, {
    key: "target",
    get: function get() {
      if (this.type === 'history') {
        var historyConfig = this.config;
        return historyConfig.target;
      }
      return undefined;
    }

    /**
     * All the state node IDs of this state node and its descendant state nodes.
     */
  }, {
    key: "stateIds",
    get: function get() {
      var _this9 = this;
      var childStateIds = flatten(Object.keys(this.states).map(function (stateKey) {
        return _this9.states[stateKey].stateIds;
      }));
      return [this.id].concat(childStateIds);
    }

    /**
     * All the event types accepted by this state node and its descendants.
     */
  }, {
    key: "events",
    get: function get() {
      var _this10 = this;
      return memo(this, 'events', function () {
        var states = _this10.states;
        var events = new Set(_this10.ownEvents);
        if (states) {
          for (var _i = 0, _Object$keys = Object.keys(states); _i < _Object$keys.length; _i++) {
            var stateId = _Object$keys[_i];
            var state = states[stateId];
            if (state.states) {
              var _iterator2 = _createForOfIteratorHelper(state.events),
                _step2;
              try {
                for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                  var event = _step2.value;
                  events.add("".concat(event));
                }
              } catch (err) {
                _iterator2.e(err);
              } finally {
                _iterator2.f();
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
  }, {
    key: "ownEvents",
    get: function get() {
      var events = new Set(this.transitions.filter(function (transition) {
        return !(!transition.target && !transition.actions.length && !transition.reenter);
      }).map(function (transition) {
        return transition.eventType;
      }));
      return Array.from(events);
    }
  }]);
  return StateNode;
}();

var STATE_IDENTIFIER = '#';
function createDefaultOptions() {
  return {
    actions: {},
    actors: {},
    delays: {},
    guards: {},
    context: {}
  };
}
var StateMachine = /*#__PURE__*/function () {
  function StateMachine(
  /**
   * The raw config used to create the machine.
   */
  config, options) {
    var _this$config$types;
    _classCallCheck(this, StateMachine);
    this.config = config;
    _defineProperty(this, "version", void 0);
    _defineProperty(this, "delimiter", void 0);
    _defineProperty(this, "options", void 0);
    _defineProperty(this, "types", void 0);
    _defineProperty(this, "__xstatenode", true);
    _defineProperty(this, "idMap", new Map());
    _defineProperty(this, "root", void 0);
    _defineProperty(this, "id", void 0);
    _defineProperty(this, "states", void 0);
    _defineProperty(this, "events", void 0);
    _defineProperty(this, "__TContext", void 0);
    _defineProperty(this, "__TEvent", void 0);
    _defineProperty(this, "__TAction", void 0);
    _defineProperty(this, "__TActorMap", void 0);
    _defineProperty(this, "__TResolvedTypesMeta", void 0);
    this.id = config.id || '(machine)';
    this.options = Object.assign(createDefaultOptions(), options);
    this.delimiter = this.config.delimiter || STATE_DELIMITER;
    this.version = this.config.version;
    this.types = (_this$config$types = this.config.types) !== null && _this$config$types !== void 0 ? _this$config$types : {};
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
  _createClass(StateMachine, [{
    key: "getContext",
    value:
    // TODO: this getter should be removed
    function getContext(input) {
      return this.getContextAndActions(undefined, input)[0];
    }
  }, {
    key: "getContextAndActions",
    value: function getContextAndActions(actorCtx, input) {
      var actions = [];
      var context = this.config.context;
      var resolvedContext = typeof context === 'function' ? context({
        spawn: createSpawner(actorCtx === null || actorCtx === void 0 ? void 0 : actorCtx.self, this, undefined,
        // TODO: this requires `| undefined` for all referenced dynamic inputs that are spawnable in the context factory,
        createInitEvent(input), actions),
        input: input
      }) : context;
      return [resolvedContext || {}, actions];
    }
    /**
     * The machine's own version.
     */
  }, {
    key: "provide",
    value: function provide(implementations) {
      var _this$options = this.options,
        actions = _this$options.actions,
        guards = _this$options.guards,
        actors = _this$options.actors,
        delays = _this$options.delays;
      return new StateMachine(this.config, {
        actions: _objectSpread2(_objectSpread2({}, actions), implementations.actions),
        guards: _objectSpread2(_objectSpread2({}, guards), implementations.guards),
        actors: _objectSpread2(_objectSpread2({}, actors), implementations.actors),
        delays: _objectSpread2(_objectSpread2({}, delays), implementations.delays)
      });
    }

    /**
     * Resolves the given `state` to a new `State` instance relative to this machine.
     *
     * This ensures that `.nextEvents` represent the correct values.
     *
     * @param state The state to resolve
     */
  }, {
    key: "resolveState",
    value: function resolveState(state) {
      var configurationSet = getConfiguration(getStateNodes(this.root, state.value));
      var configuration = Array.from(configurationSet);
      return this.createState(_objectSpread2(_objectSpread2({}, state), {}, {
        value: resolveStateValue(this.root, state.value),
        configuration: configuration,
        done: isInFinalState(configuration)
      }));
    }
  }, {
    key: "resolveStateValue",
    value: function resolveStateValue$1(stateValue) {
      var resolvedStateValue = resolveStateValue(this.root, stateValue);
      var resolvedContext = this.getContext();
      return this.resolveState(State.from(resolvedStateValue, resolvedContext, this));
    }

    /**
     * Determines the next state given the current `state` and received `event`.
     * Calculates a full macrostep from all microsteps.
     *
     * @param state The current State instance or state value
     * @param event The received event
     */
  }, {
    key: "transition",
    value: function transition() {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.initialState;
      var event = arguments.length > 1 ? arguments[1] : undefined;
      var actorCtx = arguments.length > 2 ? arguments[2] : undefined;
      var currentState = state instanceof State ? state : this.resolveStateValue(state);
      // TODO: handle error events in a better way
      if (isErrorEvent(event) && !currentState.nextEvents.some(function (nextEvent) {
        return nextEvent === event.type;
      })) {
        throw event.data;
      }
      var _macrostep = macrostep(currentState, event, actorCtx),
        nextState = _macrostep.state;
      return nextState;
    }

    /**
     * Determines the next state given the current `state` and `event`.
     * Calculates a microstep.
     *
     * @param state The current state
     * @param event The received event
     */
  }, {
    key: "microstep",
    value: function microstep() {
      var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.initialState;
      var event = arguments.length > 1 ? arguments[1] : undefined;
      var actorCtx = arguments.length > 2 ? arguments[2] : undefined;
      return macrostep(state, event, actorCtx).microstates;
    }
  }, {
    key: "getTransitionData",
    value: function getTransitionData(state, event) {
      return transitionNode(this.root, state.value, state, event) || [];
    }

    /**
     * The initial state _before_ evaluating any microsteps.
     * This "pre-initial" state is provided to initial actions executed in the initial state.
     */
  }, {
    key: "getPreInitialState",
    value: function getPreInitialState(actorCtx, input) {
      var _preInitial$actions;
      var _this$getContextAndAc = this.getContextAndActions(actorCtx, input),
        _this$getContextAndAc2 = _slicedToArray(_this$getContextAndAc, 2),
        context = _this$getContextAndAc2[0],
        actions = _this$getContextAndAc2[1];
      var config = getInitialConfiguration(this.root);
      var preInitial = this.resolveState(this.createState({
        value: {},
        // TODO: this is computed in state constructor
        context: context,
        event: createInitEvent({}),
        actions: [],
        meta: undefined,
        configuration: config,
        transitions: [],
        children: {}
      }));
      preInitial._initial = true;
      (_preInitial$actions = preInitial.actions).unshift.apply(_preInitial$actions, _toConsumableArray(actions));
      if (actorCtx) {
        var _resolveActionsAndCon = resolveActionsAndContext(actions, initEvent, preInitial, actorCtx),
          nextState = _resolveActionsAndCon.nextState;
        preInitial.children = nextState.children;
        preInitial.actions = nextState.actions;
      }
      return preInitial;
    }

    /**
     * The initial State instance, which includes all actions to be executed from
     * entering the initial state.
     */
  }, {
    key: "initialState",
    get: function get() {
      return this.getInitialState();
    }

    /**
     * Returns the initial `State` instance, with reference to `self` as an `ActorRef`.
     */
  }, {
    key: "getInitialState",
    value: function getInitialState(actorCtx, input) {
      var _nextState$actions;
      var initEvent = createInitEvent(input); // TODO: fix;

      var preInitialState = this.getPreInitialState(actorCtx, input);
      var nextState = microstep([], preInitialState, actorCtx, initEvent);
      (_nextState$actions = nextState.actions).unshift.apply(_nextState$actions, _toConsumableArray(preInitialState.actions));
      var _macrostep2 = macrostep(nextState, initEvent, actorCtx),
        macroState = _macrostep2.state;
      return macroState;
    }
  }, {
    key: "start",
    value: function start(state, actorCtx) {
      state.actions.forEach(function (action) {
        var _action$execute;
        (_action$execute = action.execute) === null || _action$execute === void 0 ? void 0 : _action$execute.call(action, actorCtx);
      });
      Object.values(state.children).forEach(function (child) {
        if (child.status === 0) {
          try {
            var _child$start;
            (_child$start = child.start) === null || _child$start === void 0 ? void 0 : _child$start.call(child);
          } catch (err) {
            // TODO: unify error handling when child starts
            actorCtx.self.send(error(child.id, err));
          }
        }
      });
    }
  }, {
    key: "getStateNodeById",
    value: function getStateNodeById(stateId) {
      var fullPath = stateId.split(this.delimiter);
      var relativePath = fullPath.slice(1);
      var resolvedStateId = isStateId(fullPath[0]) ? fullPath[0].slice(STATE_IDENTIFIER.length) : fullPath[0];
      var stateNode = this.idMap.get(resolvedStateId);
      if (!stateNode) {
        throw new Error("Child state node '#".concat(resolvedStateId, "' does not exist on machine '").concat(this.id, "'"));
      }
      return getStateNodeByPath(stateNode, relativePath);
    }
  }, {
    key: "definition",
    get: function get() {
      return _objectSpread2({
        context: this.getContext()
      }, this.root.definition);
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return this.definition;
    }
  }, {
    key: "getPersistedState",
    value: function getPersistedState$1(state) {
      return getPersistedState(state);
    }
  }, {
    key: "createState",
    value: function createState(stateConfig) {
      var state = stateConfig instanceof State ? stateConfig : new State(stateConfig, this);
      var _resolveActionsAndCon2 = resolveActionsAndContext(state.actions, state.event, state, undefined),
        resolvedState = _resolveActionsAndCon2.nextState;
      return resolvedState;
    }
  }, {
    key: "getStatus",
    value: function getStatus(state) {
      return state.done ? {
        status: 'done',
        data: state.output
      } : {
        status: 'active'
      };
    }
  }, {
    key: "restoreState",
    value: function restoreState(state, _actorCtx) {
      var _this = this;
      var children = {};
      Object.keys(state.children).forEach(function (actorId) {
        var _resolveReferencedAct, _behavior$restoreStat;
        var actorData = state.children[actorId];
        var childState = actorData.state;
        var src = actorData.src;
        var behavior = src ? (_resolveReferencedAct = resolveReferencedActor(_this.options.actors[src])) === null || _resolveReferencedAct === void 0 ? void 0 : _resolveReferencedAct.src : undefined;
        if (!behavior) {
          return;
        }
        var actorState = (_behavior$restoreStat = behavior.restoreState) === null || _behavior$restoreStat === void 0 ? void 0 : _behavior$restoreStat.call(behavior, childState, _actorCtx);
        var actorRef = interpret(behavior, {
          id: actorId,
          state: actorState
        });
        children[actorId] = actorRef;
      });
      var restoredState = this.createState(new State(_objectSpread2(_objectSpread2({}, state), {}, {
        children: children
      }), this));

      // TODO: DRY this up
      restoredState.configuration.forEach(function (stateNode) {
        if (stateNode.invoke) {
          stateNode.invoke.forEach(function (invokeConfig) {
            var id = invokeConfig.id,
              src = invokeConfig.src;
            if (children[id]) {
              return;
            }
            var referenced = resolveReferencedActor(_this.options.actors[src]);
            if (referenced) {
              var actorRef = interpret(referenced.src, {
                id: id,
                parent: _actorCtx === null || _actorCtx === void 0 ? void 0 : _actorCtx.self,
                input: 'input' in invokeConfig ? invokeConfig.input : referenced.input
              });
              children[id] = actorRef;
            }
          });
        }
      });
      restoredState.actions = [];
      return restoredState;
    }

    /**@deprecated an internal property acting as a "phantom" type, not meant to be used at runtime */
  }]);
  return StateMachine;
}();

function createMachine(config, implementations) {
  return new StateMachine(config, implementations);
}

export { assign as a, createMachine as c, fromPromise as f, interpret as i };
//# sourceMappingURL=xstate.esm-8a1e0eb0.js.map
