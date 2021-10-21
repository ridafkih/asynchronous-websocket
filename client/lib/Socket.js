const { WebSocket } = require("ws");
const { v4 } = require("uuid");
const { EventEmitter } = require("stream");

const parseWebSocketData = ({ data }) => {
  let message;
  try {
    message = JSON.parse(data);
  } catch {}
  return message;
};

const handleOpen = function () {
  this.socket.removeEventListener("open", handleOpen);
  this.emit("ready");
};

const handleMessage = function (data) {
  const message = parseWebSocketData(data);
  if (!message) return;

  const request = this.requests.find(({ uuid }) => message.uuid === uuid);
  if (!request && request.uuid) return;
  if (!request) return this.emit("message", message);

  const { uuid, timeout } = request;
  clearTimeout(timeout);
  this.emit(`message-${uuid}`, message);
};

class Socket extends EventEmitter {
  constructor() {
    super();

    this.requests = [];
    this.socket = new WebSocket("ws://localhost:3001");

    const boundHandleOpen = handleOpen.bind(this);
    const boundHandleMessage = handleMessage.bind(this);

    this.socket.addEventListener("open", boundHandleOpen);
    this.socket.addEventListener("message", boundHandleMessage);
  }

  /**
   * Sends a request to the WebSocket with a unique UUID.
   * @param {string} method The method for the request.
   * @param {object} body The body of the request.
   * @param {number} timeToTimeout The time to timeout, defaults to 10 seconds.
   * @returns {Promise} Promise that resolves WebSocket message.
   */
  sendRequest = (method, body, timeToTimeout = 10000) => {
    const uuid = v4();
    this.socket.send(JSON.stringify({ method, body, uuid }));

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.removeListener(`message-${uuid}`, resolve);
        reject("timeout");
      }, timeToTimeout);
      this.requests.push({ uuid, timeout });
      this.once(`message-${uuid}`, resolve);
    });
  };
}

module.exports = Socket;
