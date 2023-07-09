import { g as getGame } from './global-770b5537.js';
import { r as redirect } from './index-39e97e00.js';

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
    throw redirect(303, `/game/${params.gameId}/join`);
  }
  return {
    gameId: game.id,
    hostUserId: snapshot.context.hostUserId
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 11;
const component = async () => (await import('./_page.svelte-a4cdf789.js')).default;
const file = '_app/immutable/entry/game-_gameId_uid_-page.svelte.0f706913.js';
const universal_id = "src/routes/game/[gameId=uid]/+page.ts";
const server_id = "src/routes/game/[gameId=uid]/+page.server.ts";
const imports = ["_app/immutable/entry/game-_gameId_uid_-page.svelte.0f706913.js","_app/immutable/chunks/index.8741fe9c.js","_app/immutable/chunks/index.e0b1c8ed.js","_app/immutable/entry/game-_gameId_uid_-page.ts.fde3a77e.js","_app/immutable/chunks/_page.b14944b6.js"];
const stylesheets = ["_app/immutable/assets/_page.b814d52c.css"];
const fonts = [];

export { component, file, fonts, imports, index, _page_server_ts as server, server_id, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=11-b797bccd.js.map
