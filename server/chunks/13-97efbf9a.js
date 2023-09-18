import { g as getGame } from './global-09c6ed76.js';
import { g as getSharedGameContext } from './utils-e533b140.js';
import { r as redirect, e as error } from './index-a4865dbd.js';

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

const index = 13;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-9332de7f.js')).default;
const universal_id = "src/routes/game/[gameId=uid]/+page.ts";
const server_id = "src/routes/game/[gameId=uid]/+page.server.ts";
const imports = ["_app/immutable/nodes/13.93778412.js","_app/immutable/chunks/scheduler.60fb5a58.js","_app/immutable/chunks/index.02ea6f2d.js","_app/immutable/chunks/index.c3580b25.js","_app/immutable/chunks/items.a9fe0813.js","_app/immutable/chunks/spread.84d39b6c.js","_app/immutable/chunks/Polygon.a84805b6.js","_app/immutable/chunks/Button.192f9f1e.js","_app/immutable/chunks/Heading.e08ed19c.js","_app/immutable/chunks/Face.e26096ad.js"];
const stylesheets = ["_app/immutable/assets/13.a475027e.css","_app/immutable/assets/Polygon.26c5d88c.css","_app/immutable/assets/Button.e85abd37.css","_app/immutable/assets/Heading.c1be5a63.css","_app/immutable/assets/Face.7ebb55cf.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=13-97efbf9a.js.map
