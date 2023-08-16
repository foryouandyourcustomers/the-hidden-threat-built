import { c as create_ssr_component, v as validate_component } from './ssr-d73c8ffd.js';
import { S as Section } from './Section-4fe3e0fd.js';

const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Section, "Section").$$render($$result, { width: "sm" }, {}, {
    default: () => {
      return `<div class="richtext">${slots.default ? slots.default({}) : ``}</div>`;
    }
  })}`;
});

export { Layout as default };
//# sourceMappingURL=_layout.svelte-7adea4d5.js.map
