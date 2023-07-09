import { c as create_ssr_component, v as validate_component, a as subscribe, e as escape } from './index3-f551e0d4.js';
import { p as page } from './stores-da91aade.js';

const Seo = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let seo;
  let title;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  seo = $page.data.seo;
  title = seo?.title;
  $$unsubscribe_page();
  return `${$$result.head += `<!-- HEAD_svelte-14ks68m_START -->${$$result.title = `<title>UniBW - ${escape(title ?? "Serious Game")}</title>`, ""}<meta name="description" content="This is a serious game"><!-- HEAD_svelte-14ks68m_END -->`, ""}`;
});
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Seo, "Seo").$$render($$result, {}, {}, {})}

${slots.default ? slots.default({}) : ``}`;
});

export { Layout as default };
//# sourceMappingURL=_layout.svelte-ec026853.js.map
