import { c as create_ssr_component, v as validate_component, a as subscribe, e as escape } from './ssr-0f977c41.js';
import { p as page } from './stores-828decd9.js';

const Seo = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let seo;
  let title;
  let $page, $$unsubscribe_page;
  $$unsubscribe_page = subscribe(page, (value) => $page = value);
  seo = $page.data.seo;
  title = seo?.title;
  $$unsubscribe_page();
  return `${$$result.head += `<!-- HEAD_svelte-a2e7u_START -->${$$result.title = `<title>The Hidden Threat ${escape(title ? ` - ${title}` : "")}</title>`, ""}<meta name="description" content="Die digitale Variante zum Tabletop"><!-- HEAD_svelte-a2e7u_END -->`, ""}`;
});
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Seo, "Seo").$$render($$result, {}, {}, {})} ${slots.default ? slots.default({}) : ``}`;
});

export { Layout as default };
//# sourceMappingURL=_layout.svelte-2c44cc06.js.map
