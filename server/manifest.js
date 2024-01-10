const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["audio/sprite.mp3","favicon.png","fonts/Barlow-Bold.woff2","fonts/Barlow-Italic.woff2","fonts/Barlow-Medium.woff2","fonts/Barlow-SemiBold.woff2","fonts/BarlowCondensed-Bold.woff2","fonts/BarlowCondensed-Italic.woff2","fonts/BarlowCondensed-Medium.woff2","fonts/BarlowCondensed-SemiBold.woff2","images/analog-board.jpg","images/analog-cards.jpg","images/analog-rules.jpg","images/board-backdrop.svg","images/board-game.png","images/landing-page-teaser.png","images/logos/EU.svg","images/logos/Helmut_Schmidt.svg","images/logos/UnBW.svg","images/logos/dtec.bw_gross.svg","images/logos/fyayc.svg"]),
	mimeTypes: {".mp3":"audio/mpeg",".png":"image/png",".woff2":"font/woff2",".jpg":"image/jpeg",".svg":"image/svg+xml"},
	_: {
		client: {"start":"_app/immutable/entry/start.a30666dc.js","app":"_app/immutable/entry/app.47c7bcd2.js","imports":["_app/immutable/entry/start.a30666dc.js","_app/immutable/chunks/scheduler.9231f7ad.js","_app/immutable/chunks/singletons.4b5a177d.js","_app/immutable/chunks/index.cbaeab23.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/entry/app.47c7bcd2.js","_app/immutable/chunks/scheduler.9231f7ad.js","_app/immutable/chunks/index.cd525813.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./chunks/0-7da465de.js')),
			__memo(() => import('./chunks/1-183cef69.js')),
			__memo(() => import('./chunks/2-e357ef14.js')),
			__memo(() => import('./chunks/3-f5f7de05.js')),
			__memo(() => import('./chunks/5-1cd7c2a6.js')),
			__memo(() => import('./chunks/6-1a63045a.js')),
			__memo(() => import('./chunks/7-661e8e34.js')),
			__memo(() => import('./chunks/10-cf3b1aad.js')),
			__memo(() => import('./chunks/11-af9df414.js')),
			__memo(() => import('./chunks/12-7846e691.js')),
			__memo(() => import('./chunks/13-339fce3f.js')),
			__memo(() => import('./chunks/15-e3be168b.js')),
			__memo(() => import('./chunks/16-0ac883fa.js')),
			__memo(() => import('./chunks/17-fb2fbea9.js')),
			__memo(() => import('./chunks/18-4b34bbe0.js'))
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
