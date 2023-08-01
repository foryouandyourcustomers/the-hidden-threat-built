const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["audio/sprite.mp3","favicon.png","fonts/Barlow-Bold.woff2","fonts/Barlow-Italic.woff2","fonts/Barlow-Medium.woff2","fonts/Barlow-SemiBold.woff2","fonts/BarlowCondensed-Bold.woff2","fonts/BarlowCondensed-Italic.woff2","fonts/BarlowCondensed-Medium.woff2","fonts/BarlowCondensed-SemiBold.woff2"]),
	mimeTypes: {".mp3":"audio/mpeg",".png":"image/png",".woff2":"font/woff2"},
	_: {
		client: {"start":"_app/immutable/entry/start.c4425eb5.js","app":"_app/immutable/entry/app.76032f95.js","imports":["_app/immutable/entry/start.c4425eb5.js","_app/immutable/chunks/scheduler.a610e7db.js","_app/immutable/chunks/singletons.d65e3d38.js","_app/immutable/chunks/index.ed90c645.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/entry/app.76032f95.js","_app/immutable/chunks/scheduler.a610e7db.js","_app/immutable/chunks/index.fbd117d9.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./chunks/0-271d7206.js')),
			__memo(() => import('./chunks/1-b3c43e85.js')),
			__memo(() => import('./chunks/2-e93c210a.js')),
			__memo(() => import('./chunks/3-cd85bbde.js')),
			__memo(() => import('./chunks/4-af3653bd.js')),
			__memo(() => import('./chunks/5-73eb8a9e.js')),
			__memo(() => import('./chunks/8-8ae962f6.js')),
			__memo(() => import('./chunks/9-0db7fe2d.js')),
			__memo(() => import('./chunks/10-5c3ac30f.js')),
			__memo(() => import('./chunks/11-f3b91beb.js')),
			__memo(() => import('./chunks/12-7718528c.js')),
			__memo(() => import('./chunks/13-d284421a.js'))
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
				id: "/game/new",
				pattern: /^\/game\/new\/?$/,
				params: [],
				page: { layouts: [0,3,], errors: [1,,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/game/[gameId=uid]",
				pattern: /^\/game\/([^/]+?)\/?$/,
				params: [{"name":"gameId","matcher":"uid","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,4,], errors: [1,,,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/game/[gameId=uid]/join",
				pattern: /^\/game\/([^/]+?)\/join\/?$/,
				params: [{"name":"gameId","matcher":"uid","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,4,], errors: [1,,,], leaf: 10 },
				endpoint: null
			},
			{
				id: "/(pages)/imprint",
				pattern: /^\/imprint\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/(pages)/privacy",
				pattern: /^\/privacy\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/(pages)/tos",
				pattern: /^\/tos\/?$/,
				params: [],
				page: { layouts: [0,2,], errors: [1,,], leaf: 8 },
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
