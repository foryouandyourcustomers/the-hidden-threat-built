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
const component = async () => component_cache ??= (await import('./_page.svelte-7b0415a7.js')).default;
const server_id = "src/routes/game/new/+page.server.ts";
const imports = ["_app/immutable/nodes/13.0822588a.js","_app/immutable/chunks/scheduler.03dcb200.js","_app/immutable/chunks/index.91584b48.js","_app/immutable/chunks/TextInput.f83ab0dc.js","_app/immutable/chunks/stores.3a2ad949.js","_app/immutable/chunks/singletons.a0bba657.js","_app/immutable/chunks/index.c110b09d.js","_app/immutable/chunks/Button.4aedaae9.js","_app/immutable/chunks/parse.7d180a0f.js"];
const stylesheets = ["_app/immutable/assets/12.1d1b20a9.css","_app/immutable/assets/TextInput.c63d3b3a.css","_app/immutable/assets/Button.f5eac52d.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=13-6b72aba8.js.map
