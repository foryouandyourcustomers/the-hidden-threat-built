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

const index = 16;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-7601c910.js')).default;
const universal_id = "src/routes/game/[gameId=uid]/+page.ts";
const server_id = "src/routes/game/[gameId=uid]/+page.server.ts";
const imports = ["_app/immutable/nodes/16.5e93efa1.js","_app/immutable/chunks/scheduler.1a6430be.js","_app/immutable/chunks/index.9140b2e6.js","_app/immutable/chunks/index.1000d87b.js","_app/immutable/chunks/Board.86fe2217.js","_app/immutable/chunks/items.e2ae919e.js","_app/immutable/chunks/Heading.59c4c413.js","_app/immutable/chunks/Paragraph.da636106.js","_app/immutable/chunks/Face.071c892e.js","_app/immutable/chunks/Polygon.dbef578a.js"];
const stylesheets = ["_app/immutable/assets/16.6d2657b7.css","_app/immutable/assets/Board.f0e28b25.css","_app/immutable/assets/Face.7ebb55cf.css","_app/immutable/assets/Heading.02ea3cfd.css","_app/immutable/assets/Paragraph.4230a04d.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=16-1cec41e5.js.map
