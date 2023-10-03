import { g as getGlobalWebSocketServer, s as sendMessageToMachine, a as sendMessageToUsers } from './index3-67733945.js';
import './items-426393ab.js';
import './xstate.esm-113c4c56.js';
import './_commonjsHelpers-24198af3.js';
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
import './utils-d2797627.js';
import './index-bfbc1d9c.js';
import './global-09c6ed76.js';
import './index-a4865dbd.js';

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
  console.log(`[wss:kit] client connected (${webSocket.socketId}, user ${webSocket.userId})`);
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
      if (Object.hasOwn(message, "userId")) {
        console.error(
          "Received a client message that already hat the userId set. This is not allowed. Message: ",
          message
        );
      } else {
        sendMessageToMachine(webSocket.gameId, { ...message, userId: webSocket.userId });
      }
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
//# sourceMappingURL=hooks.server-fd0000a0.js.map