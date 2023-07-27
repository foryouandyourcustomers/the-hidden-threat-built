import { c as create_ssr_component, a as subscribe, v as validate_component } from './ssr-6cc58d58.js';
import { n as navigating } from './stores-174b97fe.js';

const css$2 = {
  code: "footer.svelte-1v5g8ko{background:#323c3d;color:#fff;padding:1rem var(--size-content-px)}nav.svelte-1v5g8ko{display:flex;font-size:var(--scale-00);gap:1rem}a.svelte-1v5g8ko{-webkit-text-decoration:none;text-decoration:none}",
  map: null
};
const Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$2);
  return `<footer class="svelte-1v5g8ko" data-svelte-h="svelte-jastgi"><nav class="svelte-1v5g8ko"><a href="/" class="svelte-1v5g8ko">Home</a> <a href="/help" class="svelte-1v5g8ko">Hilfe</a> <a href="/contact" class="svelte-1v5g8ko">Kontakt</a> <a href="/imprint" class="svelte-1v5g8ko">Impressum</a> <a href="/privacy" class="svelte-1v5g8ko">Datenschutzerklärung</a> <a href="/tos" class="svelte-1v5g8ko">Nutzungsbedingungen</a></nav> </footer>`;
});
const css$1 = {
  code: 'header.svelte-ciw4m4{padding:1rem var(--size-content-px)}nav.svelte-ciw4m4{gap:.5rem}a.svelte-ciw4m4,nav.svelte-ciw4m4{display:flex}a.svelte-ciw4m4{align-items:center;-webkit-text-decoration:none;text-decoration:none}a.svelte-ciw4m4:not(:first-child):before{color:var(--color-grey-400);content:"/";display:inline-block;font-size:var(--scale-000);margin-right:.5rem}',
  map: null
};
const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$1);
  return `<header class="svelte-ciw4m4" data-svelte-h="svelte-14mlwtj"><nav class="svelte-ciw4m4"><a href="/" class="svelte-ciw4m4">Home</a> <a href="/help" class="svelte-ciw4m4">Hilfe</a></nav> </header>`;
});
const css = {
  code: ".layout.svelte-1jkcd9t{display:flex;flex-direction:column;min-height:100%}main.svelte-1jkcd9t{flex:1;padding:1rem var(--size-content-px)}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $navigating, $$unsubscribe_navigating;
  $$unsubscribe_navigating = subscribe(navigating, (value) => $navigating = value);
  $$result.css.add(css);
  $$unsubscribe_navigating();
  return `<div class="layout svelte-1jkcd9t">${validate_component(Header, "Header").$$render($$result, {}, {}, {})} <main class="svelte-1jkcd9t">${$navigating ? `Loading...` : `${slots.default ? slots.default({}) : ``}`}</main> ${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})} </div>`;
});

export { Layout as default };
//# sourceMappingURL=_layout.svelte-70858006.js.map
