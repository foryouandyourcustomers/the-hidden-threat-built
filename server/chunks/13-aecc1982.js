import { g as getGame } from './global-09c6ed76.js';
import { g as getSharedGameContext } from './utils-7614c065.js';
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
const component = async () => component_cache ??= (await import('./_page.svelte-2da8a2b2.js')).default;
const universal_id = "src/routes/game/[gameId=uid]/+page.ts";
const server_id = "src/routes/game/[gameId=uid]/+page.server.ts";
const imports = ["_app/immutable/nodes/13.cac5588f.js","_app/immutable/chunks/scheduler.2144c616.js","_app/immutable/chunks/index.32c38c06.js","_app/immutable/chunks/index.26cc3723.js","_app/immutable/chunks/constants.048b6b4a.js","_app/immutable/chunks/Paragraph.d5dae1f0.js","_app/immutable/chunks/Button.6a14a5df.js","_app/immutable/chunks/spread.84d39b6c.js","_app/immutable/chunks/Heading.9360fa0a.js","_app/immutable/chunks/Face.5794671b.js"];
const stylesheets = ["_app/immutable/assets/13.f94ecd0a.css","_app/immutable/assets/Paragraph.a43b2dde.css","_app/immutable/assets/Button.e85abd37.css","_app/immutable/assets/Heading.46c81bf4.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets, _page_ts as universal, universal_id };
//# sourceMappingURL=13-aecc1982.js.map
