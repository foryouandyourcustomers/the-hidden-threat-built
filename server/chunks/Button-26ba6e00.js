import { c as create_ssr_component, v as validate_component, f as add_attribute, e as escape, x as null_to_empty } from './ssr-b0d2ddaa.js';
import { i as is_void } from './names-11b10067.js';

const css$1 = {
  code: "div.svelte-wowoyz{display:inline-block}",
  map: null
};
const Tooltip = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { title } = $$props;
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  $$result.css.add(css$1);
  return `${title ? `<div class="svelte-wowoyz">${slots.default ? slots.default({}) : ``}</div>` : `${slots.default ? slots.default({}) : ``}`}`;
});
const css = {
  code: ".button.svelte-5eu5ku{--_padding-inline:1.5rem;--_scale:var(--scale-2);--_color-text:var(--color-text);--_color-bg:transparent;--_color-bg-hover:var(--color-blue-transparent);--_color-border:var(--color-border);--_radius:var(--radius-full);--_height:3rem;align-items:center;background-color:transparent;background-color:var(--_color-bg);border:.125rem solid var(--_color-border);border-radius:var(--radius-full);border-radius:var(--_radius);color:var(--color-text);color:var(--_color-text);cursor:pointer;display:inline-flex;font-family:BarlowCondensed,sans-serif;font-size:var(--scale-2);font-size:var(--_scale);font-weight:var(--weight-semibold);gap:.5em;height:3rem;height:var(--_height);justify-content:center;padding-left:1.5rem;padding-left:var(--_padding-inline);padding-right:1.5rem;padding-right:var(--_padding-inline);-webkit-text-decoration:none;text-decoration:none;text-transform:uppercase;white-space:nowrap}.button.svelte-5eu5ku:hover:not([disabled]){background-color:var(--_color-bg-hover);box-shadow:0 0 6px var(--color-shadow)}.button.primary.svelte-5eu5ku{--_color-bg:var(--color-bg-strong);--_color-bg-hover:var(--color-bg-strong);--_color-text:var(--color-text-onstrong);--_color-border:transparent}.button.big.svelte-5eu5ku{--_height:3rem;--_padding-inline:1.5rem}.button.small.svelte-5eu5ku{--_height:2.5rem;--_padding-inline:1.5rem}.button[disabled].svelte-5eu5ku{--_color-text:var(--color-text-disabled);--_color-border:var(--color-border-disabled);cursor:not-allowed;opacity:.6;pointer-events:none}.button.primary[disabled].svelte-5eu5ku{--_color-text:var(--color-text-disabled-onstrong);--_color-bg:var(--color-bg-disabled-strong);--_color-border:transparent}",
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
  return ` ${validate_component(Tooltip, "Tooltip").$$render(
    $$result,
    {
      title: disabled && disabledReason ? disabledReason : title
    },
    {},
    {
      default: () => {
        return `${((tag) => {
          return tag ? `<${href ? "a" : "button"} role="button"${add_attribute("tabindex", tabIndex, 0)} class="${[
            escape(null_to_empty(`button ${size}`), true) + " svelte-5eu5ku",
            primary ? "primary" : ""
          ].join(" ").trim()}"${add_attribute("type", type, 0)}${add_attribute("target", target, 0)}${add_attribute("href", href, 0)} ${(disabled ? true : void 0) ? "disabled" : ""}>${is_void(tag) ? "" : `${slots.default ? slots.default({}) : `Press me`}`}${is_void(tag) ? "" : `</${tag}>`}` : "";
        })(href ? "a" : "button")}`;
      }
    }
  )} `;
});

export { Button as B };
//# sourceMappingURL=Button-26ba6e00.js.map
