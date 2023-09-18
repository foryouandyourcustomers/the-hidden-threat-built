import { c as create_ssr_component, e as escape, f as add_attribute, j as compute_slots } from './ssr-35980408.js';
import { i as is_void } from './names-11b10067.js';

const css = {
  code: ".heading.svelte-1e60ca5.svelte-1e60ca5{align-items:flex-end;display:flex;justify-content:space-between;margin:0}.heading.spacing-default.svelte-1e60ca5.svelte-1e60ca5{margin-bottom:1.25rem}.heading.separator.svelte-1e60ca5.svelte-1e60ca5{border-bottom:var(--px) solid var(--color-border);padding-bottom:.75rem}.heading.centered.svelte-1e60ca5.svelte-1e60ca5{justify-content:center}.heading.svelte-1e60ca5 .h.svelte-1e60ca5{font-family:var(--font-display);font-weight:500;text-transform:uppercase}.heading.size-xl.svelte-1e60ca5 .h.svelte-1e60ca5{font:var(--display-h1)}.heading.size-lg.svelte-1e60ca5 .h.svelte-1e60ca5{font:var(--display-h2)}.heading.size-md.svelte-1e60ca5 .h.svelte-1e60ca5{font:var(--display-h3)}.heading.size-sm.svelte-1e60ca5 .h.svelte-1e60ca5{font:var(--display-h4);text-transform:none}.heading.svelte-1e60ca5 .info.svelte-1e60ca5{font-size:var(--scale-00)}",
  map: null
};
const Heading = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$slots = compute_slots(slots);
  let { size = "lg" } = $$props;
  let { id = void 0 } = $$props;
  let { separator = false } = $$props;
  let { centered = false } = $$props;
  let { tag = void 0 } = $$props;
  let { spacing = "default" } = $$props;
  const defaultSizeTags = { xl: "h1", lg: "h2", md: "h3", sm: "h4" };
  if (!tag)
    tag = defaultSizeTags[size];
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.id === void 0 && $$bindings.id && id !== void 0)
    $$bindings.id(id);
  if ($$props.separator === void 0 && $$bindings.separator && separator !== void 0)
    $$bindings.separator(separator);
  if ($$props.centered === void 0 && $$bindings.centered && centered !== void 0)
    $$bindings.centered(centered);
  if ($$props.tag === void 0 && $$bindings.tag && tag !== void 0)
    $$bindings.tag(tag);
  if ($$props.spacing === void 0 && $$bindings.spacing && spacing !== void 0)
    $$bindings.spacing(spacing);
  $$result.css.add(css);
  return `<div class="${[
    "heading size-" + escape(size, true) + " spacing-" + escape(spacing, true) + " svelte-1e60ca5",
    (separator ? "separator" : "") + " " + (centered ? "centered" : "")
  ].join(" ").trim()}">${((tag$1) => {
    return tag$1 ? `<${tag}${add_attribute("id", id, 0)} class="h svelte-1e60ca5">${is_void(tag$1) ? "" : `${slots.default ? slots.default({}) : ``}`}${is_void(tag$1) ? "" : `</${tag$1}>`}` : "";
  })(tag)} ${$$slots.info ? `<div class="info svelte-1e60ca5">${slots.info ? slots.info({}) : ``}</div>` : ``} </div>`;
});

export { Heading as H };
//# sourceMappingURL=Heading-3f0b5004.js.map
