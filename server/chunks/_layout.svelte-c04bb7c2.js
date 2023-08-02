import { c as create_ssr_component, v as validate_component } from './ssr-b0d2ddaa.js';
import { S as Section } from './Section-9390a30c.js';

const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Section, "Section").$$render($$result, { width: "sm" }, {}, {
    default: () => {
      return `<div class="richtext">${slots.default ? slots.default({}) : ``}</div>`;
    }
  })}`;
});

export { Layout as default };
//# sourceMappingURL=_layout.svelte-c04bb7c2.js.map
