# node-red-contrib-socketio-server

A Node-Red node for [Socket.IO](https://socket.io/docs/v3) server.

## Nodes

-   `socket.io-instance`: create a Socket.IO server instance.
-   `socket.io-on`: listen for specific event.
-   `socket.io-emit`: send data for a specific event to clients.
-   `socket.io-join-room`: join a room.
-   `socket.io-leave-room`: leave a room.
-   `socket.io-middleware-start` & `socket.io-middleware-end`: for middleware.

Note: Do not print any `msg` that contains the `msg.socket`. Otherwise it will cause "RangeError: Maximum call stack size exceeded" error. see [issues #1](https://github.com/ArcherGu/node-red-contrib-socketio-server/issues/1).

## Tutorial

You can find tutorial [here]().

## License

The code in this project is licensed under [MIT license](https://github.com/ArcherGu/node-red-contrib-socketio-server/blob/main/LICENSE).
