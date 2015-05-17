var express = require('express'),
    http = require('http'),
    hbs = require('hbs'),
    fs = require("fs"),
    router = require(__dirname + '/routes').router;

var app = express();
var port = process.env.PORT || 8080;

app.disable('etag');

app.set('view engine', 'html');
app.set('views', __dirname + '/views/pages');
app.engine('html', hbs.__express);

var route = express.Router();

route.get('/index.html', function(req, res) {
    res.redirect(301, '/');
});

route.get('/', router.index);
route.get('/admin', router.admin);
route.get('/user', router.user);
route.get('/screen', router.screen);
route.get('/tablet1', router.tablet1);
route.get('/tablet2', router.tablet2);
route.get('/tablet3', router.tablet3);


app.use('/', route);

app.use("/", express.static(__dirname + "/public/"));

var server = http.createServer(app).listen(port, function() {
    console.log('Express server listening on port ' + port);
});

var io = require('socket.io').listen(server);

var admin = null
var screen = null;

var players = [{
    name: "Player 1",
    score: 0,
    tablet_id: null,
    phone_id: null,
    answer: null
}, {
    name: "Player 2",
    score: 0,
    tablet_id: null,
    phone_id: null,
    answer: null
}, {
    name: "Player 3",
    score: 0,
    tablet_id: null,
    phone_id: null,
    answer: null
}, ];


var questions = require("./public/assets/questions.json");

var currentQuestion = {
    label: "None",
    question: "No Question Selected"
};

var sendStateToAdmin = function() {
    var state = {
        players: players,
        questions: questions,
    }

    if (admin) {
        admin.emit("update:state", state);
    }
}

var sendStateToScreen = function() {
    var state = {
        players: players,
        currentQuestion: currentQuestion,
    }

    if (screen) {
        screen.emit("update:state", state);
    }
}

var sendStateToTablet = function(index) {
    var state = {}
    if (players[index].tablet_id) {
        if (players[index].tablet_id) {
            var target = players[index].tablet_id;
            target.emit("update:state", state);
        }
    }
}

var hashCode = function(str) {
    var hash = 0;
    if (str.length == 0) return hash;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

var findQuestion = function(id) {
    for (i in questions) {
        if (questions[i]._id == id) {
            return questions[i];
        }
    }
}

io.on('connection', function(socket) {
    socket.on("admin:join", function() {
        console.log("admin:join", socket.id);
        admin = socket;
        sendStateToAdmin();
    });
    socket.on("screen:join", function() {
        console.log("screen:join", socket.id);
        screen = socket;
        sendStateToScreen();
    });
    socket.on("tablet:1:join", function() {
        console.log("tablet:1:join", socket.id);
        players[0].tablet_id = socket;
        sendStateToTablet(0);
    });
    socket.on("tablet:2:join", function() {
        console.log("tablet:2:join", socket.id);
        players[1].tablet_id = socket;
        sendStateToTablet(1);
        sendStateToAdmin();
    });
    socket.on("tablet:3:join", function() {
        console.log("tablet:3:join", socket.id);
        players[2].tablet_id = socket;
        sendStateToTablet(2);
        sendStateToAdmin();

    });
    socket.on("admin:newquestion", function(label, question) {
        var _id = hashCode(question);
        questions.push({
            label: label,
            _id: _id,
            question: question,
        });
        fs.writeFile("./public/assets/questions.json", JSON.stringify(questions), "utf8", function() {
            console.log("Questions Saved");
        });
        sendStateToAdmin();
    });
    socket.on("admin:question", function(id) {
        var q = findQuestion(id);
        currentQuestion = q;
        sendStateToScreen();
    });
    socket.on("image", function(index, img){
        players[index].answer = img;
        sendStateToScreen();
    })
    socket.on("disconnect", function() {
        if (socket == admin) {
            console.log("Admin Disconnected");
            admin = null;
        }
        if (socket == players[0].tablet_id) {
            console.log("Tablet" + "0" + "Disconnected")
            players[0].tablet_id = null;
        }
        if (socket == players[1].tablet_id) {
            console.log("Tablet" + "1" + "Disconnected")
            players[1].tablet_id = null;
        }
        if (socket == players[2].tablet_id) {
            console.log("Tablet" + "2" + "Disconnected")
            players[2].tablet_id = null;
        }
        sendStateToAdmin();
    })
});
