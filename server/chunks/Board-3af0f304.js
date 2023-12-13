import { c as create_ssr_component, a as subscribe, i as add_styles, e as escape, f as add_attribute, v as validate_component } from './ssr-ea380d77.js';
import { r as readable } from './index2-863c54a1.js';
import { g as getGameContext } from './game-context-19a9f73b.js';
import { n as getUser } from './user-e3413fb3.js';
import { F as FooterNav } from './FooterNav-16dc3408.js';

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
const css$1 = {
  code: '.header.svelte-kbs536{align-items:center;background-color:var(--color-blue-spielbrett);background:linear-gradient(180deg,rgba(43,52,72,0),rgba(43,52,72,.663));display:grid;grid-template-areas:"logo score jokers options";grid-template-columns:38rem 22rem 1fr auto;height:var(--size-header-height);padding-left:7rem;padding-right:1rem}.header.svelte-kbs536,.title.svelte-kbs536{position:relative}.title.svelte-kbs536{align-self:start;font-family:var(--font-display);font-size:var(--scale-4);grid-area:logo;line-height:2.5rem;text-transform:uppercase}.backdrop.svelte-kbs536{height:3.3125rem;left:1.875rem;position:absolute;top:0;width:21.625rem}',
  map: null
};
const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$1);
  return `<div class="header svelte-kbs536"><div class="backdrop svelte-kbs536" data-svelte-h="svelte-17ojy9"><svg width="346" height="53" viewBox="0 0 346 53" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M45 0H0l54 53-9-53Z" fill="#F03A50"></path><path d="M45 0h33L54 53 45 0Z" fill="#A40224"></path><path d="M346 38 330 0H78L54 53l292-15Z" fill="#D32746"></path></svg></div> <div class="title svelte-kbs536" data-svelte-h="svelte-xbe4by">The hidden threat</div> ${slots.default ? slots.default({}) : ``} </div>`;
});
const css = {
  code: ".board-wrapper.svelte-18ll0tp{--player-status-width:30rem;align-content:center;background:#000;display:grid;height:100%;justify-content:center;place-content:center;width:100%}.board.svelte-18ll0tp{grid-gap:.75rem;background-color:var(--color-bg);border-radius:var(--radius-sm);display:grid;gap:.75rem;grid-template-rows:auto 1fr;height:var(--size-game-height);overflow:hidden;position:relative;scale:var(--board-scale);transform-origin:center;width:var(--size-game-width)}.board.with-footer.svelte-18ll0tp{grid-template-rows:auto 1fr auto}.board.side-defense.svelte-18ll0tp{outline:10px solid var(--color-blue-medium)}.board.side-attack.svelte-18ll0tp{outline:10px solid var(--color-red-medium)}.board.backdrop.svelte-18ll0tp{background-image:url(/images/board-backdrop.svg);background-repeat:no-repeat;background-size:cover}.content.svelte-18ll0tp{isolation:isolate;overflow:hidden}.content.padded.svelte-18ll0tp{padding:1rem 7rem 0}.footer.svelte-18ll0tp{align-items:center;background-color:var(--color-blue-spielbrett);background:linear-gradient(0deg,rgba(43,52,72,0) 40.63%,rgba(43,52,72,.66));display:flex;height:3.75rem;justify-content:stretch;padding:0 7rem}.footer.svelte-18ll0tp>*{flex:1}",
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
  $$result.css.add(css);
  $$unsubscribe_adminSide();
  return ` <div class="board-wrapper svelte-18ll0tp"${add_styles({ "--board-scale": scale })}> <div class="${[
    "board " + escape($adminSide ? `side-${$adminSide}` : "", true) + " svelte-18ll0tp",
    (showBackdrop ? "backdrop" : "") + " " + (showFooter ? "with-footer" : "")
  ].join(" ").trim()}"${add_attribute("this", gameContainer, 0)}>${validate_component(Header, "Header").$$render($$result, {}, {}, {
    default: () => {
      return `${slots.header ? slots.header({}) : ``}`;
    }
  })} <div class="${["content svelte-18ll0tp", paddedContent ? "padded" : ""].join(" ").trim()}">${slots.default ? slots.default({}) : ``}</div> ${slots.overlays ? slots.overlays({}) : ``} ${showFooter ? `<div class="footer svelte-18ll0tp">${validate_component(FooterNav, "FooterNav").$$render($$result, {}, {}, {})}</div>` : ``}</div> </div>`;
});

export { Board as B, getCurrentUser as g, useSelector as u };
//# sourceMappingURL=Board-3af0f304.js.map
