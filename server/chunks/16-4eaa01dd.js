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
const component = async () => component_cache ??= (await import('./_page.svelte-5601a799.js')).default;
const universal_id = "src/routes/game/[gameId=uid]/+page.ts";
const server_id = "src/routes/game/[gameId=uid]/+page.server.ts";
const imports = ["_app/immutable/nodes/16.d1423be7.js","_app/immutable/chunks/scheduler.036a2d74.js","_app/immutable/chunks/index.e2632973.js","_app/immutable/chunks/index.07541d6e.js","_app/immutable/chunks/Board.600aff9e.js","_app/immutable/chunks/game-context.fd63b07d.js","_app/immutable/chunks/FooterNav.5db6a55f.js","_app/immutable/chunks/items.df106806.js","_app/immutable/chunks/Heading.3960fba6.js","_app/immutable/chunks/Polygon.6815d52a.js","_app/immutable/chunks/Face.a6916fd1.js"];
const stylesheets = ["_app/immutable/assets/16.d4b3e027.css","_app/immutable/assets/Board.abb00679.css","_app/immutable/assets/FooterNav.ad7ef04e.css","_app/immutable/assets/Face.7ebb55cf.css","_app/immutable/assets/Heading.02ea3cfd.css","_app/immutable/assets/Polygon.da286e9e.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=16-4eaa01dd.js.map
