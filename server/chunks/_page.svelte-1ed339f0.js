import { c as create_ssr_component, v as validate_component } from './ssr-35980408.js';
import { U as UsernameScreen } from './UsernameScreen-c075982c.js';
import './Board-855031d4.js';
import './Paragraph-345ed65d.js';
import './Heading-8afffc5f.js';
import './index2-60e1937a.js';
import './forms-78616ad6.js';
import './index-a4865dbd.js';
import './stringify-f45e10e0.js';
import './stores-5ed94b92.js';
import './prod-ssr-7cc47430.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${validate_component(UsernameScreen, "UsernameScreen").$$render($$result, { data: data.form }, {}, {})}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-1ed339f0.js.map
