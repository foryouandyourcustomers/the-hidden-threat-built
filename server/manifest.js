const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["audio/sprite.mp3","favicon.svg","fonts/Barlow-Bold.woff2","fonts/Barlow-Italic.woff2","fonts/Barlow-Medium.woff2","fonts/Barlow-SemiBold.woff2","fonts/BarlowCondensed-Bold.woff2","fonts/BarlowCondensed-Italic.woff2","fonts/BarlowCondensed-Medium.woff2","fonts/BarlowCondensed-SemiBold.woff2","images/analog-board.jpg","images/analog-cards.jpg","images/analog-rules.jpg","images/board-backdrop.svg","images/board-game.png","images/landing-page-teaser.png","images/logos/EU.svg","images/logos/Helmut_Schmidt.svg","images/logos/UnBW.svg","images/logos/dtec.bw_gross.svg","images/logos/fyayc.svg"]),
	mimeTypes: {".mp3":"audio/mpeg",".svg":"image/svg+xml",".woff2":"font/woff2",".jpg":"image/jpeg",".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.9973b0ad.js","app":"_app/immutable/entry/app.67e01978.js","imports":["_app/immutable/entry/start.9973b0ad.js","_app/immutable/chunks/scheduler.e5e3f8cd.js","_app/immutable/chunks/singletons.a1c6f256.js","_app/immutable/chunks/index.91a33cbd.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/entry/app.67e01978.js","_app/immutable/chunks/scheduler.e5e3f8cd.js","_app/immutable/chunks/index.bdbe56d4.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./chunks/0-5bf5ba18.js')),
			__memo(() => import('./chunks/1-18479efc.js')),
			__memo(() => import('./chunks/2-a8d5d710.js')),
			__memo(() => import('./chunks/5-82c12ebb.js')),
			__memo(() => import('./chunks/6-318a03b0.js')),
			__memo(() => import('./chunks/7-0d5119bf.js')),
			__memo(() => import('./chunks/11-48d8d372.js')),
			__memo(() => import('./chunks/13-b8c5b718.js')),
			__memo(() => import('./chunks/14-7d11cbfa.js')),
			__memo(() => import('./chunks/15-e2aed277.js')),
			__memo(() => import('./chunks/16-9544cdec.js'))
		],
		routes: [
			{
				id: "/(pages)",
				pattern: /^\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/(pages)/all-items",
				pattern: /^\/all-items\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/game",
				pattern: /^\/game\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/game/new",
				pattern: /^\/game\/new\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/game/[gameId=uid]",
				pattern: /^\/game\/([^/]+?)\/?$/,
				params: [{"name":"gameId","matcher":"uid","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,4,], errors: [1,,,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/game/[gameId=uid]/join",
				pattern: /^\/game\/([^/]+?)\/join\/?$/,
				params: [{"name":"gameId","matcher":"uid","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,4,], errors: [1,,,], leaf: 9 },
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

const prerendered = new Set(["/imprint","/manual","/privacy","/tos"]);

export { manifest, prerendered };
//# sourceMappingURL=manifest.js.map
