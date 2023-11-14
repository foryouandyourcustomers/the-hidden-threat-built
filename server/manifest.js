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
		client: {"start":"_app/immutable/entry/start.126fdf02.js","app":"_app/immutable/entry/app.22e0fa41.js","imports":["_app/immutable/entry/start.126fdf02.js","_app/immutable/chunks/scheduler.644efde8.js","_app/immutable/chunks/singletons.9febcfcf.js","_app/immutable/chunks/index.d3db8487.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/entry/app.22e0fa41.js","_app/immutable/chunks/scheduler.644efde8.js","_app/immutable/chunks/index.9b0c7df8.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./chunks/0-2416fa40.js')),
			__memo(() => import('./chunks/1-edb0fa77.js')),
			__memo(() => import('./chunks/2-fe7750dd.js')),
			__memo(() => import('./chunks/3-2806e23d.js')),
			__memo(() => import('./chunks/4-824d9fa4.js')),
			__memo(() => import('./chunks/5-f0b937cb.js')),
			__memo(() => import('./chunks/6-2349ed61.js')),
			__memo(() => import('./chunks/9-ffb5859e.js')),
			__memo(() => import('./chunks/10-463ab5a5.js')),
			__memo(() => import('./chunks/11-21ab8a57.js')),
			__memo(() => import('./chunks/12-98fecf0b.js')),
			__memo(() => import('./chunks/13-b8c5b718.js')),
			__memo(() => import('./chunks/14-ac61e576.js')),
			__memo(() => import('./chunks/15-abfba743.js')),
			__memo(() => import('./chunks/16-d1eed3af.js'))
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

const prerendered = new Set(["/contact","/help"]);

export { manifest, prerendered };
//# sourceMappingURL=manifest.js.map
