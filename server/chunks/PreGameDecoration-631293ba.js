import { c as create_ssr_component, a as subscribe, i as add_styles, e as escape, f as add_attribute, v as validate_component, b as spread, d as escape_object } from './ssr-ea380d77.js';
import { r as readable } from './index2-863c54a1.js';
import { g as getGameContext } from './game-context-19a9f73b.js';
import { p as getUser } from './user-7763bfe7.js';
import { F as FooterNav, a as Face } from './Face-3533cebe.js';

function defaultCompare(a, b) {
  return a === b;
}
const useSelector = (actor, selector, compare = defaultCompare) => {
  let sub;
  let prevSelected = selector(actor.getSnapshot());
  const selected = readable(prevSelected, (set) => {
    const onNext = (state) => {
      const nextSelected = selector(state);
      if (!compare(prevSelected, nextSelected)) {
        prevSelected = nextSelected;
        set(nextSelected);
      }
    };
    onNext(actor.getSnapshot());
    sub = actor.subscribe(onNext);
    return () => {
      sub.unsubscribe();
    };
  });
  return selected;
};
const getCurrentUser = (context) => getUser(context.userId, context);
const css$2 = {
  code: '.header.svelte-kbs536{align-items:center;background-color:var(--color-blue-spielbrett);background:linear-gradient(180deg,rgba(43,52,72,0),rgba(43,52,72,.663));display:grid;grid-template-areas:"logo score jokers options";grid-template-columns:38rem 22rem 1fr auto;height:var(--size-header-height);padding-left:7rem;padding-right:1rem}.header.svelte-kbs536,.title.svelte-kbs536{position:relative}.title.svelte-kbs536{align-self:start;font-family:var(--font-display);font-size:var(--scale-4);grid-area:logo;line-height:2.5rem;text-transform:uppercase}.backdrop.svelte-kbs536{height:3.3125rem;left:1.875rem;position:absolute;top:0;width:21.625rem}',
  map: null
};
const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$2);
  return `<div class="header svelte-kbs536"><div class="backdrop svelte-kbs536" data-svelte-h="svelte-17ojy9"><svg width="346" height="53" viewBox="0 0 346 53" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M45 0H0l54 53-9-53Z" fill="#F03A50"></path><path d="M45 0h33L54 53 45 0Z" fill="#A40224"></path><path d="M346 38 330 0H78L54 53l292-15Z" fill="#D32746"></path></svg></div> <div class="title svelte-kbs536" data-svelte-h="svelte-xbe4by">The hidden threat</div> ${slots.default ? slots.default({}) : ``} </div>`;
});
const css$1 = {
  code: ".board-wrapper.svelte-q6v7k9{--player-status-width:30rem;align-content:center;background:#000;display:grid;height:100%;justify-content:center;place-content:center;width:100%}.board.svelte-q6v7k9{grid-gap:.75rem;background-color:var(--color-bg);border-radius:var(--radius-sm);display:grid;gap:.75rem;grid-template-rows:auto 1fr;height:var(--size-game-height);overflow:hidden;position:relative;scale:var(--board-scale);transform-origin:center;width:var(--size-game-width)}.board.with-footer.svelte-q6v7k9{grid-template-rows:auto 1fr auto}.board.side-defense.svelte-q6v7k9{outline:10px solid var(--color-blue-medium)}.board.side-attack.svelte-q6v7k9{outline:10px solid var(--color-red-medium)}.board.backdrop.svelte-q6v7k9{background-image:url(/images/board-backdrop.svg);background-repeat:no-repeat;background-size:cover}.content.svelte-q6v7k9{isolation:isolate}.content.padded.svelte-q6v7k9{padding:1rem 7rem 0}.footer.svelte-q6v7k9{align-items:center;background-color:var(--color-blue-spielbrett);background:linear-gradient(0deg,#1b253a,#252f43);display:flex;height:var(--size-game-footer-height);justify-content:stretch;padding:0 7rem}.footer.svelte-q6v7k9>*{flex:1}",
  map: null
};
const Board = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $adminSide, $$unsubscribe_adminSide;
  let { reportMousePosition = void 0 } = $$props;
  let { showBackdrop = false } = $$props;
  let { showFooter = false } = $$props;
  let { paddedContent = false } = $$props;
  const gameContext = getGameContext();
  const adminSide = gameContext ? useSelector(gameContext.machine.service, ({ context }) => {
    const user = getCurrentUser(context);
    if (!user.isAdmin)
      return void 0;
    else
      return user.side;
  }) : readable(void 0);
  $$unsubscribe_adminSide = subscribe(adminSide, (value) => $adminSide = value);
  let gameContainer;
  let scale = 1;
  if ($$props.reportMousePosition === void 0 && $$bindings.reportMousePosition && reportMousePosition !== void 0)
    $$bindings.reportMousePosition(reportMousePosition);
  if ($$props.showBackdrop === void 0 && $$bindings.showBackdrop && showBackdrop !== void 0)
    $$bindings.showBackdrop(showBackdrop);
  if ($$props.showFooter === void 0 && $$bindings.showFooter && showFooter !== void 0)
    $$bindings.showFooter(showFooter);
  if ($$props.paddedContent === void 0 && $$bindings.paddedContent && paddedContent !== void 0)
    $$bindings.paddedContent(paddedContent);
  $$result.css.add(css$1);
  $$unsubscribe_adminSide();
  return ` <div class="board-wrapper svelte-q6v7k9"${add_styles({ "--board-scale": scale })}> <div class="${[
    "board " + escape($adminSide ? `side-${$adminSide}` : "", true) + " svelte-q6v7k9",
    (showBackdrop ? "backdrop" : "") + " " + (showFooter ? "with-footer" : "")
  ].join(" ").trim()}"${add_attribute("this", gameContainer, 0)}>${validate_component(Header, "Header").$$render($$result, {}, {}, {
    default: () => {
      return `${slots.header ? slots.header({}) : ``}`;
    }
  })} <div class="${["content svelte-q6v7k9", paddedContent ? "padded" : ""].join(" ").trim()}">${slots.default ? slots.default({}) : ``}</div> ${slots.overlays ? slots.overlays({}) : ``} ${showFooter ? `<div class="footer svelte-q6v7k9">${validate_component(FooterNav, "FooterNav").$$render($$result, {}, {}, {})}</div>` : ``}</div> </div>`;
});
const X = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread(
    [
      { viewBox: "0 0 24 24" },
      { width: "1.2em" },
      { height: "1.2em" },
      escape_object($$props)
    ],
    {}
  )}><!-- HTML_TAG_START -->${`<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 6L6 18M6 6l12 12"/>`}<!-- HTML_TAG_END --></svg>`;
});
const css = {
  code: ".faces.svelte-17o38i1{display:flex;gap:.5rem;grid-area:jokers}.faces.svelte-17o38i1 svg{height:2rem;width:2rem}.close.svelte-17o38i1{grid-area:options;position:relative}.close.svelte-17o38i1 svg{height:2rem;width:2rem}",
  map: null
};
const PreGameDecoration = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="faces svelte-17o38i1">${validate_component(Face, "Face").$$render($$result, { faceId: 3 }, {}, {})} ${validate_component(Face, "Face").$$render($$result, { faceId: 2 }, {}, {})} ${validate_component(Face, "Face").$$render($$result, { faceId: 6 }, {}, {})} ${validate_component(Face, "Face").$$render($$result, { faceId: 5 }, {}, {})}</div> <a href="/" class="close unstyled svelte-17o38i1">${validate_component(X, "CloseIcon").$$render($$result, {}, {}, {})} </a>`;
});

export { Board as B, PreGameDecoration as P, X, getCurrentUser as g, useSelector as u };
//# sourceMappingURL=PreGameDecoration-631293ba.js.map
