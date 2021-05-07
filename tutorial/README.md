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

## Example Flow:

```json
[
    {
        "id": "d182129b.0ef54",
        "type": "tab",
        "label": "Flow 1",
        "disabled": false,
        "info": ""
    },
    {
        "id": "2797025b.47d87e",
        "type": "socket.io-on",
        "z": "d182129b.0ef54",
        "name": "",
        "instance": "d523a6c7.23b758",
        "event": "connection",
        "namespace": "",
        "x": 220,
        "y": 140,
        "wires": [["fa31eb65.c8e018"]]
    },
    {
        "id": "dd59181e.c873e8",
        "type": "socket.io-emit",
        "z": "d182129b.0ef54",
        "name": "",
        "instance": "d523a6c7.23b758",
        "event": "onConnection",
        "namespace": "",
        "room": "",
        "x": 630,
        "y": 80,
        "wires": []
    },
    {
        "id": "fa31eb65.c8e018",
        "type": "function",
        "z": "d182129b.0ef54",
        "name": "say-hi",
        "func": "const message = msg.socket.handshake.query.message;\nmsg.payload = \"Hi, You have successfully connected\";\n\n// override event in emit node\nmsg.event = \"onConnection\";\n\n// override namespace in emit node\nmsg.namespace = \"custom_namespace\";\n\n// override room in emit node\nmsg.room = \"custom_room\";\n\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "x": 410,
        "y": 140,
        "wires": [["dd59181e.c873e8", "692a6683.1a5eb8"]]
    },
    {
        "id": "b7d0a68c.beef48",
        "type": "comment",
        "z": "d182129b.0ef54",
        "name": "On Event & Emit Event",
        "info": "",
        "x": 240,
        "y": 100,
        "wires": []
    },
    {
        "id": "692a6683.1a5eb8",
        "type": "socket.io-emit",
        "z": "d182129b.0ef54",
        "name": "Emit by override options",
        "instance": "d523a6c7.23b758",
        "event": "",
        "namespace": "",
        "room": "",
        "x": 650,
        "y": 180,
        "wires": []
    },
    {
        "id": "6736ceee.179b3",
        "type": "socket.io-join-room",
        "z": "d182129b.0ef54",
        "name": "",
        "room": "My_Room",
        "x": 440,
        "y": 340,
        "wires": [["260e5606.6ae7fa"]]
    },
    {
        "id": "42852907.575238",
        "type": "socket.io-on",
        "z": "d182129b.0ef54",
        "name": "",
        "instance": "6c1d57b3.cf4308",
        "event": "connection",
        "namespace": "",
        "x": 220,
        "y": 340,
        "wires": [["6736ceee.179b3"]]
    },
    {
        "id": "260e5606.6ae7fa",
        "type": "function",
        "z": "d182129b.0ef54",
        "name": "do something",
        "func": "msg.room = 'My_Room';\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "x": 640,
        "y": 340,
        "wires": [["495fb56.3cc5a4c"]]
    },
    {
        "id": "495fb56.3cc5a4c",
        "type": "socket.io-leave-room",
        "z": "d182129b.0ef54",
        "name": "leave room by override option",
        "room": "",
        "x": 890,
        "y": 340,
        "wires": [[]]
    },
    {
        "id": "5a25d72f.f02a68",
        "type": "comment",
        "z": "d182129b.0ef54",
        "name": "Join & Leave Room",
        "info": "",
        "x": 230,
        "y": 300,
        "wires": []
    },
    {
        "id": "787fd325.fab90c",
        "type": "socket.io-middleware-start",
        "z": "d182129b.0ef54",
        "name": "",
        "instance": "d523a6c7.23b758",
        "namespace": "",
        "x": 250,
        "y": 520,
        "wires": [["76390e1b.1df0b"]]
    },
    {
        "id": "76390e1b.1df0b",
        "type": "function",
        "z": "d182129b.0ef54",
        "name": "middleware logic",
        "func": "// Your middleware logic\n\n// Allows the client to connect\nmsg.payload = true;\n\n// Block client connections\n// msg.payload = false;\n\n\n// Do not override or delete\n// msg.next\n// msg.socket\n\nreturn msg;",
        "outputs": 1,
        "noerr": 0,
        "initialize": "",
        "finalize": "",
        "x": 500,
        "y": 520,
        "wires": [["223753da.1f3c8c"]]
    },
    {
        "id": "223753da.1f3c8c",
        "type": "socket.io-middleware-end",
        "z": "d182129b.0ef54",
        "name": "",
        "x": 760,
        "y": 520,
        "wires": []
    },
    {
        "id": "1b9dbbab.118dc4",
        "type": "comment",
        "z": "d182129b.0ef54",
        "name": "Middleware",
        "info": "",
        "x": 210,
        "y": 480,
        "wires": []
    },
    {
        "id": "d523a6c7.23b758",
        "type": "socket.io-instance",
        "name": "MyInstance1",
        "port": "3000",
        "options": ""
    },
    {
        "id": "6c1d57b3.cf4308",
        "type": "socket.io-instance",
        "name": "MyInstance2",
        "port": "3001",
        "options": ""
    }
]
```
