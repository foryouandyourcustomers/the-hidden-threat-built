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

const index = 5;
let component_cache;
const component = async () => component_cache ??= (await import('./layout.svelte-b269e330.js')).default;
const server_id = "src/routes/game/[gameId=uid]/+layout.server.ts";
const imports = ["_app/immutable/nodes/5.d3a7fe66.js","_app/immutable/chunks/5.343fcabf.js","_app/immutable/chunks/scheduler.644efde8.js","_app/immutable/chunks/index.9b0c7df8.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=5-4c2a4b85.js.map