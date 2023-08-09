import { s as superValidate, c as createGameSchema } from './forms-8702bdb3.js';
import { c as createGame } from './index3-8860f84b.js';
import { e as error, f as fail, r as redirect } from './index-a4865dbd.js';
import './stringify-f45e10e0.js';
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
import './isEqual-ac1b14e5.js';
import './_commonjsHelpers-24198af3.js';
import './index-bfbc1d9c.js';
import './global-09c6ed76.js';
import './utils-2b8927ee.js';

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
        isSideAssigned: false
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

const index = 14;
let component_cache;
const component = async () => component_cache ??= (await import('./_page.svelte-c777f8c3.js')).default;
const server_id = "src/routes/game/new/+page.server.ts";
const imports = ["_app/immutable/nodes/14.ba85ed2b.js","_app/immutable/chunks/scheduler.2144c616.js","_app/immutable/chunks/index.ae0c723c.js","_app/immutable/chunks/TextInput.49278a0d.js","_app/immutable/chunks/stores.81057294.js","_app/immutable/chunks/singletons.f8931858.js","_app/immutable/chunks/index.26cc3723.js","_app/immutable/chunks/spread.84d39b6c.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/chunks/Button.c2c08f3f.js"];
const stylesheets = ["_app/immutable/assets/13.40c323f5.css","_app/immutable/assets/TextInput.42390ca3.css","_app/immutable/assets/Button.e85abd37.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=14-7d2f790d.js.map
