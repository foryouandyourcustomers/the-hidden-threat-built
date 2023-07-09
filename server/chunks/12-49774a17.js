import { s as superValidate, j as joinGameSchema } from './forms-abd5498f.js';
import { g as getGame } from './global-770b5537.js';
import { e as error, f as fail, r as redirect } from './index-39e97e00.js';
import './stringify-cfe36ff5.js';

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
const component = async () => (await import('./_page.svelte-57b7000b.js')).default;
const file = '_app/immutable/entry/game-_gameId_uid_-join-page.svelte.ea68a8ac.js';
const server_id = "src/routes/game/[gameId=uid]/join/+page.server.ts";
const imports = ["_app/immutable/entry/game-_gameId_uid_-join-page.svelte.ea68a8ac.js","_app/immutable/chunks/index.b40a0fed.js","_app/immutable/chunks/TextInput.5c590570.js","_app/immutable/chunks/stores.015e57d6.js","_app/immutable/chunks/singletons.5b28a2eb.js","_app/immutable/chunks/index.721ce0c9.js","_app/immutable/chunks/parse.1d2978b5.js","_app/immutable/chunks/Button.6883ff90.js"];
const stylesheets = ["_app/immutable/assets/_page.1d1b20a9.css","_app/immutable/assets/TextInput.c63d3b3a.css","_app/immutable/assets/Button.f5eac52d.css"];
const fonts = [];

export { component, file, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=12-49774a17.js.map
