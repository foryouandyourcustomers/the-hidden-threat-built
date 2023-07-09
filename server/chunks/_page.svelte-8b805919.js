import { c as create_ssr_component, v as validate_component } from './index3-f551e0d4.js';
import { s as superForm, C as CenteredContent, T as TextInput, a as Checkbox } from './TextInput-1380af41.js';
import { B as Button } from './Button-60d4d847.js';
import './index2-c2cdd0b3.js';
import './stores-da91aade.js';
import './forms-abd5498f.js';
import './index-39e97e00.js';
import './stringify-cfe36ff5.js';
import './prod-ssr-7cc47430.js';

const css = {
  code: ".actions.svelte-1raqrm4{display:flex;gap:var(--size-2)}",
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
      return `<form method="post"><h1>Neues Spiel</h1>

    ${validate_component(TextInput, "TextInput").$$render($$result, { form, field: "userName" }, {}, {
        default: () => {
          return `Dein Name *`;
        }
      })}

    ${validate_component(Checkbox, "Checkbox").$$render($$result, { form, field: "acceptedTos" }, {}, {
        default: () => {
          return `Ich habe die <a href="/privacy" target="_blank">Datenschutzerklärung</a>, die
      <a href="/tos" target="_blank">Nutzungsbedingungen</a> gelesen und akzeptiere sie und bin über
      18 Jahre alt. *
    `;
        }
      })}

    <div class="actions svelte-1raqrm4">${validate_component(Button, "Button").$$render($$result, { href: "/" }, {}, {
        default: () => {
          return `Abbrechen`;
        }
      })}
      ${validate_component(Button, "Button").$$render($$result, { type: "submit", accent: true }, {}, {
        default: () => {
          return `Start`;
        }
      })}</div></form>`;
    }
  })}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-8b805919.js.map
