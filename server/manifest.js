const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["audio/sprite.mp3","favicon.png","fonts/Barlow-Bold.woff2","fonts/Barlow-Italic.woff2","fonts/Barlow-Medium.woff2","fonts/Barlow-SemiBold.woff2","fonts/BarlowCondensed-Bold.woff2","fonts/BarlowCondensed-Italic.woff2","fonts/BarlowCondensed-Medium.woff2","fonts/BarlowCondensed-SemiBold.woff2","images/board-game.png","images/logos/EU.svg","images/logos/Helmut_Schmidt.svg","images/logos/UnBW.svg","images/logos/dtec.bw_gross.svg","images/logos/fyayc.svg"]),
	mimeTypes: {".mp3":"audio/mpeg",".png":"image/png",".woff2":"font/woff2",".svg":"image/svg+xml"},
	_: {
		client: {"start":"_app/immutable/entry/start.e8877188.js","app":"_app/immutable/entry/app.efd046c9.js","imports":["_app/immutable/entry/start.e8877188.js","_app/immutable/chunks/scheduler.2144c616.js","_app/immutable/chunks/singletons.8ef12631.js","_app/immutable/chunks/index.26cc3723.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/entry/app.efd046c9.js","_app/immutable/chunks/scheduler.2144c616.js","_app/immutable/chunks/index.32c38c06.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./chunks/0-b7992f07.js')),
			__memo(() => import('./chunks/1-024cebf6.js')),
			__memo(() => import('./chunks/2-c6c8ab3f.js')),
			__memo(() => import('./chunks/3-73880047.js')),
			__memo(() => import('./chunks/4-143c0129.js')),
			__memo(() => import('./chunks/5-5b23fb00.js')),
			__memo(() => import('./chunks/6-a5c8204c.js')),
			__memo(() => import('./chunks/9-aca2e0ce.js')),
			__memo(() => import('./chunks/10-5d230a72.js')),
			__memo(() => import('./chunks/11-2ec6a031.js')),
			__memo(() => import('./chunks/12-bd4bc020.js')),
			__memo(() => import('./chunks/13-aecc1982.js')),
			__memo(() => import('./chunks/14-e8d286ba.js')),
			__memo(() => import('./chunks/15-d54cb9b0.js'))
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
