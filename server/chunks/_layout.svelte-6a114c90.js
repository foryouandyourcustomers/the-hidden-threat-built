import { c as create_ssr_component, v as validate_component } from './ssr-287f4da9.js';
import { S as Section } from './Section-7c9141b7.js';

const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Section, "Section").$$render($$result, { width: "sm" }, {}, {
    default: () => {
      return `<div class="richtext">${slots.default ? slots.default({}) : ``}</div>`;
    }
  })}`;
});

export { Layout as default };
//# sourceMappingURL=_layout.svelte-6a114c90.js.map
