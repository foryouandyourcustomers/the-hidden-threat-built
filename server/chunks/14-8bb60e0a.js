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
const component = async () => component_cache ??= (await import('./_page.svelte-ab73802b.js')).default;
const universal_id = "src/routes/game/[gameId=uid]/+page.ts";
const server_id = "src/routes/game/[gameId=uid]/+page.server.ts";
const imports = ["_app/immutable/nodes/14.17b532a7.js","_app/immutable/chunks/scheduler.c377f626.js","_app/immutable/chunks/index.0a4ea15f.js","_app/immutable/chunks/index.d870d639.js","_app/immutable/chunks/Board.cf6ffbed.js","_app/immutable/chunks/items.b68536e7.js","_app/immutable/chunks/Heading.fe6b320e.js","_app/immutable/chunks/Paragraph.227750d9.js","_app/immutable/chunks/Face.9fc31efa.js","_app/immutable/chunks/Polygon.1a3cb19e.js"];
const stylesheets = ["_app/immutable/assets/14.11ca6f0a.css","_app/immutable/assets/Board.f0e28b25.css","_app/immutable/assets/Heading.02ea3cfd.css","_app/immutable/assets/Paragraph.7e229384.css","_app/immutable/assets/Face.7ebb55cf.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=14-8bb60e0a.js.map
