import { c as create_ssr_component, v as validate_component } from './ssr-0f977c41.js';
import { U as UsernameScreen } from './UsernameScreen-397d603a.js';
import './check-5322ef03.js';
import './index2-286c48fe.js';
import './game-context-22448513.js';
import './user-8b4b9a11.js';
import './player-81938fab.js';
import './Face-01ae0e5d.js';
import './Paragraph-714d071c.js';
import './Heading-73f1ef21.js';
import './forms-78616ad6.js';
import './index-a4865dbd.js';
import './stringify-f45e10e0.js';
import './stores-828decd9.js';
import './prod-ssr-7cc47430.js';

const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${validate_component(UsernameScreen, "UsernameScreen").$$render($$result, { data: data.form }, {}, {})}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-0d24c859.js.map
