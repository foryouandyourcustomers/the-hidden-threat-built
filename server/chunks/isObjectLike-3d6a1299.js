import { c as commonjsGlobal } from './_commonjsHelpers-24198af3.js';

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

const sharedGuards = {
  // TODO
  gameFinished: () => false,
  /** All users have been assigned a side, and there is at least one admin on both sides */
  allSidesAssigned: ({ context }) => context.users.every((user) => user.isSideAssigned) && !!context.users.find((user) => user.side === "defender" && user.isAdmin) && !!context.users.find((user) => user.side === "attacker" && user.isAdmin),
  /** The admin said that they finished assigning the sides */
  finishedAssigningSides: ({ context }) => context.finishedAssigningSides,
  /** Both, defense and attack has all players configured */
  allRolesAssigned: ({ context }) => context.attack.attacker.isConfigured && context.defense.defenders.every((defender) => defender.isConfigured),
  // TODO
  finishedAssigningRoles: ({ context }) => context.attack.finishedAssigning && context.defense.finishedAssigning,
  attackerShouldBeVisible: () => false,
  attackerShouldBeInvisible: () => false
};
const DEFAULT_DEFENSE_INVENTORY = {
  cloud: 0,
  shield: 0
};
const DEFAULT_ATTACK_INVENTORY = {
  gun: 0,
  virus: 0
};
const FACES = {
  man: "man",
  woman: "woman",
  other: "other"
};
const isDefenderId = (id) => id !== "attacker";

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

export { DEFAULT_DEFENSE_INVENTORY as D, FACES as F, requireIsObject as a, require_root as b, require_Symbol as c, requireIsObjectLike as d, require_freeGlobal as e, createMachine as f, assign as g, fromPromise as h, DEFAULT_ATTACK_INVENTORY as i, isDefenderId as j, interpret as k, not as n, require_baseGetTag as r, sharedGuards as s };
//# sourceMappingURL=isObjectLike-3d6a1299.js.map
