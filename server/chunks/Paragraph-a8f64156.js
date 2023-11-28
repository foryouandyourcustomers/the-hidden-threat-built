import { c as create_ssr_component, e as escape, f as add_attribute, z as null_to_empty, v as validate_component, o as onDestroy } from './ssr-ea380d77.js';
import { i as is_void } from './Heading-86ff148c.js';

const css$3 = {
  code: ".actions.svelte-1qhg7f{align-items:center;display:flex;gap:1rem}.actions.spacing-default.svelte-1qhg7f{margin-top:2.5rem}.actions.spacing-dialog.svelte-1qhg7f{margin-top:1.5rem}.actions.align-left.svelte-1qhg7f{justify-content:flex-start}.actions.align-right.svelte-1qhg7f{justify-content:flex-end}",
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
  return `<div class="${"actions align-" + escape(align, true) + " spacing-" + escape(spacing, true) + " svelte-1qhg7f"}">${slots.default ? slots.default({}) : ``} </div>`;
});
const css$2 = {
  code: ".tooltip.svelte-1m2u9oj.svelte-1m2u9oj{--_offset:calc(100% + 1rem);background:#fff;border-radius:var(--radius-sm);box-shadow:0 0 10px 0 rgba(38,45,46,.25);color:#000;cursor:auto;font:var(--text-regular);font-size:var(--scale-00);max-width:30ch;opacity:0;padding:.75rem;pointer-events:none;position:absolute;text-transform:none;transition:opacity .1s ease-in-out;white-space:normal;width:-moz-max-content;width:max-content;z-index:var(--layer-top)}.tooltip.visible.svelte-1m2u9oj.svelte-1m2u9oj{opacity:1;pointer-events:inherit}.tooltip.left.svelte-1m2u9oj.svelte-1m2u9oj,.tooltip.right.svelte-1m2u9oj.svelte-1m2u9oj{top:50%;transform:translateY(-50%)}.tooltip.bottom.svelte-1m2u9oj.svelte-1m2u9oj,.tooltip.top.svelte-1m2u9oj.svelte-1m2u9oj{left:50%;transform:translateX(-50%)}.tooltip.left.svelte-1m2u9oj.svelte-1m2u9oj{right:var(--_offset)}.tooltip.right.svelte-1m2u9oj.svelte-1m2u9oj{left:var(--_offset)}.tooltip.top.svelte-1m2u9oj.svelte-1m2u9oj{bottom:var(--_offset)}.tooltip.bottom.svelte-1m2u9oj.svelte-1m2u9oj{top:var(--_offset)}.arrow.svelte-1m2u9oj.svelte-1m2u9oj{--_size:0.875rem;--_offset:-0.85rem;display:block;height:.875rem;height:var(--_size);position:absolute;width:.875rem;width:var(--_size)}.tooltip.left.svelte-1m2u9oj .arrow.svelte-1m2u9oj,.tooltip.right.svelte-1m2u9oj .arrow.svelte-1m2u9oj{top:50%;translate:0 -50%}.tooltip.bottom.svelte-1m2u9oj .arrow.svelte-1m2u9oj,.tooltip.top.svelte-1m2u9oj .arrow.svelte-1m2u9oj{left:50%;translate:-50% 0}.tooltip.left.svelte-1m2u9oj .arrow.svelte-1m2u9oj{right:var(--_offset);rotate:-90deg}.tooltip.bottom.svelte-1m2u9oj .arrow.svelte-1m2u9oj{rotate:.5turn;top:var(--_offset)}.tooltip.right.svelte-1m2u9oj .arrow.svelte-1m2u9oj{left:var(--_offset);rotate:90deg}.tooltip.top.svelte-1m2u9oj .arrow.svelte-1m2u9oj{bottom:var(--_offset)}",
  map: null
};
const Tooltip = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { position = "bottom" } = $$props;
  let { click = false } = $$props;
  let visible = false;
  let tooltipElement;
  const onKeyDown = (event) => {
    if (click && visible && event.key === "Escape") {
      visible = false;
    }
  };
  const onDocumentClick = (event) => {
    tooltipElement.parentElement;
    return;
  };
  onDestroy(() => {
    document.removeEventListener("click", onDocumentClick, true);
    document.removeEventListener("keydown", onKeyDown, true);
  });
  if ($$props.position === void 0 && $$bindings.position && position !== void 0)
    $$bindings.position(position);
  if ($$props.click === void 0 && $$bindings.click && click !== void 0)
    $$bindings.click(click);
  $$result.css.add(css$2);
  {
    if (visible && click) {
      document.addEventListener("click", onDocumentClick, true);
      document.addEventListener("keydown", onKeyDown, true);
    } else if (click) {
      document.removeEventListener("click", onDocumentClick, true);
      document.removeEventListener("keydown", onKeyDown, true);
    }
  }
  return `<div role="dialog" class="${[
    "tooltip " + escape(position, true) + " svelte-1m2u9oj",
    visible ? "visible" : ""
  ].join(" ").trim()}"${add_attribute("this", tooltipElement, 0)}>${slots.default ? slots.default({}) : ``} <svg class="arrow svelte-1m2u9oj" width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><path d="M14 0H0L5.3 8.3C5.47937 8.58942 5.72965 8.82826 6.02715 8.99388C6.32465 9.1595 6.65951 9.24643 7 9.24643C7.34049 9.24643 7.67535 9.1595 7.97285 8.99388C8.27035 8.82826 8.52063 8.58942 8.7 8.3L14 0Z" fill="white"></path></svg> </div>`;
});
const css$1 = {
  code: ".button.svelte-1prqtzp{--_padding-inline:1.5rem;--_scale:var(--scale-2);--_color-text:var(--color-text);--_color-bg:transparent;--_color-bg-hover:var(--color-blue-transparent);--_color-border:var(--color-border);--_radius:var(--radius-full);--_height:3rem;align-items:center;background-color:transparent;background-color:var(--_color-bg);border:.125rem solid var(--_color-border);border-radius:var(--radius-full);border-radius:var(--_radius);color:var(--color-text);color:var(--_color-text);cursor:pointer;display:inline-flex;font-family:BarlowCondensed,sans-serif;font-size:var(--scale-2);font-size:var(--_scale);font-weight:var(--weight-semibold);gap:.5em;height:3rem;height:var(--_height);justify-content:center;padding-left:1.5rem;padding-left:var(--_padding-inline);padding-right:1.5rem;padding-right:var(--_padding-inline);position:relative;-webkit-text-decoration:none;text-decoration:none;text-transform:uppercase;white-space:nowrap}.button.svelte-1prqtzp:hover:not([disabled]){background-color:var(--_color-bg-hover);box-shadow:0 0 6px var(--color-shadow)}.button.primary.svelte-1prqtzp{--_color-bg:var(--color-bg-strong);--_color-bg-hover:var(--color-bg-strong);--_color-text:var(--color-text-onstrong);--_color-border:transparent}.button.inverse.svelte-1prqtzp{--_color-bg:var(--color-bg);--_color-bg-hover:var(--color-bg-secondary);--_color-text:var(--color-text);--_color-border:transparent}.button.big.svelte-1prqtzp{--_height:3rem;--_padding-inline:1.5rem}.button.small.svelte-1prqtzp{--_height:2.5rem;--_padding-inline:1.5rem}.button[disabled].svelte-1prqtzp{--_color-text:var(--color-text-disabled);background:color-mix(in oklab,var(--_color-bg),transparent 40%);cursor:not-allowed}.button.primary[disabled].svelte-1prqtzp{--_color-text:var(--color-text-disabled-onstrong);--_color-bg:var(--color-bg-disabled-strong);--_color-border:transparent}.button.svelte-1prqtzp:focus-visible{outline:3px solid hsla(0,0%,100%,.533)}",
  map: null
};
const Button = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let tooltipText;
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
  tooltipText = disabled && disabledReason ? disabledReason : title;
  return ` ${((tag) => {
    return tag ? `<${href ? "a" : "button"} role="button"${add_attribute("tabindex", tabIndex, 0)} class="${[
      escape(null_to_empty(`button ${size}`), true) + " svelte-1prqtzp",
      (primary ? "primary" : "") + " " + (inverse ? "inverse" : "")
    ].join(" ").trim()}"${add_attribute("type", type, 0)}${add_attribute("target", target, 0)}${add_attribute("href", href, 0)} ${(disabled ? true : void 0) ? "disabled" : ""}>${is_void(tag) ? "" : `${slots.default ? slots.default({}) : `Press me`} ${tooltipText ? `${validate_component(Tooltip, "Tooltip").$$render($$result, { position: "left" }, {}, {
      default: () => {
        return `${escape(tooltipText)}`;
      }
    })}` : ``}`}${is_void(tag) ? "" : `</${tag}>`}` : "";
  })(href ? "a" : "button")} `;
});
const css = {
  code: "p.svelte-15t6izl{margin:0}p.width-default.svelte-15t6izl{max-width:44rem}p.spacing-default.svelte-15t6izl{margin-bottom:1.5rem;margin-top:1.5rem}.centered.svelte-15t6izl{margin-left:auto;margin-right:auto;text-align:center}.size-md.svelte-15t6izl{font:var(--text-regular)}.size-lg.svelte-15t6izl{font:var(--text-big)}.size-sm.svelte-15t6izl,.size-xs.svelte-15t6izl{font:var(--text-small)}.size-xs.svelte-15t6izl{font-size:var(--scale-000)}",
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
    "size-" + escape(size, true) + " width-" + escape(width, true) + " spacing-" + escape(spacing, true) + " svelte-15t6izl",
    centered ? "centered" : ""
  ].join(" ").trim()}">${slots.default ? slots.default({}) : ``}</p>`;
});

export { Actions as A, Button as B, Paragraph as P, Tooltip as T };
//# sourceMappingURL=Paragraph-a8f64156.js.map
