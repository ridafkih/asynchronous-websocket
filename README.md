## asynchronous-websocket

An expirement on async WebSockets. This allows for a developer to take advantage of the benefits of bilateral communication while maintaining a traditional request-response information flow. Implementing something like this into an application would allow a developer to send a WebSocket "request" and treat the response asynchronously, allowing a for easier continuity of information. 

### Flow 
1. Client generates valid V4 UUID according to RFC4122
2. Client sends payload with `uuid` specified somewhere to which the server can access it. In this repository, it is provided as a key in the payload object.
    
    ```json
      {
        "method": "sum",
        "body": {
          "numbers": [1, 2, 3]
        },
        "uuid": "0e30c0e6-d1c0-4a18-b7f7-fb3834850946"
      }
    ```
3. Server runs operations using the information provided, UUID is not traditionally utilized or acknowledged by the server.
4. Once server responds to the WebSocket, acknowledge and include the original UUID in the response payload. 
5. Client uses the responded UUID to reference the original request.

### Notes
1. In this example, the UUID can either be `null`, or a valid unique identifier as specified by RFC4122. Otherwise, the handler will reject the request.
2. In this example, the `uuid` key must still be present on the top-level of the payload object. However, it could be made to be optional.
3. In this example, if a request utilizes the UUID, if the client-side `Socket` WebSocket wrapper, the event emitted is `'message-{{uuid}}'` and is internally managed, otherwise it emits a `'message'`, event. This could be changed depending on the client-side implementation.
4. Since the UUID is only used as a client reference, it is safe for the client to generate the UUID. The asynchronous logic is all handled on the client side, so if someone were to bypass our implementation of the client and develop their own API wrapper, or client, they would be responsible for handling responses synchronously, or building their own asynchronous implementation.
5. An implementation could also be built where the server would also be able to handle requests in the same way as the client. Which would allow for the server to make more traditional styled requests to the client as if it were a server.


### Installation
1. Run setup to install dependencies.

`npm run setup`

2. Run WebSocket server to allow for client connection.

`npm run start`

3. Run the test client to test the example use-case.

`npm run client`

### Usage
```js
/**
 * Using the client-side Socket constructor that wraps the 'ws' modules' WebSocket object
 * a request can be sent in an asynchronous fashion. If the operation succeeds, and
 * a response with the automatically generated UUID is received and can be correlated
 * with a request, it will resolve. If the request times out (defaults to 10000ms) it
 * will reject.
**/

const Socket = require('./lib/Socket');
const ws = new Socket();

const handleReady = () => {
  ws.sendRequest("sum", {
    numbers: [1, 2, 3];
  })
  .then(message => {
    console.log("WebSocket request resolved", message);
  })
  .catch(console.error);
};

ws.once("ready", handleReady);
```
