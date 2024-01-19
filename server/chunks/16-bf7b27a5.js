import { s as superValidate, c as createGameSchema } from './forms-78616ad6.js';
import { c as createGame } from './index4-5a174e45.js';
import { e as error, f as fail, r as redirect } from './index-a4865dbd.js';
import './stringify-f45e10e0.js';
import './index3-b25e75a1.js';
import './_commonjsHelpers-24198af3.js';
import './player-81938fab.js';
import './game-state-29cc4d08.js';
import './guards-125f1339.js';
import './user-8b4b9a11.js';
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

const index = 16;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-0d24c859.js')).default;
const server_id = "src/routes/game/new/+page.server.ts";
const imports = ["_app/immutable/nodes/16.4877e18a.js","_app/immutable/chunks/scheduler.e5e3f8cd.js","_app/immutable/chunks/index.bdbe56d4.js","_app/immutable/chunks/UsernameScreen.cb7cd857.js","_app/immutable/chunks/check.70d04bfb.js","_app/immutable/chunks/index.91a33cbd.js","_app/immutable/chunks/game-context.82b6aa47.js","_app/immutable/chunks/Face.9b2b7a38.js","_app/immutable/chunks/Paragraph.d1340062.js","_app/immutable/chunks/Heading.b5cbd977.js","_app/immutable/chunks/singletons.91b6725d.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/chunks/stores.388dffc2.js"];
const stylesheets = ["_app/immutable/assets/UsernameScreen.7d96227e.css","_app/immutable/assets/check.76fc71d3.css","_app/immutable/assets/Face.bd2e2c8c.css","_app/immutable/assets/Paragraph.19e1d39f.css","_app/immutable/assets/Heading.02ea3cfd.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=16-bf7b27a5.js.map
