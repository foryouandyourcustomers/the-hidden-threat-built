import { c as create_ssr_component, a as subscribe, i as add_styles, e as escape, f as add_attribute, v as validate_component } from './ssr-ea380d77.js';
import { r as readable } from './index2-863c54a1.js';
import { g as getGameContext } from './game-context-19a9f73b.js';
import { n as getUser } from './user-e3413fb3.js';

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
  code: ".header.svelte-17fjqxi{align-items:center;background:linear-gradient(180deg,rgba(43,52,72,0),rgba(43,52,72,.663));display:grid;grid-template-columns:[logo-start] 42rem [logo-end score-start] 22rem [score-end jokers-start] 1fr [jokers-end options-start] auto [options-end];height:var(--size-header-height);padding-left:3rem;padding-right:1rem;position:relative}.title.svelte-17fjqxi{font:var(--display-h2);font-size:var(--scale-4);grid-area:logo;text-transform:uppercase}",
  map: null
};
const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$1);
  return `<div class="header svelte-17fjqxi"><div class="title svelte-17fjqxi" data-svelte-h="svelte-xbe4by">The hidden threat</div> ${slots.default ? slots.default({}) : ``} </div>`;
});
const css = {
  code: ".board-wrapper.svelte-ovklwv{align-content:center;background:#000;display:grid;height:100%;justify-content:center;place-content:center;width:100%}.board.svelte-ovklwv{grid-gap:1rem;background-color:var(--color-bg);border-radius:var(--radius-sm);display:grid;gap:1rem;grid-template-rows:auto 1fr;height:var(--size-game-height);overflow:hidden;position:relative;scale:var(--board-scale);transform-origin:center;width:var(--size-game-width)}.board.side-defense.svelte-ovklwv{outline:10px solid var(--color-blue-medium)}.board.side-attack.svelte-ovklwv{outline:10px solid var(--color-red-medium)}.board.backdrop.svelte-ovklwv{background-image:url(/images/board-backdrop.svg);background-repeat:no-repeat;background-size:cover}.content.svelte-ovklwv{isolation:isolate}.content.padded.svelte-ovklwv{padding:4rem 7rem}",
  map: null
};
const Board = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let $adminSide, $$unsubscribe_adminSide;
  let { reportMousePosition = void 0 } = $$props;
  let { showBackdrop = false } = $$props;
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
  if ($$props.paddedContent === void 0 && $$bindings.paddedContent && paddedContent !== void 0)
    $$bindings.paddedContent(paddedContent);
  $$result.css.add(css);
  $$unsubscribe_adminSide();
  return ` <div class="board-wrapper svelte-ovklwv"${add_styles({ "--board-scale": scale })}> <div class="${[
    "board " + escape($adminSide ? `side-${$adminSide}` : "", true) + " svelte-ovklwv",
    showBackdrop ? "backdrop" : ""
  ].join(" ").trim()}"${add_attribute("this", gameContainer, 0)}>${validate_component(Header, "Header").$$render($$result, {}, {}, {
    default: () => {
      return `${slots.header ? slots.header({}) : ``}`;
    }
  })} <div class="${["content svelte-ovklwv", paddedContent ? "padded" : ""].join(" ").trim()}">${slots.default ? slots.default({}) : ``}</div> ${slots.overlays ? slots.overlays({}) : ``}</div> </div>`;
});

export { Board as B, getCurrentUser as g, useSelector as u };
//# sourceMappingURL=Board-02bbb246.js.map
