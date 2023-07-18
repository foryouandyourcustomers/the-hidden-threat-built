import { s as superValidate, j as joinGameSchema } from './forms-8702bdb3.js';
import { g as getGame } from './global-09c6ed76.js';
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

const index = 12;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-8d59a89e.js')).default;
const server_id = "src/routes/game/[gameId=uid]/join/+page.server.ts";
const imports = ["_app/immutable/nodes/12.2573961a.js","_app/immutable/chunks/scheduler.03dcb200.js","_app/immutable/chunks/index.1583bf7b.js","_app/immutable/chunks/TextInput.996ff9c4.js","_app/immutable/chunks/stores.4c0357c8.js","_app/immutable/chunks/singletons.95640c38.js","_app/immutable/chunks/index.c110b09d.js","_app/immutable/chunks/Button.ffb4c577.js","_app/immutable/chunks/parse.7d180a0f.js"];
const stylesheets = ["_app/immutable/assets/12.1d1b20a9.css","_app/immutable/assets/TextInput.c63d3b3a.css","_app/immutable/assets/Button.f5eac52d.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=12-0cca6a57.js.map
