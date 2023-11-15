import { c as create_ssr_component, e as escape, f as add_attribute, l as compute_slots } from './ssr-53fe64ef.js';

const void_element_names = /^(?:area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/;
function is_void(name) {
  return void_element_names.test(name) || name.toLowerCase() === "!doctype";
}
const css = {
  code: ".heading.svelte-3cb6w2.svelte-3cb6w2{align-items:flex-end;display:flex;justify-content:space-between;margin:0}.heading.spacing-default.svelte-3cb6w2.svelte-3cb6w2{margin-bottom:1.25rem}.heading.separator.svelte-3cb6w2.svelte-3cb6w2{border-bottom:var(--px) solid var(--color-border);padding-bottom:.75rem}.heading.centered.svelte-3cb6w2.svelte-3cb6w2{justify-content:center}.heading.svelte-3cb6w2 .h.svelte-3cb6w2{font-family:var(--font-display);font-weight:500;text-transform:uppercase}.heading.size-xl.svelte-3cb6w2 .h.svelte-3cb6w2{font:var(--display-h1)}.heading.size-lg.svelte-3cb6w2 .h.svelte-3cb6w2{font:var(--display-h2)}.heading.size-md.svelte-3cb6w2 .h.svelte-3cb6w2{font:var(--display-h3)}.heading.size-sm.svelte-3cb6w2 .h.svelte-3cb6w2{font:var(--display-h4);text-transform:none}.heading.size-xs.svelte-3cb6w2 .h.svelte-3cb6w2{font:var(--display-h5);text-transform:none}.heading.svelte-3cb6w2 .info.svelte-3cb6w2{font-size:var(--scale-00)}",
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
  const defaultSizeTags = {
    xl: "h1",
    lg: "h2",
    md: "h3",
    sm: "h4",
    xs: "h4"
  };
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
    "heading size-" + escape(size, true) + " spacing-" + escape(spacing, true) + " svelte-3cb6w2",
    (separator ? "separator" : "") + " " + (centered ? "centered" : "")
  ].join(" ").trim()}">${((tag$1) => {
    return tag$1 ? `<${tag}${add_attribute("id", id, 0)} class="h svelte-3cb6w2">${is_void(tag$1) ? "" : `${slots.default ? slots.default({}) : ``}`}${is_void(tag$1) ? "" : `</${tag$1}>`}` : "";
  })(tag)} ${$$slots.info ? `<div class="info svelte-3cb6w2">${slots.info ? slots.info({}) : ``}</div>` : ``} </div>`;
});

export { Heading as H, is_void as i };
//# sourceMappingURL=Heading-e9ca207e.js.map
