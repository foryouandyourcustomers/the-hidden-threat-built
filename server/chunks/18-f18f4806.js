import { s as superValidate, c as createGameSchema } from './forms-78616ad6.js';
import { c as createGame } from './index4-b8a08e26.js';
import { e as error, f as fail, r as redirect } from './index-a4865dbd.js';
import './stringify-f45e10e0.js';
import './index3-7678c32b.js';
import './_commonjsHelpers-24198af3.js';
import './user-e3413fb3.js';
import './items-4883f019.js';
import './guards-ab25e847.js';
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
import 'util';
import 'fs';
import 'dns';
import 'os';
import 'path';
import 'punycode';
import 'child_process';
import './index-475ff67d.js';
import './global-b99bb08b.js';

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

const index = 18;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-21860a93.js')).default;
const server_id = "src/routes/game/new/+page.server.ts";
const imports = ["_app/immutable/nodes/18.93a3fb1e.js","_app/immutable/chunks/scheduler.9575fd4f.js","_app/immutable/chunks/index.ae3d3fc3.js","_app/immutable/chunks/UsernameScreen.1e6637f4.js","_app/immutable/chunks/Board.0410d1d0.js","_app/immutable/chunks/index.a8ce1c85.js","_app/immutable/chunks/game-context.06b850d9.js","_app/immutable/chunks/Paragraph.3fcb0210.js","_app/immutable/chunks/Heading.db207678.js","_app/immutable/chunks/singletons.3225d277.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/chunks/stores.6906479b.js"];
const stylesheets = ["_app/immutable/assets/UsernameScreen.8cfd1fdc.css","_app/immutable/assets/Board.025e7114.css","_app/immutable/assets/Paragraph.942e02ab.css","_app/immutable/assets/Heading.02ea3cfd.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=18-f18f4806.js.map
