import { c as create_ssr_component, v as validate_component } from './ssr-53fe64ef.js';
import { U as UsernameScreen } from './UsernameScreen-140b10d3.js';
import './Board-c2329118.js';
import './index2-19ef3658.js';
import './user-fc27f200.js';
import './Paragraph-442e1907.js';
import './Heading-e9ca207e.js';
import './forms-78616ad6.js';
import './index-a4865dbd.js';
import './stringify-f45e10e0.js';
import './stores-75bfba60.js';
import './prod-ssr-7cc47430.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${validate_component(UsernameScreen, "UsernameScreen").$$render($$result, { data: data.form }, {}, {})}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-58da0997.js.map
