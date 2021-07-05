module.exports = function (RED) {
    const socketio = require("socket.io");

    function _getNamespaceAndRoomInstance(instance, namespace, room) {
        if (namespace) {
            instance = instance.of(namespace);
        }

        if (room) {
            instance = instance.to(room);
        }

        return instance;
    }

    function socketIoInstance(n) {
        RED.nodes.createNode(this, n);
        // node-specific code goes here
        const node = this;
        this.name = n.name;
        this.port = Number(n.port);
        this.bindToNode = n.bindToNode;

        try {
            this.options = n.options ? JSON.parse(n.options) : {};
        } catch (error) {
            node.error("[Wrong Options] create socket.io instance fail!");
            this.options = {};
        }

        if (Number(RED.settings.uiPort) == this.port || this.bindToNode) {
            this.instance = socketio(RED.server, this.options);
            this.instance.protectHttpServer = true;
            node.log("Socket.IO server will bind to Node-Red port");
        }
        else {
            this.instance = socketio(this.port, this.options);
            node.log("Created Socket.IO server at " + this.port);
        }

        node.on("close", () => {
            if (this.instance.protectHttpServer) {
                this.instance.httpServer = null;
            }
            this.instance.close();
            node.log("Closed Socket.IO server at " + (this.bindToNode ? 'Node-Red port' : this.port));
        });
    }

    function socketIoOn(n) {
        RED.nodes.createNode(this, n);
        // node-specific code goes here
        const node = this;
        this.name = n.name;
        this.event = n.event;
        this.namespace = n.namespace;
        if (n.instance) {
            this.instance = RED.nodes.getNode(n.instance).instance;

            const instance = _getNamespaceAndRoomInstance(this.instance, this.namespace, null);

            const listener = (socket) => {
                node.send({
                    socket
                });
            };

            instance.on(this.event, listener);

            node.on("close", () => {
                instance.off(this.event, listener);
            });
        }
        else {
            node.on('input', (msg) => {
                if (!this.event && !msg.socket) {
                    return;
                }

                const listener = (...args) => {
                    msg.payload = args;
                    node.send(msg);
                };

                msg.socket.on(this.event, listener);

                node.on("close", () => {
                    msg.socket.off(this.event, listener);
                });
            });
        }
    }

    function socketIoEmit(n) {
        RED.nodes.createNode(this, n);
        // node-specific code goes here
        const node = this;
        this.name = n.name;
        this.event = n.event;
        this.namespace = n.namespace;
        this.room = n.room;
        this.instance = RED.nodes.getNode(n.instance).instance;

        node.on('input', (msg) => {
            if (!this.event && !msg.event) {
                return;
            }

            const instance = _getNamespaceAndRoomInstance(
                this.instance,
                msg.namespace || this.namespace,
                msg.room || this.room,
            );
            instance.emit(msg.event || this.event, msg.payload);
        });
    }

    function socketIoJoinRoom(n) {
        RED.nodes.createNode(this, n);
        // node-specific code goes here
        const node = this;
        this.name = n.name;
        this.room = n.room;

        node.on('input', (msg) => {
            if (!msg.socket || (!msg.room && !this.room)) {
                node.send(msg);
                return;
            }

            msg.socket.join(msg.room || this.room);
            node.send(msg);
        });
    }

    function socketIoLeaveRoom(n) {
        RED.nodes.createNode(this, n);
        // node-specific code goes here
        const node = this;
        this.name = n.name;
        this.room = n.room;

        node.on('input', (msg) => {
            if (!msg.socket || (!msg.room && !this.room)) {
                node.send(msg);
                return;
            }

            msg.socket.leave(msg.room || this.room);
            node.send(msg);
        });
    }

    function socketIoMiddlewareStart(n) {
        RED.nodes.createNode(this, n);
        // node-specific code goes here
        const node = this;
        this.name = n.name;
        this.namespace = n.namespace;
        this.instance = RED.nodes.getNode(n.instance).instance;
        const instance = _getNamespaceAndRoomInstance(this.instance, this.namespace, null);

        instance.use((socket, next) => {
            node.send({
                socket,
                next
            });
        });
    }

    function socketIoMiddlewareEnd(n) {
        RED.nodes.createNode(this, n);
        // node-specific code goes here
        const node = this;
        this.name = n.name;

        node.on("input", (msg) => {
            if (!msg.next) {
                node.log("No msg.next");
                return;
            }

            if (msg.payload) {
                msg.next();
            }
            else {
                msg.next(new Error(msg.errMsg ? msg.errMsg : 'invalid'));
            }
        });
    }

    RED.nodes.registerType("socket.io-instance", socketIoInstance);
    RED.nodes.registerType("socket.io-on", socketIoOn);
    RED.nodes.registerType("socket.io-emit", socketIoEmit);
    RED.nodes.registerType("socket.io-join-room", socketIoJoinRoom);
    RED.nodes.registerType("socket.io-leave-room", socketIoLeaveRoom);
    RED.nodes.registerType("socket.io-middleware-start", socketIoMiddlewareStart);
    RED.nodes.registerType("socket.io-middleware-end", socketIoMiddlewareEnd);
};
