import { g as getSharedGameContext } from './index3-b25e75a1.js';
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

const index = 14;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-0ac50129.js')).default;
const universal_id = "src/routes/game/[gameId=uid]/+page.ts";
const server_id = "src/routes/game/[gameId=uid]/+page.server.ts";
const imports = ["_app/immutable/nodes/14.c9b5108d.js","_app/immutable/chunks/scheduler.93b05707.js","_app/immutable/chunks/index.e4493cfb.js","_app/immutable/chunks/index.3d85e2e9.js","_app/immutable/chunks/game-context.d774e95e.js","_app/immutable/chunks/Item.0927ef06.js","_app/immutable/chunks/check.a6e495a7.js","_app/immutable/chunks/Face.9cbab6eb.js","_app/immutable/chunks/Heading.ecdaaed4.js","_app/immutable/chunks/Paragraph.57913173.js"];
const stylesheets = ["_app/immutable/assets/14.11cc9c54.css","_app/immutable/assets/Item.7ebb55cf.css","_app/immutable/assets/check.5c7df1d2.css","_app/immutable/assets/Face.bd2e2c8c.css","_app/immutable/assets/Heading.02ea3cfd.css","_app/immutable/assets/Paragraph.36586e1e.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=14-20e0b6bd.js.map
