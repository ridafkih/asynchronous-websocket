import { WebSocket } from "ws";

import { sendError, sendMessage } from "@helpers/socket";
import {
  WebSocketClientMethodHandler,
  WebSocketError,
  WebSocketMessage,
} from "@typings/sockets";

interface SumNumbersProps {
  numbers: [];
}

const isBodyValid = ({ numbers }: SumNumbersProps) => {
  return Array.isArray(numbers) && numbers.every((number) => !isNaN(number));
};

export default {
  name: "sum",
  requiredBodyKeys: ["numbers"],
  method: function (
    this: WebSocket,
    { method, body, uuid }: WebSocketMessage<SumNumbersProps>
  ) {
    if (!isBodyValid(body))
      return sendError(this, WebSocketError.INVALID_BODY_PROPERTIES);

    const sum = body.numbers.reduce((a, b) => a + b, 0);
    return sendMessage(this, { method, body: { sum }, uuid });
  },
} as WebSocketClientMethodHandler;
