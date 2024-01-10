import { G as GameState } from './game-state-78587e72.js';

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

const STATE_DELIMITER = '.';
const TARGETLESS_KEY = '';
const NULL_EVENT = '';
const STATE_IDENTIFIER$1 = '#';
const WILDCARD = '*';
const XSTATE_INIT = 'xstate.init';
const XSTATE_STOP = 'xstate.stop';

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
      this._current = consumed.next;
    }
    this._last = null;
  }
}

/**
 * Returns an event that represents an implicit event that
 * is sent after the specified `delay`.
 *
 * @param delayRef The delay in milliseconds
 * @param id The state node ID where this event is handled
 */
function createAfterEvent(delayRef, id) {
  const idSuffix = id ? `#${id}` : '';
  return {
    type: `xstate.after(${delayRef})${idSuffix}`
  };
}

/**
 * Returns an event that represents that a final state node
 * has been reached in the parent state node.
 *
 * @param id The final state node's parent state node `id`
 * @param output The data to pass into the event
 */
function createDoneStateEvent(id, output) {
  return {
    type: `xstate.done.state.${id}`,
    output
  };
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
function createDoneActorEvent(invokeId, output) {
  return {
    type: `xstate.done.actor.${invokeId}`,
    output
  };
}
function createErrorActorEvent(id, data) {
  return {
    type: `xstate.error.actor.${id}`,
    data
  };
}
function createInitEvent(input) {
  return {
    type: XSTATE_INIT,
    input
  };
}

/**
 * This function makes sure that unhandled errors are thrown in a separate macrotask.
 * It allows those errors to be detected by global error handlers and reported to bug tracking services
 * without interrupting our own stack of execution.
 *
 * @param err error to be thrown
 */
function reportUnhandledError(err) {
  setTimeout(() => {
    throw err;
  });
}

const symbolObservable = (() => typeof Symbol === 'function' && Symbol.observable || '@@observable')();

let idCounter = 0;
function createSystem(rootActor) {
  const children = new Map();
  const keyedActors = new Map();
  const reverseKeyedActors = new WeakMap();
  const observers = new Set();
  const system = {
    _bookId: () => `x:${idCounter++}`,
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
    },
    inspect: observer => {
      observers.add(observer);
    },
    _sendInspectionEvent: event => {
      const resolvedInspectionEvent = {
        ...event,
        rootId: rootActor.sessionId
      };
      observers.forEach(observer => observer.next?.(resolvedInspectionEvent));
    },
    _relay: (source, target, event) => {
      system._sendInspectionEvent({
        type: '@xstate.event',
        sourceRef: source,
        actorRef: target,
        event
      });
      target._send(event);
    }
  };
  return system;
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
function resolveOutput(mapper, context, event, self) {
  if (typeof mapper === 'function') {
    return mapper({
      context,
      event,
      self
    });
  }
  return mapper;
}
function isArray(value) {
  return Array.isArray(value);
}
function isErrorActorEvent(event) {
  return event.type.startsWith('xstate.error.actor');
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
function toObserver(nextHandler, errorHandler, completionHandler) {
  const isObserver = typeof nextHandler === 'object';
  const self = isObserver ? nextHandler : undefined;
  return {
    next: (isObserver ? nextHandler.next : nextHandler)?.bind(self),
    error: (isObserver ? nextHandler.error : errorHandler)?.bind(self),
    complete: (isObserver ? nextHandler.complete : completionHandler)?.bind(self)
  };
}
function createInvokeId(stateNodeId, index) {
  return `${stateNodeId}[${index}]`;
}
function resolveReferencedActor(machine, src) {
  if (src.startsWith('xstate#')) {
    const [, indexStr] = src.match(/\[(\d+)\]$/);
    const node = machine.getStateNodeById(src.slice(7, -(indexStr.length + 2)));
    const invokeConfig = node.config.invoke;
    return {
      src: (Array.isArray(invokeConfig) ? invokeConfig[indexStr] : invokeConfig).src,
      input: undefined
    };
  }
  const referenced = machine.implementations.actors[src];
  return referenced ? 'transition' in referenced ? {
    src: referenced,
    input: undefined
  } : referenced : undefined;
}

const $$ACTOR_TYPE = 1;
let ActorStatus = /*#__PURE__*/function (ActorStatus) {
  ActorStatus[ActorStatus["NotStarted"] = 0] = "NotStarted";
  ActorStatus[ActorStatus["Running"] = 1] = "Running";
  ActorStatus[ActorStatus["Stopped"] = 2] = "Stopped";
  return ActorStatus;
}({});
const defaultOptions = {
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

/**
 * An Actor is a running process that can receive events, send events and change its behavior based on the events it receives, which can cause effects outside of the actor. When you run a state machine, it becomes an actor.
 */
class Actor {
  /**
   * The current internal state of the actor.
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
   * The system to which this actor belongs.
   */

  /**
   * Creates a new actor instance for the given logic with the provided options, if any.
   *
   * @param logic The logic to create an actor from
   * @param options Actor options
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
    this._actorScope = void 0;
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
      systemId,
      inspect
    } = resolvedOptions;
    this.system = parent?.system ?? createSystem(this);
    if (inspect && !parent) {
      // Always inspect at the system-level
      this.system.inspect(toObserver(inspect));
    }
    this.sessionId = this.system._bookId();
    this.id = id ?? this.sessionId;
    this.logger = logger;
    this.clock = clock;
    this._parent = parent;
    this.options = resolvedOptions;
    this.src = resolvedOptions.src;
    this.ref = this;
    this._actorScope = {
      self: this,
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

    // Ensure that the send method is bound to this Actor instance
    // if destructured
    this.send = this.send.bind(this);
    this.system._sendInspectionEvent({
      type: '@xstate.actor',
      actorRef: this
    });
    this._initState();
    if (systemId && this._state.status === 'active') {
      this._systemId = systemId;
      this.system._set(systemId, this);
    }
  }
  _initState() {
    this._state = this.options.state ? this.logic.restoreState ? this.logic.restoreState(this.options.state, this._actorScope) : this.options.state : this.logic.getInitialState(this._actorScope, this.options?.input);
  }

  // array of functions to defer

  update(snapshot, event) {
    // Update state
    this._state = snapshot;

    // Execute deferred effects
    let deferredFn;
    while (deferredFn = this._deferred.shift()) {
      deferredFn();
    }
    for (const observer of this.observers) {
      // TODO: should observers be notified in case of the error?
      try {
        observer.next?.(snapshot);
      } catch (err) {
        reportUnhandledError(err);
      }
    }
    switch (this._state.status) {
      case 'done':
        this._stopProcedure();
        this._complete();
        this._doneEvent = createDoneActorEvent(this.id, this._state.output);
        if (this._parent) {
          this.system._relay(this, this._parent, this._doneEvent);
        }
        break;
      case 'error':
        this._stopProcedure();
        this._error(this._state.error);
        if (this._parent) {
          this.system._relay(this, this._parent, createErrorActorEvent(this.id, this._state.error));
        }
        break;
    }
    this.system._sendInspectionEvent({
      type: '@xstate.snapshot',
      actorRef: this,
      event,
      snapshot
    });
  }

  /**
   * Subscribe an observer to an actor’s snapshot values.
   *
   * @remarks
   * The observer will receive the actor’s snapshot value when it is emitted. The observer can be:
   * - A plain function that receives the latest snapshot, or
   * - An observer object whose `.next(snapshot)` method receives the latest snapshot
   *
   * @example
   * ```ts
   * // Observer as a plain function
   * const subscription = actor.subscribe((snapshot) => {
   *   console.log(snapshot);
   * });
   * ```
   *
   * @example
   * ```ts
   * // Observer as an object
   * const subscription = actor.subscribe({
   *   next(snapshot) {
   *     console.log(snapshot);
   *   },
   *   error(err) {
   *     // ...
   *   },
   *   complete() {
   *     // ...
   *   },
   * });
   * ```
   *
   * The return value of `actor.subscribe(observer)` is a subscription object that has an `.unsubscribe()` method. You can call `subscription.unsubscribe()` to unsubscribe the observer:
   *
   * @example
   * ```ts
   * const subscription = actor.subscribe((snapshot) => {
   *   // ...
   * });
   *
   * // Unsubscribe the observer
   * subscription.unsubscribe();
   * ```
   *
   * When the actor is stopped, all of its observers will automatically be unsubscribed.
   *
   * @param observer - Either a plain function that receives the latest snapshot, or an observer object whose `.next(snapshot)` method receives the latest snapshot
   */

  subscribe(nextListenerOrObserver, errorListener, completeListener) {
    const observer = toObserver(nextListenerOrObserver, errorListener, completeListener);
    if (this.status !== ActorStatus.Stopped) {
      this.observers.add(observer);
    } else {
      try {
        observer.complete?.();
      } catch (err) {
        reportUnhandledError(err);
      }
    }
    return {
      unsubscribe: () => {
        this.observers.delete(observer);
      }
    };
  }

  /**
   * Starts the Actor from the initial state
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
    const initEvent = createInitEvent(this.options.input);
    this.system._sendInspectionEvent({
      type: '@xstate.event',
      sourceRef: this._parent,
      actorRef: this,
      event: initEvent
    });
    const status = this._state.status;
    switch (status) {
      case 'done':
        // a state machine can be "done" upon initialization (it could reach a final state using initial microsteps)
        // we still need to complete observers, flush deferreds etc
        this.update(this._state, initEvent);
      // fallthrough
      case 'error':
        // TODO: rethink cleanup of observers, mailbox, etc
        return this;
    }
    if (this.logic.start) {
      try {
        this.logic.start(this._state, this._actorScope);
      } catch (err) {
        this._stopProcedure();
        this._error(err);
        this._parent?.send(createErrorActorEvent(this.id, err));
        return this;
      }
    }

    // TODO: this notifies all subscribers but usually this is redundant
    // there is no real change happening here
    // we need to rethink if this needs to be refactored
    this.update(this._state, initEvent);
    if (this.options.devTools) {
      this.attachDevTools();
    }
    this.mailbox.start();
    return this;
  }
  _process(event) {
    // TODO: reexamine what happens when an action (or a guard or smth) throws
    let nextState;
    let caughtError;
    try {
      nextState = this.logic.transition(this._state, event, this._actorScope);
    } catch (err) {
      // we wrap it in a box so we can rethrow it later even if falsy value gets caught here
      caughtError = {
        err
      };
    }
    if (caughtError) {
      const {
        err
      } = caughtError;
      this._stopProcedure();
      this._error(err);
      this._parent?.send(createErrorActorEvent(this.id, err));
      return;
    }
    this.update(nextState, event);
    if (event.type === XSTATE_STOP) {
      this._stopProcedure();
      this._complete();
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
      type: XSTATE_STOP
    });
    return this;
  }

  /**
   * Stops the Actor and unsubscribe all listeners.
   */
  stop() {
    if (this._parent) {
      throw new Error('A non-root actor cannot be stopped directly.');
    }
    return this._stop();
  }
  _complete() {
    for (const observer of this.observers) {
      try {
        observer.complete?.();
      } catch (err) {
        reportUnhandledError(err);
      }
    }
    this.observers.clear();
  }
  _error(err) {
    if (!this.observers.size) {
      if (!this._parent) {
        reportUnhandledError(err);
      }
      return;
    }
    let reportError = false;
    for (const observer of this.observers) {
      const errorListener = observer.error;
      reportError ||= !errorListener;
      try {
        errorListener?.(err);
      } catch (err2) {
        reportUnhandledError(err2);
      }
    }
    this.observers.clear();
    if (reportError) {
      reportUnhandledError(err);
    }
  }
  _stopProcedure() {
    if (this.status !== ActorStatus.Running) {
      // Actor already stopped; do nothing
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
   * @internal
   */
  _send(event) {
    if (this.status === ActorStatus.Stopped) {
      return;
    }
    this.mailbox.enqueue(event);
  }

  /**
   * Sends an event to the running Actor to trigger a transition.
   *
   * @param event The event to send
   */
  send(event) {
    this.system._relay(undefined, this, event);
  }

  /**
   * TODO: figure out a way to do this within the machine
   * @internal
   */
  delaySend(params) {
    const {
      event,
      id,
      delay
    } = params;
    const timerId = this.clock.setTimeout(() => {
      this.system._relay(this, params.to ?? this, event);
    }, delay);

    // TODO: consider the rehydration story here
    if (id) {
      this.delayedEventsMap[id] = timerId;
    }
  }

  /**
   * TODO: figure out a way to do this within the machine
   * @internal
   */
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
      xstate$$type: $$ACTOR_TYPE,
      id: this.id
    };
  }
  getPersistedState() {
    return this.logic.getPersistedState(this._state);
  }
  [symbolObservable]() {
    return this;
  }

  /**
   * Read an actor’s snapshot synchronously.
   *
   * @remarks
   * The snapshot represent an actor's last emitted value.
   *
   * When an actor receives an event, its internal state may change.
   * An actor may emit a snapshot when a state transition occurs.
   *
   * Note that some actors, such as callback actors generated with `fromCallback`, will not emit snapshots.
   *
   * @see {@link Actor.subscribe} to subscribe to an actor’s snapshot values.
   * @see {@link Actor.getPersistedState} to persist the internal state of an actor (which is more than just a snapshot).
   */
  getSnapshot() {
    return this._state;
  }
}

/**
 * Creates a new `ActorRef` instance for the given machine with the provided options, if any.
 *
 * @param machine The machine to create an actor from
 * @param options `ActorRef` options
 */

function createActor(logic, options) {
  const interpreter = new Actor(logic, options);
  return interpreter;
}

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

function resolveCancel(_, state, actionArgs, actionParams, {
  sendId
}) {
  const resolvedSendId = typeof sendId === 'function' ? sendId(actionArgs, actionParams) : sendId;
  return [state, resolvedSendId];
}
function executeCancel(actorScope, resolvedSendId) {
  actorScope.self.cancel(resolvedSendId);
}
/**
 * Cancels an in-flight `send(...)` action. A canceled sent action will not
 * be executed, nor will its event be sent, unless it has already been sent
 * (e.g., if `cancel(...)` is called after the `send(...)` action's `delay`).
 *
 * @param sendId The `id` of the `send(...)` action to cancel.
 */
function cancel(sendId) {
  function cancel(args, params) {
  }
  cancel.type = 'xstate.cancel';
  cancel.sendId = sendId;
  cancel.resolve = resolveCancel;
  cancel.execute = executeCancel;
  return cancel;
}

function resolveSpawn(actorScope, state, actionArgs, _actionParams, {
  id,
  systemId,
  src,
  input,
  syncSnapshot
}) {
  const referenced = typeof src === 'string' ? resolveReferencedActor(state.machine, src) : {
    src,
    input: undefined
  };
  const resolvedId = typeof id === 'function' ? id(actionArgs) : id;
  let actorRef;
  if (referenced) {
    // TODO: inline `input: undefined` should win over the referenced one
    const configuredInput = input || referenced.input;
    actorRef = createActor(referenced.src, {
      id: resolvedId,
      src: typeof src === 'string' ? src : undefined,
      parent: actorScope?.self,
      systemId,
      input: typeof configuredInput === 'function' ? configuredInput({
        context: state.context,
        event: actionArgs.event,
        self: actorScope?.self
      }) : configuredInput
    });
    if (syncSnapshot) {
      actorRef.subscribe({
        next: snapshot => {
          if (snapshot.status === 'active') {
            actorScope.self.send({
              type: `xstate.snapshot.${id}`,
              snapshot
            });
          }
        },
        error: () => {}
      });
    }
  }
  return [cloneState(state, {
    children: {
      ...state.children,
      [resolvedId]: actorRef
    }
  }), {
    id,
    actorRef
  }];
}
function executeSpawn(actorScope, {
  id,
  actorRef
}) {
  if (!actorRef) {
    return;
  }
  actorScope.defer(() => {
    if (actorRef.status === ActorStatus.Stopped) {
      return;
    }
    try {
      actorRef.start?.();
    } catch (err) {
      actorScope.self.send(createErrorActorEvent(id, err));
      return;
    }
  });
}
function spawn(...[src, {
  id,
  systemId,
  input,
  syncSnapshot = false
} = {}]) {
  function spawn(args, params) {
  }
  spawn.type = 'xstate.spawn';
  spawn.id = id;
  spawn.systemId = systemId;
  spawn.src = src;
  spawn.input = input;
  spawn.syncSnapshot = syncSnapshot;
  spawn.resolve = resolveSpawn;
  spawn.execute = executeSpawn;
  return spawn;
}

function resolveStop(_, state, args, actionParams, {
  actorRef
}) {
  const actorRefOrString = typeof actorRef === 'function' ? actorRef(args, actionParams) : actorRef;
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
function executeStop(actorScope, actorRef) {
  if (!actorRef) {
    return;
  }

  // we need to eagerly unregister it here so a new actor with the same systemId can be registered immediately
  // since we defer actual stopping of the actor but we don't defer actor creations (and we can't do that)
  // this could throw on `systemId` collision, for example, when dealing with reentering transitions
  actorScope.system._unregister(actorRef);

  // this allows us to prevent an actor from being started if it gets stopped within the same macrostep
  // this can happen, for example, when the invoking state is being exited immediately by an always transition
  if (actorRef.status !== ActorStatus.Running) {
    actorScope.stopChild(actorRef);
    return;
  }
  // stopping a child enqueues a stop event in the child actor's mailbox
  // we need for all of the already enqueued events to be processed before we stop the child
  // the parent itself might want to send some events to a child (for example from exit actions on the invoking state)
  // and we don't want to ignore those events
  actorScope.defer(() => {
    actorScope.stopChild(actorRef);
  });
}
/**
 * Stops an actor.
 *
 * @param actorRef The actor to stop.
 */
function stop(actorRef) {
  function stop(args, params) {
  }
  stop.type = 'xstate.stop';
  stop.actorRef = actorRef;
  stop.resolve = resolveStop;
  stop.execute = executeStop;
  return stop;
}
function checkNot(state, {
  context,
  event
}, {
  guards
}) {
  return !evaluateGuard(guards[0], context, event, state);
}
function not(guard) {
  function not(args, params) {
    return false;
  }
  not.check = checkNot;
  not.guards = [guard];
  return not;
}
function checkAnd(state, {
  context,
  event
}, {
  guards
}) {
  return guards.every(guard => evaluateGuard(guard, context, event, state));
}
function and(guards) {
  function and(args, params) {
    return false;
  }
  and.check = checkAnd;
  and.guards = guards;
  return and;
}

// TODO: throw on cycles (depth check should be enough)
function evaluateGuard(guard, context, event, state) {
  const {
    machine
  } = state;
  const isInline = typeof guard === 'function';
  const resolved = isInline ? guard : machine.implementations.guards[typeof guard === 'string' ? guard : guard.type];
  if (!isInline && !resolved) {
    throw new Error(`Guard '${typeof guard === 'string' ? guard : guard.type}' is not implemented.'.`);
  }
  if (typeof resolved !== 'function') {
    return evaluateGuard(resolved, context, event, state);
  }
  const guardArgs = {
    context,
    event
  };
  const guardParams = isInline || typeof guard === 'string' ? undefined : 'params' in guard ? typeof guard.params === 'function' ? guard.params({
    context,
    event
  }) : guard.params : undefined;
  if (!('check' in resolved)) {
    // the existing type of `.guards` assumes non-nullable `TExpressionGuard`
    // inline guards expect `TExpressionGuard` to be set to `undefined`
    // it's fine to cast this here, our logic makes sure that we call those 2 "variants" correctly
    return resolved(guardArgs, guardParams);
  }
  const builtinGuard = resolved;
  return builtinGuard.check(state, guardArgs, resolved // this holds all params
  );
}

const isAtomicStateNode = stateNode => stateNode.type === 'atomic' || stateNode.type === 'final';
function getChildren(stateNode) {
  return Object.values(stateNode.states).filter(sn => sn.type !== 'history');
}
function getProperAncestors(stateNode, toStateNode) {
  const ancestors = [];
  if (toStateNode === stateNode) {
    return ancestors;
  }

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
      getInitialStateNodesWithTheirAncestors(s).forEach(sn => configurationSet.add(sn));
    } else {
      if (s.type === 'parallel') {
        for (const child of getChildren(s)) {
          if (child.type === 'history') {
            continue;
          }
          if (!configurationSet.has(child)) {
            const initialStates = getInitialStateNodesWithTheirAncestors(child);
            for (const initialStateNode of initialStates) {
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
function isInFinalState(configuration, stateNode) {
  if (stateNode.type === 'compound') {
    return getChildren(stateNode).some(s => s.type === 'final' && configuration.has(s));
  }
  if (stateNode.type === 'parallel') {
    return getChildren(stateNode).every(sn => isInFinalState(configuration, sn));
  }
  return stateNode.type === 'final';
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
    const afterEvent = createAfterEvent(delayRef, stateNode.id);
    const eventType = afterEvent.type;
    stateNode.entry.push(raise(afterEvent, {
      id: eventType,
      delay
    }));
    stateNode.exit.push(cancel(eventType));
    return eventType;
  };
  const delayedTransitions = Object.keys(afterConfig).flatMap((delay, i) => {
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
  const target = resolveTarget(stateNode, normalizedTarget);
  const transition = {
    ...transitionConfig,
    actions: toArray(transitionConfig.actions),
    guard: transitionConfig.guard,
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
    const descriptor = `xstate.done.state.${stateNode.id}`;
    transitions.set(descriptor, toTransitionConfigArray(stateNode.config.onDone).map(t => formatTransition(stateNode, descriptor, t)));
  }
  for (const invokeDef of stateNode.invoke) {
    if (invokeDef.onDone) {
      const descriptor = `xstate.done.actor.${invokeDef.id}`;
      transitions.set(descriptor, toTransitionConfigArray(invokeDef.onDone).map(t => formatTransition(stateNode, descriptor, t)));
    }
    if (invokeDef.onError) {
      const descriptor = `xstate.error.actor.${invokeDef.id}`;
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
  const resolvedTarget = typeof _target === 'string' ? stateNode.states[_target] : _target ? stateNode.states[_target.target] : undefined;
  if (!resolvedTarget && _target) {
    throw new Error(`Initial state node "${_target}" not found on parent state node #${stateNode.id}`);
  }
  const transition = {
    source: stateNode,
    actions: !_target || typeof _target === 'string' ? [] : toArray(_target.actions),
    eventType: null,
    reenter: false,
    target: resolvedTarget ? [resolvedTarget] : [],
    toJSON: () => ({
      ...transition,
      source: `#${stateNode.id}`,
      target: resolvedTarget ? [`#${resolvedTarget.id}`] : []
    })
  };
  return transition;
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
function resolveHistoryDefaultTransition(stateNode) {
  const normalizedTarget = normalizeTarget(stateNode.config.target);
  if (!normalizedTarget) {
    return stateNode.parent.initial;
  }
  return {
    target: normalizedTarget.map(t => typeof t === 'string' ? getStateNodeByPath(stateNode.parent, t) : t)
  };
}
function isHistoryNode(stateNode) {
  return stateNode.type === 'history';
}
function getInitialStateNodesWithTheirAncestors(stateNode) {
  const states = getInitialStateNodes(stateNode);
  for (const initialState of states) {
    for (const ancestor of getProperAncestors(initialState, stateNode)) {
      states.add(ancestor);
    }
  }
  return states;
}
function getInitialStateNodes(stateNode) {
  const set = new Set();
  function iter(descStateNode) {
    if (set.has(descStateNode)) {
      return;
    }
    set.add(descStateNode);
    if (descStateNode.type === 'compound') {
      iter(descStateNode.initial.target[0]);
    } else if (descStateNode.type === 'parallel') {
      for (const child of getChildren(descStateNode)) {
        iter(child);
      }
    }
  }
  iter(stateNode);
  return set;
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
function findLeastCommonAncestor(stateNodes) {
  const [head, ...tail] = stateNodes;
  for (const ancestor of getProperAncestors(head, undefined)) {
    if (tail.every(sn => isDescendant(sn, ancestor))) {
      return ancestor;
    }
  }
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
        for (const node of getEffectiveTargetStates(resolveHistoryDefaultTransition(targetNode), historyValue)) {
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
    return;
  }
  if (!transition.reenter && targetStates.every(target => target === transition.source || isDescendant(target, transition.source))) {
    return transition.source;
  }
  const lca = findLeastCommonAncestor(targetStates.concat(transition.source));
  if (lca) {
    return lca;
  }

  // at this point we know that it's a root transition since LCA couldn't be found
  if (transition.reenter) {
    return;
  }
  return transition.source.machine.root;
}
function computeExitSet(transitions, configuration, historyValue) {
  const statesToExit = new Set();
  for (const t of transitions) {
    if (t.target?.length) {
      const domain = getTransitionDomain(t, historyValue);
      if (t.reenter && t.source === domain) {
        statesToExit.add(domain);
      }
      for (const stateNode of configuration) {
        if (isDescendant(stateNode, domain)) {
          statesToExit.add(stateNode);
        }
      }
    }
  }
  return [...statesToExit];
}
function areConfigurationsEqual(previousConfiguration, nextConfigurationSet) {
  if (previousConfiguration.length !== nextConfigurationSet.size) {
    return false;
  }
  for (const node of previousConfiguration) {
    if (!nextConfigurationSet.has(node)) {
      return false;
    }
  }
  return true;
}

/**
 * https://www.w3.org/TR/scxml/#microstepProcedure
 */
function microstep(transitions, currentState, actorScope, event, isInitial, internalQueue) {
  if (!transitions.length) {
    return currentState;
  }
  const mutConfiguration = new Set(currentState.configuration);
  let historyValue = currentState.historyValue;
  const filteredTransitions = removeConflictingTransitions(transitions, mutConfiguration, historyValue);
  let nextState = currentState;

  // Exit states
  if (!isInitial) {
    [nextState, historyValue] = exitStates(nextState, event, actorScope, filteredTransitions, mutConfiguration, historyValue, internalQueue);
  }

  // Execute transition content
  nextState = resolveActionsAndContext(nextState, event, actorScope, filteredTransitions.flatMap(t => t.actions), internalQueue);

  // Enter states
  nextState = enterStates(nextState, event, actorScope, filteredTransitions, mutConfiguration, internalQueue, historyValue, isInitial);
  const nextConfiguration = [...mutConfiguration];
  if (nextState.status === 'done') {
    nextState = resolveActionsAndContext(nextState, event, actorScope, nextConfiguration.sort((a, b) => b.order - a.order).flatMap(state => state.exit), internalQueue);
  }
  try {
    if (historyValue === currentState.historyValue && areConfigurationsEqual(currentState.configuration, mutConfiguration)) {
      return nextState;
    }
    return cloneState(nextState, {
      configuration: nextConfiguration,
      historyValue
    });
  } catch (e) {
    // TODO: Refactor this once proper error handling is implemented.
    // See https://github.com/statelyai/rfcs/pull/4
    throw e;
  }
}
function getMachineOutput(state, event, actorScope, rootNode, rootCompletionNode) {
  if (!rootNode.output) {
    return;
  }
  const doneStateEvent = createDoneStateEvent(rootCompletionNode.id, rootCompletionNode.output && rootCompletionNode.parent ? resolveOutput(rootCompletionNode.output, state.context, event, actorScope.self) : undefined);
  return resolveOutput(rootNode.output, state.context, doneStateEvent, actorScope.self);
}
function enterStates(currentState, event, actorScope, filteredTransitions, mutConfiguration, internalQueue, historyValue, isInitial) {
  let nextState = currentState;
  const statesToEnter = new Set();
  // those are states that were directly targeted or indirectly targeted by the explicit target
  // in other words, those are states for which initial actions should be executed
  // when we target `#deep_child` initial actions of its ancestors shouldn't be executed
  const statesForDefaultEntry = new Set();
  computeEntrySet(filteredTransitions, historyValue, statesForDefaultEntry, statesToEnter);

  // In the initial state, the root state node is "entered".
  if (isInitial) {
    statesForDefaultEntry.add(currentState.machine.root);
  }
  const completedNodes = new Set();
  for (const stateNodeToEnter of [...statesToEnter].sort((a, b) => a.order - b.order)) {
    mutConfiguration.add(stateNodeToEnter);
    const actions = [];

    // Add entry actions
    actions.push(...stateNodeToEnter.entry);
    for (const invokeDef of stateNodeToEnter.invoke) {
      actions.push(spawn(invokeDef.src, {
        ...invokeDef,
        syncSnapshot: !!invokeDef.onSnapshot
      }));
    }
    if (statesForDefaultEntry.has(stateNodeToEnter)) {
      const initialActions = stateNodeToEnter.initial.actions;
      actions.push(...initialActions);
    }
    nextState = resolveActionsAndContext(nextState, event, actorScope, actions, internalQueue, stateNodeToEnter.invoke.map(invokeDef => invokeDef.id));
    if (stateNodeToEnter.type === 'final') {
      const parent = stateNodeToEnter.parent;
      let ancestorMarker = parent?.type === 'parallel' ? parent : parent?.parent;
      let rootCompletionNode = ancestorMarker || stateNodeToEnter;
      if (parent?.type === 'compound') {
        internalQueue.push(createDoneStateEvent(parent.id, stateNodeToEnter.output ? resolveOutput(stateNodeToEnter.output, nextState.context, event, actorScope.self) : undefined));
      }
      while (ancestorMarker?.type === 'parallel' && !completedNodes.has(ancestorMarker) && isInFinalState(mutConfiguration, ancestorMarker)) {
        completedNodes.add(ancestorMarker);
        internalQueue.push(createDoneStateEvent(ancestorMarker.id));
        rootCompletionNode = ancestorMarker;
        ancestorMarker = ancestorMarker.parent;
      }
      if (ancestorMarker) {
        continue;
      }
      nextState = cloneState(nextState, {
        status: 'done',
        output: getMachineOutput(nextState, event, actorScope, currentState.configuration[0].machine.root, rootCompletionNode)
      });
    }
  }
  return nextState;
}
function computeEntrySet(transitions, historyValue, statesForDefaultEntry, statesToEnter) {
  for (const t of transitions) {
    const domain = getTransitionDomain(t, historyValue);
    for (const s of t.target || []) {
      if (!isHistoryNode(s) && (
      // if the target is different than the source then it will *definitely* be entered
      t.source !== s ||
      // we know that the domain can't lie within the source
      // if it's different than the source then it's outside of it and it means that the target has to be entered as well
      t.source !== domain ||
      // reentering transitions always enter the target, even if it's the source itself
      t.reenter)) {
        statesToEnter.add(s);
        statesForDefaultEntry.add(s);
      }
      addDescendantStatesToEnter(s, historyValue, statesForDefaultEntry, statesToEnter);
    }
    const targetStates = getEffectiveTargetStates(t, historyValue);
    for (const s of targetStates) {
      const ancestors = getProperAncestors(s, domain);
      if (domain?.type === 'parallel') {
        ancestors.push(domain);
      }
      addAncestorStatesToEnter(statesToEnter, historyValue, statesForDefaultEntry, ancestors, !t.source.parent && t.reenter ? undefined : domain);
    }
  }
}
function addDescendantStatesToEnter(stateNode, historyValue, statesForDefaultEntry, statesToEnter) {
  if (isHistoryNode(stateNode)) {
    if (historyValue[stateNode.id]) {
      const historyStateNodes = historyValue[stateNode.id];
      for (const s of historyStateNodes) {
        statesToEnter.add(s);
        addDescendantStatesToEnter(s, historyValue, statesForDefaultEntry, statesToEnter);
      }
      for (const s of historyStateNodes) {
        addProperAncestorStatesToEnter(s, stateNode.parent, statesToEnter, historyValue, statesForDefaultEntry);
      }
    } else {
      const historyDefaultTransition = resolveHistoryDefaultTransition(stateNode);
      for (const s of historyDefaultTransition.target) {
        statesToEnter.add(s);
        if (historyDefaultTransition === stateNode.parent?.initial) {
          statesForDefaultEntry.add(stateNode.parent);
        }
        addDescendantStatesToEnter(s, historyValue, statesForDefaultEntry, statesToEnter);
      }
      for (const s of historyDefaultTransition.target) {
        addProperAncestorStatesToEnter(s, stateNode, statesToEnter, historyValue, statesForDefaultEntry);
      }
    }
  } else {
    if (stateNode.type === 'compound') {
      const [initialState] = stateNode.initial.target;
      if (!isHistoryNode(initialState)) {
        statesToEnter.add(initialState);
        statesForDefaultEntry.add(initialState);
      }
      addDescendantStatesToEnter(initialState, historyValue, statesForDefaultEntry, statesToEnter);
      addProperAncestorStatesToEnter(initialState, stateNode, statesToEnter, historyValue, statesForDefaultEntry);
    } else {
      if (stateNode.type === 'parallel') {
        for (const child of getChildren(stateNode).filter(sn => !isHistoryNode(sn))) {
          if (![...statesToEnter].some(s => isDescendant(s, child))) {
            if (!isHistoryNode(child)) {
              statesToEnter.add(child);
              statesForDefaultEntry.add(child);
            }
            addDescendantStatesToEnter(child, historyValue, statesForDefaultEntry, statesToEnter);
          }
        }
      }
    }
  }
}
function addAncestorStatesToEnter(statesToEnter, historyValue, statesForDefaultEntry, ancestors, reentrancyDomain) {
  for (const anc of ancestors) {
    if (!reentrancyDomain || isDescendant(anc, reentrancyDomain)) {
      statesToEnter.add(anc);
    }
    if (anc.type === 'parallel') {
      for (const child of getChildren(anc).filter(sn => !isHistoryNode(sn))) {
        if (![...statesToEnter].some(s => isDescendant(s, child))) {
          statesToEnter.add(child);
          addDescendantStatesToEnter(child, historyValue, statesForDefaultEntry, statesToEnter);
        }
      }
    }
  }
}
function addProperAncestorStatesToEnter(stateNode, toStateNode, statesToEnter, historyValue, statesForDefaultEntry) {
  addAncestorStatesToEnter(statesToEnter, historyValue, statesForDefaultEntry, getProperAncestors(stateNode, toStateNode));
}
function exitStates(currentState, event, actorScope, transitions, mutConfiguration, historyValue, internalQueue) {
  let nextState = currentState;
  const statesToExit = computeExitSet(transitions, mutConfiguration, historyValue);
  statesToExit.sort((a, b) => b.order - a.order);
  let changedHistory;

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
      changedHistory ??= {
        ...historyValue
      };
      changedHistory[historyNode.id] = Array.from(mutConfiguration).filter(predicate);
    }
  }
  for (const s of statesToExit) {
    nextState = resolveActionsAndContext(nextState, event, actorScope, [...s.exit, ...s.invoke.map(def => stop(def.id))], internalQueue);
    mutConfiguration.delete(s);
  }
  return [nextState, changedHistory || historyValue];
}
function resolveActionsAndContextWorker(currentState, event, actorScope, actions, extra, retries) {
  const {
    machine
  } = currentState;
  let intermediateState = currentState;
  for (const action of actions) {
    const isInline = typeof action === 'function';
    const resolvedAction = isInline ? action :
    // the existing type of `.actions` assumes non-nullable `TExpressionAction`
    // it's fine to cast this here to get a common type and lack of errors in the rest of the code
    // our logic below makes sure that we call those 2 "variants" correctly
    machine.implementations.actions[typeof action === 'string' ? action : action.type];
    if (!resolvedAction) {
      continue;
    }
    const actionArgs = {
      context: intermediateState.context,
      event,
      self: actorScope?.self,
      system: actorScope?.system
    };
    const actionParams = isInline || typeof action === 'string' ? undefined : 'params' in action ? typeof action.params === 'function' ? action.params({
      context: intermediateState.context,
      event
    }) : action.params : undefined;
    if (!('resolve' in resolvedAction)) {
      if (actorScope?.self.status === ActorStatus.Running) {
        resolvedAction(actionArgs, actionParams);
      } else {
        actorScope?.defer(() => {
          resolvedAction(actionArgs, actionParams);
        });
      }
      continue;
    }
    const builtinAction = resolvedAction;
    const [nextState, params, actions] = builtinAction.resolve(actorScope, intermediateState, actionArgs, actionParams, resolvedAction,
    // this holds all params
    extra);
    intermediateState = nextState;
    if ('retryResolve' in builtinAction) {
      retries?.push([builtinAction, params]);
    }
    if ('execute' in builtinAction) {
      if (actorScope?.self.status === ActorStatus.Running) {
        builtinAction.execute(actorScope, params);
      } else {
        actorScope?.defer(builtinAction.execute.bind(null, actorScope, params));
      }
    }
    if (actions) {
      intermediateState = resolveActionsAndContextWorker(intermediateState, event, actorScope, actions, extra, retries);
    }
  }
  return intermediateState;
}
function resolveActionsAndContext(currentState, event, actorScope, actions, internalQueue, deferredActorIds) {
  const retries = deferredActorIds ? [] : undefined;
  const nextState = resolveActionsAndContextWorker(currentState, event, actorScope, actions, {
    internalQueue,
    deferredActorIds
  }, retries);
  retries?.forEach(([builtinAction, params]) => {
    builtinAction.retryResolve(actorScope, nextState, params);
  });
  return nextState;
}
function macrostep(state, event, actorScope, internalQueue = []) {
  let nextState = state;
  const states = [];

  // Handle stop event
  if (event.type === XSTATE_STOP) {
    nextState = cloneState(stopChildren(nextState, event, actorScope), {
      status: 'stopped'
    });
    states.push(nextState);
    return {
      state: nextState,
      microstates: states
    };
  }
  let nextEvent = event;

  // Assume the state is at rest (no raised events)
  // Determine the next state based on the next microstep
  if (nextEvent.type !== XSTATE_INIT) {
    const transitions = selectTransitions(nextEvent, nextState);
    nextState = microstep(transitions, state, actorScope, nextEvent, false, internalQueue);
    states.push(nextState);
  }
  let shouldSelectEventlessTransitions = true;
  while (nextState.status === 'active') {
    let enabledTransitions = shouldSelectEventlessTransitions ? selectEventlessTransitions(nextState, nextEvent) : [];

    // eventless transitions should always be selected after selecting *regular* transitions
    // by assigning `undefined` to `previousState` we ensure that `shouldSelectEventlessTransitions` gets always computed to true in such a case
    const previousState = enabledTransitions.length ? nextState : undefined;
    if (!enabledTransitions.length) {
      if (!internalQueue.length) {
        break;
      }
      nextEvent = internalQueue.shift();
      enabledTransitions = selectTransitions(nextEvent, nextState);
    }
    nextState = microstep(enabledTransitions, nextState, actorScope, nextEvent, false, internalQueue);
    shouldSelectEventlessTransitions = nextState !== previousState;
    states.push(nextState);
  }
  if (nextState.status !== 'active') {
    stopChildren(nextState, nextEvent, actorScope);
  }
  return {
    state: nextState,
    microstates: states
  };
}
function stopChildren(nextState, event, actorScope) {
  return resolveActionsAndContext(nextState, event, actorScope, Object.values(nextState.children).map(child => stop(child)), []);
}
function selectTransitions(event, nextState) {
  return nextState.machine.getTransitionData(nextState, event);
}
function selectEventlessTransitions(nextState, event) {
  const enabledTransitionSet = new Set();
  const atomicStates = nextState.configuration.filter(isAtomicStateNode);
  for (const stateNode of atomicStates) {
    loop: for (const s of [stateNode].concat(getProperAncestors(stateNode, undefined))) {
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
   * The output data of the top-level finite state.
   */

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
          children: {},
          status: 'active'
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
      children: {},
      status: 'active'
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
    this.status = void 0;
    this.error = void 0;
    this.context = void 0;
    this.historyValue = {};
    this.configuration = void 0;
    this.children = void 0;
    this.context = config.context;
    this.historyValue = config.historyValue || {};
    this.matches = this.matches.bind(this);
    this.toStrings = this.toStrings.bind(this);
    this.configuration = config.configuration ?? Array.from(getConfiguration(getStateNodes(machine.root, config.value)));
    this.children = config.children;
    this.value = getStateValue(machine.root, this.configuration);
    this.tags = new Set(flatten(this.configuration.map(sn => sn.tags)));
    this.status = config.status;
    this.output = config.output;
    this.error = config.error;
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
    context,
    ...jsonValues
  } = state;
  const childrenJson = {};
  for (const id in children) {
    const child = children[id];
    childrenJson[id] = {
      state: child.getPersistedState(),
      src: child.src,
      systemId: child._systemId
    };
  }
  const persisted = {
    ...jsonValues,
    context: persistContext(context),
    children: childrenJson
  };
  return persisted;
}
function persistContext(contextPart) {
  let copy;
  for (const key in contextPart) {
    const value = contextPart[key];
    if (value && typeof value === 'object') {
      if ('sessionId' in value && 'send' in value && 'ref' in value) {
        copy ??= Array.isArray(contextPart) ? contextPart.slice() : {
          ...contextPart
        };
        copy[key] = {
          xstate$$type: $$ACTOR_TYPE,
          id: value.id
        };
      } else {
        const result = persistContext(value);
        if (result !== value) {
          copy ??= Array.isArray(contextPart) ? contextPart.slice() : {
            ...contextPart
          };
          copy[key] = result;
        }
      }
    }
  }
  return copy ?? contextPart;
}

function resolveRaise(_, state, args, actionParams, {
  event: eventOrExpr,
  id,
  delay
}, {
  internalQueue
}) {
  const delaysMap = state.machine.implementations.delays;
  if (typeof eventOrExpr === 'string') {
    throw new Error(`Only event objects may be used with raise; use raise({ type: "${eventOrExpr}" }) instead`);
  }
  const resolvedEvent = typeof eventOrExpr === 'function' ? eventOrExpr(args, actionParams) : eventOrExpr;
  let resolvedDelay;
  if (typeof delay === 'string') {
    const configDelay = delaysMap && delaysMap[delay];
    resolvedDelay = typeof configDelay === 'function' ? configDelay(args, actionParams) : configDelay;
  } else {
    resolvedDelay = typeof delay === 'function' ? delay(args, actionParams) : delay;
  }
  if (typeof resolvedDelay !== 'number') {
    internalQueue.push(resolvedEvent);
  }
  return [state, {
    event: resolvedEvent,
    id,
    delay: resolvedDelay
  }];
}
function executeRaise(actorScope, params) {
  if (typeof params.delay === 'number') {
    actorScope.self.delaySend(params);
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
  function raise(args, params) {
  }
  raise.type = 'xstate.raise';
  raise.event = eventOrExpr;
  raise.id = options?.id;
  raise.delay = options?.delay;
  raise.resolve = resolveRaise;
  raise.execute = executeRaise;
  return raise;
}

function createSpawner(actorScope, {
  machine,
  context
}, event, spawnedChildren) {
  const spawn = (src, options = {}) => {
    const {
      systemId
    } = options;
    if (typeof src === 'string') {
      const referenced = resolveReferencedActor(machine, src);
      if (!referenced) {
        throw new Error(`Actor logic '${src}' not implemented in machine '${machine.id}'`);
      }
      const input = 'input' in options ? options.input : referenced.input;

      // TODO: this should also receive `src`
      const actorRef = createActor(referenced.src, {
        id: options.id,
        parent: actorScope.self,
        input: typeof input === 'function' ? input({
          context,
          event,
          self: actorScope.self
        }) : input,
        src,
        systemId
      });
      spawnedChildren[actorRef.id] = actorRef;
      if (options.syncSnapshot) {
        actorRef.subscribe({
          next: snapshot => {
            if (snapshot.status === 'active') {
              actorScope.self.send({
                type: `xstate.snapshot.${actorRef.id}`,
                snapshot
              });
            }
          },
          error: () => {}
        });
      }
      return actorRef;
    } else {
      // TODO: this should also receive `src`
      const actorRef = createActor(src, {
        id: options.id,
        parent: actorScope.self,
        input: options.input,
        src: undefined,
        systemId
      });
      if (options.syncSnapshot) {
        actorRef.subscribe({
          next: snapshot => {
            if (snapshot.status === 'active') {
              actorScope.self.send({
                type: `xstate.snapshot.${actorRef.id}`,
                snapshot,
                id: actorRef.id
              });
            }
          },
          error: () => {}
        });
      }
      return actorRef;
    }
  };
  return (src, options) => {
    const actorRef = spawn(src, options); // TODO: fix types
    spawnedChildren[actorRef.id] = actorRef;
    actorScope.defer(() => {
      if (actorRef.status === ActorStatus.Stopped) {
        return;
      }
      try {
        actorRef.start?.();
      } catch (err) {
        actorScope.self.send(createErrorActorEvent(actorRef.id, err));
        return;
      }
    });
    return actorRef;
  };
}

function resolveAssign(actorScope, state, actionArgs, actionParams, {
  assignment
}) {
  if (!state.context) {
    throw new Error('Cannot assign to undefined `context`. Ensure that `context` is defined in the machine config.');
  }
  const spawnedChildren = {};
  const assignArgs = {
    context: state.context,
    event: actionArgs.event,
    spawn: createSpawner(actorScope, state, actionArgs.event, spawnedChildren),
    self: actorScope?.self,
    system: actorScope?.system
  };
  let partialUpdate = {};
  if (typeof assignment === 'function') {
    partialUpdate = assignment(assignArgs, actionParams);
  } else {
    for (const key of Object.keys(assignment)) {
      const propAssignment = assignment[key];
      partialUpdate[key] = typeof propAssignment === 'function' ? propAssignment(assignArgs, actionParams) : propAssignment;
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
  function assign(args, params) {
  }
  assign.type = 'xstate.assign';
  assign.assignment = assignment;
  assign.resolve = resolveAssign;
  return assign;
}

const EMPTY_OBJECT = {};
const toSerializableAction = action => {
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
   * The output data sent with the "xstate.done.state._id_" event if this is a final state node.
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
    this.entry = toArray(this.config.entry).slice();
    this.exit = toArray(this.config.exit).slice();
    this.meta = this.config.meta;
    this.output = this.type === 'final' || !this.parent ? this.config.output : undefined;
    this.tags = toArray(config.tags).slice();
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
        actions: this.initial.actions.map(toSerializableAction),
        eventType: null,
        reenter: false,
        toJSON: () => ({
          target: this.initial.target.map(t => `#${t.id}`),
          source: `#${this.id}`,
          actions: this.initial.actions.map(toSerializableAction),
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
        actions: t.actions.map(toSerializableAction)
      })),
      entry: this.entry.map(toSerializableAction),
      exit: this.exit.map(toSerializableAction),
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
    return memo(this, 'invoke', () => toArray(this.config.invoke).map((invokeConfig, i) => {
      const {
        src,
        systemId
      } = invokeConfig;
      const resolvedId = invokeConfig.id || createInvokeId(this.id, i);
      const resolvedSrc = typeof src === 'string' ? src : `xstate#${createInvokeId(this.id, i)}`;
      return {
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
    return memo(this, 'initial', () => formatInitialTransition(this, this.config.initial));
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
        const guardType = typeof guard === 'string' ? guard : typeof guard === 'object' ? guard.type : undefined;
        throw new Error(`Unable to evaluate guard ${guardType ? `'${guardType}' ` : ''}in transition for event '${eventType}' in state node '${this.id}':\n${err.message}`);
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
    this.__TActor = void 0;
    this.__TAction = void 0;
    this.__TGuard = void 0;
    this.__TDelay = void 0;
    this.__TTag = void 0;
    this.__TInput = void 0;
    this.__TOutput = void 0;
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
    this.getInitialState = this.getInitialState.bind(this);
    this.restoreState = this.restoreState.bind(this);
    this.start = this.start.bind(this);
    this.getPersistedState = this.getPersistedState.bind(this);
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
      status: isInFinalState(configurationSet, this.root) ? 'done' : state.status
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
  transition(state, event, actorScope) {
    // TODO: handle error events in a better way
    if (isErrorActorEvent(event) && !state.nextEvents.some(nextEvent => nextEvent === event.type)) {
      return cloneState(state, {
        status: 'error',
        error: event.data
      });
    }
    const {
      state: nextState
    } = macrostep(state, event, actorScope);
    return nextState;
  }

  /**
   * Determines the next state given the current `state` and `event`.
   * Calculates a microstep.
   *
   * @param state The current state
   * @param event The received event
   */
  microstep(state, event, actorScope) {
    return macrostep(state, event, actorScope).microstates;
  }
  getTransitionData(state, event) {
    return transitionNode(this.root, state.value, state, event) || [];
  }

  /**
   * The initial state _before_ evaluating any microsteps.
   * This "pre-initial" state is provided to initial actions executed in the initial state.
   */
  getPreInitialState(actorScope, initEvent, internalQueue) {
    const {
      context
    } = this.config;
    const preInitial = this.resolveState(this.createState({
      value: {},
      // TODO: this is computed in state constructor
      context: typeof context !== 'function' && context ? context : {},
      meta: undefined,
      configuration: getInitialConfiguration(this.root),
      children: {},
      status: 'active'
    }));
    if (typeof context === 'function') {
      const assignment = ({
        spawn,
        event
      }) => context({
        spawn,
        input: event.input
      });
      return resolveActionsAndContext(preInitial, initEvent, actorScope, [assign(assignment)], internalQueue);
    }
    return preInitial;
  }

  /**
   * Returns the initial `State` instance, with reference to `self` as an `ActorRef`.
   */
  getInitialState(actorScope, input) {
    const initEvent = createInitEvent(input); // TODO: fix;
    const internalQueue = [];
    const preInitialState = this.getPreInitialState(actorScope, initEvent, internalQueue);
    const nextState = microstep([{
      target: [...getInitialStateNodes(this.root)],
      source: this.root,
      reenter: true,
      actions: [],
      eventType: null,
      toJSON: null // TODO: fix
    }], preInitialState, actorScope, initEvent, true, internalQueue);
    const {
      state: macroState
    } = macrostep(nextState, initEvent, actorScope, internalQueue);
    return macroState;
  }
  start(state) {
    Object.values(state.children).forEach(child => {
      if (child.getSnapshot().status === 'active') {
        child.start();
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
  restoreState(snapshot, _actorScope) {
    const children = {};
    const snapshotChildren = snapshot.children;
    Object.keys(snapshotChildren).forEach(actorId => {
      const actorData = snapshotChildren[actorId];
      const childState = actorData.state;
      const src = actorData.src;
      const logic = src ? resolveReferencedActor(this, src)?.src : undefined;
      if (!logic) {
        return;
      }
      const actorState = logic.restoreState?.(childState, _actorScope);
      const actorRef = createActor(logic, {
        id: actorId,
        parent: _actorScope?.self,
        state: actorState,
        src,
        systemId: actorData.systemId
      });
      children[actorId] = actorRef;
    });
    const restoredSnapshot = this.createState(new State({
      ...snapshot,
      children
    }, this));
    let seen = new Set();
    function reviveContext(contextPart, children) {
      if (seen.has(contextPart)) {
        return;
      }
      seen.add(contextPart);
      for (let key in contextPart) {
        const value = contextPart[key];
        if (value && typeof value === 'object') {
          if ('xstate$$type' in value && value.xstate$$type === $$ACTOR_TYPE) {
            contextPart[key] = children[value.id];
            continue;
          }
          reviveContext(value, children);
        }
      }
    }
    reviveContext(restoredSnapshot.context, children);
    return restoredSnapshot;
  }

  /**@deprecated an internal property acting as a "phantom" type, not meant to be used at runtime */
}

function createMachine(config, implementations) {
  return new StateMachine(config, implementations);
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

export { ActorStatus as A, XSTATE_STOP as X, assign as a, createActor as b, createMachine as c, and as d, not as n, sharedGuards as s };
//# sourceMappingURL=guards-34507652.js.map
