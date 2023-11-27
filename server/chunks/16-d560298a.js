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
const component = async () => component_cache ??= (await import('./_page.svelte-b41dffa7.js')).default;
const universal_id = "src/routes/game/[gameId=uid]/+page.ts";
const server_id = "src/routes/game/[gameId=uid]/+page.server.ts";
const imports = ["_app/immutable/nodes/16.bc7f7e12.js","_app/immutable/chunks/scheduler.6b9f5a51.js","_app/immutable/chunks/index.994f439d.js","_app/immutable/chunks/index.39a8c634.js","_app/immutable/chunks/Board.5172aae3.js","_app/immutable/chunks/items.4930b858.js","_app/immutable/chunks/Heading.af2bd395.js","_app/immutable/chunks/Paragraph.f0804e3e.js","_app/immutable/chunks/Face.8ae4a79f.js","_app/immutable/chunks/Polygon.1661afc7.js"];
const stylesheets = ["_app/immutable/assets/16.091af323.css","_app/immutable/assets/Board.025e7114.css","_app/immutable/assets/Face.7ebb55cf.css","_app/immutable/assets/Heading.02ea3cfd.css","_app/immutable/assets/Paragraph.942e02ab.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=16-d560298a.js.map
