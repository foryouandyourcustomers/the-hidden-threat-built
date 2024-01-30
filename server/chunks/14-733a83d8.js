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
const component = async () => component_cache ??= (await import('./_page.svelte-8e5e4722.js')).default;
const universal_id = "src/routes/game/[gameId=uid]/+page.ts";
const server_id = "src/routes/game/[gameId=uid]/+page.server.ts";
const imports = ["_app/immutable/nodes/14.33b7ceb1.js","_app/immutable/chunks/scheduler.e5e3f8cd.js","_app/immutable/chunks/index.bdbe56d4.js","_app/immutable/chunks/index.91a33cbd.js","_app/immutable/chunks/game-context.82b6aa47.js","_app/immutable/chunks/Item.2bc52626.js","_app/immutable/chunks/check.70d04bfb.js","_app/immutable/chunks/Face.9b2b7a38.js","_app/immutable/chunks/Paragraph.d1340062.js","_app/immutable/chunks/Heading.b5cbd977.js","_app/immutable/chunks/constants.50f7fc60.js"];
const stylesheets = ["_app/immutable/assets/14.77cb99ae.css","_app/immutable/assets/Item.7ebb55cf.css","_app/immutable/assets/check.76fc71d3.css","_app/immutable/assets/Face.bd2e2c8c.css","_app/immutable/assets/Paragraph.19e1d39f.css","_app/immutable/assets/Heading.02ea3cfd.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=14-733a83d8.js.map
