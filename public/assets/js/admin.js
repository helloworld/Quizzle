var socket;

var serverState = {}

var localState = {
    activeMenuItem: "control_panel"
}

var localStateHelpers = {
    menu: {
        switchMenuTo: function(target) {
            if (target == "control_panel" || target == "users") {
                localState.activeMenuItem = target;
            } else {
                console.error("Invalid Menu Item");

            }

        }
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    socket = io();
    initializeSocket(socket);
});

var initializeSocket = function(socket) {
    socket.emit("admin:join");
    socket.on("update:state", function(state) {
        serverState = state;
        renderView(serverState, localState);
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

var renderView = function(serverState, localState) {
    var container = document.querySelector(".container");
    clearContainer(container);

    var gridEL = grid(serverState, localState);
    container.appendChild(gridEL);
}

var title = function() {

    // <h1 class="title">Admin</h1>

    var h1 = document.createElement("h1");
    h1.className = "title";
    h1.textContent = "Admin"
    return h1;
}

var grid = function(serverState, localState) {

    // <div class="ui grid">
    //  <div class="four wide column">
    //  </div>
    //  <div class="twelve wide column">
    //  </div>
    // </div>

    var div = document.createElement("div");
    div.className = "ui grid";

    var four_column = document.createElement("div");
    four_column.className = "four wide column";

    var menuEL = menu(serverState, localState);
    four_column.appendChild(menuEL);

    var twelve_column = document.createElement("div");
    twelve_column.className = "twelve wide column";

    var child = localState.activeMenuItem == "control_panel" ? controlPanel(serverState, localState) : user(serverState, localState);
    twelve_column.appendChild(child);

    div.appendChild(four_column);
    div.appendChild(twelve_column);

    return div;
}

var menu = function(serverState, localState) {
    var classString;

    // <div class="ui vertical menu">
    //  <a class="item">
    //    Control Panel
    //  </a>
    //  <a class="teal item">
    //    Users
    //    <div class="ui teal label" id="user-count">1</div>
    //  </a>
    // </div>

    var div = document.createElement("div");
    div.className = "ui vertical menu";

    var control_panel = document.createElement("a");
    classString = localState.activeMenuItem == "control_panel" ? "active item" : "item"
    control_panel.className = classString;
    control_panel.textContent = "Control Panel";
    control_panel.id = "control_panel";

    control_panel.addEventListener("click", function(event) {
        localStateHelpers.menu.switchMenuTo("control_panel");
        renderView(serverState, localState);
    });


    var users = document.createElement("a");
    classString = localState.activeMenuItem == "users" ? "active item" : "item"
    users.className = classString;
    users.textContent = "Users";
    users.id = "user";

    users.addEventListener("click", function(event) {
        localStateHelpers.menu.switchMenuTo("users");
        renderView(serverState, localState);
    });

    var label = document.createElement("div");
    label.className = "ui teal label";
    label.textContent = "0";
    users.appendChild(label);

    div.appendChild(control_panel);
    div.appendChild(users);

    return div;
}

var card = function(playerName, status, tablet_id, phone_id) {

    // <div class="card">
    //     <div class="content">
    //         <div class="header">Player 1</div>
    //         <div class="meta">Not Connected</div>
    //         <div class="description">
    //             Socket ID: null
    //         </div>
    //     </div>
    // </div>

    var div = document.createElement("div");
    div.className = "card";

    var content = document.createElement("div")
    content.className = "content";

    var header = document.createElement("div")
    header.textContent = playerName;
    header.className = "header";

    var meta = document.createElement("div")
    meta.textContent = status;
    meta.className = "meta";

    var description = document.createElement("div")
    description.innerHTML = "tablet_id: " + tablet_id + "<br/> phone_id: " + phone_id;
    description.className = "description";

    content.appendChild(header);
    content.appendChild(meta);
    content.appendChild(description);

    div.appendChild(content);

    return div;
}

var user = function(serverState, localState) {

    // <div class = "ui cards">
    // </div>

    var div = document.createElement("div");
    div.className = "ui cards";

    var users = serverState.players;

    for (var i in users) {
        var current = users[i];
        var status = (current.tablet_id == null || current.phone_id == null) ? 'Not Ready' : 'Ready'
        var cardEl = card(current.name, status, current.tablet_id, current.phone_id);
        div.appendChild(cardEl);
    };

    return div;

}

var controlPanel = function(serverState, localState) {

    var div = document.createElement("div");

    var scoreEL = scoreSegment(serverState, localState);
    var tableEL = table(serverState, localState);

    div.appendChild(scoreEL);
    div.appendChild(tableEL);

    return div;
}

var table = function(serverState, localState) {
    var questions = serverState.questions;

    var div = document.createElement("table");
    div.className = "ui celled striped table";

    var head = document.createElement("thead");
    var headRow = document.createElement("tr");
    var headH = document.createElement("th");
    headH.setAttribute('colspan', '3');
    headH.textContent = "Questions";

    headRow.appendChild(headH);
    head.appendChild(headRow);
    div.appendChild(head);

    var addNewQ = newQuestion();

    div.appendChild(addNewQ);

    var body = document.createElement("tbody");

    for (var i in questions) {
        var current = questions[i];
        var tableRowEL = tableRow(current.label, current.question, current._id);
        body.appendChild(tableRowEL);
    };

    div.appendChild(body);

    return div;
}

var tableRow = function(category, question, id) {
    var div = document.createElement("tr");

    var row1 = document.createElement("td");
    row1.className = "collapsing";

    var label = document.createElement("a");
    label.className = "ui blue label";
    label.textContent = category;

    row1.appendChild(label);

    var row2 = document.createElement('td');
    row2.textContent = question;

    var row3 = document.createElement('td');
    row3.className = "right aligned collapsing";

    var button = document.createElement('div');
    button.className = "ui right labeled icon button";

    var icon = document.createElement('i');
    icon.className = "right arrow icon";
    button.appendChild(icon);

    var buttonText = document.createElement('span');
    buttonText.textContent = "Add";
    button.appendChild(buttonText);

    button.addEventListener("click", function(event){
        socket.emit("admin:question", id);
    });

    row3.appendChild(button);

    div.appendChild(row1);
    div.appendChild(row2);
    div.appendChild(row3);

    return div;
}

var scoreSegment = function(serverState, localState) {

    var players = serverState.players;

    var segment = document.createElement("div");
    segment.className = "ui segment";

    var div = document.createElement("div");
    div.className = "ui three column divided grid";

    for (i in players) {
        var current = players[i];
        var scoreEl = score(current.name, current.score);
        div.appendChild(scoreEl);
    }

    segment.appendChild(div);

    return segment;
}

var score = function(name, score) {

    var div = document.createElement("div");
    div.className = "column center aligned"

    var statistic = document.createElement("div");
    statistic.className = "ui statistic";

    var scoreValue = document.createElement("div");
    scoreValue.className = "text value";
    scoreValue.textContent = score;

    var nameValue = document.createElement("div");
    nameValue.className = "label";
    nameValue.textContent = name;

    statistic.appendChild(scoreValue);
    statistic.appendChild(nameValue);

    div.appendChild(statistic);

    return div;
}


var newQuestion = function() {
    // <tr>
    //     <td class="collapsing"><a class="ui blue label">SAT</a>
    //     </td>
    //     <td>A special lottery is to be held to select the student who will live in the only deluxe room in a dormitory. There are 100 seniors, 150 juniors, and 200 sophomores who applied. Each senior's name is placed in the lottery 3 times; each junior's name, 2 times; and each sophomore's name, 1 time. What is the probability that a senior's name will be chosen?</td>
    //     <td class="right aligned collapsing">
    //         <div class="ui right labeled icon button"><i class="right arrow icon"></i><span>Add</span>
    //         </div>
    //     </td>
    // </tr>

    // <div class="field">
    //     <textarea></textarea>
    //   </div>

    var row = document.createElement('tr');
    var td = document.createElement('td');
    td.className = 'collapsing';
    var input = document.createElement('div');
    input.className = 'field';
    var text = document.createElement('textarea');
    text.id = "labelText"

    input.appendChild(text);
    td.appendChild(input);

    td2 = document.createElement('td');
    td2.className = 'collapsing';
    var input2 = document.createElement('div');
    input2.className = 'field';
    var text2 = document.createElement('textarea');
    text2.id = "questionText"

    input2.appendChild(text2);
    td2.appendChild(input2);

    td3 = document.createElement('td');
    td3.className = 'collapsing';

    var button = document.createElement('div');
    button.className = "ui right labeled icon button";

    var icon = document.createElement('i');
    icon.className = "right arrow icon";
    button.appendChild(icon);

    var buttonText = document.createElement('span');
    buttonText.textContent = "Add";
    button.appendChild(buttonText);

    button.addEventListener("click", function(event) {
        var label = document.querySelector("#labelText").value;
        var question = document.querySelector("#questionText").value;
        socket.emit("admin:newquestion", label, question);
    });

    td3.appendChild(button);

    row.appendChild(td);
    row.appendChild(td2);
    row.appendChild(td3);
    return row;

}
