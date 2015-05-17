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
};
