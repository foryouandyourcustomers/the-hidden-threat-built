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
		client: {"start":"_app/immutable/entry/start.977ab30f.js","app":"_app/immutable/entry/app.bcd3d4db.js","imports":["_app/immutable/entry/start.977ab30f.js","_app/immutable/chunks/scheduler.03dcb200.js","_app/immutable/chunks/singletons.a0bba657.js","_app/immutable/chunks/index.c110b09d.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/entry/app.bcd3d4db.js","_app/immutable/chunks/scheduler.03dcb200.js","_app/immutable/chunks/index.91584b48.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./chunks/0-574983cf.js')),
			__memo(() => import('./chunks/1-b88977a8.js')),
			__memo(() => import('./chunks/2-285a2e50.js')),
			__memo(() => import('./chunks/3-6b93c5d1.js')),
			__memo(() => import('./chunks/4-8953a36e.js')),
			__memo(() => import('./chunks/5-c95063aa.js')),
			__memo(() => import('./chunks/8-b7907e21.js')),
			__memo(() => import('./chunks/9-5286242a.js')),
			__memo(() => import('./chunks/10-2acf5bd4.js')),
			__memo(() => import('./chunks/11-e65d7ebc.js')),
			__memo(() => import('./chunks/12-e67d77af.js')),
			__memo(() => import('./chunks/13-6b72aba8.js'))
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
