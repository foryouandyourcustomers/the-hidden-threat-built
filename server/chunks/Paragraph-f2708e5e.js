import { c as create_ssr_component, e as escape } from './ssr-b0d2ddaa.js';

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
  code: "p.svelte-caane7{margin-bottom:1.5rem;margin-top:1.5rem;max-width:44rem}.centered.svelte-caane7{margin-left:auto;margin-right:auto;text-align:center}.size-md.svelte-caane7{font:var(--text-regular)}.size-lg.svelte-caane7{font:var(--text-big)}.size-sm.svelte-caane7{font:var(--text-small)}",
  map: null
};
const Paragraph = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { centered = false } = $$props;
  let { size = "md" } = $$props;
  if ($$props.centered === void 0 && $$bindings.centered && centered !== void 0)
    $$bindings.centered(centered);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  $$result.css.add(css);
  return `<p class="${["size-" + escape(size, true) + " svelte-caane7", centered ? "centered" : ""].join(" ").trim()}">${slots.default ? slots.default({}) : ``}</p>`;
});

export { Actions as A, Paragraph as P };
//# sourceMappingURL=Paragraph-f2708e5e.js.map
