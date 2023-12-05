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

const index = 17;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-e91941bb.js')).default;
const server_id = "src/routes/game/[gameId=uid]/join/+page.server.ts";
const imports = ["_app/immutable/nodes/17.8bab6363.js","_app/immutable/chunks/scheduler.9575fd4f.js","_app/immutable/chunks/index.ae3d3fc3.js","_app/immutable/chunks/UsernameScreen.d0d9741a.js","_app/immutable/chunks/Board.1f0dfd3a.js","_app/immutable/chunks/index.a8ce1c85.js","_app/immutable/chunks/game-context.06b850d9.js","_app/immutable/chunks/FooterNav.7413425f.js","_app/immutable/chunks/Paragraph.f42cea57.js","_app/immutable/chunks/Heading.db207678.js","_app/immutable/chunks/singletons.21883f10.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/chunks/stores.e048043f.js"];
const stylesheets = ["_app/immutable/assets/UsernameScreen.e18a5ff7.css","_app/immutable/assets/Board.abb00679.css","_app/immutable/assets/FooterNav.ad7ef04e.css","_app/immutable/assets/Paragraph.35536718.css","_app/immutable/assets/Heading.02ea3cfd.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=17-b98bb6a9.js.map
