import { s as superValidate, c as createGameSchema } from './forms-78616ad6.js';
import { c as createGame } from './index3-f273396d.js';
import { e as error, f as fail, r as redirect } from './index-a4865dbd.js';
import './stringify-f45e10e0.js';
import './xstate.esm-7a90b764.js';
import './_commonjsHelpers-24198af3.js';
import './items-4c987187.js';
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
import './utils-84124f51.js';
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
        isSideAssigned: true
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
const component = async () => component_cache ??= (await import('./_page.svelte-8c82a372.js')).default;
const server_id = "src/routes/game/new/+page.server.ts";
const imports = ["_app/immutable/nodes/15.c995c3af.js","_app/immutable/chunks/scheduler.f179ddf4.js","_app/immutable/chunks/index.4053e3c1.js","_app/immutable/chunks/UsernameScreen.52c1fc78.js","_app/immutable/chunks/Board.c681ce9d.js","_app/immutable/chunks/Paragraph.4b69c533.js","_app/immutable/chunks/Heading.bb657057.js","_app/immutable/chunks/singletons.c0cf15e6.js","_app/immutable/chunks/index.4b340825.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/chunks/stores.b0e5b1b9.js"];
const stylesheets = ["_app/immutable/assets/UsernameScreen.59cbf0e4.css","_app/immutable/assets/Board.88917564.css","_app/immutable/assets/Paragraph.bc58373c.css","_app/immutable/assets/Heading.02ea3cfd.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=15-ae319cd7.js.map
