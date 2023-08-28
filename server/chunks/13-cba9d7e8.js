import { g as getGame } from './global-09c6ed76.js';
import { g as getSharedGameContext } from './utils-d1f5f7f0.js';
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
const component = async () => component_cache ??= (await import('./_page.svelte-99d3354c.js')).default;
const universal_id = "src/routes/game/[gameId=uid]/+page.ts";
const server_id = "src/routes/game/[gameId=uid]/+page.server.ts";
const imports = ["_app/immutable/nodes/13.eafa8a90.js","_app/immutable/chunks/scheduler.7e6d0366.js","_app/immutable/chunks/index.8a6eef5f.js","_app/immutable/chunks/index.36015b49.js","_app/immutable/chunks/constants.2f511e56.js","_app/immutable/chunks/Paragraph.94078081.js","_app/immutable/chunks/Button.f446f169.js","_app/immutable/chunks/spread.84d39b6c.js","_app/immutable/chunks/Heading.b9add070.js","_app/immutable/chunks/Face.a7e162aa.js"];
const stylesheets = ["_app/immutable/assets/13.9c9cd580.css","_app/immutable/assets/Paragraph.c7b8c323.css","_app/immutable/assets/Button.e85abd37.css","_app/immutable/assets/Heading.c5956ce9.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=13-cba9d7e8.js.map
