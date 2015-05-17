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

    answersEL = answers(serverState);

    container.appendChild(questionEL);
    container.appendChild(document.createElement('br'));

    container.appendChild(answersEL);
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

var answers = function(serverState) {
//     <div class="ui small images">
//   <img src="/images/wireframe/image.png">
//   <img src="/images/wireframe/image.png">
//   <img src="/images/wireframe/image.png">
//   <img src="/images/wireframe/image.png">
// </div>

    var div = document.createElement('div');
    div.className = 'ui medium images';

    var users = serverState.players;
    for (i in users){
        var imageAns = document.createElement('img');
        var current = users[i];
        if (current.answer != null){
            imageAns.src = current.answer;
        }
        else{
            imageAns.src = 'http://t2.gstatic.com/images?q=tbn%3AANd9GcStv5CZHas_Ayq9kflFMwCoMY0Y3h-MkclbcAOn3a5Tz9Zunl3cbA';
        }
        div.appendChild(imageAns);
    }

    return div;
}
