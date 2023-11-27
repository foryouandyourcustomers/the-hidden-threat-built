import { a as getGame } from './global-b99bb08b.js';
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

const index = 6;
let component_cache;
const component = async () => component_cache ??= (await import('./layout.svelte-0e238fe9.js')).default;
const server_id = "src/routes/game/[gameId=uid]/+layout.server.ts";
const imports = ["_app/immutable/nodes/6.8bbfcab8.js","_app/immutable/chunks/6.875a30fa.js","_app/immutable/chunks/scheduler.6b9f5a51.js","_app/immutable/chunks/index.994f439d.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=6-7167b9f3.js.map