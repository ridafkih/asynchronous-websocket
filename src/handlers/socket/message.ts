import { WebSocket, RawData } from "ws";

import {
  objectHasKeys,
  parseWebSocketMessage,
  sendError,
} from "@helpers/socket";
import {
  WebSocketClientEventHandler,
  WebSocketClientMethodHandler,
  WebSocketError,
} from "@typings/sockets";
import { importHandlers } from "@helpers/filesystem";
import { validateUuid } from "@helpers/uuid";

const methodHandlers = importHandlers<WebSocketClientMethodHandler>(
  "handlers",
  "methods"
);

export default {
  name: "message",
  method: async function (this: WebSocket, data: RawData) {
    const message = parseWebSocketMessage(this, data);
    if (!message) return;

    const { method, body, uuid } = message;

    const handlers = await methodHandlers;
    const handler = handlers.find(({ name }) => name === method);
    if (!handler) return sendError(this, WebSocketError.INVALID_METHOD);

    if (!objectHasKeys(body, handler.requiredBodyKeys))
      return sendError(this, WebSocketError.INVALID_BODY_FORMAT);
    if (!validateUuid(uuid))
      return sendError(this, WebSocketError.INVALID_UUID);

    const boundHandlerMethod = handler.method.bind(this);
    boundHandlerMethod(message);
  },
} as WebSocketClientEventHandler;
