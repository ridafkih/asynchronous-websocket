import { IncomingMessage } from "http";
import { WebSocket } from "ws";

import { importHandlers } from "@helpers/filesystem";
import {
  WebSocketClientEventHandler,
  WebSocketServerEventHandler,
} from "@typings/sockets";

/**
 * Registers a WebSocket client handler.
 * @param socket The WebSocket to register the event to.
 * @param handler The WebSocket client event handler.
 */
const registerWebSocketClientEvent = (
  socket: WebSocket,
  { name, method }: WebSocketClientEventHandler
) => {
  socket.on(name, method);
};

export default {
  name: "connection",
  method: async (socket: WebSocket, request: IncomingMessage) => {
    const handlers = await importHandlers<WebSocketClientEventHandler>(
      "handlers",
      "socket"
    );
    handlers.forEach(({ name, method }) => {
      const boundMethod = method.bind(socket);
      registerWebSocketClientEvent(socket, { name, method: boundMethod });
    });
  },
} as WebSocketServerEventHandler;
