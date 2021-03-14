module.exports = function (RED) {
    var socketio = require("socket.io");

    function socketIoInstance(n) {
        RED.nodes.createNode(this, n);
        // node-specific code goes here
        var node = this;
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

        node.on("close", function () {
            this.instance.close();
            node.log("Closed Socket.IO server at " + this.port);
        });
    }

    function socketIoOn(n) {
        RED.nodes.createNode(this, n);
        // node-specific code goes here
        var node = this;
        this.name = n.name;
        this.instance = RED.nodes.getNode(n.instance).instance;
        this.event = n.event;
        this.namespace = n.namespace;

        var currentIo;
        if (this.namespace) {
            this.instance = this.instance.of(this.namespace);
        }
        else {
            currentIo = this.instance;
        }

        currentIo.on(this.event, (socket) => {
            node.send({
                socket
            });
        });
    }

    RED.nodes.registerType("socket.io-instance", socketIoInstance);
    RED.nodes.registerType("socket.io-on", socketIoOn);
};