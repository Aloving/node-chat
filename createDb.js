var mongoose = require('./libs/mongoose');
var User = require('./models/user').User;

function open(){
	return new Promise((resolve, reject) => {
		mongoose.connection.on('open', resolve);
	});
}

function dropDb() {
	var db = mongoose.connection.db;
	return new Promise((resolve, reject) => db.dropDatabase(resolve));
}

function createUsers(){
	require('./models/user');
	var vasya = new User({username: 'Вася', password: 'supervasya'});
	var petya = new User({username: 'Петя', password: 'superpetya'});
	var admin = new User({username: 'admin', password: 'admin'});
	return Promise.all([
		vasya.save(),
		petya.save(),
		admin.save()
	])
}

	open()
		.then(dropDb)
		.then(createUsers)
		.then(result => {
			console.log(result);
		})
		.catch(err => console.log(err))
		.then(() => mongoose.disconnect());