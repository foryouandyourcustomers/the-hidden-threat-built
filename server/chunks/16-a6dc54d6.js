import { s as superValidate, c as createGameSchema } from './forms-78616ad6.js';
import { c as createGame } from './index4-31ec5c9a.js';
import { e as error, f as fail, r as redirect } from './index-a4865dbd.js';
import './stringify-f45e10e0.js';
import './index3-7e2fa931.js';
import './_commonjsHelpers-24198af3.js';
import './user-fc27f200.js';
import './items-4c987187.js';
import './xstate.esm-0e2aedc9.js';
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
const component = async () => component_cache ??= (await import('./_page.svelte-dbad6169.js')).default;
const server_id = "src/routes/game/new/+page.server.ts";
const imports = ["_app/immutable/nodes/16.ab35ffa7.js","_app/immutable/chunks/scheduler.a29f8582.js","_app/immutable/chunks/index.4a3323ad.js","_app/immutable/chunks/UsernameScreen.206010ae.js","_app/immutable/chunks/Board.b3bb48eb.js","_app/immutable/chunks/index.d1925ba3.js","_app/immutable/chunks/Paragraph.405342b6.js","_app/immutable/chunks/Heading.46b7fb0c.js","_app/immutable/chunks/singletons.3617d84c.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/chunks/stores.4909d374.js"];
const stylesheets = ["_app/immutable/assets/UsernameScreen.59cbf0e4.css","_app/immutable/assets/Board.f0e28b25.css","_app/immutable/assets/Paragraph.7e229384.css","_app/immutable/assets/Heading.02ea3cfd.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=16-a6dc54d6.js.map
