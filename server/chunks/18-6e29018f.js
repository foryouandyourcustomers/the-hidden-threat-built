import { s as superValidate, c as createGameSchema } from './forms-78616ad6.js';
import { c as createGame } from './index4-efbd1a39.js';
import { e as error, f as fail, r as redirect } from './index-a4865dbd.js';
import './stringify-f45e10e0.js';
import './index3-be69e8c3.js';
import './_commonjsHelpers-24198af3.js';
import './user-7763bfe7.js';
import './items-4883f019.js';
import './guards-e8146d85.js';
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
const component = async () => component_cache ??= (await import('./_page.svelte-6320840e.js')).default;
const server_id = "src/routes/game/new/+page.server.ts";
const imports = ["_app/immutable/nodes/18.f7472b56.js","_app/immutable/chunks/scheduler.9231f7ad.js","_app/immutable/chunks/index.cd525813.js","_app/immutable/chunks/UsernameScreen.552dd0a8.js","_app/immutable/chunks/PreGameDecoration.43e23a23.js","_app/immutable/chunks/index.cbaeab23.js","_app/immutable/chunks/game-context.978a1c0d.js","_app/immutable/chunks/Face.063e1e75.js","_app/immutable/chunks/Heading.470aa6b4.js","_app/immutable/chunks/Polygon.58299097.js","_app/immutable/chunks/singletons.f2d5db1f.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/chunks/stores.5feb3be5.js"];
const stylesheets = ["_app/immutable/assets/UsernameScreen.7d96227e.css","_app/immutable/assets/PreGameDecoration.5c7df1d2.css","_app/immutable/assets/Face.8b646817.css","_app/immutable/assets/Heading.02ea3cfd.css","_app/immutable/assets/Polygon.fed6d67b.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=18-6e29018f.js.map
