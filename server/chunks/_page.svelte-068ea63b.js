import { c as create_ssr_component, v as validate_component, g as each, e as escape } from './ssr-efd797e6.js';
import { I as Item } from './Item-2876956f.js';
import { S as Section } from './Section-33e2ec5e.js';
import { I as ITEMS } from './items-4c987187.js';

const css = {
  code: ".items.svelte-1bxrgqn.svelte-1bxrgqn{display:flex;flex-wrap:wrap;gap:1rem}.items.svelte-1bxrgqn .item.svelte-1bxrgqn{border:1px solid silver;border-radius:.5rem;display:flex;flex-direction:column;max-width:20rem;padding:1rem}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${validate_component(Section, "Section").$$render($$result, {}, {}, {
    default: () => {
      return `<div class="items svelte-1bxrgqn">${each(ITEMS, (item) => {
        return `<div class="item svelte-1bxrgqn"><h3>${escape(item.name)}</h3> ${validate_component(Item, "Item").$$render($$result, { itemId: item.id }, {}, {})} <p>${escape(item.description)}</p> </div>`;
      })}</div>`;
    }
  })}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-068ea63b.js.map
