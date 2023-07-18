import { s as superValidate, c as createGameSchema } from './forms-8702bdb3.js';
import { c as createGame } from './index3-496c6f74.js';
import { e as error, f as fail, r as redirect } from './index-a4865dbd.js';
import './stringify-f45e10e0.js';
import './xstate.esm-3f8dde68.js';
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
import './index-8bc3041a.js';
import './_commonjsHelpers-849bcf65.js';
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
      host: { id: userId, name: form.data.userName, isAdmin: true, isConnected: false }
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
const imports = ["_app/immutable/nodes/13.51733165.js","_app/immutable/chunks/scheduler.03dcb200.js","_app/immutable/chunks/index.1583bf7b.js","_app/immutable/chunks/TextInput.996ff9c4.js","_app/immutable/chunks/stores.4c0357c8.js","_app/immutable/chunks/singletons.95640c38.js","_app/immutable/chunks/index.c110b09d.js","_app/immutable/chunks/Button.ffb4c577.js","_app/immutable/chunks/parse.7d180a0f.js"];
const stylesheets = ["_app/immutable/assets/12.1d1b20a9.css","_app/immutable/assets/TextInput.c63d3b3a.css","_app/immutable/assets/Button.f5eac52d.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=13-e7a2cc83.js.map
