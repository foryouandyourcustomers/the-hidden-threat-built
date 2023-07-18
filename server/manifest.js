const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["audio/sprite.mp3","favicon.png"]),
	mimeTypes: {".mp3":"audio/mpeg",".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.ceaaff3c.js","app":"_app/immutable/entry/app.3fc30f5f.js","imports":["_app/immutable/entry/start.ceaaff3c.js","_app/immutable/chunks/scheduler.03dcb200.js","_app/immutable/chunks/singletons.a8e88a50.js","_app/immutable/chunks/index.c110b09d.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/entry/app.3fc30f5f.js","_app/immutable/chunks/scheduler.03dcb200.js","_app/immutable/chunks/index.1583bf7b.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./chunks/0-c63d0db3.js')),
			__memo(() => import('./chunks/1-78a6296d.js')),
			__memo(() => import('./chunks/2-4aec3587.js')),
			__memo(() => import('./chunks/3-e9dc4f5e.js')),
			__memo(() => import('./chunks/4-66057f20.js')),
			__memo(() => import('./chunks/5-f195e432.js')),
			__memo(() => import('./chunks/8-9825551f.js')),
			__memo(() => import('./chunks/9-06402c51.js')),
			__memo(() => import('./chunks/10-eabd84ac.js')),
			__memo(() => import('./chunks/11-c44f9429.js')),
			__memo(() => import('./chunks/12-5bbd7500.js')),
			__memo(() => import('./chunks/13-8a8baf6d.js'))
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
