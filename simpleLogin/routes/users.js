var express = require('express');
var expressValidator = require('express-validator');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest:'./uploads'});
var passport = require('passport');
var User = require('../models/user');
var localStrategy = require('passport-local').Strategy;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', {title: 'Register'});
});

router.get('/login', function(req, res, next) {
  res.render('login', {title: 'Login'});
});

router.post('/register', upload.single('profileImage'), function(req, res, next) {
  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var confirmPassword = req.body.confirmPassword;
  if(req.file){
    var profileImage = req.file.filename;
  } else {
    var profileImage = 'noimage.jpg';
  }
  // Form Validator
  req.checkBody('name', 'Name field is empty').notEmpty();
  req.checkBody('email', 'Email field is empty').notEmpty();
  req.checkBody('email', 'Email entered is not valid').isEmail();
  req.checkBody('username', 'Username field is empty').notEmpty();
  req.checkBody('password', 'Password field is empty').notEmpty();
  req.checkBody('confirmPassword', "Passwords don't match").equals(req.body.password);
  
  var errors = req.validationErrors();
  
  if(errors){
      res.render('register', {
          errors: errors
      })
  } else{
    var newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password,
      profileImage: profileImage
    });
    
    User.createUser(newUser, function(err, user){
      if(err) throw err;
    });
    
    req.flash('success', 'You are now registered and can login as a Client');
    
    res.location('/');
    res.redirect('/');
  }
});

router.post('/login',
  passport.authenticate('local', {failureRedirect: '/users/login', failureFlash: 'Invalid Username or Password'}),
  function(req, res){
    req.flash('success', 'Log in scuccessfull!');
    res.redirect('/');
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new localStrategy(function(username, password, done){
  User.findOne({username: username}, function(err, user){
    if(err) throw err;
    if(!user){
      return done(null, false, {message: 'Unknown user'});
    }
    User.comparePassword(password, user.password, function(err, isMatch){
      if(err) return done(err);
      if(isMatch){
        return done(null, user);
      } else{
        return done(null, false, {message: 'Invalid password'});
      }
    });
  });
}));

router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'Log out successfull!');
  res.redirect('/users/login');
});
  
module.exports = router;
