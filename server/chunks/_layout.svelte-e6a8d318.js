import { c as create_ssr_component, v as validate_component } from './ssr-efd797e6.js';
import { S as Section } from './Section-33e2ec5e.js';

const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Section, "Section").$$render($$result, { width: "sm" }, {}, {
    default: () => {
      return `<div class="richtext">${slots.default ? slots.default({}) : ``}</div>`;
    }
  })}`;
});

export { Layout as default };
//# sourceMappingURL=_layout.svelte-e6a8d318.js.map
