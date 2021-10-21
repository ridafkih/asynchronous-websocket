import { WebSocketMessage, WebSocketError } from "@typings/sockets";
import { WebSocket, RawData } from "ws";

/**
 * Checks if the object has all the required keys.
 * @param object The object to check.
 * @param requiredKeys The required keys.
 * @returns Whether or not the object is properly formatted.
 */
export const objectHasKeys = (
  object: any = {},
  requiredKeys: string[]
): boolean => {
  const keys = Object.keys(object);
  return requiredKeys.every((requiredKey) => keys.includes(requiredKey));
};

/**
 * With raw data from the WebSocket 'message' event, this will parse it into a valid JSON response.
 * @param rawData The raw data from the WebSocket 'message' event.
 * @returns
 */
export const parseWebSocketMessage = <T>(
  socket: WebSocket,
  rawData: RawData
) => {
  let message: WebSocketMessage<T> | undefined;
  try {
    message = JSON.parse(rawData.toString());
    if (!objectHasKeys(message, ["method", "body", "uuid"]))
      return sendError(socket, WebSocketError.INVALID_PROPERTIES);
  } catch {
    sendError(socket, WebSocketError.INVALID_MESSAGE);
  }
  return message;
};

/**
 * Send a message to the recipient socket.
 * @param socket The WebSocket connection.
 * @param message The message to send.
 */
export const sendMessage = <BodyType>(
  socket: WebSocket,
  message: WebSocketMessage<BodyType>
) => {
  socket.send(JSON.stringify(message));
};

/**
 * Sends a clean WebSocket message containing an error.
 * @param socket The WebSocket connection.
 * @param errorMessage The message to send.
 */
export const sendError = (socket: WebSocket, errorMessage: string) => {
  socket.send(JSON.stringify({ error: errorMessage }));
};
