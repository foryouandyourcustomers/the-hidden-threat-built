import { s as superValidate, j as joinGameSchema } from './forms-78616ad6.js';
import { a as getGame } from './global-b99bb08b.js';
import { e as error, f as fail, r as redirect } from './index-a4865dbd.js';
import './stringify-f45e10e0.js';

const load = async () => {
  const form = await superValidate(joinGameSchema);
  return { form };
};
const actions = {
  default: async ({ request, cookies, params }) => {
    const form = await superValidate(request, joinGameSchema);
    const userId = cookies.get("userId");
    const gameId = params.gameId;
    const game = getGame(gameId);
    if (!userId) {
      throw error(500, "No userId was found");
    }
    if (!game) {
      throw error(500, "Game was not found");
    }
    if (!form.valid) {
      return fail(400, { form });
    }
    if (!game.machine.getSnapshot().can({ type: "user joined", userId, userName: "" })) {
      throw error(403, "This game already started.");
    }
    game.machine.send({
      type: "user joined",
      userId,
      userName: form.data.userName
    });
    throw redirect(303, `/game/${gameId}`);
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 15;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-49d1dd58.js')).default;
const server_id = "src/routes/game/[gameId=uid]/join/+page.server.ts";
const imports = ["_app/immutable/nodes/15.904ee903.js","_app/immutable/chunks/scheduler.93b05707.js","_app/immutable/chunks/index.e4493cfb.js","_app/immutable/chunks/UsernameScreen.f30f4fdf.js","_app/immutable/chunks/check.a6e495a7.js","_app/immutable/chunks/index.3d85e2e9.js","_app/immutable/chunks/game-context.d774e95e.js","_app/immutable/chunks/Face.9cbab6eb.js","_app/immutable/chunks/Heading.ecdaaed4.js","_app/immutable/chunks/Paragraph.57913173.js","_app/immutable/chunks/singletons.ad3d482b.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/chunks/stores.873f4a72.js"];
const stylesheets = ["_app/immutable/assets/UsernameScreen.7d96227e.css","_app/immutable/assets/check.5c7df1d2.css","_app/immutable/assets/Face.bd2e2c8c.css","_app/immutable/assets/Heading.02ea3cfd.css","_app/immutable/assets/Paragraph.36586e1e.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=15-95bee7ba.js.map
