import { c as create_ssr_component, v as validate_component, p as get_store_value, o as onDestroy, q as compute_rest_props, a as subscribe, b as spread, l as escape_attribute_value, d as escape_object, f as add_attribute, e as escape, n as noop, r as set_current_component, t as run_all, u as current_component } from './ssr-0dbbabcd.js';
import { B as Board } from './Board-ab5f7865.js';
import { P as Paragraph, A as Actions, B as Button } from './Paragraph-c549ffc0.js';
import { w as writable, d as derived } from './index2-fcf0b728.js';
import { a as clone$1, S as SuperFormError, b as clearErrors, d as splitPath, t as traversePath, e as comparePaths, f as setPaths, g as flattenErrors, m as mapErrors, h as errorShape, i as traversePathsAsync, k as traversePaths, p as pathExists, l as isInvalidPath, n as parse } from './forms-78616ad6.js';
import { p as page } from './stores-5381becf.js';
import { B as BROWSER } from './prod-ssr-7cc47430.js';
import { s as stringify } from './stringify-f45e10e0.js';
import './index-a4865dbd.js';
import { H as Heading } from './Heading-6d80f38d.js';

const dirty_components = [];
const binding_callbacks = [];
let render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = /* @__PURE__ */ Promise.resolve();
let update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function tick() {
  schedule_update();
  return resolved_promise;
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
const seen_callbacks = /* @__PURE__ */ new Set();
let flushidx = 0;
function flush() {
  if (flushidx !== 0) {
    return;
  }
  const saved_component = current_component;
  do {
    try {
      while (flushidx < dirty_components.length) {
        const component = dirty_components[flushidx];
        flushidx++;
        set_current_component(component);
        update(component.$$);
      }
    } catch (e) {
      dirty_components.length = 0;
      flushidx = 0;
      throw e;
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i = 0; i < render_callbacks.length; i += 1) {
      const callback = render_callbacks[i];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
const browser = BROWSER;
function client_method(key) {
  {
    if (key === "before_navigate" || key === "after_navigate") {
      return () => {
      };
    } else {
      const name_lookup = {
        disable_scroll_handling: "disableScrollHandling",
        preload_data: "preloadData",
        preload_code: "preloadCode",
        invalidate_all: "invalidateAll"
      };
      return () => {
        throw new Error(`Cannot call ${name_lookup[key] ?? key}(...) on the server`);
      };
    }
  }
}
const invalidateAll = /* @__PURE__ */ client_method("invalidate_all");
const afterNavigate = /* @__PURE__ */ client_method("after_navigate");
function formFieldProxy(form, path) {
  const path2 = splitPath(path);
  const constraintsPath = path2.filter((p) => isNaN(parseInt(String(p)))).join(".");
  return {
    path,
    value: fieldProxy(form.form, path),
    errors: fieldProxy(form.errors, path),
    constraints: fieldProxy(form.constraints, constraintsPath)
  };
}
function fieldProxy(form, path) {
  const path2 = splitPath(path);
  const proxy = derived(form, ($form) => {
    const data = traversePath($form, path2);
    return data?.value;
  });
  return {
    subscribe(...params) {
      const unsub = proxy.subscribe(...params);
      return () => {
        unsub();
      };
    },
    //subscribe: proxy.subscribe,
    update(upd) {
      form.update((f) => {
        const output = traversePath(f, path2);
        if (output)
          output.parent[output.key] = upd(output.value);
        return f;
      });
    },
    set(value) {
      form.update((f) => {
        const output = traversePath(f, path2);
        if (output)
          output.parent[output.key] = value;
        return f;
      });
    }
  };
}
async function clientValidation(options, checkData, formId, constraints, posted) {
  return _clientValidation(options.validators, checkData, formId, constraints, posted);
}
async function _clientValidation(validators, checkData, formId, constraints, posted) {
  if (validators) {
    let valid;
    let clientErrors = {};
    if ("safeParseAsync" in validators) {
      const validator = validators;
      const result = await validator.safeParseAsync(checkData);
      valid = result.success;
      if (!result.success) {
        clientErrors = mapErrors(
          result.error.format(),
          errorShape(validator)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        );
      }
    } else {
      valid = true;
      const validator = validators;
      const newErrors = [];
      await traversePathsAsync(checkData, async ({ value, path }) => {
        const validationPath = path.filter((p) => isNaN(parseInt(p)));
        const maybeValidator = traversePath(validator, validationPath);
        if (typeof maybeValidator?.value === "function") {
          const check = maybeValidator.value;
          if (Array.isArray(value)) {
            for (const key in value) {
              const errors = await check(value[key]);
              if (errors) {
                valid = false;
                newErrors.push({
                  path: path.concat([key]),
                  errors: typeof errors === "string" ? [errors] : errors ?? void 0
                });
              }
            }
          } else {
            const errors = await check(value);
            if (errors) {
              valid = false;
              newErrors.push({
                path,
                errors: typeof errors === "string" ? [errors] : errors ?? void 0
              });
            }
          }
        }
      });
      for (const { path, errors } of newErrors) {
        const errorPath = traversePath(clientErrors, path, ({ parent, key, value }) => {
          if (value === void 0)
            parent[key] = {};
          return parent[key];
        });
        if (errorPath) {
          const { parent, key } = errorPath;
          parent[key] = errors;
        }
      }
    }
    if (!valid) {
      return {
        valid: false,
        posted,
        errors: clientErrors,
        data: checkData,
        constraints,
        message: void 0,
        id: formId
      };
    }
  }
  return {
    valid: true,
    posted,
    errors: {},
    data: checkData,
    constraints,
    message: void 0,
    id: formId
  };
}
async function validateObjectErrors(formOptions, data, Errors) {
  if (typeof formOptions.validators !== "object" || !("safeParseAsync" in formOptions.validators)) {
    return;
  }
  const validators = formOptions.validators;
  const result = await validators.safeParseAsync(data);
  if (!result.success) {
    const newErrors = mapErrors(result.error.format(), errorShape(validators));
    Errors.update((currentErrors) => {
      traversePaths(currentErrors, (pathData) => {
        if (pathData.key == "_errors") {
          return pathData.set(void 0);
        }
      });
      traversePaths(newErrors, (pathData) => {
        if (pathData.key == "_errors") {
          return setPaths(currentErrors, [pathData.path], pathData.value);
        }
      });
      return currentErrors;
    });
  } else {
    Errors.update((currentErrors) => {
      traversePaths(currentErrors, (pathData) => {
        if (pathData.key == "_errors") {
          return pathData.set(void 0);
        }
      });
      return currentErrors;
    });
  }
}
async function validateField(path, formOptions, data, Errors, Tainted, options = {}) {
  function Errors_clear() {
    clearErrors(Errors, { undefinePath: path, clearFormLevelErrors: true });
  }
  function Errors_update(errorMsgs) {
    if (typeof errorMsgs === "string")
      errorMsgs = [errorMsgs];
    if (options.update === true || options.update == "errors") {
      Errors.update((errors2) => {
        const error = traversePath(errors2, path, (node) => {
          if (isInvalidPath(path, node)) {
            throw new SuperFormError("Errors can only be added to form fields, not to arrays or objects in the schema. Path: " + node.path.slice(0, -1));
          } else if (node.value === void 0) {
            node.parent[node.key] = {};
            return node.parent[node.key];
          } else {
            return node.value;
          }
        });
        if (!error)
          throw new SuperFormError("Error path could not be created: " + path);
        error.parent[error.key] = errorMsgs ?? void 0;
        return errors2;
      });
    }
    return errorMsgs ?? void 0;
  }
  const errors = await _validateField(path, formOptions.validators, data, Errors, Tainted, options);
  if (errors.validated) {
    if (errors.validated === "all" && !errors.errors) {
      Errors_clear();
    } else {
      return Errors_update(errors.errors);
    }
  } else if (errors.validated === false && formOptions.defaultValidator == "clear") {
    return Errors_update(void 0);
  }
  return errors.errors;
}
async function _validateField(path, validators, data, Errors, Tainted, options = {}) {
  if (options.update === void 0)
    options.update = true;
  if (options.taint === void 0)
    options.taint = false;
  if (typeof options.errors == "string")
    options.errors = [options.errors];
  const Context = {
    value: options.value,
    shouldUpdate: true,
    currentData: void 0,
    // Remove numeric indices, they're not used for validators.
    validationPath: path.filter((p) => isNaN(parseInt(p)))
  };
  async function defaultValidate() {
    return { validated: false, errors: void 0 };
  }
  function Tainted_isPathTainted(path2, tainted) {
    if (tainted === void 0)
      return false;
    const leaf = traversePath(tainted, path2);
    if (!leaf)
      return false;
    return leaf.value === true;
  }
  function Errors_update(updater) {
    Errors.update(updater);
  }
  function Errors_clearFormLevelErrors() {
    Errors.update(($errors) => {
      traversePaths($errors, (path2) => {
        if (path2.key == "_errors")
          return path2.set(void 0);
      });
      return $errors;
    });
  }
  function Errors_fromZod(errors, validator) {
    return mapErrors(errors.format(), errorShape(validator));
  }
  if (!("value" in options)) {
    Context.currentData = get_store_value(data);
    const dataToValidate = traversePath(Context.currentData, path);
    Context.value = dataToValidate?.value;
  } else if (options.update === true || options.update === "value") {
    data.update(($data) => {
      setPaths($data, [path], Context.value);
      return Context.currentData = $data;
    }, { taint: options.taint });
  } else {
    Context.shouldUpdate = false;
  }
  if (typeof validators !== "object") {
    return defaultValidate();
  }
  if ("safeParseAsync" in validators) {
    if (!Context.shouldUpdate) {
      Context.currentData = clone$1(Context.currentData ?? get_store_value(data));
      setPaths(Context.currentData, [path], Context.value);
    }
    const result = await validators.safeParseAsync(Context.currentData);
    if (!result.success) {
      const newErrors = Errors_fromZod(result.error, validators);
      if (options.update === true || options.update == "errors") {
        const taintedFields = get_store_value(Tainted);
        Errors_update((currentErrors) => {
          traversePaths(currentErrors, (pathData) => {
            if (pathData.key == "_errors") {
              return pathData.set(void 0);
            }
          });
          traversePaths(newErrors, (pathData) => {
            if (pathData.key == "_errors") {
              return setPaths(currentErrors, [pathData.path], pathData.value);
            }
            if (!Array.isArray(pathData.value))
              return;
            if (Tainted_isPathTainted(pathData.path, taintedFields)) {
              setPaths(currentErrors, [pathData.path], pathData.value);
            }
            return "skip";
          });
          return currentErrors;
        });
      }
      const current = traversePath(newErrors, path);
      return {
        validated: true,
        errors: options.errors ?? current?.value
      };
    } else {
      Errors_clearFormLevelErrors();
      return { validated: true, errors: void 0 };
    }
  } else {
    const validator = traversePath(validators, Context.validationPath);
    if (!validator) {
      throw new SuperFormError("No Superforms validator found: " + path);
    } else if (validator.value === void 0) {
      return defaultValidate();
    } else {
      const result = await validator.value(Context.value);
      return {
        validated: true,
        errors: result ? options.errors ?? result : result
      };
    }
  }
}
function applyAction(result) {
  {
    throw new Error("Cannot call applyAction(...) on the server");
  }
}
function deserialize(result) {
  const parsed = JSON.parse(result);
  if (parsed.data) {
    parsed.data = parse(parsed.data);
  }
  return parsed;
}
function clone(element) {
  return (
    /** @type {T} */
    HTMLElement.prototype.cloneNode.call(element)
  );
}
function enhance(form_element, submit = () => {
}) {
  const fallback_callback = async ({ action, result, reset }) => {
    if (result.type === "success") {
      if (reset !== false) {
        HTMLFormElement.prototype.reset.call(form_element);
      }
      await invalidateAll();
    }
    if (location.origin + location.pathname === action.origin + action.pathname || result.type === "redirect" || result.type === "error") {
      applyAction();
    }
  };
  async function handle_submit(event) {
    const method = event.submitter?.hasAttribute("formmethod") ? (
      /** @type {HTMLButtonElement | HTMLInputElement} */
      event.submitter.formMethod
    ) : clone(form_element).method;
    if (method !== "post")
      return;
    event.preventDefault();
    const action = new URL(
      // We can't do submitter.formAction directly because that property is always set
      event.submitter?.hasAttribute("formaction") ? (
        /** @type {HTMLButtonElement | HTMLInputElement} */
        event.submitter.formAction
      ) : clone(form_element).action
    );
    const form_data = new FormData(form_element);
    const submitter_name = event.submitter?.getAttribute("name");
    if (submitter_name) {
      form_data.append(submitter_name, event.submitter?.getAttribute("value") ?? "");
    }
    const controller = new AbortController();
    let cancelled = false;
    const cancel = () => cancelled = true;
    const callback = await submit({
      action,
      cancel,
      controller,
      get data() {
        return form_data;
      },
      formData: form_data,
      get form() {
        return form_element;
      },
      formElement: form_element,
      submitter: event.submitter
    }) ?? fallback_callback;
    if (cancelled)
      return;
    let result;
    try {
      const response = await fetch(action, {
        method: "POST",
        headers: {
          accept: "application/json",
          "x-sveltekit-action": "true"
        },
        cache: "no-store",
        body: form_data,
        signal: controller.signal
      });
      result = deserialize(await response.text());
      if (result.type === "error")
        result.status = response.status;
    } catch (error) {
      if (
        /** @type {any} */
        error?.name === "AbortError"
      )
        return;
      result = { type: "error", error };
    }
    callback({
      action,
      get data() {
        return form_data;
      },
      formData: form_data,
      get form() {
        return form_element;
      },
      formElement: form_element,
      update: (opts) => fallback_callback({ action, result, reset: opts?.reset }),
      // @ts-expect-error generic constraints stuff we don't care about
      result
    });
  }
  HTMLFormElement.prototype.addEventListener.call(form_element, "submit", handle_submit);
  return {
    destroy() {
      HTMLFormElement.prototype.removeEventListener.call(form_element, "submit", handle_submit);
    }
  };
}
const isElementInViewport = (el, topOffset = 0) => {
  const rect = el.getBoundingClientRect();
  return rect.top >= topOffset && rect.left >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && rect.right <= (window.innerWidth || document.documentElement.clientWidth);
};
const scrollToAndCenter = (el, offset = 1.125, behavior = "smooth") => {
  const elementRect = el.getBoundingClientRect();
  const absoluteElementTop = elementRect.top + window.pageYOffset;
  const top = absoluteElementTop - window.innerHeight / (2 * offset);
  window.scrollTo({ left: 0, top, behavior });
};
var FetchStatus;
(function(FetchStatus2) {
  FetchStatus2[FetchStatus2["Idle"] = 0] = "Idle";
  FetchStatus2[FetchStatus2["Submitting"] = 1] = "Submitting";
  FetchStatus2[FetchStatus2["Delayed"] = 2] = "Delayed";
  FetchStatus2[FetchStatus2["Timeout"] = 3] = "Timeout";
})(FetchStatus || (FetchStatus = {}));
function cancelFlash(options) {
  if (!options.flashMessage || !browser)
    return;
  if (!shouldSyncFlash(options))
    return;
  document.cookie = `flash=; Max-Age=0; Path=${options.flashMessage.cookiePath ?? "/"};`;
}
function shouldSyncFlash(options) {
  if (!options.flashMessage || !browser)
    return false;
  return options.syncFlashMessage;
}
function formEnhance(formEl, submitting, delayed, timeout, errs, Form_updateFromActionResult, options, data, message, enableTaintedForm, formEvents, formId, constraints, tainted, lastChanges, Context_findValidationForms, posted) {
  enableTaintedForm();
  const errors = errs;
  async function validateChange(change) {
    await validateField(change, options, data, errors, tainted);
  }
  function timingIssue(el) {
    return el && (el instanceof HTMLSelectElement || el instanceof HTMLInputElement && el.type == "radio");
  }
  async function checkBlur(e) {
    if (options.validationMethod == "oninput" || options.validationMethod == "submit-only") {
      return;
    }
    if (timingIssue(e.target)) {
      await new Promise((r) => setTimeout(r, 0));
    }
    for (const change of get_store_value(lastChanges)) {
      validateChange(change);
    }
    lastChanges.set([]);
  }
  formEl.addEventListener("focusout", checkBlur);
  const ErrorTextEvents = /* @__PURE__ */ new Set();
  function ErrorTextEvents_selectText(e) {
    const target = e.target;
    if (options.selectErrorText)
      target.select();
  }
  function ErrorTextEvents_addErrorTextListeners(formEl2) {
    formEl2.querySelectorAll("input").forEach((el) => {
      el.addEventListener("invalid", ErrorTextEvents_selectText);
    });
  }
  function ErrorTextEvents_removeErrorTextListeners(formEl2) {
    formEl2.querySelectorAll("input").forEach((el) => el.removeEventListener("invalid", ErrorTextEvents_selectText));
  }
  afterNavigate((nav) => {
    if (nav.type == "goto") {
      htmlForm.completed(true);
    }
  });
  onDestroy(() => {
    ErrorTextEvents.forEach((formEl2) => ErrorTextEvents_removeErrorTextListeners(formEl2));
    ErrorTextEvents.clear();
    formEl.removeEventListener("focusout", checkBlur);
    htmlForm.completed(true);
  });
  function Form(formEl2) {
    function rebind() {
      if (options.selectErrorText) {
        const form = Form_element();
        if (form && formEl2 !== form) {
          ErrorTextEvents_removeErrorTextListeners(form);
          ErrorTextEvents.delete(form);
        }
        if (!ErrorTextEvents.has(formEl2)) {
          ErrorTextEvents_addErrorTextListeners(formEl2);
          ErrorTextEvents.add(formEl2);
        }
      }
      Form2 = formEl2;
    }
    let Form2;
    function Form_element() {
      return Form2;
    }
    function Form_shouldAutoFocus(userAgent) {
      if (typeof options.autoFocusOnError === "boolean")
        return options.autoFocusOnError;
      else
        return !/iPhone|iPad|iPod|Android/i.test(userAgent);
    }
    const Form_scrollToFirstError = async () => {
      if (options.scrollToError == "off")
        return;
      const selector = options.errorSelector;
      if (!selector)
        return;
      await tick();
      let el;
      el = Form2.querySelector(selector);
      if (!el)
        return;
      el = el.querySelector(selector) ?? el;
      const nav = options.stickyNavbar ? document.querySelector(options.stickyNavbar) : null;
      if (typeof options.scrollToError != "string") {
        el.scrollIntoView(options.scrollToError);
      } else if (!isElementInViewport(el, nav?.offsetHeight ?? 0)) {
        scrollToAndCenter(el, void 0, options.scrollToError);
      }
      if (!Form_shouldAutoFocus(navigator.userAgent))
        return;
      let focusEl;
      focusEl = el;
      if (!["INPUT", "SELECT", "BUTTON", "TEXTAREA"].includes(focusEl.tagName)) {
        focusEl = focusEl.querySelector('input:not([type="hidden"]):not(.flatpickr-input), select, textarea');
      }
      if (focusEl) {
        try {
          focusEl.focus({ preventScroll: true });
          if (options.selectErrorText && focusEl.tagName == "INPUT") {
            focusEl.select();
          }
        } catch (err) {
        }
      }
    };
    rebind();
    {
      let state = FetchStatus.Idle;
      let delayedTimeout, timeoutTimeout;
      const setState = (s) => {
        state = s;
        submitting.set(state >= FetchStatus.Submitting);
        delayed.set(state >= FetchStatus.Delayed);
        timeout.set(state >= FetchStatus.Timeout);
      };
      return {
        submitting: () => {
          rebind();
          setState(state != FetchStatus.Delayed ? FetchStatus.Submitting : FetchStatus.Delayed);
          if (delayedTimeout)
            clearTimeout(delayedTimeout);
          if (timeoutTimeout)
            clearTimeout(timeoutTimeout);
          delayedTimeout = window.setTimeout(() => {
            if (state == FetchStatus.Submitting)
              setState(FetchStatus.Delayed);
          }, options.delayMs);
          timeoutTimeout = window.setTimeout(() => {
            if (state == FetchStatus.Delayed)
              setState(FetchStatus.Timeout);
          }, options.timeoutMs);
        },
        completed: (cancelled) => {
          if (delayedTimeout)
            clearTimeout(delayedTimeout);
          if (timeoutTimeout)
            clearTimeout(timeoutTimeout);
          delayedTimeout = timeoutTimeout = 0;
          setState(FetchStatus.Idle);
          if (!cancelled)
            setTimeout(Form_scrollToFirstError);
        },
        scrollToFirstError: () => setTimeout(Form_scrollToFirstError),
        isSubmitting: () => state === FetchStatus.Submitting || state === FetchStatus.Delayed
      };
    }
  }
  const htmlForm = Form(formEl);
  let currentRequest;
  return enhance(formEl, async (submit) => {
    const submitCancel = submit.cancel;
    let cancelled = false;
    function cancel() {
      cancelled = true;
      return submitCancel();
    }
    submit.cancel = cancel;
    if (htmlForm.isSubmitting() && options.multipleSubmits == "prevent") {
      cancel();
    } else {
      if (htmlForm.isSubmitting() && options.multipleSubmits == "abort") {
        if (currentRequest)
          currentRequest.abort();
      }
      currentRequest = submit.controller;
      for (const event of formEvents.onSubmit) {
        await event(submit);
      }
    }
    if (cancelled) {
      if (options.flashMessage)
        cancelFlash(options);
    } else {
      const validation = await clientValidation(options, get_store_value(data), get_store_value(formId), get_store_value(constraints), get_store_value(posted));
      if (!validation.valid) {
        cancel();
        const result = {
          type: "failure",
          status: (typeof options.SPA === "boolean" ? void 0 : options.SPA?.failStatus) ?? 400,
          data: { form: validation }
        };
        setTimeout(() => validationResponse({ result }), 0);
      }
      if (!cancelled) {
        switch (options.clearOnSubmit) {
          case "errors-and-message":
            errors.clear();
            message.set(void 0);
            break;
          case "errors":
            errors.clear();
            break;
          case "message":
            message.set(void 0);
            break;
        }
        if (options.flashMessage && (options.clearOnSubmit == "errors-and-message" || options.clearOnSubmit == "message") && shouldSyncFlash(options)) {
          options.flashMessage.module.getFlash(page).set(void 0);
        }
        htmlForm.submitting();
        const submitData = "formData" in submit ? submit.formData : submit.data;
        if (options.SPA) {
          cancel();
          const validationResult = {
            valid: true,
            posted: true,
            errors: {},
            data: get_store_value(data),
            constraints: get_store_value(constraints),
            message: void 0,
            id: get_store_value(formId)
          };
          const result = {
            type: "success",
            status: 200,
            data: { form: validationResult }
          };
          setTimeout(() => validationResponse({ result }), 0);
        } else if (options.dataType === "json") {
          const postData = get_store_value(data);
          const chunks = chunkSubstr(stringify(postData), options.jsonChunkSize ?? 5e5);
          for (const chunk of chunks) {
            submitData.append("__superform_json", chunk);
          }
          Object.keys(postData).forEach((key) => {
            if (typeof submitData.get(key) === "string") {
              submitData.delete(key);
            }
          });
        }
        if (!options.SPA && !submitData.has("__superform_id")) {
          const id = get_store_value(formId);
          if (id !== void 0)
            submitData.set("__superform_id", id);
        }
      }
    }
    function chunkSubstr(str, size) {
      const numChunks = Math.ceil(str.length / size);
      const chunks = new Array(numChunks);
      for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
        chunks[i] = str.substring(o, o + size);
      }
      return chunks;
    }
    async function validationResponse(event) {
      const result = event.result;
      currentRequest = null;
      let cancelled2 = false;
      const data2 = {
        result,
        formEl,
        cancel: () => cancelled2 = true
      };
      for (const event2 of formEvents.onResult) {
        await event2(data2);
      }
      if (!cancelled2) {
        if ((result.type === "success" || result.type == "failure") && result.data) {
          const forms = Context_findValidationForms(result.data);
          if (!forms.length) {
            throw new SuperFormError("No form data returned from ActionResult. Make sure you return { form } in the form actions.");
          }
          for (const newForm of forms) {
            if (newForm.id !== get_store_value(formId))
              continue;
            const data3 = {
              form: newForm,
              formEl,
              cancel: () => cancelled2 = true
            };
            for (const event2 of formEvents.onUpdate) {
              await event2(data3);
            }
          }
        }
        if (!cancelled2) {
          if (result.type !== "error") {
            if (result.type === "success" && options.invalidateAll) {
              await invalidateAll();
            }
            if (options.applyAction) {
              await applyAction();
            } else {
              await Form_updateFromActionResult(result);
            }
          } else {
            if (options.applyAction) {
              if (options.onError == "apply") {
                await applyAction();
              } else {
                ({
                  type: "failure",
                  status: Math.floor(result.status || 500),
                  data: result
                });
                await applyAction();
              }
            }
            if (options.onError !== "apply") {
              const data3 = { result, message };
              for (const event2 of formEvents.onError) {
                if (event2 !== "apply")
                  await event2(data3);
              }
            }
          }
          if (options.flashMessage) {
            if (result.type == "error" && options.flashMessage.onError) {
              await options.flashMessage.onError({
                result,
                message: options.flashMessage.module.getFlash(page)
              });
            }
          }
        }
      }
      if (cancelled2 && options.flashMessage) {
        cancelFlash(options);
      }
      if (cancelled2 || result.type != "redirect") {
        htmlForm.completed(cancelled2);
      }
    }
    return validationResponse;
  });
}
const defaultFormOptions = {
  applyAction: true,
  invalidateAll: true,
  resetForm: false,
  autoFocusOnError: "detect",
  scrollToError: "smooth",
  errorSelector: '[aria-invalid="true"],[data-invalid]',
  selectErrorText: false,
  stickyNavbar: void 0,
  taintedMessage: "Do you want to leave this page? Changes you made may not be saved.",
  onSubmit: void 0,
  onResult: void 0,
  onUpdate: void 0,
  onUpdated: void 0,
  onError: (event) => {
    console.warn("Unhandled Superform error, use onError event to handle it:", event.result.error);
  },
  dataType: "form",
  validators: void 0,
  defaultValidator: "keep",
  clearOnSubmit: "errors-and-message",
  delayMs: 500,
  timeoutMs: 8e3,
  multipleSubmits: "prevent",
  validation: void 0,
  SPA: void 0,
  validateMethod: "auto"
};
function superForm(form, options = {}) {
  {
    options = {
      ...defaultFormOptions,
      ...options
    };
    if (options.SPA && options.validators === void 0) {
      console.warn("No validators set for Superform in SPA mode. Add them to the validators option, or set it to false to disable this warning.");
    }
  }
  let _formId = options.id;
  if (!form || Context_isValidationObject(form) === false) {
    if (options.warnings?.noValidationAndConstraints !== false) {
      console.warn((form ? "Form data sent directly to superForm instead of through superValidate. No initial data validation is made. " : "No form data sent to superForm, schema type safety cannot be guaranteed. ") + "Also, no constraints will exist for the form. Set the warnings.noValidationAndConstraints option to false to disable this warning.");
    }
    form = {
      valid: false,
      posted: false,
      errors: {},
      data: form ?? {},
      constraints: {}
    };
  } else {
    if (_formId === void 0)
      _formId = form.id;
  }
  const postedData = get_store_value(page).form;
  if (postedData && typeof postedData === "object") {
    for (const postedForm of Context_findValidationForms(postedData).reverse()) {
      if (postedForm.id === _formId) {
        const pageDataForm = form;
        form = postedForm;
        if (form.valid && options.resetForm && (options.resetForm === true || options.resetForm())) {
          form = clone$1(pageDataForm);
          form.message = postedForm.message;
        }
        break;
      }
    }
  }
  const form2 = form;
  const initialForm = clone$1(form2);
  if (typeof initialForm.valid !== "boolean") {
    throw new SuperFormError("A non-validation object was passed to superForm. Check what's passed to its first parameter.");
  }
  const _errors = writable(form2.errors);
  const FormId = writable(_formId);
  const Context = {
    taintedMessage: options.taintedMessage,
    taintedFormState: clone$1(initialForm.data)
  };
  function Context_randomId(length = 8) {
    return Math.random().toString(36).substring(2, length + 2);
  }
  function Context_setTaintedFormState(data) {
    Context.taintedFormState = clone$1(data);
  }
  function Context_findValidationForms(data) {
    const forms = Object.values(data).filter((v) => Context_isValidationObject(v) !== false);
    if (forms.length > 1 && options.warnings?.duplicateId !== false) {
      const duplicateId = /* @__PURE__ */ new Set();
      for (const form3 of forms) {
        if (duplicateId.has(form3.id)) {
          console.warn(`Duplicate form id found: "${form3.id}". Multiple forms will receive the same data. Use the id option to differentiate between them, or if this is intended, set warnings.duplicateId option to false to disable this message.`);
        } else {
          duplicateId.add(form3.id);
        }
      }
    }
    return forms;
  }
  function Context_isValidationObject(object) {
    if (!object || typeof object !== "object")
      return false;
    if (!("valid" in object && "errors" in object && typeof object.valid === "boolean")) {
      return false;
    }
    return "id" in object && typeof object.id === "string" ? object.id : void 0;
  }
  function Context_useEnhanceEnabled() {
    options.taintedMessage = Context.taintedMessage;
    if (_formId === void 0)
      FormId.set(Context_randomId());
  }
  function Context_newFormStore(data) {
    const _formData = writable(data);
    return {
      subscribe: _formData.subscribe,
      set: (value, options2 = {}) => {
        Tainted_update(value, Context.taintedFormState, options2.taint ?? true);
        Context.taintedFormState = clone$1(value);
        return _formData.set(value);
      },
      update: (updater, options2 = {}) => {
        return _formData.update((value) => {
          const output = updater(value);
          Tainted_update(output, Context.taintedFormState, options2.taint ?? true);
          Context.taintedFormState = clone$1(value);
          return output;
        });
      }
    };
  }
  const Unsubscriptions = [
    FormId.subscribe((id) => _formId = id)
  ];
  function Unsubscriptions_unsubscribe() {
    Unsubscriptions.forEach((unsub) => unsub());
  }
  const Form = Context_newFormStore(form2.data);
  function Form_checkForNestedData(key, value) {
    if (!value || typeof value !== "object")
      return;
    if (Array.isArray(value)) {
      if (value.length > 0)
        Form_checkForNestedData(key, value[0]);
    } else if (!(value instanceof Date)) {
      throw new SuperFormError(`Object found in form field "${key}". Set options.dataType = 'json' and use:enhance to use nested data structures.`);
    }
  }
  async function Form_updateFromValidation(form3, untaint) {
    if (form3.valid && untaint && options.resetForm && (options.resetForm === true || options.resetForm())) {
      Form_reset(form3.message);
    } else {
      rebind(form3, untaint);
    }
    if (formEvents.onUpdated.length) {
      await tick();
    }
    for (const event of formEvents.onUpdated) {
      event({ form: form3 });
    }
  }
  function Form_reset(message, data, id) {
    const resetData = clone$1(initialForm);
    resetData.data = { ...resetData.data, ...data };
    if (id !== void 0)
      resetData.id = id;
    rebind(resetData, true, message);
  }
  const Form_updateFromActionResult = async (result, untaint) => {
    if (result.type == "error") {
      throw new SuperFormError(`ActionResult of type "${result.type}" cannot be passed to update function.`);
    }
    if (result.type == "redirect") {
      if (options.resetForm && (options.resetForm === true || options.resetForm())) {
        Form_reset();
      }
      return;
    }
    if (typeof result.data !== "object") {
      throw new SuperFormError("Non-object validation data returned from ActionResult.");
    }
    const forms = Context_findValidationForms(result.data);
    if (!forms.length) {
      throw new SuperFormError("No form data returned from ActionResult. Make sure you return { form } in the form actions.");
    }
    for (const newForm of forms) {
      if (newForm.id !== _formId)
        continue;
      await Form_updateFromValidation(newForm, untaint ?? (result.status >= 200 && result.status < 300));
    }
  };
  const LastChanges = writable([]);
  const Message = writable(form2.message);
  const Constraints = writable(form2.constraints);
  const Posted = writable(false);
  const Errors = {
    subscribe: _errors.subscribe,
    set: _errors.set,
    update: _errors.update,
    /**
     * To work with client-side validation, errors cannot be deleted but must
     * be set to undefined, to know where they existed before (tainted+error check in oninput)
     */
    clear: () => clearErrors(_errors, {
      undefinePath: null,
      clearFormLevelErrors: true
    })
  };
  const Tainted = writable();
  async function Tainted__validate(path, taint) {
    if (options.validationMethod == "onblur" || options.validationMethod == "submit-only") {
      return false;
    }
    let shouldValidate = options.validationMethod === "oninput";
    if (!shouldValidate) {
      const errorContent = get_store_value(Errors);
      const errorNode = errorContent ? pathExists(errorContent, path, {
        modifier: (pathData) => {
          if (isInvalidPath(path, pathData)) {
            throw new SuperFormError("Errors can only be added to form fields, not to arrays or objects in the schema. Path: " + pathData.path.slice(0, -1));
          }
          return pathData.value;
        }
      }) : void 0;
      const hasError = errorNode && errorNode.key in errorNode.parent;
      shouldValidate = !!hasError;
    }
    if (shouldValidate) {
      await validateField(path, options, Form, Errors, Tainted, { taint });
      return true;
    } else {
      return false;
    }
  }
  async function Tainted_update(newObj, compareAgainst, taintOptions) {
    if (taintOptions === false) {
      return;
    } else if (taintOptions === "untaint-all") {
      Tainted.set(void 0);
      return;
    }
    let paths = comparePaths(newObj, compareAgainst);
    if (typeof taintOptions === "object") {
      if (typeof taintOptions.fields === "string")
        taintOptions.fields = [taintOptions.fields];
      paths = taintOptions.fields.map((path) => splitPath(path));
      taintOptions = true;
    }
    if (taintOptions === true) {
      LastChanges.set(paths);
    }
    if (paths.length) {
      Tainted.update((tainted) => {
        if (!tainted)
          tainted = {};
        setPaths(tainted, paths, taintOptions === true ? true : void 0);
        return tainted;
      });
      let updated = false;
      for (const path of paths) {
        updated = updated || await Tainted__validate(path, taintOptions);
      }
      if (!updated)
        await validateObjectErrors(options, get_store_value(Form), Errors);
    }
  }
  function Tainted_set(tainted, newData) {
    Tainted.set(tainted);
    Context_setTaintedFormState(newData);
  }
  const Submitting = writable(false);
  const Delayed = writable(false);
  const Timeout = writable(false);
  const AllErrors = derived(Errors, ($errors) => {
    if (!$errors)
      return [];
    return flattenErrors($errors);
  });
  options.taintedMessage = void 0;
  onDestroy(() => {
    Unsubscriptions_unsubscribe();
    for (const events of Object.values(formEvents)) {
      events.length = 0;
    }
  });
  if (options.dataType !== "json") {
    for (const [key, value] of Object.entries(form2.data)) {
      Form_checkForNestedData(key, value);
    }
  }
  function rebind(form3, untaint, message) {
    if (untaint) {
      Tainted_set(typeof untaint === "boolean" ? void 0 : untaint, form3.data);
    }
    message = message ?? form3.message;
    Form.set(form3.data, { taint: false });
    Message.set(message);
    Errors.set(form3.errors);
    FormId.set(form3.id);
    Posted.set(form3.posted);
    if (options.flashMessage && shouldSyncFlash(options)) {
      const flash = options.flashMessage.module.getFlash(page);
      if (message && get_store_value(flash) === void 0) {
        flash.set(message);
      }
    }
  }
  const formEvents = {
    onSubmit: options.onSubmit ? [options.onSubmit] : [],
    onResult: options.onResult ? [options.onResult] : [],
    onUpdate: options.onUpdate ? [options.onUpdate] : [],
    onUpdated: options.onUpdated ? [options.onUpdated] : [],
    onError: options.onError ? [options.onError] : []
  };
  const Fields = Object.fromEntries(Object.keys(initialForm.data).map((key) => {
    return [
      key,
      {
        name: key,
        value: fieldProxy(Form, key),
        errors: fieldProxy(Errors, key),
        constraints: fieldProxy(Constraints, key)
      }
    ];
  }));
  function validate(path, opts) {
    if (path === void 0) {
      return clientValidation(options, get_store_value(Form), _formId, get_store_value(Constraints), false);
    }
    return validateField(splitPath(path), options, Form, Errors, Tainted, opts);
  }
  return {
    form: Form,
    formId: FormId,
    errors: Errors,
    message: Message,
    constraints: Constraints,
    fields: Fields,
    tainted: Tainted,
    submitting: derived(Submitting, ($s) => $s),
    delayed: derived(Delayed, ($d) => $d),
    timeout: derived(Timeout, ($t) => $t),
    options,
    capture: function() {
      return {
        valid: initialForm.valid,
        posted: get_store_value(Posted),
        errors: get_store_value(Errors),
        data: get_store_value(Form),
        constraints: get_store_value(Constraints),
        message: get_store_value(Message),
        id: _formId,
        tainted: get_store_value(Tainted)
      };
    },
    restore: function(snapshot) {
      return rebind(snapshot, snapshot.tainted ?? true);
    },
    validate,
    enhance: (el, events) => {
      if (events) {
        if (events.onError) {
          if (options.onError === "apply") {
            throw new SuperFormError('options.onError is set to "apply", cannot add any onError events.');
          } else if (events.onError === "apply") {
            throw new SuperFormError('Cannot add "apply" as onError event in use:enhance.');
          }
          formEvents.onError.push(events.onError);
        }
        if (events.onResult)
          formEvents.onResult.push(events.onResult);
        if (events.onSubmit)
          formEvents.onSubmit.push(events.onSubmit);
        if (events.onUpdate)
          formEvents.onUpdate.push(events.onUpdate);
        if (events.onUpdated)
          formEvents.onUpdated.push(events.onUpdated);
      }
      return formEnhance(el, Submitting, Delayed, Timeout, Errors, Form_updateFromActionResult, options, Form, Message, Context_useEnhanceEnabled, formEvents, FormId, Constraints, Tainted, LastChanges, Context_findValidationForms, Posted);
    },
    allErrors: AllErrors,
    posted: Posted,
    reset: (options2) => Form_reset(options2?.keepMessage ? get_store_value(Message) : void 0, options2?.data, options2?.id)
  };
}
const css$2 = {
  code: "label.svelte-1ch2xak{display:block;margin-bottom:.5rem;margin-top:.5rem}.invalid.svelte-1ch2xak{color:#cd5c5c}",
  map: null
};
const Checkbox = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let boolValue;
  let $$restProps = compute_rest_props($$props, ["form", "field"]);
  let $boolValue, $$unsubscribe_boolValue = noop, $$subscribe_boolValue = () => ($$unsubscribe_boolValue(), $$unsubscribe_boolValue = subscribe(boolValue, ($$value) => $boolValue = $$value), boolValue);
  let $errors, $$unsubscribe_errors;
  let { form } = $$props;
  let { field } = $$props;
  const { value, errors } = formFieldProxy(form, field);
  $$unsubscribe_errors = subscribe(errors, (value2) => $errors = value2);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  if ($$props.field === void 0 && $$bindings.field && field !== void 0)
    $$bindings.field(field);
  $$result.css.add(css$2);
  $$subscribe_boolValue(boolValue = value);
  $$unsubscribe_boolValue();
  $$unsubscribe_errors();
  return `<label class="svelte-1ch2xak"><input${spread(
    [
      { type: "checkbox" },
      { name: escape_attribute_value(field) },
      { value: "true" },
      escape_object($$restProps)
    ],
    { classes: "svelte-1ch2xak" }
  )}${add_attribute("checked", $boolValue, 1)}> <span class="display-name">${slots.default ? slots.default({}) : ``}</span></label> ${$errors ? `<span class="invalid svelte-1ch2xak">${escape($errors)}</span>` : ``}`;
});
const css$1 = {
  code: "label.svelte-1f6b8ri{margin-bottom:.5rem;margin-top:.5rem}input.svelte-1f6b8ri,label.svelte-1f6b8ri{display:block}input.svelte-1f6b8ri{border:1px solid var(--color-grey-300);border-radius:var(--radius-md);height:2.5rem;min-width:18rem;padding-left:.75rem;padding-right:.75rem;width:100%}.invalid.svelte-1f6b8ri{color:#cd5c5c}",
  map: null
};
const TextInput = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$restProps = compute_rest_props($$props, ["form", "field"]);
  let $errors, $$unsubscribe_errors;
  let $constraints, $$unsubscribe_constraints;
  let $value, $$unsubscribe_value;
  let { form } = $$props;
  let { field } = $$props;
  const { value, errors, constraints } = formFieldProxy(form, field);
  $$unsubscribe_value = subscribe(value, (value2) => $value = value2);
  $$unsubscribe_errors = subscribe(errors, (value2) => $errors = value2);
  $$unsubscribe_constraints = subscribe(constraints, (value2) => $constraints = value2);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  if ($$props.field === void 0 && $$bindings.field && field !== void 0)
    $$bindings.field(field);
  $$result.css.add(css$1);
  $$unsubscribe_errors();
  $$unsubscribe_constraints();
  $$unsubscribe_value();
  return `<label class="svelte-1f6b8ri"><span class="display-name">${slots.default ? slots.default({}) : ``}</span> <input${spread(
    [
      { name: escape_attribute_value(field) },
      { type: "text" },
      {
        "aria-invalid": escape_attribute_value($errors ? "true" : void 0)
      },
      escape_object($constraints),
      escape_object($$restProps)
    ],
    { classes: "svelte-1f6b8ri" }
  )}${add_attribute("value", $value, 0)}></label> ${$errors ? `<span class="invalid svelte-1f6b8ri">${escape($errors)}</span>` : ``}`;
});
const css = {
  code: "form.svelte-fhfcdl{width:44rem}.field.svelte-fhfcdl{background:var(--color-blue-transp-760);padding:1rem 2rem}",
  map: null
};
const UsernameScreen = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  const form = superForm(data);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  return `${validate_component(Board, "Board").$$render($$result, { paddedContent: true }, {}, {
    default: () => {
      return `${validate_component(Heading, "Heading").$$render($$result, { separator: true }, {}, {
        info: () => {
          return `Schritt 1 von 3`;
        },
        default: () => {
          return `Username vergeben`;
        }
      })} ${validate_component(Paragraph, "Paragraph").$$render($$result, {}, {}, {
        default: () => {
          return `Willkommen zum Online-Spiel The Hidden Threat*. Gleich geht es los. Nach der Vergabe des
    Usernamen werden Sie in die Lobby geleitet.`;
        }
      })} <form method="post" class="svelte-fhfcdl"><div class="field svelte-fhfcdl">${validate_component(Heading, "Heading").$$render($$result, { centered: true }, {}, {
        default: () => {
          return `Dein Username`;
        }
      })} ${validate_component(Paragraph, "Paragraph").$$render($$result, {}, {}, {
        default: () => {
          return `Bitte gib Dir einen Username mit maximal 20 Buchstaben.`;
        }
      })} ${validate_component(TextInput, "TextInput").$$render(
        $$result,
        {
          form,
          field: "userName",
          placeholder: "z.B. Vor-und Nachname, Spitzname, Initalen, etc."
        },
        {},
        {}
      )}</div> ${validate_component(Checkbox, "Checkbox").$$render($$result, { form, field: "acceptedTos" }, {}, {
        default: () => {
          return `Hiermit stimme ich der Speicherung meiner eingegebenen Daten zu und bestätige dass ich
      mindestens 18 Jahre alt bin.*`;
        }
      })} ${validate_component(Actions, "Actions").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Button, "Button").$$render($$result, { href: "/" }, {}, {
            default: () => {
              return `Abbrechen`;
            }
          })} ${validate_component(Button, "Button").$$render($$result, { type: "submit", primary: true }, {}, {
            default: () => {
              return `Start`;
            }
          })}`;
        }
      })}</form>`;
    }
  })}`;
});

export { UsernameScreen as U };
//# sourceMappingURL=UsernameScreen-046bb215.js.map
