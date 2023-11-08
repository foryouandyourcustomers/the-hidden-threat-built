import { g as getSharedGameContext } from './index3-7e2fa931.js';
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

const index = 14;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-c6a9f990.js')).default;
const universal_id = "src/routes/game/[gameId=uid]/+page.ts";
const server_id = "src/routes/game/[gameId=uid]/+page.server.ts";
const imports = ["_app/immutable/nodes/14.3c994a79.js","_app/immutable/chunks/scheduler.a29f8582.js","_app/immutable/chunks/index.4a3323ad.js","_app/immutable/chunks/index.d1925ba3.js","_app/immutable/chunks/Board.b3bb48eb.js","_app/immutable/chunks/items.1181bef2.js","_app/immutable/chunks/Heading.46b7fb0c.js","_app/immutable/chunks/Paragraph.405342b6.js","_app/immutable/chunks/Face.aa4604b7.js","_app/immutable/chunks/Polygon.3fb31f8e.js"];
const stylesheets = ["_app/immutable/assets/14.03b3d692.css","_app/immutable/assets/Board.f0e28b25.css","_app/immutable/assets/Heading.02ea3cfd.css","_app/immutable/assets/Paragraph.7e229384.css","_app/immutable/assets/Face.7ebb55cf.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=14-9bd992cc.js.map
