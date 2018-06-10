var express = require('express');
var expressValidator = require('express-validator');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest:'./uploads'});

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
  }
});
module.exports = router;
