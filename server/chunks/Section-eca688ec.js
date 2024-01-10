import { c as create_ssr_component, e as escape } from './ssr-ea380d77.js';

const css = {
  code: "section.svelte-1u99ng5.svelte-1u99ng5{--_width:100%;--_bg:transparent;isolation:isolate}section.bg-light.svelte-1u99ng5.svelte-1u99ng5{--_bg:var(--color-bg-secondary);margin-left:var(--size-content-px);margin-right:var(--size-content-px)}section.bg-fade.svelte-1u99ng5.svelte-1u99ng5{--_bg:linear-gradient(180deg,transparent 50%,#232c41)}section.bg-fill-content.svelte-1u99ng5 .wrapper.svelte-1u99ng5,section.bg-fill-full.svelte-1u99ng5.svelte-1u99ng5{background:var(--_bg)}section.svelte-1u99ng5 .wrapper.svelte-1u99ng5{border-radius:var(--radius-md);isolation:isolate;margin-left:auto;margin-right:auto;max-width:calc(var(--_width) + var(--size-content-px)*2);padding:5rem var(--size-content-px);position:relative}.width-sm.svelte-1u99ng5.svelte-1u99ng5{--_width:var(--width-md)}.width-md.svelte-1u99ng5.svelte-1u99ng5{--_width:var(--width-lg)}.width-lg.svelte-1u99ng5.svelte-1u99ng5{--_width:100%}",
  map: null
};
const Section = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { width = "md" } = $$props;
  let { bg = "none" } = $$props;
  let { bgFill = "full" } = $$props;
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  if ($$props.bg === void 0 && $$bindings.bg && bg !== void 0)
    $$bindings.bg(bg);
  if ($$props.bgFill === void 0 && $$bindings.bgFill && bgFill !== void 0)
    $$bindings.bgFill(bgFill);
  $$result.css.add(css);
  return `<section class="${"width-" + escape(width, true) + " bg-" + escape(bg, true) + " bg-fill-" + escape(bgFill, true) + " svelte-1u99ng5"}"><div class="wrapper svelte-1u99ng5">${slots.default ? slots.default({}) : ``}</div> </section>`;
});

export { Section as S };
//# sourceMappingURL=Section-eca688ec.js.map
