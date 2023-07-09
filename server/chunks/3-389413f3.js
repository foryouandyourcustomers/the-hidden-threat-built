import { s as shortUuid } from './index-8bc3041a.js';
import './_commonjsHelpers-849bcf65.js';
import 'crypto';

const load = ({ cookies }) => {
  let userId = cookies.get("userId");
  if (!userId) {
    userId = shortUuid.generate();
  }
  cookies.set("userId", userId, {
    path: "/",
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax"
  });
  return {
    /**
     * Every client (browser) gets assigned a random userId
     * that is stored in a cookie. This identifies the user
     * for each game.
     */
    userId
  };
};

var _layout_server_ts = /*#__PURE__*/Object.freeze({
  __proto__: null,
  load: load
});

const index = 3;
const component = async () => (await import('./layout.svelte-40ec306d.js')).default;
const file = '_app/immutable/entry/layout.svelte.bef78746.js';
const server_id = "src/routes/game/+layout.server.ts";
const imports = ["_app/immutable/entry/layout.svelte.bef78746.js","_app/immutable/chunks/index.8741fe9c.js"];
const stylesheets = [];
const fonts = [];

export { component, file, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=3-389413f3.js.map
