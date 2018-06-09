var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var multer = require('multer');
var connectFlash = require('connect-flash');
var mongoDB = require('mongodb');
var mongoose = require('mongoose');
var db = mongoose.connection;

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var localStrategy = require('passport-local').Strategy;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//file upload handler
var upload = multer({dest:'./uploads'});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//session handler
app.use(session({
	secret:'secret',
	saveUninitialized: true,
	resave: true
}));

//passport handler
app.use(passport.initialize());
app.use(passport.session());

//express
app.use(express.json());
app.post('/user', (req, res) => {
  User.create({
    username: req.body.username,
    password: req.body.password
  }).then(user => res.json(user));
});

//express-validator
var { check, validationResult } = require('express-validator/check');

app.post('/user', [
  // username must be an email
  check('username').isEmail(),
  // password must be at least 5 chars long
  check('password').isLength({ min: 5 })
], (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  User.create({
    username: req.body.username,
    password: req.body.password
  }).then(user => res.json(user));
});

//connect-flash
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
