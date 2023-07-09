import { g as getGame } from './global-770b5537.js';
import { e as error } from './index-39e97e00.js';

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
const component = async () => (await import('./layout.svelte-40ec306d.js')).default;
const file = '_app/immutable/entry/layout.svelte.bef78746.js';
const server_id = "src/routes/game/[gameId=uid]/+layout.server.ts";
const imports = ["_app/immutable/entry/layout.svelte.bef78746.js","_app/immutable/chunks/index.8741fe9c.js"];
const stylesheets = [];
const fonts = [];

export { component, file, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=4-66c19a02.js.map
