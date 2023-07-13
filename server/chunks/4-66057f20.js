import { g as getGame } from './global-09c6ed76.js';
import { e as error } from './index-a4865dbd.js';

const load = async ({ params, locals }) => {
  const gameId = params.gameId;
  const game = getGame(gameId);
  if (!game) {
    throw error(404, "Game not found");
  }
  locals.game = game;
};

var _layout_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 4;
let component_cache;
const component = async () => component_cache ??= (await import('./layout.svelte-d29182fb.js')).default;
const server_id = "src/routes/game/[gameId=uid]/+layout.server.ts";
const imports = ["_app/immutable/nodes/4.fa7084f2.js","_app/immutable/chunks/4.ceca2eb3.js","_app/immutable/chunks/scheduler.03dcb200.js","_app/immutable/chunks/index.1583bf7b.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=4-66057f20.js.map
