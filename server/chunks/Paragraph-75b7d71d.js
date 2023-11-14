import { c as create_ssr_component, e as escape, v as validate_component, f as add_attribute, z as null_to_empty } from './ssr-efd797e6.js';
import { i as is_void } from './Heading-2db5e692.js';

const css$3 = {
  code: ".actions.svelte-18kw5m4{align-items:center;display:flex;gap:1rem}.actions.spacing-default.svelte-18kw5m4{margin-top:2.5rem}.actions.align-left.svelte-18kw5m4{justify-content:flex-start}.actions.align-right.svelte-18kw5m4{justify-content:flex-end}",
  map: null
};
const Actions = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { align = "right" } = $$props;
  let { spacing = "default" } = $$props;
  if ($$props.align === void 0 && $$bindings.align && align !== void 0)
    $$bindings.align(align);
  if ($$props.spacing === void 0 && $$bindings.spacing && spacing !== void 0)
    $$bindings.spacing(spacing);
  $$result.css.add(css$3);
  return `<div class="${"actions align-" + escape(align, true) + " spacing-" + escape(spacing, true) + " svelte-18kw5m4"}">${slots.default ? slots.default({}) : ``} </div>`;
});
const css$2 = {
  code: "div.svelte-wowoyz{display:inline-block}",
  map: null
};
const Tooltip = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { title } = $$props;
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  $$result.css.add(css$2);
  return `${title ? `<div class="svelte-wowoyz">${slots.default ? slots.default({}) : ``}</div>` : `${slots.default ? slots.default({}) : ``}`}`;
});
const css$1 = {
  code: ".button.svelte-1xo80rn{--_padding-inline:1.5rem;--_scale:var(--scale-2);--_color-text:var(--color-text);--_color-bg:transparent;--_color-bg-hover:var(--color-blue-transparent);--_color-border:var(--color-border);--_radius:var(--radius-full);--_height:3rem;align-items:center;background-color:transparent;background-color:var(--_color-bg);border:.125rem solid var(--_color-border);border-radius:var(--radius-full);border-radius:var(--_radius);color:var(--color-text);color:var(--_color-text);cursor:pointer;display:inline-flex;font-family:BarlowCondensed,sans-serif;font-size:var(--scale-2);font-size:var(--_scale);font-weight:var(--weight-semibold);gap:.5em;height:3rem;height:var(--_height);justify-content:center;padding-left:1.5rem;padding-left:var(--_padding-inline);padding-right:1.5rem;padding-right:var(--_padding-inline);-webkit-text-decoration:none;text-decoration:none;text-transform:uppercase;white-space:nowrap}.button.svelte-1xo80rn:hover:not([disabled]){background-color:var(--_color-bg-hover);box-shadow:0 0 6px var(--color-shadow)}.button.primary.svelte-1xo80rn{--_color-bg:var(--color-bg-strong);--_color-bg-hover:var(--color-bg-strong);--_color-text:var(--color-text-onstrong);--_color-border:transparent}.button.inverse.svelte-1xo80rn{--_color-bg:var(--color-bg);--_color-bg-hover:var(--color-bg-secondary);--_color-text:var(--color-text);--_color-border:transparent}.button.big.svelte-1xo80rn{--_height:3rem;--_padding-inline:1.5rem}.button.small.svelte-1xo80rn{--_height:2.5rem;--_padding-inline:1.5rem}.button[disabled].svelte-1xo80rn{--_color-text:var(--color-text-disabled);--_color-border:var(--color-border-disabled);cursor:not-allowed;opacity:.6;pointer-events:none}.button.primary[disabled].svelte-1xo80rn{--_color-text:var(--color-text-disabled-onstrong);--_color-bg:var(--color-bg-disabled-strong);--_color-border:transparent}",
  map: null
};
const Button = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { size = "default" } = $$props;
  let { disabled = false } = $$props;
  let { disabledReason = void 0 } = $$props;
  let { primary = false } = $$props;
  let { inverse = false } = $$props;
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
  if ($$props.inverse === void 0 && $$bindings.inverse && inverse !== void 0)
    $$bindings.inverse(inverse);
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
  $$result.css.add(css$1);
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
            escape(null_to_empty(`button ${size}`), true) + " svelte-1xo80rn",
            (primary ? "primary" : "") + " " + (inverse ? "inverse" : "")
          ].join(" ").trim()}"${add_attribute("type", type, 0)}${add_attribute("target", target, 0)}${add_attribute("href", href, 0)} ${(disabled ? true : void 0) ? "disabled" : ""}>${is_void(tag) ? "" : `${slots.default ? slots.default({}) : `Press me`}`}${is_void(tag) ? "" : `</${tag}>`}` : "";
        })(href ? "a" : "button")}`;
      }
    }
  )} `;
});
const css = {
  code: "p.svelte-75njxh{margin:0}p.width-default.svelte-75njxh{max-width:44rem}p.spacing-default.svelte-75njxh{margin-bottom:1.5rem;margin-top:1.5rem}.centered.svelte-75njxh{margin-left:auto;margin-right:auto;text-align:center}.size-md.svelte-75njxh{font:var(--text-regular)}.size-lg.svelte-75njxh{font:var(--text-big)}.size-sm.svelte-75njxh{font:var(--text-small)}",
  map: null
};
const Paragraph = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { centered = false } = $$props;
  let { size = "md" } = $$props;
  let { width = "default" } = $$props;
  let { spacing = "default" } = $$props;
  if ($$props.centered === void 0 && $$bindings.centered && centered !== void 0)
    $$bindings.centered(centered);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.spacing === void 0 && $$bindings.spacing && spacing !== void 0)
    $$bindings.spacing(spacing);
  $$result.css.add(css);
  return `<p class="${[
    "size-" + escape(size, true) + " width-" + escape(width, true) + " spacing-" + escape(spacing, true) + " svelte-75njxh",
    centered ? "centered" : ""
  ].join(" ").trim()}">${slots.default ? slots.default({}) : ``}</p>`;
});

export { Actions as A, Button as B, Paragraph as P };
//# sourceMappingURL=Paragraph-75b7d71d.js.map
