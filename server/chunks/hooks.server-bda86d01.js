import { g as getGlobalWebSocketServer, s as sendMessageToMachine, a as sendMessageToUsers } from './index4-1c09767b.js';
import './xstate.esm-8a1e0eb0.js';
import 'stream';
import 'zlib';
import 'buffer';
import 'net';
import 'tls';
import 'crypto';
import 'events';
import 'https';
import 'http';
import 'url';
import './index-8bc3041a.js';
import './_commonjsHelpers-849bcf65.js';
import './global-770b5537.js';
import './index-39e97e00.js';

const getSocketsForUser = ({
  gameId,
  userId
}) => {
  return [...getGlobalWebSocketServer().clients].filter(
    (client) => client.userId === userId && client.gameId === gameId
  );
};
new Proxy({}, {
  get() {
    throw new Error(
      `

=================================================
Web sockets are not available during prerendering
=================================================

`
    );
  }
});
let wssInitialized = false;
const setupWebSocketServerListeners = () => {
  const webSocketServer = getGlobalWebSocketServer();
  if (wssInitialized)
    return webSocketServer;
  wssInitialized = true;
  console.log("[wss:kit] setup");
  console.log("[wss:kit] setting up connection listener");
  webSocketServer.on("connection", connectionCallback);
  return webSocketServer;
};
const connectionCallback = (webSocket) => {
  console.log(`[wss:kit] client connected (${webSocket.socketId})`);
  if (getSocketsForUser(webSocket).length === 1) {
    sendMessageToMachine(webSocket.gameId, {
      type: "user connected",
      userId: webSocket.userId
    });
  } else {
    sendMessageToMachine(webSocket.gameId, {
      type: "user reconnected",
      userId: webSocket.userId
    });
  }
  webSocket.on("error", console.error);
  webSocket.on("message", (data) => {
    const message = JSON.parse(data.toString());
    if (message.type === "mouse position") {
      sendMessageToUsers({
        gameId: webSocket.gameId,
        message: { type: "mouse position", userId: webSocket.userId, position: message.position },
        excludeUserIds: [webSocket.userId]
      });
    } else {
      console.log("[wss:kit] received: %s", data);
      sendMessageToMachine(webSocket.gameId, { ...message, userId: webSocket.userId });
    }
  });
  webSocket.on("close", () => {
    console.log(`[wss:kit] client disconnected (${webSocket.socketId})`);
    if (getSocketsForUser(webSocket).length === 0) {
      sendMessageToMachine(webSocket.gameId, {
        type: "user disconnected",
        userId: webSocket.userId
      });
    }
  });
};
connectionCallback.svelteKitListener = true;
const handle = async ({ event, resolve }) => {
  const webSocketServer = setupWebSocketServerListeners();
  event.locals.webSocketServer = webSocketServer;
  const response = await resolve(event, {
    filterSerializedResponseHeaders: (name) => name === "content-type"
  });
  return response;
};

export { handle };
//# sourceMappingURL=hooks.server-bda86d01.js.map
