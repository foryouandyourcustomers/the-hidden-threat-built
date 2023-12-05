import { g as getSharedGameContext } from './index3-7678c32b.js';
import { a as getGame } from './global-b99bb08b.js';
import { r as redirect, e as error } from './index-a4865dbd.js';
import './_commonjsHelpers-24198af3.js';

const ssr = false;

var _page_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  ssr: ssr
});

const load = async ({ params, parent, locals }) => {
  const { userId } = await parent();
  const game = getGame(locals);
  const snapshot = game.machine.getSnapshot();
  if (!snapshot.context.users.find((user) => user.id === userId)) {
    if (snapshot.can({ type: "user joined", userId, userName: "" })) {
      throw redirect(303, `/game/${params.gameId}/join`);
    } else {
      throw error(403, "This game already started.");
    }
  }
  const sharedGameContext = getSharedGameContext(snapshot.context);
  return {
    machineInput: {
      userId,
      ...sharedGameContext
    }
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 16;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-041777ae.js')).default;
const universal_id = "src/routes/game/[gameId=uid]/+page.ts";
const server_id = "src/routes/game/[gameId=uid]/+page.server.ts";
const imports = ["_app/immutable/nodes/16.bbd2fff1.js","_app/immutable/chunks/scheduler.9575fd4f.js","_app/immutable/chunks/index.ae3d3fc3.js","_app/immutable/chunks/index.a8ce1c85.js","_app/immutable/chunks/Board.1f0dfd3a.js","_app/immutable/chunks/game-context.06b850d9.js","_app/immutable/chunks/FooterNav.7413425f.js","_app/immutable/chunks/items.a01df278.js","_app/immutable/chunks/Heading.db207678.js","_app/immutable/chunks/Paragraph.f42cea57.js","_app/immutable/chunks/Face.9ce1777d.js","_app/immutable/chunks/Polygon.fab36ba1.js"];
const stylesheets = ["_app/immutable/assets/16.13547607.css","_app/immutable/assets/Board.abb00679.css","_app/immutable/assets/FooterNav.ad7ef04e.css","_app/immutable/assets/Face.7ebb55cf.css","_app/immutable/assets/Heading.02ea3cfd.css","_app/immutable/assets/Paragraph.35536718.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=16-c877a714.js.map