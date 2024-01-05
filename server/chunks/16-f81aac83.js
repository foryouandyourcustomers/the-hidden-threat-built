import { g as getSharedGameContext } from './index3-be69e8c3.js';
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
const component = async () => component_cache ??= (await import('./_page.svelte-a19d99a8.js')).default;
const universal_id = "src/routes/game/[gameId=uid]/+page.ts";
const server_id = "src/routes/game/[gameId=uid]/+page.server.ts";
const imports = ["_app/immutable/nodes/16.ec10841b.js","_app/immutable/chunks/scheduler.9231f7ad.js","_app/immutable/chunks/index.cd525813.js","_app/immutable/chunks/index.cbaeab23.js","_app/immutable/chunks/PreGameDecoration.43e23a23.js","_app/immutable/chunks/game-context.978a1c0d.js","_app/immutable/chunks/Face.063e1e75.js","_app/immutable/chunks/Heading.470aa6b4.js","_app/immutable/chunks/items.262060bb.js","_app/immutable/chunks/Polygon.58299097.js"];
const stylesheets = ["_app/immutable/assets/16.7f5b4bc7.css","_app/immutable/assets/PreGameDecoration.5c7df1d2.css","_app/immutable/assets/Face.8b646817.css","_app/immutable/assets/Heading.02ea3cfd.css","_app/immutable/assets/items.7ebb55cf.css","_app/immutable/assets/Polygon.fed6d67b.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=16-f81aac83.js.map
