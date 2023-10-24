import { c as create_ssr_component, v as validate_component } from './ssr-f1b8bed9.js';
import { U as UsernameScreen } from './UsernameScreen-e5540d76.js';
import './Board-8540192e.js';
import './index2-a476f11a.js';
import './user-fc27f200.js';
import './Paragraph-0af6e181.js';
import './Heading-580e22ef.js';
import './forms-78616ad6.js';
import './index-a4865dbd.js';
import './stringify-f45e10e0.js';
import './stores-4a854845.js';
import './prod-ssr-7cc47430.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${validate_component(UsernameScreen, "UsernameScreen").$$render($$result, { data: data.form }, {}, {})}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-dbad6169.js.map
