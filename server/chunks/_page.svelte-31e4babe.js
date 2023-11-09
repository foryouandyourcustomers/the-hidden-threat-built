import { c as create_ssr_component, v as validate_component } from './ssr-0dbbabcd.js';
import { U as UsernameScreen } from './UsernameScreen-046bb215.js';
import './Board-ab5f7865.js';
import './index2-fcf0b728.js';
import './user-fc27f200.js';
import './Paragraph-c549ffc0.js';
import './Heading-6d80f38d.js';
import './forms-78616ad6.js';
import './index-a4865dbd.js';
import './stringify-f45e10e0.js';
import './stores-5381becf.js';
import './prod-ssr-7cc47430.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${validate_component(UsernameScreen, "UsernameScreen").$$render($$result, { data: data.form }, {}, {})}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-31e4babe.js.map
