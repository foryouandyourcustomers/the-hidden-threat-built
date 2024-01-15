import { s as superValidate, c as createGameSchema } from './forms-78616ad6.js';
import { c as createGame } from './index4-f26de42c.js';
import { e as error, f as fail, r as redirect } from './index-a4865dbd.js';
import './stringify-f45e10e0.js';
import './index3-3138adce.js';
import './targeted-attacks-0c2ef07b.js';
import './_commonjsHelpers-24198af3.js';
import './player-85f087dd.js';
import './game-state-78587e72.js';
import './guards-34507652.js';
import './user-1bcc6d1d.js';
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
const component = async () => component_cache ??= (await import('./_page.svelte-94057f33.js')).default;
const server_id = "src/routes/game/new/+page.server.ts";
const imports = ["_app/immutable/nodes/16.34811c4b.js","_app/immutable/chunks/scheduler.93b05707.js","_app/immutable/chunks/index.e4493cfb.js","_app/immutable/chunks/UsernameScreen.bf88d3e8.js","_app/immutable/chunks/check.a6e495a7.js","_app/immutable/chunks/index.3d85e2e9.js","_app/immutable/chunks/game-context.d774e95e.js","_app/immutable/chunks/Face.9cbab6eb.js","_app/immutable/chunks/Heading.ecdaaed4.js","_app/immutable/chunks/Paragraph.57913173.js","_app/immutable/chunks/singletons.84394d77.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/chunks/stores.73b1ac56.js"];
const stylesheets = ["_app/immutable/assets/UsernameScreen.7d96227e.css","_app/immutable/assets/check.5c7df1d2.css","_app/immutable/assets/Face.bd2e2c8c.css","_app/immutable/assets/Heading.02ea3cfd.css","_app/immutable/assets/Paragraph.36586e1e.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=16-19d60ba1.js.map
