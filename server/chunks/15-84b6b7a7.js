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
const component = async () => component_cache ??= (await import('./_page.svelte-ae8190c7.js')).default;
const server_id = "src/routes/game/[gameId=uid]/join/+page.server.ts";
const imports = ["_app/immutable/nodes/15.04ff855d.js","_app/immutable/chunks/scheduler.0e0379d3.js","_app/immutable/chunks/index.b1996567.js","_app/immutable/chunks/UsernameScreen.2ff694ca.js","_app/immutable/chunks/Board.c3625c27.js","_app/immutable/chunks/index.d071e8be.js","_app/immutable/chunks/Paragraph.722d0890.js","_app/immutable/chunks/Heading.999fce17.js","_app/immutable/chunks/singletons.e547540e.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/chunks/stores.9bac2b20.js"];
const stylesheets = ["_app/immutable/assets/UsernameScreen.8cfd1fdc.css","_app/immutable/assets/Board.f0e28b25.css","_app/immutable/assets/Paragraph.4230a04d.css","_app/immutable/assets/Heading.02ea3cfd.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=15-84b6b7a7.js.map
