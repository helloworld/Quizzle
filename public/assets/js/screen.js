var serverState = {};

document.addEventListener("DOMContentLoaded", function(event) {
    var socket = io();
    initializeSocket(socket);
});

var initializeSocket = function(socket) {
    socket.emit("screen:join");
    socket.on("update:state", function(state) {
        serverState = state;
        renderView(serverState);
    });
}

var clearContainer = function(e) {
    if (!e) {
        return false;
    }
    if (typeof(e) == 'string') {
        e = xGetElementById(e);
    }
    while (e.hasChildNodes()) {
        e.removeChild(e.firstChild);
    }
    return true;
}

var renderView = function(serverState) {
    var container = document.querySelector(".container");
    clearContainer(container);

}