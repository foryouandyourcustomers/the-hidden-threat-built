import { c as create_ssr_component, e as escape } from './ssr-0dbbabcd.js';

const css = {
  code: "section.svelte-llg4em.svelte-llg4em{--_width:var(--width-content-max);--_bg:transparent}section.bg-light.svelte-llg4em.svelte-llg4em{--_bg:var(--color-bg-secondary)}section.bg-fade.svelte-llg4em.svelte-llg4em{--_bg:linear-gradient(180deg,transparent,#232c41)}section.bg-fill-content.svelte-llg4em .wrapper.svelte-llg4em,section.bg-fill-full.svelte-llg4em.svelte-llg4em{background:var(--_bg)}section.svelte-llg4em .wrapper.svelte-llg4em{border-radius:var(--radius-md);isolation:isolate;margin-left:auto;margin-right:auto;max-width:var(--_width);padding:5rem 1rem;position:relative}.width-sm.svelte-llg4em.svelte-llg4em{--_width:var(--width-md);--_padding-x:max(var(--size-default-px),(100vw - var(--width-md))/2)}.width-md.svelte-llg4em.svelte-llg4em{--_width:var(--width-lg);--_padding-x:max(var(--size-default-px),(100vw - var(--width-lg))/2)}.width-lg.svelte-llg4em.svelte-llg4em{--_width:var(--width-content-max)}",
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
  return `<section class="${"width-" + escape(width, true) + " bg-" + escape(bg, true) + " bg-fill-" + escape(bgFill, true) + " svelte-llg4em"}"><div class="wrapper svelte-llg4em">${slots.default ? slots.default({}) : ``}</div> </section>`;
});

export { Section as S };
//# sourceMappingURL=Section-02b9d997.js.map
