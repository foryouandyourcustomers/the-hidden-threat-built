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
		client: {"start":"_app/immutable/entry/start.64b2edbc.js","app":"_app/immutable/entry/app.fcb68ac8.js","imports":["_app/immutable/entry/start.64b2edbc.js","_app/immutable/chunks/scheduler.036a2d74.js","_app/immutable/chunks/singletons.a936657a.js","_app/immutable/chunks/index.07541d6e.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/entry/app.fcb68ac8.js","_app/immutable/chunks/scheduler.036a2d74.js","_app/immutable/chunks/index.e2632973.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./chunks/0-e9ea3ef0.js')),
			__memo(() => import('./chunks/1-f1a9f000.js')),
			__memo(() => import('./chunks/2-787f41d4.js')),
			__memo(() => import('./chunks/3-e0e05d1e.js')),
			__memo(() => import('./chunks/5-b6ad6c57.js')),
			__memo(() => import('./chunks/6-bfe608aa.js')),
			__memo(() => import('./chunks/7-37a025f8.js')),
			__memo(() => import('./chunks/10-a5bb6ca4.js')),
			__memo(() => import('./chunks/11-9cb9d0d4.js')),
			__memo(() => import('./chunks/12-93fe1a61.js')),
			__memo(() => import('./chunks/13-74345e72.js')),
			__memo(() => import('./chunks/15-e3be168b.js')),
			__memo(() => import('./chunks/16-a9b80f55.js')),
			__memo(() => import('./chunks/17-2e7fbd2a.js')),
			__memo(() => import('./chunks/18-b251d48a.js'))
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
				id: "/game",
				pattern: /^\/game\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/game/new",
				pattern: /^\/game\/new\/?$/,
				params: [],
				page: { layouts: [0,4,], errors: [1,,], leaf: 14 },
				endpoint: null
			},
			{
				id: "/game/[gameId=uid]",
				pattern: /^\/game\/([^/]+?)\/?$/,
				params: [{"name":"gameId","matcher":"uid","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,4,5,], errors: [1,,,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/game/[gameId=uid]/join",
				pattern: /^\/game\/([^/]+?)\/join\/?$/,
				params: [{"name":"gameId","matcher":"uid","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,4,5,], errors: [1,,,], leaf: 13 },
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

const prerendered = new Set(["/contact","/help","/manual"]);

export { manifest, prerendered };
//# sourceMappingURL=manifest.js.map
