import { s as shortUuid } from './index-475ff67d.js';
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
const component = async () => component_cache ??= (await import('./layout.svelte-e0b78413.js')).default;
const server_id = "src/routes/game/+layout.server.ts";
const imports = ["_app/immutable/nodes/4.d3a7fe66.js","_app/immutable/chunks/5.343fcabf.js","_app/immutable/chunks/scheduler.644efde8.js","_app/immutable/chunks/index.9b0c7df8.js"];
const stylesheets = [];
const fonts = [];

export { component, fonts, imports, index, _layout_server_ts as server, server_id, stylesheets };
//# sourceMappingURL=4-824d9fa4.js.map
