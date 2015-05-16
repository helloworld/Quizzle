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
    renderView(serverState, localState);
});

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

var title = function(){

	// <h1 class="title">Admin</h1>

	var h1 = document.createElement("h1");
	h1.className = "title";
	h1.textContent = "Admin"
	return h1;
}

var grid = function(serverState, localState) {

    // <div class="ui grid">
    // 	<div class="four wide column">
    // 	</div>
    // 	<div class="twelve wide column">
    // 	</div>
    // </div>

    var div = document.createElement("div");
    div.className = "ui grid";

    var four_column = document.createElement("div");
    four_column.className = "four wide column";

    var menuEL = menu(serverState, localState);
    four_column.appendChild(menuEL);

    var twelve_column = document.createElement("div");
    twelve_column.className = "twelve wide column";

    div.appendChild(four_column);
    div.appendChild(twelve_column);

    return div;
}

var menu = function(serverState, localState) {
    var classString;

    // <div class="ui vertical menu">
    // 	<a class="item">
    // 	  Control Panel
    // 	</a>
    // 	<a class="teal item">
    // 	  Users
    // 	  <div class="ui teal label" id="user-count">1</div>
    // 	</a>
    // </div>

    var div = document.createElement("div");
    div.className = "ui vertical menu";

    var control_panel = document.createElement("a");
    classString = localState.activeMenuItem == "control_panel" ? "active item" : "item"
    control_panel.className = classString;
    control_panel.textContent = "Control Panel"

    var users = document.createElement("a");
    classString = localState.activeMenuItem == "users" ? "active item" : "item"
    users.className = classString;
    users.textContent = "Users"

    var label = document.createElement("div");
    label.className = "ui teal label";
    label.textContent = "0";
    users.appendChild(label);

    div.appendChild(control_panel);
    div.appendChild(users);
    return div;
}

var card = function(serverState, localState){

	// <div class="card">
	//     <div class="content">
	//         <div class="header">Player 1</div>
	//         <div class="meta">Not Connected</div>
	//         <div class="description">
	//             Socket ID: null
	//         </div>
	//     </div>
	// </div>
	
}