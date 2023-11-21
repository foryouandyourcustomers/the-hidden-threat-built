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
		client: {"start":"_app/immutable/entry/start.f9de77f6.js","app":"_app/immutable/entry/app.9f1d9f21.js","imports":["_app/immutable/entry/start.f9de77f6.js","_app/immutable/chunks/scheduler.1a6430be.js","_app/immutable/chunks/singletons.265892e9.js","_app/immutable/chunks/index.1000d87b.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/entry/app.9f1d9f21.js","_app/immutable/chunks/scheduler.1a6430be.js","_app/immutable/chunks/index.9140b2e6.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./chunks/0-22678fb5.js')),
			__memo(() => import('./chunks/1-d0727750.js')),
			__memo(() => import('./chunks/2-69264e47.js')),
			__memo(() => import('./chunks/3-637aae81.js')),
			__memo(() => import('./chunks/5-928ff796.js')),
			__memo(() => import('./chunks/6-dfcf3f84.js')),
			__memo(() => import('./chunks/7-38497eff.js')),
			__memo(() => import('./chunks/10-577df4f6.js')),
			__memo(() => import('./chunks/11-8b227df9.js')),
			__memo(() => import('./chunks/12-be205faf.js')),
			__memo(() => import('./chunks/13-f36628d9.js')),
			__memo(() => import('./chunks/15-e3be168b.js')),
			__memo(() => import('./chunks/16-1cec41e5.js')),
			__memo(() => import('./chunks/17-87619d98.js')),
			__memo(() => import('./chunks/18-ea0862cc.js'))
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
