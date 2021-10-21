import dotenv from "dotenv";
dotenv.config();

import SocketServer from "@modules/SocketServer";
import { logMessage } from "@helpers/logs";

const server = new SocketServer();
server.on("ready", () => {
  logMessage("SOCKET SERVER ONLINE");
});
