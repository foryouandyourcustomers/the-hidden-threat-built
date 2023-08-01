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
		client: {"start":"_app/immutable/entry/start.97054b80.js","app":"_app/immutable/entry/app.09241766.js","imports":["_app/immutable/entry/start.97054b80.js","_app/immutable/chunks/scheduler.3df9b730.js","_app/immutable/chunks/singletons.ee4b9461.js","_app/immutable/chunks/index.9b15924c.js","_app/immutable/chunks/parse.7d180a0f.js","_app/immutable/entry/app.09241766.js","_app/immutable/chunks/scheduler.3df9b730.js","_app/immutable/chunks/index.06da1297.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./chunks/0-24cdfbf5.js')),
			__memo(() => import('./chunks/1-e65a6e3d.js')),
			__memo(() => import('./chunks/2-72eb1751.js')),
			__memo(() => import('./chunks/3-95ebeb37.js')),
			__memo(() => import('./chunks/4-25a13886.js')),
			__memo(() => import('./chunks/5-c19bcd48.js')),
			__memo(() => import('./chunks/8-518d9c9b.js')),
			__memo(() => import('./chunks/9-8b444513.js')),
			__memo(() => import('./chunks/10-b38bc490.js')),
			__memo(() => import('./chunks/11-543510b5.js')),
			__memo(() => import('./chunks/12-03d3cad3.js')),
			__memo(() => import('./chunks/13-f44c0908.js'))
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
