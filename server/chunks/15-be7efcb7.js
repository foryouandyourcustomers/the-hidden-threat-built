import { s as superValidate, c as createGameSchema } from './forms-78616ad6.js';
import { c as createGame } from './index3-b87b6124.js';
import { e as error, f as fail, r as redirect } from './index-a4865dbd.js';
import './stringify-f45e10e0.js';
import './items-ba2c7988.js';
import './xstate.esm-d8ebc29e.js';
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
import './utils-e533b140.js';
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
const component = async () => component_cache ??= (await import('./_page.svelte-6401dc58.js')).default;
const server_id = "src/routes/game/new/+page.server.ts";
const imports = ["_app/immutable/nodes/15.fd6794cc.js","_app/immutable/chunks/scheduler.60fb5a58.js","_app/immutable/chunks/index.02ea6f2d.js","_app/immutable/chunks/TextInput.35a6f2c9.js","_app/immutable/chunks/stores.a7916c55.js","_app/immutable/chunks/singletons.9f0c4571.js","_app/immutable/chunks/index.c3580b25.js","_app/immutable/chunks/spread.84d39b6c.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/chunks/Button.192f9f1e.js"];
const stylesheets = ["_app/immutable/assets/14.40c323f5.css","_app/immutable/assets/TextInput.42390ca3.css","_app/immutable/assets/Button.e85abd37.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=15-be7efcb7.js.map
