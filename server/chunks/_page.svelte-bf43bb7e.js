import { c as create_ssr_component, v as validate_component } from './ssr-efd797e6.js';
import { U as UsernameScreen } from './UsernameScreen-fb691f7b.js';
import './Board-c851670d.js';
import './index2-5c74218a.js';
import './user-fc27f200.js';
import './Paragraph-75b7d71d.js';
import './Heading-2db5e692.js';
import './forms-78616ad6.js';
import './index-a4865dbd.js';
import './stringify-f45e10e0.js';
import './stores-58892a32.js';
import './prod-ssr-7cc47430.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${validate_component(UsernameScreen, "UsernameScreen").$$render($$result, { data: data.form }, {}, {})}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-bf43bb7e.js.map
