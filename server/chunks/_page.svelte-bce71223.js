import { c as create_ssr_component, v as validate_component, e as escape, b as spread, d as escape_object, f as add_attribute } from './ssr-b0d2ddaa.js';
import { S as Section } from './Section-9390a30c.js';
import { P as Paragraph, A as Actions } from './Paragraph-f2708e5e.js';
import { B as Button } from './Button-26ba6e00.js';
import { H as Heading } from './Heading-bb3c9ecf.js';
import './names-11b10067.js';

const css$3 = {
  code: ".horizontal.svelte-sn8i91.svelte-sn8i91{grid-gap:1.5rem;display:grid;gap:1.5rem;grid-template-columns:1fr;grid-template-rows:auto auto}.horizontal.svelte-sn8i91 .left.svelte-sn8i91,.horizontal.svelte-sn8i91 .right.svelte-sn8i91{position:relative}@media screen and (min-width:800px){.horizontal.svelte-sn8i91.svelte-sn8i91{grid-template-rows:1fr}.horizontal.svelte-sn8i91 .left.svelte-sn8i91{display:block;min-width:0}.horizontal.partition-1-1.svelte-sn8i91.svelte-sn8i91{grid-template-columns:1fr 1fr}.horizontal.partition-1-2.svelte-sn8i91.svelte-sn8i91{grid-template-columns:1fr 2fr}.horizontal.partition-2-1.svelte-sn8i91.svelte-sn8i91{grid-template-columns:2fr 1fr}}",
  map: null
};
const Horizontal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { partition = "1-1" } = $$props;
  if ($$props.partition === void 0 && $$bindings.partition && partition !== void 0)
    $$bindings.partition(partition);
  $$result.css.add(css$3);
  return `<div class="${"horizontal partition-" + escape(partition, true) + " svelte-sn8i91"}"><div class="left svelte-sn8i91">${slots.left ? slots.left({}) : ``}</div> <div class="right svelte-sn8i91">${slots.right ? slots.right({}) : ``}</div> </div>`;
});
const Arrow_down_to_line = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread(
    [
      { viewBox: "0 0 24 24" },
      { width: "1.2em" },
      { height: "1.2em" },
      escape_object($$props)
    ],
    {}
  )}><!-- HTML_TAG_START -->${`<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 17V3m-6 8l6 6l6-6m1 10H5"/>`}<!-- HTML_TAG_END --></svg>`;
});
const Polygon = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { color = "orange" } = $$props;
  if ($$props.color === void 0 && $$bindings.color && color !== void 0)
    $$bindings.color(color);
  return `<svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">${color === "orange" ? `<path d="M140 81.6038L139.321 136.333L72.1412 74.4597L140 81.6038Z" fill="#FCB337"></path> <path d="M72.1412 74.4597L139.321 136.333L43.4262 112.105L72.1412 74.4597Z" fill="#F49C07"></path> <path d="M119.334 3L140 81.6038L72.1412 74.4597L119.334 3Z" fill="#EE8F20"></path> <path d="M119.334 3L72.1412 74.4597L50.4998 15.9187L119.334 3Z" fill="#F49C07"></path> <path d="M72.1412 74.4597L43.4262 112.105L0 53.8032L72.1412 74.4597Z" fill="#EE8F20"></path> <path d="M50.4998 15.9186L72.1412 74.4597L0 53.8032L50.4998 15.9186Z" fill="#FCB337"></path>` : `${color === "red" ? `<path d="M12.8316 77.549L0 115.755L72.9167 86.0966L12.8316 77.549Z" fill="#F03A50"></path> <path d="M72.9167 86.0966L0 115.755L88.3759 118L72.9167 86.0966Z" fill="#D32746"></path> <path d="M49.8724 27L12.8316 77.549L72.9167 86.0966L49.8724 27Z" fill="#B91235"></path> <path d="M49.8725 27L72.9167 86.0966L105.876 49.6949L49.8725 27Z" fill="#D32746"></path> <path d="M72.9167 86.0966L88.3758 118L140 86.0966H72.9167Z" fill="#F03A50"></path> <path d="M105.876 49.6949L72.9167 86.0966H140L105.876 49.6949Z" fill="#B91235"></path>` : `${color === "green" ? `<path d="M35.3397 42.9673L97.3819 126L140 76.1354L35.3397 42.9673Z" fill="#97A022"></path> <path d="M35.3396 42.9673L0 118.214L97.3819 126L35.3396 42.9673Z" fill="#B5BF39"></path> <path d="M35.3396 42.9673L140 76.1354L123.905 13L35.3396 42.9673Z" fill="#C7CF5A"></path>` : `${color === "blue" ? `<path d="M0 40.8268L74.116 106.272L82.0411 31.1625L0 40.8268Z" fill="#2C2B76"></path> <path d="M0 40.8268L40.2578 115L74.116 106.272L0 40.8268Z" fill="#5150A8"></path> <path d="M82.0411 31.1625L101.258 94.1147L140 24L82.0411 31.1625Z" fill="#3B3A8E"></path> <path d="M82.041 31.1625L74.116 106.272L101.258 94.1147L82.041 31.1625Z" fill="#5150A8"></path>` : `${color === "black" ? `<path d="M0 53.6991L74.116 119.265L79.4552 12L0 53.6991Z" fill="#374243"></path> <path d="M0 53.6991L40.2578 128L74.116 119.265L0 53.6991Z" fill="#1C2526"></path> <path d="M79.4552 12L101.258 107.085L140 36.8412L79.4552 12Z" fill="#495556"></path> <path d="M79.4552 12L74.116 119.265L101.258 107.085L79.4552 12Z" fill="#1C2526"></path>` : `${color === "red-angriff" ? `<path d="M57.42 28L75.0497 119L128.489 95.3867L57.42 28Z" fill="#A40224"></path> <path d="M57.42 28L0 74.8832L75.0497 119L57.42 28Z" fill="#D32746"></path> <path d="M57.42 28L128.489 95.3867L140 38.2708L57.42 28Z" fill="#F03A50"></path>` : ``}`}`}`}`}`}</svg>`;
});
const css$2 = {
  code: ".card.svelte-1wr4pom.svelte-1wr4pom{background:var(--color-bg-secondary);border-radius:var(--radius-md);box-shadow:0 0 25px rgba(28,37,38,.467);overflow:hidden}.card.svelte-1wr4pom header.svelte-1wr4pom{align-items:flex-end;background:var(--color-bg);display:flex;height:9rem;justify-content:flex-start}.card.svelte-1wr4pom .content.svelte-1wr4pom{padding:1rem}.card.svelte-1wr4pom h2.svelte-1wr4pom{background:var(--color-bg-secondary);border-top-right-radius:var(--radius-md);font:var(--display-h3);padding:.5rem 1rem;text-transform:uppercase}.card.svelte-1wr4pom h3.svelte-1wr4pom{font:var(--display-h4)}.card.svelte-1wr4pom p.svelte-1wr4pom{font:var(--text-regular)}",
  map: null
};
const AnalogGameCard = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { title } = $$props;
  let { subtitle } = $$props;
  let { downloadLink } = $$props;
  if ($$props.title === void 0 && $$bindings.title && title !== void 0)
    $$bindings.title(title);
  if ($$props.subtitle === void 0 && $$bindings.subtitle && subtitle !== void 0)
    $$bindings.subtitle(subtitle);
  if ($$props.downloadLink === void 0 && $$bindings.downloadLink && downloadLink !== void 0)
    $$bindings.downloadLink(downloadLink);
  $$result.css.add(css$2);
  return `<div class="card svelte-1wr4pom"><header class="svelte-1wr4pom"><h2 class="svelte-1wr4pom">${escape(title)}</h2></header> <div class="content svelte-1wr4pom"><h3 class="svelte-1wr4pom">${escape(subtitle)}</h3> <p class="svelte-1wr4pom">${slots.default ? slots.default({}) : ``}</p> <a${add_attribute("href", downloadLink, 0)}>Download starten</a></div> </div>`;
});
const css$1 = {
  code: ".bg-polygon-blue.svelte-87got1{left:1.5rem;position:absolute;rotate:-20deg;scale:1.5;top:6rem;transform-origin:top left;z-index:0}.bg-polygon-black.svelte-87got1{bottom:1.5rem;position:absolute;right:1.5rem;z-index:-1}.cards.svelte-87got1{grid-gap:1.5rem;display:grid;gap:1.5rem;grid-template-columns:repeat(auto-fit,minmax(10rem,1fr));margin-left:auto;margin-right:auto;margin-top:2.5rem;max-width:56rem}",
  map: null
};
const AnalogGame = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css$1);
  return `${validate_component(Section, "Section").$$render(
    $$result,
    {
      width: "lg",
      bg: "light",
      bgFill: "content"
    },
    {},
    {
      default: () => {
        return `<div class="bg-polygon-blue svelte-87got1">${validate_component(Polygon, "Polygon").$$render($$result, { color: "blue" }, {}, {})}</div> <div class="bg-polygon-black svelte-87got1">${validate_component(Polygon, "Polygon").$$render($$result, { color: "black" }, {}, {})}</div> ${validate_component(Heading, "Heading").$$render($$result, { centered: true, size: "lg" }, {}, {
          default: () => {
            return `Analoge Spielelemente zum Download`;
          }
        })} ${validate_component(Paragraph, "Paragraph").$$render($$result, { centered: true, size: "lg" }, {}, {
          default: () => {
            return `Doch lieber analog? Das Spiel kann auch zusammen am Tisch gespielt werden. Alles was dazu
    gebraucht wird, ist hier zum Download bereitgestellt. Laden Sie alle Spielmaterialien herunter
    und drucken Sie diese einfach aus.`;
          }
        })} <div class="cards svelte-87got1">${validate_component(AnalogGameCard, "AnalogGameCard").$$render(
          $$result,
          {
            title: "Spielbrett",
            subtitle: "Sie benötigen noch weitere Spielkarten?",
            downloadLink: ""
          },
          {},
          {
            default: () => {
              return `Hier finden Sie das komplette Kartendeck.`;
            }
          }
        )} ${validate_component(AnalogGameCard, "AnalogGameCard").$$render(
          $$result,
          {
            title: "Spielkarten",
            subtitle: "Sie brauchen ein weiteres Spielbrett für den Angreifer?",
            downloadLink: ""
          },
          {},
          {
            default: () => {
              return `Es liegt für Sie im A4-Format zum Download bereit.`;
            }
          }
        )} ${validate_component(AnalogGameCard, "AnalogGameCard").$$render(
          $$result,
          {
            title: "Spielregeln",
            subtitle: "Nicht mehr alle Regeln oder Gegenstände parat?",
            downloadLink: ""
          },
          {},
          {
            default: () => {
              return `Finden Sie alles in den Spielregeln für das Brettspiel.`;
            }
          }
        )}</div>`;
      }
    }
  )}`;
});
const css = {
  code: ".bg-polygon-orange.svelte-pzdmji{position:absolute;right:0;rotate:-60deg;scale:1.2;top:-3rem}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${validate_component(Section, "Section").$$render($$result, { width: "sm", bg: "fade" }, {}, {
    default: () => {
      return `${validate_component(Heading, "Heading").$$render($$result, { size: "xl" }, {}, {
        default: () => {
          return `Die digitale Variante zum Tabletop`;
        }
      })} ${validate_component(Paragraph, "Paragraph").$$render($$result, { size: "lg" }, {}, {
        default: () => {
          return `In diesem fesselnden Spiel werden Sie unmittelbar Zeuge von Angriffen auf Lieferketten.
    Schlüpfen Sie entweder in eine bedeutende Rolle in der Verteidigung oder arbeiten Sie im
    Verborgenen als Teil des Angriffs.`;
        }
      })} ${validate_component(Paragraph, "Paragraph").$$render($$result, { size: "lg" }, {}, {
        default: () => {
          return `Unvorhergesehene Ereignisse müssen gemeistert und unter Druck wichtige Entscheidungen getroffen
    werden, um die Lieferketten zu schützen und Resilienz aufzubauen. Durch Teamarbeit und
    strategisches Denken können Angriffe abgewehrt und die angreifende Person aufgespürt werden.
    Sind Sie bereit, diese Verantwortung anzunehmen und sich der Aufgabe zu stellen?`;
        }
      })} ${validate_component(Actions, "Actions").$$render($$result, { align: "left" }, {}, {
        default: () => {
          return `${validate_component(Button, "Button").$$render($$result, { primary: true, href: "/game/new" }, {}, {
            default: () => {
              return `Neues Spiel starten`;
            }
          })}`;
        }
      })}`;
    }
  })} ${validate_component(Section, "Section").$$render($$result, { width: "md" }, {}, {
    default: () => {
      return `<div class="bg-polygon-orange svelte-pzdmji">${validate_component(Polygon, "Polygon").$$render($$result, { color: "orange" }, {}, {})}</div> ${validate_component(Horizontal, "Horizontal").$$render($$result, {}, {}, {
        right: () => {
          return `<div slot="right">${validate_component(Heading, "Heading").$$render($$result, { size: "md" }, {}, {
            default: () => {
              return `Details zum Spiel`;
            }
          })} ${validate_component(Paragraph, "Paragraph").$$render($$result, {}, {}, {
            default: () => {
              return `<p data-svelte-h="svelte-4ignfk">Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
          invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
          accusam et justo duo dolores et ea rebum.</p> <p data-svelte-h="svelte-1sdnkcd">Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem
          ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt
          ut labore et dolore magna aliquyam erat,</p>`;
            }
          })} ${validate_component(Actions, "Actions").$$render($$result, { align: "left" }, {}, {
            default: () => {
              return `${validate_component(Button, "Button").$$render($$result, { size: "small" }, {}, {
                default: () => {
                  return `${validate_component(Arrow_down_to_line, "DownloadIcon").$$render($$result, {}, {}, {})} Spielanleitung herunterladen`;
                }
              })}`;
            }
          })}</div>`;
        },
        left: () => {
          return `<img slot="left" src="/images/board-game.png" alt="The physical board game">`;
        }
      })}`;
    }
  })} ${validate_component(AnalogGame, "AnalogGame").$$render($$result, {}, {}, {})}`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-bce71223.js.map
