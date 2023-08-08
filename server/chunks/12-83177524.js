import { g as getGame } from './global-09c6ed76.js';
import { g as getSharedGameContext } from './utils-6b09c87a.js';
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

const index = 12;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-846f247e.js')).default;
const universal_id = "src/routes/game/[gameId=uid]/+page.ts";
const server_id = "src/routes/game/[gameId=uid]/+page.server.ts";
const imports = ["_app/immutable/nodes/12.c7024206.js","_app/immutable/chunks/scheduler.2144c616.js","_app/immutable/chunks/index.ae0c723c.js","_app/immutable/chunks/index.26cc3723.js","_app/immutable/chunks/Paragraph.ff9b2696.js","_app/immutable/chunks/Button.c2c08f3f.js","_app/immutable/chunks/spread.84d39b6c.js","_app/immutable/chunks/Heading.3e840281.js","_app/immutable/chunks/Face.ff891f61.js"];
const stylesheets = ["_app/immutable/assets/12.4d42c766.css","_app/immutable/assets/Paragraph.a43b2dde.css","_app/immutable/assets/Button.e85abd37.css","_app/immutable/assets/Heading.46c81bf4.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=12-83177524.js.map
