var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', verifyCredentials, function(req, res, next) {
  res.render('index', { title: 'Clients Area' });
});

function verifyCredentials(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('users/login');
}

module.exports = router;
