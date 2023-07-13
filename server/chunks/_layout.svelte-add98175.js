import { c as create_ssr_component, a as subscribe, v as validate_component } from './ssr-3cdd5219.js';
import { n as navigating } from './stores-57cf8497.js';

const css$2 = {
  code: "footer.svelte-hwkg9e{background:#323c3d;color:#fff;padding:var(--size-4) var(--size-content-px)}nav.svelte-hwkg9e{display:flex;font-size:var(--scale-00);gap:var(--size-4)}a.svelte-hwkg9e{-webkit-text-decoration:none;text-decoration:none}",
  map: null
};
const Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$2);
  return `<footer class="svelte-hwkg9e" data-svelte-h="svelte-jastgi"><nav class="svelte-hwkg9e"><a href="/" class="svelte-hwkg9e">Home</a> <a href="/help" class="svelte-hwkg9e">Hilfe</a> <a href="/contact" class="svelte-hwkg9e">Kontakt</a> <a href="/imprint" class="svelte-hwkg9e">Impressum</a> <a href="/privacy" class="svelte-hwkg9e">Datenschutzerklärung</a> <a href="/tos" class="svelte-hwkg9e">Nutzungsbedingungen</a></nav> </footer>`;
});
const css$1 = {
  code: 'header.svelte-pfr22j{padding:var(--size-4) var(--size-content-px)}nav.svelte-pfr22j{gap:var(--size-2)}a.svelte-pfr22j,nav.svelte-pfr22j{display:flex}a.svelte-pfr22j{align-items:center;-webkit-text-decoration:none;text-decoration:none}a.svelte-pfr22j:not(:first-child):before{color:var(--color-grey-400);content:"/";display:inline-block;font-size:var(--scale-000);margin-right:var(--size-2)}',
  map: null
};
const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$1);
  return `<header class="svelte-pfr22j" data-svelte-h="svelte-14mlwtj"><nav class="svelte-pfr22j"><a href="/" class="svelte-pfr22j">Home</a> <a href="/help" class="svelte-pfr22j">Hilfe</a></nav> </header>`;
});
const css = {
  code: ".layout.svelte-1h72d1y{display:flex;flex-direction:column;min-height:100%}main.svelte-1h72d1y{flex:1;padding:var(--size-4) var(--size-content-px)}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $navigating, $$unsubscribe_navigating;
  $$unsubscribe_navigating = subscribe(navigating, (value) => $navigating = value);
  $$result.css.add(css);
  $$unsubscribe_navigating();
  return `<div class="layout svelte-1h72d1y">${validate_component(Header, "Header").$$render($$result, {}, {}, {})} <main class="svelte-1h72d1y">${$navigating ? `Loading...` : `${slots.default ? slots.default({}) : ``}`}</main> ${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})} </div>`;
});

export { Layout as default };
//# sourceMappingURL=_layout.svelte-add98175.js.map
