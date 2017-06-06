var express = require('express');
var app = express();
var path = require('path');
var http = require('http');
var errorHandler = require('errorhandler');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('./libs/mongoose');
var mongoose_store = new MongoStore({mongooseConnection: mongoose.connection});
var config = require('./config');
var HttpError = require('./error').HttpError;



//middleware
app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, '/templates'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
	secret: config.get('session:secret'),
	key: config.get('session:sid'),
	cookie: config.get('session:cookie'),
	saveUninitialized: false,
  resave: false,
  store: mongoose_store
}));
app.use(function(req, res, next){
	req.session.numberOfVisits = req.session.numberOfVisits +1 || 1;
	res.send(`Visits ${req.session.numberOfVisits}`);
});
app.use(require('./middleware/sendHttpError'));
require('./routes')(app);
app.use(express.static(path.join(__dirname, 'public')));



app.use((err, req, res, next) => {
	if(typeof err == 'number'){
		err = new HttpError(err);
	}

	if(err instanceof HttpError){
		res.sendHttpError(err);
	}else{
		if(app.get('env') == 'development'){
			errorHandler(err, req, res, next);
		}else{
			logger(err);
			err = new HttpError(500);
			res.sendHttpError(err);
		}
	}
});

if(app.get('env') == 'development'){
	app.use(errorHandler());
}

module.exports = app;
