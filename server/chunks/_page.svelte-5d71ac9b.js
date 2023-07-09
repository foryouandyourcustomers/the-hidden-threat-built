import { c as create_ssr_component, v as validate_component } from './index3-f551e0d4.js';
import { B as Button } from './Button-60d4d847.js';

const css = {
  code: "h1.svelte-9da22d{font-size:var(--scale-5);-webkit-text-decoration:none;text-decoration:none}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<h1 class="svelte-9da22d">The Hidden Threat</h1>

<p>The Hidden Threat ist ein &quot;serious game&quot; lorum ipsum.</p>

<br>
<br>
${validate_component(Button, "Button").$$render($$result, { accent: true, href: "/game/new" }, {}, {
    default: () => {
      return `Neues Spiel starten`;
    }
  })}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-5d71ac9b.js.map
