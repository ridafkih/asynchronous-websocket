import { importHandlers } from "@helpers/filesystem";
import { logMessage } from "@helpers/logs";
import { WebSocketServerEventHandler } from "@typings/sockets";
import EventEmitter from "events";
import { WebSocketServer } from "ws";

const { WEBSOCKET_PORT } = process.env;

declare interface SocketServer {
  on(event: "ready", listener: () => void): this;
}

class SocketServer extends EventEmitter {
  constructor(
    private readonly socket = new WebSocketServer({
      port: WEBSOCKET_PORT as number | undefined,
    })
  ) {
    super();
    this.registerServerEvents();
  }

  private registerServerEvents = async () => {
    const handlers = await importHandlers<WebSocketServerEventHandler>(
      "handlers",
      "server"
    );

    handlers.forEach((handler) => this.registerEventHandler(handler));
    this.emit("ready");
  };

  private registerEventHandler = ({
    name,
    method,
  }: WebSocketServerEventHandler) => {
    logMessage(`REGISTERED WEBSOCKET SERVER EVENT: ${name}`);
    this.socket.on(name, method);
  };
}

export default SocketServer;
