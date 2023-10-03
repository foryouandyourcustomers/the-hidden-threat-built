import { c as create_ssr_component, v as validate_component } from './ssr-35980408.js';
import { s as superForm, C as CenteredContent, T as TextInput, a as Checkbox } from './TextInput-b0a2b166.js';
import { B as Button } from './Button-aa025954.js';
import './index2-60e1937a.js';
import './stores-5ed94b92.js';
import './forms-78616ad6.js';
import './index-a4865dbd.js';
import './stringify-f45e10e0.js';
import './prod-ssr-7cc47430.js';
import './names-11b10067.js';

const css = {
  code: ".actions.svelte-134u3m3{display:flex;gap:.5rem}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  const form = superForm(data.form);
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  $$result.css.add(css);
  return `${validate_component(CenteredContent, "CenteredContent").$$render($$result, {}, {}, {
    default: () => {
      return `<form method="post"><h1 data-svelte-h="svelte-13np4yz">Neues Spiel</h1> ${validate_component(TextInput, "TextInput").$$render($$result, { form, field: "userName" }, {}, {
        default: () => {
          return `Dein Name *`;
        }
      })} ${validate_component(Checkbox, "Checkbox").$$render($$result, { form, field: "acceptedTos" }, {}, {
        default: () => {
          return `Ich habe die <a href="/privacy" target="_blank" data-svelte-h="svelte-1ft4v3t">Datenschutzerklärung</a>, die
      <a href="/tos" target="_blank" data-svelte-h="svelte-hthhvw">Nutzungsbedingungen</a> gelesen und akzeptiere sie und bin über
      18 Jahre alt. *`;
        }
      })} <div class="actions svelte-134u3m3">${validate_component(Button, "Button").$$render($$result, { href: "/" }, {}, {
        default: () => {
          return `Abbrechen`;
        }
      })} ${validate_component(Button, "Button").$$render($$result, { type: "submit", primary: true }, {}, {
        default: () => {
          return `Start`;
        }
      })}</div></form>`;
    }
  })}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-f2e1a6c8.js.map
