const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["audio/sprite.mp3","favicon.png"]),
	mimeTypes: {".mp3":"audio/mpeg",".png":"image/png"},
	_: {
		client: {"start":{"file":"_app/immutable/entry/start.ed272a3f.js","imports":["_app/immutable/entry/start.ed272a3f.js","_app/immutable/chunks/index.b40a0fed.js","_app/immutable/chunks/singletons.5b28a2eb.js","_app/immutable/chunks/index.721ce0c9.js","_app/immutable/chunks/parse.1d2978b5.js"],"stylesheets":[],"fonts":[]},"app":{"file":"_app/immutable/entry/app.9893a4fd.js","imports":["_app/immutable/entry/app.9893a4fd.js","_app/immutable/chunks/index.b40a0fed.js"],"stylesheets":[],"fonts":[]}},
		nodes: [
			() => import('./chunks/0-61a94b92.js'),
			() => import('./chunks/1-f8c9f90e.js'),
			() => import('./chunks/2-3b135f02.js'),
			() => import('./chunks/3-fb6c65f4.js'),
			() => import('./chunks/4-fdfc17be.js'),
			() => import('./chunks/5-8317426f.js'),
			() => import('./chunks/6-6908a28b.js'),
			() => import('./chunks/7-a5f69f24.js'),
			() => import('./chunks/8-8445352e.js'),
			() => import('./chunks/9-49e68295.js'),
			() => import('./chunks/10-43fb13de.js'),
			() => import('./chunks/11-fd77f3c1.js'),
			() => import('./chunks/12-49774a17.js'),
			() => import('./chunks/13-66037224.js')
		],
		routes: [
			{
				id: "/(pages)",
				pattern: /^\/?$/,
				params: [],
				page: { layouts: [0,2], errors: [1,,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/(pages)/contact",
				pattern: /^\/contact\/?$/,
				params: [],
				page: { layouts: [0,2], errors: [1,,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/game/new",
				pattern: /^\/game\/new\/?$/,
				params: [],
				page: { layouts: [0,3], errors: [1,,], leaf: 13 },
				endpoint: null
			},
			{
				id: "/game/[gameId=uid]",
				pattern: /^\/game\/([^/]+?)\/?$/,
				params: [{"name":"gameId","matcher":"uid","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,4], errors: [1,,,], leaf: 11 },
				endpoint: null
			},
			{
				id: "/game/[gameId=uid]/join",
				pattern: /^\/game\/([^/]+?)\/join\/?$/,
				params: [{"name":"gameId","matcher":"uid","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,3,4], errors: [1,,,], leaf: 12 },
				endpoint: null
			},
			{
				id: "/(pages)/help",
				pattern: /^\/help\/?$/,
				params: [],
				page: { layouts: [0,2], errors: [1,,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/(pages)/imprint",
				pattern: /^\/imprint\/?$/,
				params: [],
				page: { layouts: [0,2], errors: [1,,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/(pages)/privacy",
				pattern: /^\/privacy\/?$/,
				params: [],
				page: { layouts: [0,2], errors: [1,,], leaf: 9 },
				endpoint: null
			},
			{
				id: "/(pages)/tos",
				pattern: /^\/tos\/?$/,
				params: [],
				page: { layouts: [0,2], errors: [1,,], leaf: 10 },
				endpoint: null
			}
		],
		matchers: async () => {
			const { match: uid } = await import ('./chunks/uid-8ce0af1e.js');
			return { uid };
		}
	}
};

const prerendered = new Set(["/contact","/help"]);

export { manifest, prerendered };
//# sourceMappingURL=manifest.js.map
