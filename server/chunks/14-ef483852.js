import { g as getSharedGameContext } from './index3-e8ad4754.js';
import { g as getGame } from './global-09c6ed76.js';
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

const index = 14;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-6e4650d7.js')).default;
const universal_id = "src/routes/game/[gameId=uid]/+page.ts";
const server_id = "src/routes/game/[gameId=uid]/+page.server.ts";
const imports = ["_app/immutable/nodes/14.d7a192f0.js","_app/immutable/chunks/scheduler.0e0379d3.js","_app/immutable/chunks/index.b1996567.js","_app/immutable/chunks/index.d071e8be.js","_app/immutable/chunks/Board.c3625c27.js","_app/immutable/chunks/items.30b03a22.js","_app/immutable/chunks/Heading.999fce17.js","_app/immutable/chunks/Paragraph.722d0890.js","_app/immutable/chunks/Face.3c022f1b.js","_app/immutable/chunks/Polygon.dec40219.js"];
const stylesheets = ["_app/immutable/assets/14.6d2657b7.css","_app/immutable/assets/Board.f0e28b25.css","_app/immutable/assets/Face.7ebb55cf.css","_app/immutable/assets/Heading.02ea3cfd.css","_app/immutable/assets/Paragraph.4230a04d.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=14-ef483852.js.map
