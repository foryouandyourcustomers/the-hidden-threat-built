import { c as create_ssr_component, v as validate_component } from './ssr-ea380d77.js';
import { S as Section } from './Section-4b2c4ed5.js';

const css = {
  code: ".richtext.svelte-1lvyskl nav.toc{display:none}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${validate_component(Section, "Section").$$render($$result, { width: "sm" }, {}, {
    default: () => {
      return `<div class="richtext svelte-1lvyskl">${slots.default ? slots.default({}) : ``}</div>`;
    }
  })}`;
});

export { Layout as default };
//# sourceMappingURL=_layout.svelte-9660a19b.js.map
