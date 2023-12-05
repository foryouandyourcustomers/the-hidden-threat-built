import { c as create_ssr_component, v as validate_component } from './ssr-ea380d77.js';
import { U as UsernameScreen } from './UsernameScreen-091c638a.js';
import './Board-d43dd77e.js';
import './index2-863c54a1.js';
import './game-context-19a9f73b.js';
import './user-e3413fb3.js';
import './FooterNav-16dc3408.js';
import './Paragraph-a8f64156.js';
import './Heading-86ff148c.js';
import './forms-78616ad6.js';
import './index-a4865dbd.js';
import './stringify-f45e10e0.js';
import './stores-39439931.js';
import './prod-ssr-7cc47430.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${validate_component(UsernameScreen, "UsernameScreen").$$render($$result, { data: data.form }, {}, {})}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-9863d21e.js.map