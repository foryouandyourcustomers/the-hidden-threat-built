import { s as superValidate, c as createGameSchema } from './forms-78616ad6.js';
import { c as createGame } from './index4-1f29ed2f.js';
import { e as error, f as fail, r as redirect } from './index-a4865dbd.js';
import './stringify-f45e10e0.js';
import './index3-7e2fa931.js';
import './_commonjsHelpers-24198af3.js';
import './user-fc27f200.js';
import './items-4c987187.js';
import './xstate.esm-82e04545.js';
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

const index = 16;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-00c31dd6.js')).default;
const server_id = "src/routes/game/new/+page.server.ts";
const imports = ["_app/immutable/nodes/16.e130ecb0.js","_app/immutable/chunks/scheduler.c377f626.js","_app/immutable/chunks/index.0a4ea15f.js","_app/immutable/chunks/UsernameScreen.c7e6e0b8.js","_app/immutable/chunks/Board.cf6ffbed.js","_app/immutable/chunks/index.d870d639.js","_app/immutable/chunks/Paragraph.227750d9.js","_app/immutable/chunks/Heading.fe6b320e.js","_app/immutable/chunks/singletons.ce6f4378.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/chunks/stores.5c08239e.js"];
const stylesheets = ["_app/immutable/assets/UsernameScreen.59cbf0e4.css","_app/immutable/assets/Board.f0e28b25.css","_app/immutable/assets/Paragraph.7e229384.css","_app/immutable/assets/Heading.02ea3cfd.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=16-5c1d048f.js.map
