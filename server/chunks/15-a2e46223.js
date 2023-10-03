import { s as superValidate, c as createGameSchema } from './forms-78616ad6.js';
import { c as createGame } from './index3-67733945.js';
import { e as error, f as fail, r as redirect } from './index-a4865dbd.js';
import './stringify-f45e10e0.js';
import './items-426393ab.js';
import './xstate.esm-113c4c56.js';
import './_commonjsHelpers-24198af3.js';
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
import './utils-d2797627.js';
import './index-bfbc1d9c.js';
import './global-09c6ed76.js';

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
        side: "defense",
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

const index = 15;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-cd0c9079.js')).default;
const server_id = "src/routes/game/new/+page.server.ts";
const imports = ["_app/immutable/nodes/15.71d584a3.js","_app/immutable/chunks/scheduler.777037b1.js","_app/immutable/chunks/index.72fc83ae.js","_app/immutable/chunks/TextInput.5f34ec89.js","_app/immutable/chunks/stores.2fcfb243.js","_app/immutable/chunks/singletons.6e7c14c2.js","_app/immutable/chunks/index.426cd02d.js","_app/immutable/chunks/spread.84d39b6c.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/chunks/Button.dcc1f627.js"];
const stylesheets = ["_app/immutable/assets/14.40c323f5.css","_app/immutable/assets/TextInput.42390ca3.css","_app/immutable/assets/Button.e85abd37.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=15-a2e46223.js.map
