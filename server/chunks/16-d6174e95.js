import { s as superValidate, c as createGameSchema } from './forms-78616ad6.js';
import { c as createGame } from './index4-cf45f815.js';
import { e as error, f as fail, r as redirect } from './index-a4865dbd.js';
import './stringify-f45e10e0.js';
import './index3-e8ad4754.js';
import './_commonjsHelpers-24198af3.js';
import './user-e3413fb3.js';
import './items-4883f019.js';
import './xstate.esm-a5fdd2b8.js';
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
const component = async () => component_cache ??= (await import('./_page.svelte-6876533b.js')).default;
const server_id = "src/routes/game/new/+page.server.ts";
const imports = ["_app/immutable/nodes/16.04ff855d.js","_app/immutable/chunks/scheduler.0e0379d3.js","_app/immutable/chunks/index.b1996567.js","_app/immutable/chunks/UsernameScreen.2ff694ca.js","_app/immutable/chunks/Board.c3625c27.js","_app/immutable/chunks/index.d071e8be.js","_app/immutable/chunks/Paragraph.722d0890.js","_app/immutable/chunks/Heading.999fce17.js","_app/immutable/chunks/singletons.e547540e.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/chunks/stores.9bac2b20.js"];
const stylesheets = ["_app/immutable/assets/UsernameScreen.8cfd1fdc.css","_app/immutable/assets/Board.f0e28b25.css","_app/immutable/assets/Paragraph.4230a04d.css","_app/immutable/assets/Heading.02ea3cfd.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=16-d6174e95.js.map
