import { c as create_ssr_component, v as validate_component } from './ssr-53fe64ef.js';
import { S as Section } from './Section-25947e8f.js';

const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Section, "Section").$$render($$result, { width: "sm" }, {}, {
    default: () => {
      return `<div class="richtext">${slots.default ? slots.default({}) : ``}</div>`;
    }
  })}`;
});

export { Layout as default };
//# sourceMappingURL=_layout.svelte-d7144bc5.js.map
