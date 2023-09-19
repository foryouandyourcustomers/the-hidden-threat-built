import { c as create_ssr_component, v as validate_component, e as escape, b as spread, d as escape_object, f as add_attribute } from './ssr-35980408.js';
import { S as Section } from './Section-5904206b.js';
import { P as Paragraph, A as Actions, a as Polygon } from './Polygon-c521e3a7.js';
import { B as Button } from './Button-d4280ae9.js';
import { H as Heading } from './Heading-940bbdc5.js';
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
//# sourceMappingURL=_page.svelte-d6e730ae.js.map
