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

const index = 14;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-47f426b4.js')).default;
const server_id = "src/routes/game/[gameId=uid]/join/+page.server.ts";
const imports = ["_app/immutable/nodes/14.d27dbba3.js","_app/immutable/chunks/scheduler.7e6d0366.js","_app/immutable/chunks/index.8a6eef5f.js","_app/immutable/chunks/TextInput.abbab817.js","_app/immutable/chunks/stores.0afff324.js","_app/immutable/chunks/singletons.6502b8b6.js","_app/immutable/chunks/index.36015b49.js","_app/immutable/chunks/spread.84d39b6c.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/chunks/Button.f446f169.js"];
const stylesheets = ["_app/immutable/assets/14.40c323f5.css","_app/immutable/assets/TextInput.42390ca3.css","_app/immutable/assets/Button.e85abd37.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=14-01978034.js.map