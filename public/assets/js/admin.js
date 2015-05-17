var serverState = {
    players: [{
        name: "Player 1",
        score: 0,
        _id: null,
    }, {
        name: "Player 2",
        score: 0,
        _id: null,
    }, {
        name: "Player 3",
        score: 0,
        _id: null,
    }, {
        name: "Player 4",
        score: 0,
        _id: null,
    }],
    questions: [{
        label: "SAT",
        question: "A special lottery is to be held to select the student who will live in the only deluxe room in a dormitory. There are 100 seniors, 150 juniors, and 200 sophomores who applied. Each senior's name is placed in the lottery 3 times; each junior's name, 2 times; and each sophomore's name, 1 time. What is the probability that a senior's name will be chosen?"
    }, {
        label: "Math",
        question: "The projected sales volume of a video game cartridge is given by the function s of p = 3000 over ((2 times p) + a) where s is the number of cartridges sold, in thousands; p is the price per cartridge, in dollars; and a is a constant. If according to the projections, 100000 cartridges are sold at 10 dollars per cartridge, how many cartridges will be sold at 20 dollars per cartridge?"
    }, ]
}
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
    var socket = io();
    initializeSocket(socket);
    renderView(serverState, localState);
});

var initializeSocket = function(socket) {
    socket.on("update:state", function(state) {
        serverState = state;
        renderView(serverState, localState);
    })
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

    // var cardListEL = cardList(serverState, localState);
    // twelve_column.appendChild(cardListEL);
    var tableEL = table(serverState, localState);
    twelve_column.appendChild(tableEL);

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

    var users = document.createElement("a");
    classString = localState.activeMenuItem == "users" ? "active item" : "item"
    users.className = classString;
    users.textContent = "Users";

    var label = document.createElement("div");
    label.className = "ui teal label";
    label.textContent = "0";
    users.appendChild(label);

    div.appendChild(control_panel);
    div.appendChild(users);
    return div;
}

var card = function(playerName, status, socketID) {

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
    description.textContent = socketID;
    description.className = "description";

    content.appendChild(header);
    content.appendChild(meta);
    content.appendChild(description);

    div.appendChild(content);

    return div;
}

var cardList = function(serverState, localState) {

    var users = [{
        name: "Rachel",
        status: "Connected",
        socketID: "xmjh298374j"
    }, {
        name: "Sashank",
        status: "Connected",
        socketID: "asdfghjkl"
    }, {
        name: "Srijith",
        status: "Not Connected",
        socketID: "iurewiufehjf"
    }]

    // <div class = "ui cards">
    // </div>

    var div = document.createElement("div");
    div.className = "ui cards";

    for (var i in users) {
        var current = users[i];
        var cardEl = card(current.name, current.status, current.socketID)
        div.appendChild(cardEl);
    };

    return div;

}

var tableRow = function(category, question) {
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

    row3.appendChild(button);

    div.appendChild(row1);
    div.appendChild(row2);
    div.appendChild(row3);

    return div;
}

var table = function(serverState, localState) {
    var questions = [{
        label: 'SAT',
        question: "A special lottery is to be held to select the student who will live in the only deluxe room in a dormitory. There are 100 seniors, 150 juniors, and 200 sophomores who applied. Each senior's name is placed in the lottery 3 times; each junior's name, 2 times; and each sophomore's name, 1 time. What is the probability that a senior's name will be chosen?"
    }, {
        label: 'Math',
        question: "The projected sales volume of a video game cartridge is given by the function s of p = 3000 over ((2 times p) + a) where s is the number of cartridges sold, in thousands; p is the price per cartridge, in dollars; and a is a constant. If according to the projections, 100000 cartridges are sold at 10 dollars per cartridge, how many cartridges will be sold at 20 dollars per cartridge?"
    }];

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

    var body = document.createElement("tbody");

    for (var i in questions) {
        var current = questions[i];
        var tableRowEL = tableRow(current.label, current.question);
        body.appendChild(tableRowEL);
    };

    div.appendChild(body);

    return div;
}
