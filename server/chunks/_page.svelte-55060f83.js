import { c as create_ssr_component, v as validate_component } from './ssr-3cdd5219.js';
import { B as Button } from './Button-0c8fd717.js';

const css = {
  code: "h1.svelte-9da22d{font-size:var(--scale-5);-webkit-text-decoration:none;text-decoration:none}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<h1 class="svelte-9da22d" data-svelte-h="svelte-k9gcz">The Hidden Threat</h1> <p data-svelte-h="svelte-c3a5t8">The Hidden Threat ist ein &quot;serious game&quot; lorum ipsum.</p> <br> <br> ${validate_component(Button, "Button").$$render($$result, { accent: true, href: "/game/new" }, {}, {
    default: () => {
      return `Neues Spiel starten`;
    }
  })}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-55060f83.js.map
