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
		client: {"start":"_app/immutable/entry/start.8fa4801d.js","app":"_app/immutable/entry/app.9a123fbe.js","imports":["_app/immutable/entry/start.8fa4801d.js","_app/immutable/chunks/scheduler.60fb5a58.js","_app/immutable/chunks/singletons.08eb4354.js","_app/immutable/chunks/index.c3580b25.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/entry/app.9a123fbe.js","_app/immutable/chunks/scheduler.60fb5a58.js","_app/immutable/chunks/index.02ea6f2d.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./chunks/0-1739ccff.js')),
			__memo(() => import('./chunks/1-c281e2ab.js')),
			__memo(() => import('./chunks/2-6d6c0bc2.js')),
			__memo(() => import('./chunks/3-6280002f.js')),
			__memo(() => import('./chunks/4-f0d800f6.js')),
			__memo(() => import('./chunks/5-f60643ad.js')),
			__memo(() => import('./chunks/6-e0c5cc17.js')),
			__memo(() => import('./chunks/9-dfd215a6.js')),
			__memo(() => import('./chunks/10-75cb648c.js')),
			__memo(() => import('./chunks/11-bb1cf5c2.js')),
			__memo(() => import('./chunks/12-1a90e861.js')),
			__memo(() => import('./chunks/13-74c2d6ef.js')),
			__memo(() => import('./chunks/14-703a550f.js')),
			__memo(() => import('./chunks/15-7309a8ea.js'))
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
