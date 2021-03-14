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
        this.port = n.port;
        try {
            this.options = n.options ? JSON.parse(n.options) : {};
        } catch (error) {
            node.error("[Wrong Options] create socket.io instance fail!");
            this.options = {};
        }

        this.instance = socketio(this.port, this.options);
        node.log("Created Socket.IO server at " + this.port);

        node.on("close", () => {
            this.instance.close();
            node.log("Closed Socket.IO server at " + this.port);
        });
    }

    function socketIoOn(n) {
        RED.nodes.createNode(this, n);
        // node-specific code goes here
        const node = this;
        this.name = n.name;
        this.event = n.event;
        this.namespace = n.namespace;
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
            const instance = _getNamespaceAndRoomInstance(
                this.instance,
                msg.namespace || this.namespace,
                msg.room || this.room,
            );
            instance.emit(this.event, msg.payload);
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
    RED.nodes.registerType("socket.io-middleware-start", socketIoMiddlewareStart);
    RED.nodes.registerType("socket.io-middleware-end", socketIoMiddlewareEnd);
};