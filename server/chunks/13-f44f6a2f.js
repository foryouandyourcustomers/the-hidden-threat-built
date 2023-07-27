import { s as superValidate, c as createGameSchema } from './forms-8702bdb3.js';
import { c as createGame } from './index3-51adee25.js';
import { e as error, f as fail, r as redirect } from './index-a4865dbd.js';
import './stringify-f45e10e0.js';
import 'stream';
import 'zlib';
import 'buffer';
import 'net';
import 'tls';
import 'crypto';
import 'events';
import 'https';
import 'http';
import 'url';
import './isObjectLike-3d6a1299.js';
import './_commonjsHelpers-24198af3.js';
import './index-bfbc1d9c.js';
import './global-09c6ed76.js';
import './utils-83a2361e.js';

const load = async () => {
  const form = await superValidate(createGameSchema);
  return { form };
};
const actions = {
  default: async ({ request, cookies }) => {
    const form = await superValidate(request, createGameSchema);
    const userId = cookies.get("userId");
    if (!userId) {
      throw error(500, "No userId was found");
    }
    if (!form.valid) {
      return fail(400, { form });
    }
    const { id } = createGame({
      host: {
        id: userId,
        name: form.data.userName,
        isAdmin: true,
        isConnected: false,
        side: "defender",
        isSideAssigned: false
      }
    });
    throw redirect(303, `/game/${id}`);
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 13;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-4ff1fd01.js')).default;
const server_id = "src/routes/game/new/+page.server.ts";
const imports = ["_app/immutable/nodes/13.d2067d80.js","_app/immutable/chunks/scheduler.3df9b730.js","_app/immutable/chunks/index.06da1297.js","_app/immutable/chunks/TextInput.041e8514.js","_app/immutable/chunks/stores.04b57fdf.js","_app/immutable/chunks/singletons.a725471c.js","_app/immutable/chunks/index.9b15924c.js","_app/immutable/chunks/Button.b63fec9a.js","_app/immutable/chunks/parse.7d180a0f.js"];
const stylesheets = ["_app/immutable/assets/12.40c323f5.css","_app/immutable/assets/TextInput.42390ca3.css","_app/immutable/assets/Button.665f322b.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=13-f44f6a2f.js.map
