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
		client: {"start":"_app/immutable/entry/start.57f610da.js","app":"_app/immutable/entry/app.9beae2bb.js","imports":["_app/immutable/entry/start.57f610da.js","_app/immutable/chunks/scheduler.9231f7ad.js","_app/immutable/chunks/singletons.f2d5db1f.js","_app/immutable/chunks/index.cbaeab23.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/entry/app.9beae2bb.js","_app/immutable/chunks/scheduler.9231f7ad.js","_app/immutable/chunks/index.cd525813.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./chunks/0-0f3f24be.js')),
			__memo(() => import('./chunks/1-2de83c9d.js')),
			__memo(() => import('./chunks/2-6f5bf79f.js')),
			__memo(() => import('./chunks/3-decb492f.js')),
			__memo(() => import('./chunks/5-1cd7c2a6.js')),
			__memo(() => import('./chunks/6-1a63045a.js')),
			__memo(() => import('./chunks/7-40a34353.js')),
			__memo(() => import('./chunks/10-7f48db4b.js')),
			__memo(() => import('./chunks/11-6fa2e1f1.js')),
			__memo(() => import('./chunks/12-0b590db8.js')),
			__memo(() => import('./chunks/13-996a709b.js')),
			__memo(() => import('./chunks/15-e3be168b.js')),
			__memo(() => import('./chunks/16-f81aac83.js')),
			__memo(() => import('./chunks/17-dc326cf3.js')),
			__memo(() => import('./chunks/18-6e29018f.js'))
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
