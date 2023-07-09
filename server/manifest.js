const manifest = {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["audio/sprite.mp3","favicon.png"]),
	mimeTypes: {".mp3":"audio/mpeg",".png":"image/png"},
	_: {
		client: {"start":{"file":"_app/immutable/entry/start.9b66dc69.js","imports":["_app/immutable/entry/start.9b66dc69.js","_app/immutable/chunks/index.8741fe9c.js","_app/immutable/chunks/singletons.a7f42d84.js","_app/immutable/chunks/index.e0b1c8ed.js","_app/immutable/chunks/parse.1d2978b5.js"],"stylesheets":[],"fonts":[]},"app":{"file":"_app/immutable/entry/app.3fe1120c.js","imports":["_app/immutable/entry/app.3fe1120c.js","_app/immutable/chunks/index.8741fe9c.js"],"stylesheets":[],"fonts":[]}},
		nodes: [
			() => import('./chunks/0-9aa6af91.js'),
			() => import('./chunks/1-984e7bbe.js'),
			() => import('./chunks/2-3756182a.js'),
			() => import('./chunks/3-389413f3.js'),
			() => import('./chunks/4-66c19a02.js'),
			() => import('./chunks/5-c4e54643.js'),
			() => import('./chunks/6-462738d8.js'),
			() => import('./chunks/7-162332ea.js'),
			() => import('./chunks/8-ff64f18d.js'),
			() => import('./chunks/9-8988a6a4.js'),
			() => import('./chunks/10-3f7bb178.js'),
			() => import('./chunks/11-b797bccd.js'),
			() => import('./chunks/12-b87e2363.js'),
			() => import('./chunks/13-596c65b9.js')
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
