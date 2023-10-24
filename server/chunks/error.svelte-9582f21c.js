import { c as create_ssr_component, a as subscribe, e as escape } from './ssr-f1b8bed9.js';
import { p as page } from './stores-4a854845.js';

const Error = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  $$unsubscribe_page();
  return `<h1>${escape($page.status)}</h1> <p>${escape($page.error?.message)}</p>`;
});

export { Error as default };
//# sourceMappingURL=error.svelte-9582f21c.js.map
