import { s as shortUuid } from './index-bfbc1d9c.js';
import './_commonjsHelpers-24198af3.js';
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

const index = 4;
let component_cache;
const component = async () => component_cache ??= (await import('./layout.svelte-22826b00.js')).default;
const server_id = "src/routes/game/+layout.server.ts";
const imports = ["_app/immutable/nodes/4.0b1d742d.js","_app/immutable/chunks/5.7068b2a7.js","_app/immutable/chunks/scheduler.60fb5a58.js","_app/immutable/chunks/index.02ea6f2d.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=4-f0d800f6.js.map
