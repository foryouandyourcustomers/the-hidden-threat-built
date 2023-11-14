import { s as superValidate, j as joinGameSchema } from './forms-78616ad6.js';
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

const index = 15;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-bf43bb7e.js')).default;
const server_id = "src/routes/game/[gameId=uid]/join/+page.server.ts";
const imports = ["_app/immutable/nodes/15.78f64c61.js","_app/immutable/chunks/scheduler.644efde8.js","_app/immutable/chunks/index.9b0c7df8.js","_app/immutable/chunks/UsernameScreen.a09252c2.js","_app/immutable/chunks/Board.a5a5ee43.js","_app/immutable/chunks/index.d3db8487.js","_app/immutable/chunks/Paragraph.503c2c99.js","_app/immutable/chunks/Heading.0892b4c6.js","_app/immutable/chunks/singletons.9febcfcf.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/chunks/stores.15da6978.js"];
const stylesheets = ["_app/immutable/assets/UsernameScreen.59cbf0e4.css","_app/immutable/assets/Board.f0e28b25.css","_app/immutable/assets/Paragraph.7e229384.css","_app/immutable/assets/Heading.02ea3cfd.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=15-abfba743.js.map
