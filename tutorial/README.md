# Tutorial

## 1. Add Instances

Create a instance of Socket.IO Server.

A port must be specified to bind.

JSON is required for options. Options information can be referenced in [Socket.IO documentation](https://socket.io/docs/v3/server-initialization/).

## 2. Listen for Events

Specify an instance to listen for specific event.

A [Socket](https://socket.io/docs/v3/server-api/#Socket) instance will be mounted to `msg.socket` for output.

For example, you can listen for connection event, and when a client connects, you can identify it by `handshake` from `msg.socket.handshake`.

## 3. Emit Event

Send data for a specific event to clients.

Mount data for sending to `msg.payload`.

`msg.event`, `msg.namespace`, `msg.room` can be used to override node's options.

## 4. Room

Let Socket instance join or leave a specific room.

Socket instance must be mounted to `msg.socket`.

Same msg will be output.

`msg.room` can be used to override node's options.

## 5. Middleware

[Middleware](https://socket.io/docs/v3/middlewares/) settings for Socket.IO Server instance.

Need to be used with `socket.io middleware end`.

The middleware process that needs to be handled is connected in series between `socket.io middleware start` and `socket.io middleware end`.

The process will receive an input that contains `msg.socket` `and msg.next`.

`msg.socket`: [Socket instance](https://socket.io/docs/v3/server-api/#Socket).

`msg.next`: Middleware process completion method.

**NOTE: Do not override or delete these two members in the process.**

The process finally needs to mount `true / false` to msg.payload, Then link to `socket.io middleware end` to complete the entire process of the middleware.

success: `socket.io middleware end` receives `msg.payload` what is `true`.

fail: `socket.io middleware end` receives `msg.payload` is `false`, the client will be disconnected. You can mount a custom error message to `msg.errMsg` which will be send to client.

## 6. Example:

You can find example flow [here](https://flows.nodered.org/flow/e65be16b8f2a83f61f0c2ad93bb52d1a).
