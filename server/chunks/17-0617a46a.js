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
const component = async () => component_cache ??= (await import('./_page.svelte-f37d864c.js')).default;
const server_id = "src/routes/game/[gameId=uid]/join/+page.server.ts";
const imports = ["_app/immutable/nodes/17.07e80af1.js","_app/immutable/chunks/scheduler.036a2d74.js","_app/immutable/chunks/index.e2632973.js","_app/immutable/chunks/UsernameScreen.bb0102cc.js","_app/immutable/chunks/Board.9694d32b.js","_app/immutable/chunks/index.07541d6e.js","_app/immutable/chunks/game-context.fd63b07d.js","_app/immutable/chunks/FooterNav.5db6a55f.js","_app/immutable/chunks/Polygon.6815d52a.js","_app/immutable/chunks/Heading.3960fba6.js","_app/immutable/chunks/singletons.0b6b221e.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/chunks/stores.3e80f44b.js"];
const stylesheets = ["_app/immutable/assets/UsernameScreen.fb30e955.css","_app/immutable/assets/Board.47345c90.css","_app/immutable/assets/FooterNav.ad7ef04e.css","_app/immutable/assets/Polygon.da286e9e.css","_app/immutable/assets/Heading.02ea3cfd.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=17-0617a46a.js.map
