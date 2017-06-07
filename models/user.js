var path = require('path');
var util = require('util');
var http = require('http');

var crypto = require('crypto');

var mongoose = require('../libs/mongoose'),
		Schema = mongoose.Schema;

var schema = new Schema({
	username: {
		type: String,
		unique: true,
		required: true
	},
	hashedPassword: {
		type: String,
		required: true
	},
	salt: {
		type: String,	
		required: true
	},
	created: {
		type: Date,
		default: Date.now
	}
});

schema.methods.encryptPassword = function(password){
	return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
}

schema.virtual('password')
	.set(function(password){
		this._plainPassword = password;
		this.salt = Math.random() + '';
		this.hashedPassword = this.encryptPassword(password);
	})
	.get(function(){return this._plainPassword});

	schema.methods.checkPassword = function(password){
		return this.encryptPassword(password) === this.hashedPassword;
	}

schema.statics.authorize = function(username, password, cb){
	let User = this;
	let findUser = User.findOne({username});

	function checkPassword(user){
			return new Promise(function(resolve, reject){
				if(user){
					if(user.checkPassword(password)){
						resolve(user);
					}else{
						reject(new AuthError('Пароль не верен'));
					}
				}else{
					let user = new User({username, password});
					user.save(function(err){
						if(err) reject(err);
						resolve(user);
					});
				}

			});
	};


  let writeSession = function(user){
  	req.session.user = user._id;
  	res.send({});
  };

	findUser
		.then(checkPassword)
		.then(user => cb(null, user))
		.catch(cb())
}

exports.User = mongoose.model('User', schema);

function AuthError(message){
	Error.apply(this, arguments);
	Error.captureStackTrace(this, HttpError);

	this.message = message;
}

util.inherits(AuthError, Error);

AuthError.prototype.name = 'AuthError';

exports.AuthError = AuthError;