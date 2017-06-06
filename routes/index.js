var User = require('../models/user').User;
var HttpError = require('../error').HttpError;

module.exports = function(app){
	app.get('/', (req, res, next) => {
		res.render('index')
	});

	app.get('/users', (req, res, next) => {
		User.find({}, (err, users) => {
			if(err) return next(err);
			res.json(users);
		});
	});

	app.get('/user/:id', (req, res, next) => {
		User.findById(req.params.id, (err, user) => {
			if(err) next(err);
			if(!user) {
				next(new HttpError(404, "User not found"));
			}
			res.json(user);
		});
	});
}