var express = require('express'),
    http = require('http'),
    hbs = require('hbs'),
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

app.use('/', route);

app.use("/", express.static(__dirname + "/public/"));

var server = http.createServer(app).listen(port, function() {
    console.log('Express server listening on port ' + port);
});

var io = require('socket.io').listen(server);
var admin;

var players = [{
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
}];

var questions = [{
    label: "SAT",
    question: "A special lottery is to be held to select the student who will live in the only deluxe room in a dormitory. There are 100 seniors, 150 juniors, and 200 sophomores who applied. Each senior's name is placed in the lottery 3 times; each junior's name, 2 times; and each sophomore's name, 1 time. What is the probability that a senior's name will be chosen?"
}, {
    label: "Math",
    question: "The projected sales volume of a video game cartridge is given by the function s of p = 3000 over ((2 times p) + a) where s is the number of cartridges sold, in thousands; p is the price per cartridge, in dollars; and a is a constant. If according to the projections, 100000 cartridges are sold at 10 dollars per cartridge, how many cartridges will be sold at 20 dollars per cartridge?"
},]

var navigation = {
	menu: "Control Panel";
}

var sendStateToAdmin = function() {
    state = {
        players: players,
        questions: questions,
        navigation: navigation,
    }

    if(admin){
    	admin.emit("update:state", state);
    }

}

io.on('connection', function(socket) {
    socket.on("admin:join", function() {
        console.log("admin:join", socket._id);
        admin = socket;
    });
    socket.on("user:join", function(player) {

    })
});
