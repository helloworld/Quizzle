document.addEventListener("DOMContentLoaded", function(event) {
    var socket = io();
    initializeSocket(socket);
});

var initializeSocket = function(socket) {
    socket.emit("screen:join");
    // socket.on("update:state", function(state) {
    //     serverState = state;
    //     renderView(serverState, localState);
    // });
}

