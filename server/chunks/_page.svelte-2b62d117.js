import { c as create_ssr_component, v as validate_component, e as escape, b as spread, d as escape_object, f as add_attribute } from './ssr-0f977c41.js';
import { P as Paragraph, A as Actions, B as Button, a as Polygon } from './Paragraph-ecb098cf.js';
import { S as Section } from './Section-ef72d05f.js';
import { H as Heading } from './Heading-73f1ef21.js';

const css$3 = {
  code: ".horizontal.svelte-gp13g5.svelte-gp13g5{grid-gap:1.5rem;align-items:center;display:grid;gap:1.5rem;grid-template-columns:1fr;grid-template-rows:auto auto}.horizontal.svelte-gp13g5 .left.svelte-gp13g5,.horizontal.svelte-gp13g5 .right.svelte-gp13g5{position:relative}@media screen and (min-width:800px){.horizontal.svelte-gp13g5.svelte-gp13g5{grid-template-rows:1fr}.horizontal.svelte-gp13g5 .left.svelte-gp13g5{display:block;min-width:0}.horizontal.partition-1-1.svelte-gp13g5.svelte-gp13g5{grid-template-columns:1fr 1fr}.horizontal.partition-1-2.svelte-gp13g5.svelte-gp13g5{grid-template-columns:1fr 2fr}.horizontal.partition-2-1.svelte-gp13g5.svelte-gp13g5{grid-template-columns:2fr 1fr}}",
  map: null
};
const Horizontal = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { partition = "1-1" } = $$props;
  if ($$props.partition === void 0 && $$bindings.partition && partition !== void 0)
    $$bindings.partition(partition);
  $$result.css.add(css$3);
  return `<div class="${"horizontal partition-" + escape(partition, true) + " svelte-gp13g5"}"><div class="left svelte-gp13g5">${slots.left ? slots.left({}) : ``}</div> <div class="right svelte-gp13g5">${slots.right ? slots.right({}) : ``}</div> </div>`;
});
const DOCS_URL = "https://github.com/foryouandyourcustomers/the-hidden-threat/tree/main/docs/";
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
const Arrow_down_circle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<svg${spread(
    [
      { viewBox: "0 0 24 24" },
      { width: "1.2em" },
      { height: "1.2em" },
      escape_object($$props)
    ],
    {}
  )}><!-- HTML_TAG_START -->${`<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8m-4-4l4 4l4-4"/></g>`}<!-- HTML_TAG_END --></svg>`;
});
const css$2 = {
  code: ".card.svelte-ag71c2.svelte-ag71c2{background:var(--color-bg-secondary);border-radius:var(--radius-md);box-shadow:0 0 1.75rem rgba(28,37,38,.467);overflow:hidden}.card.svelte-ag71c2 header.svelte-ag71c2{align-items:flex-end;background-color:var(--color-bg);background:var(--background-image) no-repeat center;background-size:cover;display:flex;height:9rem;justify-content:flex-start;position:relative}.card.svelte-ag71c2 header a.svelte-ag71c2{display:block;height:1.75rem;position:absolute;right:.75rem;top:.75rem;width:1.75rem}.card.svelte-ag71c2 header a.svelte-ag71c2 svg{height:100%;width:100%}.card.svelte-ag71c2 .content.svelte-ag71c2{padding:1rem}.card.svelte-ag71c2 h2.svelte-ag71c2{background:var(--color-bg-secondary);border-top-right-radius:var(--radius-md);font:var(--display-h3);padding:.5rem 1rem;text-transform:uppercase}.card.svelte-ag71c2 h3.svelte-ag71c2{font:var(--display-h5)}.card.svelte-ag71c2 p.svelte-ag71c2{font:var(--text-regular)}",
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
  return `<div class="card svelte-ag71c2"><header class="svelte-ag71c2"><h2 class="svelte-ag71c2">${escape(title)}</h2> <a target="_blank"${add_attribute("href", downloadLink, 0)} title="Download starten" class="svelte-ag71c2">${validate_component(Arrow_down_circle, "DownloadIcon").$$render($$result, {}, {}, {})}</a></header> <div class="content svelte-ag71c2"><h3 class="svelte-ag71c2">${escape(subtitle)}</h3> <p class="svelte-ag71c2">${slots.default ? slots.default({}) : ``}</p> <a target="_blank"${add_attribute("href", downloadLink, 0)} class="svelte-ag71c2">Download starten</a></div> </div>`;
});
const css$1 = {
  code: ".bg-polygon-blue.svelte-1yw1cqw{height:15rem;left:1.5rem;position:absolute;rotate:-20deg;top:15rem;transform-origin:top left;width:15rem;z-index:-1}.bg-polygon-black.svelte-1yw1cqw{bottom:1.5rem;height:10rem;position:absolute;right:1.5rem;width:10rem;z-index:-1}.cards.svelte-1yw1cqw{grid-gap:1.5rem;display:grid;gap:1.5rem;grid-template-columns:repeat(auto-fit,minmax(10rem,1fr));margin-left:auto;margin-right:auto;margin-top:2.5rem;max-width:56rem}",
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
        return `<div class="bg-polygon-blue svelte-1yw1cqw">${validate_component(Polygon, "Polygon").$$render($$result, { color: "blue" }, {}, {})}</div> <div class="bg-polygon-black svelte-1yw1cqw">${validate_component(Polygon, "Polygon").$$render($$result, { color: "black" }, {}, {})}</div> ${validate_component(Heading, "Heading").$$render($$result, { centered: true, size: "lg" }, {}, {
          default: () => {
            return `Analoge Spielelemente zum Download`;
          }
        })} ${validate_component(Paragraph, "Paragraph").$$render($$result, { centered: true, size: "lg" }, {}, {
          default: () => {
            return `Doch lieber analog? Das Spiel kann auch zusammen am Tisch gespielt werden. Alles was dazu
    gebraucht wird, ist hier zum Download bereitgestellt. Laden Sie alle Spielmaterialien herunter
    und drucken Sie diese einfach aus.`;
          }
        })} <div class="cards svelte-1yw1cqw"><div style="display: contents; --background-image:url('/images/analog-cards.jpg');">${validate_component(AnalogGameCard, "AnalogGameCard").$$render(
          $$result,
          {
            title: "Spielkarten",
            subtitle: "Sie brauchen noch weitere Spielkarten?",
            downloadLink: DOCS_URL + "Spielkarten/"
          },
          {},
          {
            default: () => {
              return `Hier finden Sie das komplette Kartendeck.`;
            }
          }
        )}</div> <div style="display: contents; --background-image:url('/images/analog-board.jpg');">${validate_component(AnalogGameCard, "AnalogGameCard").$$render(
          $$result,
          {
            title: "Spielbrett",
            subtitle: "Sie benötigen noch ein Spielbrett?",
            downloadLink: DOCS_URL + "Spielbrett/"
          },
          {},
          {
            default: () => {
              return `Es liegen beide Spielbretter zum Download für Sie bereit.`;
            }
          }
        )}</div> <div style="display: contents; --background-image:url('/images/analog-rules.jpg');">${validate_component(AnalogGameCard, "AnalogGameCard").$$render(
          $$result,
          {
            title: "Spielregeln",
            subtitle: "Nicht mehr alle Regeln oder Gegenstände parat?",
            downloadLink: DOCS_URL + "Spielregeln.pdf"
          },
          {},
          {
            default: () => {
              return `Finden Sie alles in den Spielregeln für das Brettspiel.`;
            }
          }
        )}</div></div>`;
      }
    }
  )}`;
});
const css = {
  code: ".title.svelte-19sqy9p{margin-bottom:3rem;text-align:center}.bg-polygon-orange.svelte-19sqy9p{position:absolute;right:0;rotate:-60deg;top:-4rem;width:10rem}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${validate_component(Section, "Section").$$render($$result, { width: "sm", bg: "fade" }, {}, {
    default: () => {
      return `<h2 class="title auto svelte-19sqy9p" data-svelte-h="svelte-c2buvw">Die digitale Variante zum Tabletop</h2> <img src="/images/landing-page-teaser.png" alt="The physical board game"> ${validate_component(Paragraph, "Paragraph").$$render($$result, { size: "lg" }, {}, {
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
      return `<div class="bg-polygon-orange svelte-19sqy9p">${validate_component(Polygon, "Polygon").$$render($$result, { color: "orange" }, {}, {})}</div> ${validate_component(Horizontal, "Horizontal").$$render($$result, {}, {}, {
        right: () => {
          return `<div slot="right">${validate_component(Heading, "Heading").$$render($$result, { size: "md" }, {}, {
            default: () => {
              return `Spielziel`;
            }
          })} ${validate_component(Paragraph, "Paragraph").$$render($$result, {}, {}, {
            default: () => {
              return `<p data-svelte-h="svelte-jv8eqn">Das Ziel des Spiels ist es, dass die Verteidigung durch den Schutz der Supply Chain Stufen
          so viele Resilienzpunkte wie möglich sammelt und verhindert, dass die Angreifer:innen
          Schadenspunkte erhalten. Gleichzeitig versucht die Verteidigung, die angreifende
          Spielfigur zu enttarnen, während diese sich bemüht, unerkannt zu bleiben und weitere
          Angriffe zu planen.</p> <p data-svelte-h="svelte-d6jxjx">Am Ende gewinnt das Team, das die höchste Punktzahl erzielt hat.</p>`;
            }
          })} ${validate_component(Actions, "Actions").$$render($$result, { align: "left" }, {}, {
            default: () => {
              return `${validate_component(Button, "Button").$$render(
                $$result,
                {
                  target: "_blank",
                  href: DOCS_URL + "Spielregeln.pdf",
                  size: "small"
                },
                {},
                {
                  default: () => {
                    return `${validate_component(Arrow_down_to_line, "DownloadIcon").$$render($$result, {}, {}, {})} Spielanleitung herunterladen`;
                  }
                }
              )}`;
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
//# sourceMappingURL=_page.svelte-2b62d117.js.map
