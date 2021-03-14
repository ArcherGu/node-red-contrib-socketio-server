module.exports = function (RED) {
    const socketio = require("socket.io");

    function _getNamespaceInstance(instance, namespace) {
        return namespace ? instance.of(namespace) : instance;
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

    function socketIoInit(n) {
        RED.nodes.createNode(this, n);
        // node-specific code goes here
        const node = this;
        this.name = n.name;
        this.delay = n.delay;
        this.instance = RED.nodes.getNode(n.instance).instance;

        setTimeout(() => {
            node.send({
                socketIoInstance: this.instance
            });
        }, this.delay);
    }

    function socketIoOn(n) {
        RED.nodes.createNode(this, n);
        // node-specific code goes here
        const node = this;
        this.name = n.name;
        this.event = n.event;
        this.namespace = n.namespace;

        node.on("input", (msg) => {
            if (!msg.socketIoInstance) {
                node.log("No msg.instance");
                return;
            }
            const instance = _getNamespaceInstance(msg.socketIoInstance, this.namespace);

            const listener = (socket) => {
                msg.socket = socket;
                node.send(msg);
            };

            instance.on(this.event, listener);

            node.on("close", () => {
                instance.off(this.event, listener);
            });
        });
    }

    function socketIoEmit(n) {
        RED.nodes.createNode(this, n);
        // node-specific code goes here
        const node = this;
        this.name = n.name;
        this.event = n.event;
        this.namespace = n.namespace;
        this.instance = RED.nodes.getNode(n.instance).instance;

        const instance = _getNamespaceInstance(this.instance, this.namespace);
        node.on('input', (msg) => {
            instance.emit(this.event, msg.payload);
        });
    }

    RED.nodes.registerType("socket.io-instance", socketIoInstance);
    RED.nodes.registerType("socket.io-init", socketIoInit);
    RED.nodes.registerType("socket.io-on", socketIoOn);
    RED.nodes.registerType("socket.io-emit", socketIoEmit);
};