import { c as create_ssr_component, h as add_styles, f as add_attribute, v as validate_component } from './ssr-35980408.js';

const css$1 = {
  code: ".header.svelte-1d60vr1{align-items:center;background:linear-gradient(180deg,rgba(43,52,72,0),rgba(43,52,72,.663));display:flex;height:var(--size-header-height);justify-content:space-between;padding-left:3rem;padding-right:1rem;position:relative}.title.svelte-1d60vr1{font:var(--display-h2);font-size:var(--scale-4);text-transform:uppercase}",
  map: null
};
const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$1);
  return `<div class="header svelte-1d60vr1"><div class="title svelte-1d60vr1" data-svelte-h="svelte-xbe4by">The hidden threat</div> ${slots.default ? slots.default({}) : ``} </div>`;
});
const css = {
  code: ".board-wrapper.svelte-l9qiwm{align-content:center;background:#000;display:grid;height:100%;justify-content:center;place-content:center;width:100%}.board.svelte-l9qiwm{grid-gap:1rem;background-color:var(--color-bg);border-radius:var(--radius-sm);display:grid;gap:1rem;grid-template-rows:auto 1fr;height:var(--size-game-height);overflow:hidden;position:relative;scale:var(--board-scale);transform-origin:center;width:var(--size-game-width)}.board.backdrop.svelte-l9qiwm{background-image:url(/images/board-backdrop.svg);background-repeat:no-repeat;background-size:cover}.content.svelte-l9qiwm{isolation:isolate}.content.padded.svelte-l9qiwm{padding:4rem 7rem}",
  map: null
};
const Board = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { reportMousePosition = void 0 } = $$props;
  let { showBackdrop = false } = $$props;
  let { paddedContent = false } = $$props;
  let gameContainer;
  let scale = 1;
  if ($$props.reportMousePosition === void 0 && $$bindings.reportMousePosition && reportMousePosition !== void 0)
    $$bindings.reportMousePosition(reportMousePosition);
  if ($$props.showBackdrop === void 0 && $$bindings.showBackdrop && showBackdrop !== void 0)
    $$bindings.showBackdrop(showBackdrop);
  if ($$props.paddedContent === void 0 && $$bindings.paddedContent && paddedContent !== void 0)
    $$bindings.paddedContent(paddedContent);
  $$result.css.add(css);
  return ` <div class="board-wrapper svelte-l9qiwm"${add_styles({ "--board-scale": scale })}> <div class="${["board svelte-l9qiwm", showBackdrop ? "backdrop" : ""].join(" ").trim()}"${add_attribute("this", gameContainer, 0)}>${validate_component(Header, "Header").$$render($$result, {}, {}, {
    default: () => {
      return `${slots.header ? slots.header({}) : ``}`;
    }
  })} <div class="${["content svelte-l9qiwm", paddedContent ? "padded" : ""].join(" ").trim()}">${slots.default ? slots.default({}) : ``}</div> ${slots.overlays ? slots.overlays({}) : ``}</div> </div>`;
});

export { Board as B };
//# sourceMappingURL=Board-855031d4.js.map
