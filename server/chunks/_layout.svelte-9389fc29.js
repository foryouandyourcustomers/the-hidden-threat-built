import { c as create_ssr_component, v as validate_component } from './ssr-f1b8bed9.js';
import { S as Section } from './Section-f0e0b8d4.js';

const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Section, "Section").$$render($$result, { width: "sm" }, {}, {
    default: () => {
      return `<div class="richtext">${slots.default ? slots.default({}) : ``}</div>`;
    }
  })}`;
});

export { Layout as default };
//# sourceMappingURL=_layout.svelte-9389fc29.js.map
