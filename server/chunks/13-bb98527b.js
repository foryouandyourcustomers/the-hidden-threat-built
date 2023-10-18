import { g as getGame } from './global-09c6ed76.js';
import { g as getSharedGameContext } from './utils-84124f51.js';
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
const component = async () => component_cache ??= (await import('./_page.svelte-2404edd0.js')).default;
const universal_id = "src/routes/game/[gameId=uid]/+page.ts";
const server_id = "src/routes/game/[gameId=uid]/+page.server.ts";
const imports = ["_app/immutable/nodes/13.a8f4fb1b.js","_app/immutable/chunks/scheduler.f179ddf4.js","_app/immutable/chunks/index.4053e3c1.js","_app/immutable/chunks/index.4b340825.js","_app/immutable/chunks/items.16240b6a.js","_app/immutable/chunks/Board.c681ce9d.js","_app/immutable/chunks/Heading.bb657057.js","_app/immutable/chunks/Paragraph.4b69c533.js","_app/immutable/chunks/Face.e52410f9.js","_app/immutable/chunks/Polygon.b79e2fbe.js"];
const stylesheets = ["_app/immutable/assets/13.35b210c8.css","_app/immutable/assets/Board.88917564.css","_app/immutable/assets/Heading.02ea3cfd.css","_app/immutable/assets/Paragraph.bc58373c.css","_app/immutable/assets/Face.7ebb55cf.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=13-bb98527b.js.map
