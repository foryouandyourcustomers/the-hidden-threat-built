import { s as superValidate, c as createGameSchema } from './forms-78616ad6.js';
import { c as createGame } from './index4-a52165a1.js';
import { e as error, f as fail, r as redirect } from './index-a4865dbd.js';
import './stringify-f45e10e0.js';
import './index3-7678c32b.js';
import './_commonjsHelpers-24198af3.js';
import './user-e3413fb3.js';
import './items-4883f019.js';
import './guards-104127fa.js';
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
const component = async () => component_cache ??= (await import('./_page.svelte-49b26d8a.js')).default;
const server_id = "src/routes/game/new/+page.server.ts";
const imports = ["_app/immutable/nodes/18.8fed4ce2.js","_app/immutable/chunks/scheduler.036a2d74.js","_app/immutable/chunks/index.e2632973.js","_app/immutable/chunks/UsernameScreen.652a75fb.js","_app/immutable/chunks/Board.bfaa13f2.js","_app/immutable/chunks/index.07541d6e.js","_app/immutable/chunks/game-context.fd63b07d.js","_app/immutable/chunks/FooterNav.5db6a55f.js","_app/immutable/chunks/Polygon.5badf3bf.js","_app/immutable/chunks/Heading.3960fba6.js","_app/immutable/chunks/singletons.bfdd58ec.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/chunks/stores.91e9dc4e.js"];
const stylesheets = ["_app/immutable/assets/UsernameScreen.fb30e955.css","_app/immutable/assets/Board.11062d12.css","_app/immutable/assets/FooterNav.ad7ef04e.css","_app/immutable/assets/Polygon.fed6d67b.css","_app/immutable/assets/Heading.02ea3cfd.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=18-d07c9721.js.map
