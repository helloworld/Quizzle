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

    questionEL = question(serverState);

    container.appendChild(questionEL);
}

var question = function(serverState) {
	// <div class="container">
 //        <h1>Question</h1>
 //        <div class="ui purple massive message">
 //            No question available.
 //        </div>
 //    </div>

 	quest = serverState.currentQuestion.question;

 	var d = document.createElement('div');

	var h1 = document.createElement('h1');
	h1.textContent = 'Question';

	var div = document.createElement('div');
	div.className = 'ui purple massive message';
	div.textContent = quest;

	d.appendChild(h1);
	d.appendChild(div);

	return d;
}