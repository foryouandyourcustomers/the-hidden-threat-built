import { c as create_ssr_component, d as add_attribute, e as escape, t as null_to_empty } from './ssr-3cdd5219.js';

const void_element_names = /^(?:area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/;
function is_void(name) {
  return void_element_names.test(name) || name.toLowerCase() === "!doctype";
}
const css = {
  code: ".button.svelte-18mr3rm{--_padding-inline:var(--size-4);--_scale:var(--scale-0);--_color-text:var(--color-grey-900);--_color-background:var(--color-grey-100);--_color-hover-background:var(--color-grey-200);--_radius:var(--radius-sm);--_height:var(--size-10);align-items:center;background-color:var(--color-grey-100);background-color:var(--_color-background);border:none;border-radius:var(--radius-sm);border-radius:var(--_radius);color:var(--color-grey-900);color:var(--_color-text);cursor:pointer;display:inline-flex;font-size:var(--scale-0);font-size:var(--_scale);font-weight:var(--weight-semibold);gap:.5em;height:var(--size-10);height:var(--_height);justify-content:center;padding-left:var(--_padding-inline);padding-right:var(--_padding-inline);-webkit-text-decoration:none;text-decoration:none;white-space:nowrap}.button.svelte-18mr3rm:hover{background-color:var(--_color-hover-background)}.button.accent.svelte-18mr3rm{--_color-background:var(--color-blue-700);--_color-hover-background:var(--color-blue-500);--_color-text:#fff}.button.big.svelte-18mr3rm{--_height:var(--size-12);--_padding-inline:var(--size-6)}.button.small.svelte-18mr3rm{--_height:var(--size-8);--_padding-inline:var(--size-3)}.button[disabled].svelte-18mr3rm{--_color-text:var(--color-grey-300);--_color-background:var(--color-grey-500);cursor:not-allowed}.button.accent[disabled].svelte-18mr3rm{--_color-text:var(--color-grey-400);--_color-background:var(--color-grey-600)}",
  map: null
};
const Button = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "default" } = $$props;
  let { disabled = false } = $$props;
  let { accent = false } = $$props;
  let { href = void 0 } = $$props;
  let { title = void 0 } = $$props;
  let { target = void 0 } = $$props;
  let { type = void 0 } = $$props;
  let { tabIndex = 0 } = $$props;
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.disabled === void 0 && $$bindings.disabled && disabled !== void 0)
    $$bindings.disabled(disabled);
  if ($$props.accent === void 0 && $$bindings.accent && accent !== void 0)
    $$bindings.accent(accent);
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
      escape(null_to_empty(`button ${size}`), true) + " svelte-18mr3rm",
      accent ? "accent" : ""
    ].join(" ").trim()}"${add_attribute("type", type, 0)}${add_attribute("target", target, 0)}${add_attribute("title", title, 0)}${add_attribute("href", href, 0)} ${(disabled ? true : void 0) ? "disabled" : ""}>${is_void(tag) ? "" : `${slots.default ? slots.default({}) : `Press me`}`}${is_void(tag) ? "" : `</${tag}>`}` : "";
  })(href ? "a" : "button")} `;
});

export { Button as B };
//# sourceMappingURL=Button-0c8fd717.js.map
