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
		client: {"start":"_app/immutable/entry/start.179d8cd3.js","app":"_app/immutable/entry/app.2879a0af.js","imports":["_app/immutable/entry/start.179d8cd3.js","_app/immutable/chunks/scheduler.03dcb200.js","_app/immutable/chunks/singletons.7900e180.js","_app/immutable/chunks/index.c110b09d.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/entry/app.2879a0af.js","_app/immutable/chunks/scheduler.03dcb200.js","_app/immutable/chunks/index.91584b48.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./chunks/0-e192b2ff.js')),
			__memo(() => import('./chunks/1-b7b03afb.js')),
			__memo(() => import('./chunks/2-f22ecb90.js')),
			__memo(() => import('./chunks/3-6b93c5d1.js')),
			__memo(() => import('./chunks/4-8953a36e.js')),
			__memo(() => import('./chunks/5-c95063aa.js')),
			__memo(() => import('./chunks/8-b7907e21.js')),
			__memo(() => import('./chunks/9-5286242a.js')),
			__memo(() => import('./chunks/10-2acf5bd4.js')),
			__memo(() => import('./chunks/11-ddf4ad02.js')),
			__memo(() => import('./chunks/12-e14da4a7.js')),
			__memo(() => import('./chunks/13-02a809f7.js'))
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
