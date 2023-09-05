import { c as create_ssr_component, e as escape } from './ssr-35980408.js';

const css$1 = {
  code: ".actions.svelte-177b0px{align-items:center;display:flex;gap:1rem;margin-top:2.5rem}.actions.align-left.svelte-177b0px{justify-content:flex-start}.actions.align-right.svelte-177b0px{justify-content:flex-end}",
  map: null
};
const Actions = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { align = "right" } = $$props;
  if ($$props.align === void 0 && $$bindings.align && align !== void 0)
    $$bindings.align(align);
  $$result.css.add(css$1);
  return `<div class="${"actions align-" + escape(align, true) + " svelte-177b0px"}">${slots.default ? slots.default({}) : ``} </div>`;
});
const css = {
  code: "p.svelte-7ymvdw{margin-bottom:1.5rem;margin-top:1.5rem}p.width-default.svelte-7ymvdw{max-width:44rem}.centered.svelte-7ymvdw{margin-left:auto;margin-right:auto;text-align:center}.size-md.svelte-7ymvdw{font:var(--text-regular)}.size-lg.svelte-7ymvdw{font:var(--text-big)}.size-sm.svelte-7ymvdw{font:var(--text-small)}",
  map: null
};
const Paragraph = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { centered = false } = $$props;
  let { size = "md" } = $$props;
  let { width = "default" } = $$props;
  if ($$props.centered === void 0 && $$bindings.centered && centered !== void 0)
    $$bindings.centered(centered);
  if ($$props.size === void 0 && $$bindings.size && size !== void 0)
    $$bindings.size(size);
  if ($$props.width === void 0 && $$bindings.width && width !== void 0)
    $$bindings.width(width);
  $$result.css.add(css);
  return `<p class="${[
    "size-" + escape(size, true) + " width-" + escape(width, true) + " svelte-7ymvdw",
    centered ? "centered" : ""
  ].join(" ").trim()}">${slots.default ? slots.default({}) : ``}</p>`;
});
const Polygon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color = "orange" } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  return `<svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">${color === "orange" ? `<path d="M140 81.6038L139.321 136.333L72.1412 74.4597L140 81.6038Z" fill="#FCB337"></path> <path d="M72.1412 74.4597L139.321 136.333L43.4262 112.105L72.1412 74.4597Z" fill="#F49C07"></path> <path d="M119.334 3L140 81.6038L72.1412 74.4597L119.334 3Z" fill="#EE8F20"></path> <path d="M119.334 3L72.1412 74.4597L50.4998 15.9187L119.334 3Z" fill="#F49C07"></path> <path d="M72.1412 74.4597L43.4262 112.105L0 53.8032L72.1412 74.4597Z" fill="#EE8F20"></path> <path d="M50.4998 15.9186L72.1412 74.4597L0 53.8032L50.4998 15.9186Z" fill="#FCB337"></path>` : `${color === "red" ? `<path d="M12.8316 77.549L0 115.755L72.9167 86.0966L12.8316 77.549Z" fill="#F03A50"></path> <path d="M72.9167 86.0966L0 115.755L88.3759 118L72.9167 86.0966Z" fill="#D32746"></path> <path d="M49.8724 27L12.8316 77.549L72.9167 86.0966L49.8724 27Z" fill="#B91235"></path> <path d="M49.8725 27L72.9167 86.0966L105.876 49.6949L49.8725 27Z" fill="#D32746"></path> <path d="M72.9167 86.0966L88.3758 118L140 86.0966H72.9167Z" fill="#F03A50"></path> <path d="M105.876 49.6949L72.9167 86.0966H140L105.876 49.6949Z" fill="#B91235"></path>` : `${color === "green" ? `<path d="M35.3397 42.9673L97.3819 126L140 76.1354L35.3397 42.9673Z" fill="#97A022"></path> <path d="M35.3396 42.9673L0 118.214L97.3819 126L35.3396 42.9673Z" fill="#B5BF39"></path> <path d="M35.3396 42.9673L140 76.1354L123.905 13L35.3396 42.9673Z" fill="#C7CF5A"></path>` : `${color === "blue" ? `<path d="M0 40.8268L74.116 106.272L82.0411 31.1625L0 40.8268Z" fill="#2C2B76"></path> <path d="M0 40.8268L40.2578 115L74.116 106.272L0 40.8268Z" fill="#5150A8"></path> <path d="M82.0411 31.1625L101.258 94.1147L140 24L82.0411 31.1625Z" fill="#3B3A8E"></path> <path d="M82.041 31.1625L74.116 106.272L101.258 94.1147L82.041 31.1625Z" fill="#5150A8"></path>` : `${color === "black" ? `<path d="M0 53.6991L74.116 119.265L79.4552 12L0 53.6991Z" fill="#374243"></path> <path d="M0 53.6991L40.2578 128L74.116 119.265L0 53.6991Z" fill="#1C2526"></path> <path d="M79.4552 12L101.258 107.085L140 36.8412L79.4552 12Z" fill="#495556"></path> <path d="M79.4552 12L74.116 119.265L101.258 107.085L79.4552 12Z" fill="#1C2526"></path>` : `${color === "red-angriff" ? `<path d="M57.42 28L75.0497 119L128.489 95.3867L57.42 28Z" fill="#A40224"></path> <path d="M57.42 28L0 74.8832L75.0497 119L57.42 28Z" fill="#D32746"></path> <path d="M57.42 28L128.489 95.3867L140 38.2708L57.42 28Z" fill="#F03A50"></path>` : ``}`}`}`}`}`}</svg>`;
});

export { Actions as A, Paragraph as P, Polygon as a };
//# sourceMappingURL=Polygon-294533f8.js.map
