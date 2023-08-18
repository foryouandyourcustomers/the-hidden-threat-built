import { c as create_ssr_component, e as escape } from './ssr-35980408.js';

const css$1 = {
  code: ".actions.svelte-177b0px{align-items:center;display:flex;gap:1rem;margin-top:2.5rem}.actions.align-left.svelte-177b0px{justify-content:flex-start}.actions.align-right.svelte-177b0px{justify-content:flex-end}",
  map: null
};
const Actions = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { align = "right" } = $$props;
  if ($$props.align === void 0 && $$bindings.align && align !== void 0)
    $$bindings.align(align);
  $$result.css.add(css$1);
  return `<div class="${"actions align-" + escape(align, true) + " svelte-177b0px"}">${slots.default ? slots.default({}) : ``} </div>`;
});
const css = {
  code: "p.svelte-7ymvdw{margin-bottom:1.5rem;margin-top:1.5rem}p.width-default.svelte-7ymvdw{max-width:44rem}.centered.svelte-7ymvdw{margin-left:auto;margin-right:auto;text-align:center}.size-md.svelte-7ymvdw{font:var(--text-regular)}.size-lg.svelte-7ymvdw{font:var(--text-big)}.size-sm.svelte-7ymvdw{font:var(--text-small)}",
  map: null
};
const Paragraph = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { centered = false } = $$props;
  let { size = "md" } = $$props;
  let { width = "default" } = $$props;
  if ($$props.centered === void 0 && $$bindings.centered && centered !== void 0)
    $$bindings.centered(centered);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  $$result.css.add(css);
  return `<p class="${[
    "size-" + escape(size, true) + " width-" + escape(width, true) + " svelte-7ymvdw",
    centered ? "centered" : ""
  ].join(" ").trim()}">${slots.default ? slots.default({}) : ``}</p>`;
});

export { Actions as A, Paragraph as P };
//# sourceMappingURL=Paragraph-91fb6104.js.map
