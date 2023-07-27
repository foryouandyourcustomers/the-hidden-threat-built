import { c as create_ssr_component, d as add_attribute, e as escape, x as null_to_empty } from './ssr-6cc58d58.js';

const void_element_names = /^(?:area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/;
function is_void(name) {
  return void_element_names.test(name) || name.toLowerCase() === "!doctype";
}
const css = {
  code: ".button.svelte-9pgjp3{--_padding-inline:1.5rem;--_scale:var(--scale-2);--_color-text:var(--color-text);--_color-bg:transparent;--_color-bg-hover:var(--color-bg-hover);--_color-border:var(--color-border);--_radius:var(--radius-full);--_height:3rem;align-items:center;background-color:transparent;background-color:var(--_color-bg);border:.125rem solid var(--_color-border);border-radius:var(--radius-full);border-radius:var(--_radius);color:var(--color-text);color:var(--_color-text);cursor:pointer;display:inline-flex;font-family:BarlowCondensed,sans-serif;font-size:var(--scale-2);font-size:var(--_scale);font-weight:var(--weight-semibold);gap:.5em;height:3rem;height:var(--_height);justify-content:center;padding-left:1.5rem;padding-left:var(--_padding-inline);padding-right:1.5rem;padding-right:var(--_padding-inline);-webkit-text-decoration:none;text-decoration:none;text-transform:uppercase;white-space:nowrap}.button.svelte-9pgjp3:hover{background-color:var(--_color-bg-hover);box-shadow:0 0 6px var(--color-shadow)}.button.primary.svelte-9pgjp3{--_color-bg:var(--color-bg-contrast);--_color-bg-hover:var(--color-bg-contrast);--_color-text:var(--color-text-oncontrast)}.button.big.svelte-9pgjp3{--_height:3rem;--_padding-inline:1.5rem}.button.small.svelte-9pgjp3{--_height:2.5rem;--_padding-inline:1.5rem}.button[disabled].svelte-9pgjp3{--_color-text:var(--color-grey-300);--_color-bg:var(--color-grey-500);cursor:not-allowed}.button.accent[disabled].svelte-9pgjp3{--_color-text:var(--color-grey-400);--_color-bg:var(--color-grey-600)}",
  map: null
};
const Button = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "default" } = $$props;
  let { disabled = false } = $$props;
  let { disabledReason = void 0 } = $$props;
  let { primary = false } = $$props;
  let { href = void 0 } = $$props;
  let { title = void 0 } = $$props;
  let { target = void 0 } = $$props;
  let { type = void 0 } = $$props;
  let { tabIndex = 0 } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.disabledReason === void 0 && $$bindings.disabledReason && disabledReason !== void 0)
    $$bindings.disabledReason(disabledReason);
  if ($$props.primary === void 0 && $$bindings.primary && primary !== void 0)
    $$bindings.primary(primary);
  if ($$props.href === void 0 && $$bindings.href && href !== void 0)
    $$bindings.href(href);
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.target === void 0 && $$bindings.target && target !== void 0)
    $$bindings.target(target);
  if ($$props.type === void 0 && $$bindings.type && type !== void 0)
    $$bindings.type(type);
  if ($$props.tabIndex === void 0 && $$bindings.tabIndex && tabIndex !== void 0)
    $$bindings.tabIndex(tabIndex);
  $$result.css.add(css);
  return ` ${((tag) => {
    return tag ? `<${href ? "a" : "button"} role="button"${add_attribute("tabindex", tabIndex, 0)} class="${[
      escape(null_to_empty(`button ${size}`), true) + " svelte-9pgjp3",
      primary ? "primary" : ""
    ].join(" ").trim()}"${add_attribute("title", disabled && disabledReason ? disabledReason : title, 0)}${add_attribute("type", type, 0)}${add_attribute("target", target, 0)}${add_attribute("href", href, 0)} ${(disabled ? true : void 0) ? "disabled" : ""}>${is_void(tag) ? "" : `${slots.default ? slots.default({}) : `Press me`}`}${is_void(tag) ? "" : `</${tag}>`}` : "";
  })(href ? "a" : "button")} `;
});

export { Button as B, is_void as i };
//# sourceMappingURL=Button-a5ee912b.js.map