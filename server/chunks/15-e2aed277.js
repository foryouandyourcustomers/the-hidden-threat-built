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
const component = async () => component_cache ??= (await import('./_page.svelte-accca44a.js')).default;
const server_id = "src/routes/game/[gameId=uid]/join/+page.server.ts";
const imports = ["_app/immutable/nodes/15.f40ada26.js","_app/immutable/chunks/scheduler.e5e3f8cd.js","_app/immutable/chunks/index.bdbe56d4.js","_app/immutable/chunks/UsernameScreen.7529319d.js","_app/immutable/chunks/check.70d04bfb.js","_app/immutable/chunks/index.91a33cbd.js","_app/immutable/chunks/game-context.82b6aa47.js","_app/immutable/chunks/Face.9b2b7a38.js","_app/immutable/chunks/Paragraph.d1340062.js","_app/immutable/chunks/Heading.b5cbd977.js","_app/immutable/chunks/singletons.a1c6f256.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/chunks/stores.d5e977f4.js"];
const stylesheets = ["_app/immutable/assets/UsernameScreen.7d96227e.css","_app/immutable/assets/check.76fc71d3.css","_app/immutable/assets/Face.bd2e2c8c.css","_app/immutable/assets/Paragraph.19e1d39f.css","_app/immutable/assets/Heading.02ea3cfd.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=15-e2aed277.js.map
