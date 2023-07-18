import { g as getGame } from './global-09c6ed76.js';
import { r as redirect } from './index-a4865dbd.js';

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
    machineInput: {
      gameId: game.id,
      userId,
      hostUserId: snapshot.context.hostUserId,
      actions: snapshot.context.actions,
      attack: snapshot.context.attack,
      defense: snapshot.context.defense,
      users: snapshot.context.users
    }
  };
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 11;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-db8bb892.js')).default;
const universal_id = "src/routes/game/[gameId=uid]/+page.ts";
const server_id = "src/routes/game/[gameId=uid]/+page.server.ts";
const imports = ["_app/immutable/nodes/11.e365f4dc.js","_app/immutable/chunks/scheduler.03dcb200.js","_app/immutable/chunks/index.1583bf7b.js","_app/immutable/chunks/index.c110b09d.js"];
const stylesheets = ["_app/immutable/assets/11.b814d52c.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=11-c44f9429.js.map
