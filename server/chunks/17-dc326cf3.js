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
const component = async () => component_cache ??= (await import('./_page.svelte-d90cf872.js')).default;
const server_id = "src/routes/game/[gameId=uid]/join/+page.server.ts";
const imports = ["_app/immutable/nodes/17.f7472b56.js","_app/immutable/chunks/scheduler.9231f7ad.js","_app/immutable/chunks/index.cd525813.js","_app/immutable/chunks/UsernameScreen.552dd0a8.js","_app/immutable/chunks/PreGameDecoration.43e23a23.js","_app/immutable/chunks/index.cbaeab23.js","_app/immutable/chunks/game-context.978a1c0d.js","_app/immutable/chunks/Face.063e1e75.js","_app/immutable/chunks/Heading.470aa6b4.js","_app/immutable/chunks/Polygon.58299097.js","_app/immutable/chunks/singletons.f2d5db1f.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/chunks/stores.5feb3be5.js"];
const stylesheets = ["_app/immutable/assets/UsernameScreen.7d96227e.css","_app/immutable/assets/PreGameDecoration.5c7df1d2.css","_app/immutable/assets/Face.8b646817.css","_app/immutable/assets/Heading.02ea3cfd.css","_app/immutable/assets/Polygon.fed6d67b.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=17-dc326cf3.js.map
