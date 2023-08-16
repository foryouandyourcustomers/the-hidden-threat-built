import { c as create_ssr_component, e as escape, f as add_attribute, j as compute_slots } from './ssr-d73c8ffd.js';
import { i as is_void } from './names-11b10067.js';

const css = {
  code: ".heading.svelte-jqkl8t.svelte-jqkl8t{align-items:flex-end;display:flex;justify-content:space-between;margin:0 0 1.25rem}.heading.separator.svelte-jqkl8t.svelte-jqkl8t{border-bottom:var(--px) solid var(--color-border);padding-bottom:.75rem}.heading.centered.svelte-jqkl8t.svelte-jqkl8t{justify-content:center}.heading.svelte-jqkl8t .h.svelte-jqkl8t{font-family:var(--font-display);font-weight:500;text-transform:uppercase}.heading.size-xl.svelte-jqkl8t .h.svelte-jqkl8t{font:var(--display-h1)}.heading.size-lg.svelte-jqkl8t .h.svelte-jqkl8t{font:var(--display-h2)}.heading.size-md.svelte-jqkl8t .h.svelte-jqkl8t{font:var(--display-h3)}.heading.size-sm.svelte-jqkl8t .h.svelte-jqkl8t{font:var(--display-h4)}.heading.svelte-jqkl8t .info.svelte-jqkl8t{font-size:var(--scale-00)}",
  map: null
};
const Heading = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $$slots = compute_slots(slots);
  let { size = "lg" } = $$props;
  let { id = void 0 } = $$props;
  let { separator = false } = $$props;
  let { centered = false } = $$props;
  let { tag = void 0 } = $$props;
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
  $$result.css.add(css);
  return `<div class="${[
    "heading size-" + escape(size, true) + " svelte-jqkl8t",
    (separator ? "separator" : "") + " " + (centered ? "centered" : "")
  ].join(" ").trim()}">${((tag$1) => {
    return tag$1 ? `<${tag}${add_attribute("id", id, 0)} class="h svelte-jqkl8t">${is_void(tag$1) ? "" : `${slots.default ? slots.default({}) : ``}`}${is_void(tag$1) ? "" : `</${tag$1}>`}` : "";
  })(tag)} ${$$slots.info ? `<div class="info svelte-jqkl8t">${slots.info ? slots.info({}) : ``}</div>` : ``} </div>`;
});

export { Heading as H };
//# sourceMappingURL=Heading-c28dca20.js.map
