import { s as superValidate, c as createGameSchema } from './forms-abd5498f.js';
import { c as createGame } from './index4-1c09767b.js';
import { e as error, f as fail, r as redirect } from './index-39e97e00.js';
import './stringify-cfe36ff5.js';
import './xstate.esm-8a1e0eb0.js';
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
import './index-8bc3041a.js';
import './_commonjsHelpers-849bcf65.js';
import './global-770b5537.js';

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
      host: { id: userId, name: form.data.userName, isAdmin: true, isConnected: false }
    });
    throw redirect(303, `/game/${id}`);
  }
};

var _page_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  actions: actions,
  load: load
});

const index = 13;
const component = async () => (await import('./_page.svelte-8b805919.js')).default;
const file = '_app/immutable/entry/game-new-page.svelte.7cce081c.js';
const server_id = "src/routes/game/new/+page.server.ts";
const imports = ["_app/immutable/entry/game-new-page.svelte.7cce081c.js","_app/immutable/chunks/index.8741fe9c.js","_app/immutable/chunks/TextInput.6980d2f3.js","_app/immutable/chunks/stores.e523f392.js","_app/immutable/chunks/singletons.a7f42d84.js","_app/immutable/chunks/index.e0b1c8ed.js","_app/immutable/chunks/parse.1d2978b5.js","_app/immutable/chunks/Button.bffcdd30.js"];
const stylesheets = ["_app/immutable/assets/_page.1d1b20a9.css","_app/immutable/assets/TextInput.c63d3b3a.css","_app/immutable/assets/Button.f5eac52d.css"];
const fonts = [];

export { component, file, fonts, imports, index, _page_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=13-596c65b9.js.map
