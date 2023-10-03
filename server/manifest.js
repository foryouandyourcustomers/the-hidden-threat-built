const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["audio/sprite.mp3","favicon.png","fonts/Barlow-Bold.woff2","fonts/Barlow-Italic.woff2","fonts/Barlow-Medium.woff2","fonts/Barlow-SemiBold.woff2","fonts/BarlowCondensed-Bold.woff2","fonts/BarlowCondensed-Italic.woff2","fonts/BarlowCondensed-Medium.woff2","fonts/BarlowCondensed-SemiBold.woff2","images/board-backdrop.svg","images/board-game.png","images/logos/EU.svg","images/logos/Helmut_Schmidt.svg","images/logos/UnBW.svg","images/logos/dtec.bw_gross.svg","images/logos/fyayc.svg"]),
	mimeTypes: {".mp3":"audio/mpeg",".png":"image/png",".woff2":"font/woff2",".svg":"image/svg+xml"},
	_: {
		client: {"start":"_app/immutable/entry/start.7a58585c.js","app":"_app/immutable/entry/app.cd9e220a.js","imports":["_app/immutable/entry/start.7a58585c.js","_app/immutable/chunks/scheduler.60fb5a58.js","_app/immutable/chunks/singletons.aa078f3d.js","_app/immutable/chunks/index.c3580b25.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/entry/app.cd9e220a.js","_app/immutable/chunks/scheduler.60fb5a58.js","_app/immutable/chunks/index.02ea6f2d.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./chunks/0-c4b50264.js')),
			__memo(() => import('./chunks/1-4e44af6f.js')),
			__memo(() => import('./chunks/2-07fa67d6.js')),
			__memo(() => import('./chunks/3-744eb0e5.js')),
			__memo(() => import('./chunks/4-5dea35fd.js')),
			__memo(() => import('./chunks/5-98040311.js')),
			__memo(() => import('./chunks/6-2dcb8b3f.js')),
			__memo(() => import('./chunks/9-b92e0242.js')),
			__memo(() => import('./chunks/10-5903aa5e.js')),
			__memo(() => import('./chunks/11-c6482dd1.js')),
			__memo(() => import('./chunks/12-2347abf3.js')),
			__memo(() => import('./chunks/13-dceabb4a.js')),
			__memo(() => import('./chunks/14-4fc350fa.js')),
			__memo(() => import('./chunks/15-60dc9afe.js'))
		],
		routes: [
			{
				id: "/(pages)",
				pattern: /^\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/(pages)/all-items",
				pattern: /^\/all-items\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/game/new",
				pattern: /^\/game\/new\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/game/[gameId=uid]",
				pattern: /^\/game\/([^/]+?)\/?$/,
				params: [{"name":"gameId","matcher":"uid","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,4,5,], errors: [1,,,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/game/[gameId=uid]/join",
				pattern: /^\/game\/([^/]+?)\/join\/?$/,
				params: [{"name":"gameId","matcher":"uid","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,4,5,], errors: [1,,,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/(pages)/(markdown)/imprint",
				pattern: /^\/imprint\/?$/,
				params: [],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/(pages)/(markdown)/privacy",
				pattern: /^\/privacy\/?$/,
				params: [],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/(pages)/(markdown)/tos",
				pattern: /^\/tos\/?$/,
				params: [],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 9 },
				endpoint: null
			}
		],
		matchers: async () => {
			const { match: uid } = await import ('./chunks/uid-8ce0af1e.js');
			return { uid };
		}
	}
}
})();

const prerendered = new Set(["/contact","/help"]);

export { manifest, prerendered };
//# sourceMappingURL=manifest.js.map
