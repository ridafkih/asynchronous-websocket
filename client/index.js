const Socket = require("./lib/Socket");

const ws = new Socket();

ws.once("ready", () => {
  ws.sendRequest("sum", { numbers: [1, 2, 3] })
    .then(console.log)
    .catch(console.error);
});
