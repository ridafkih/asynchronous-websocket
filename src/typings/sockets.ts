export enum WebSocketError {
  INVALID_PROPERTIES = "websocket_invalid_properties",
  INVALID_BODY_FORMAT = "websocket_invalid_body_format",
  INVALID_BODY_PROPERTIES = "websocket_invalid_body_properties",
  INVALID_MESSAGE = "websocket_invalid_message",
  INVALID_METHOD = "websocket_invalid_method",
  INVALID_UUID = "websocket_invalid_uuid",
}

export interface WebSocketServerEventHandler {
  name: string;
  method: (...args: any[]) => any;
}

export interface WebSocketClientEventHandler {
  name: string;
  method: (...args: any[]) => any;
}

export interface WebSocketClientMethodHandler {
  name: string;
  requiredBodyKeys: string[];
  method: Function;
}

export interface WebSocketMessage<BodyType> {
  uuid: string;
  method: string;
  body: BodyType;
}
