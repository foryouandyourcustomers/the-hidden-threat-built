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
let component_cache;
const component = async () => component_cache ??= (await import('./layout.svelte-d29182fb.js')).default;
const server_id = "src/routes/game/+layout.server.ts";
const imports = ["_app/immutable/nodes/3.fa7084f2.js","_app/immutable/chunks/4.ceca2eb3.js","_app/immutable/chunks/scheduler.03dcb200.js","_app/immutable/chunks/index.1583bf7b.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=3-e9dc4f5e.js.map
