var express = require('express');
var app = express();
var path = require('path');
var http = require('http');
var errorHandler = require('errorhandler');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');



//middleware
app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, '/templates'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


if(app.get('env') == 'development'){
	app.use(errorHandler());
}

app.get('/', (req, res, next) => {
	res.render('index')
});
module.exports = app;
