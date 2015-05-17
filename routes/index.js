exports.router = {
	index: function(req, res){
		res.render('index');
	},
    admin: function(req, res) {
        res.render('admin');
    },
    user: function(req, res) {
        res.render('user');
    },
    screen: function(req, res) {
        res.render('screen');
    },
    tablet1: function(req, res) {
        res.render('tablet1');
    },
    tablet2: function(req, res) {
        res.render('tablet2');
    },
    tablet3: function(req, res) {
        res.render('tablet3');
    },
};
