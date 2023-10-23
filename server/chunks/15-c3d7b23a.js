import { s as superValidate, c as createGameSchema } from './forms-78616ad6.js';
import { c as createGame } from './index3-8ca44b51.js';
import { e as error, f as fail, r as redirect } from './index-a4865dbd.js';
import './stringify-f45e10e0.js';
import './xstate.esm-e7d0869d.js';
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
const component = async () => component_cache ??= (await import('./_page.svelte-ae7c6e68.js')).default;
const server_id = "src/routes/game/new/+page.server.ts";
const imports = ["_app/immutable/nodes/15.71c81a04.js","_app/immutable/chunks/scheduler.f179ddf4.js","_app/immutable/chunks/index.4053e3c1.js","_app/immutable/chunks/UsernameScreen.5938461e.js","_app/immutable/chunks/Board.c681ce9d.js","_app/immutable/chunks/Paragraph.3bd4ac1c.js","_app/immutable/chunks/Heading.bb657057.js","_app/immutable/chunks/singletons.df27a4e0.js","_app/immutable/chunks/index.4b340825.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/chunks/stores.f43d12c0.js"];
const stylesheets = ["_app/immutable/assets/UsernameScreen.59cbf0e4.css","_app/immutable/assets/Board.88917564.css","_app/immutable/assets/Paragraph.7e229384.css","_app/immutable/assets/Heading.02ea3cfd.css"];
const fonts = [];

export { component, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=15-c3d7b23a.js.map
