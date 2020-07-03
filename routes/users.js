var express = require('express');
const BodyParser = require('body-parser');
var User = require('../models/users');
var router = express.Router();

router.use(BodyParser.json());
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/signup', (req, res, next) => {
  User.findOne({username : req.body.username})
  .then((user) => {
    if(user != null){
      var err = new Error('User '+ req.body.username+' already exists!');
      err.status = 403;
      next(err);
    }
    else{
      return User.create({
        username : req.body.username,
        password : req.body.password
      });
    }
  })
  .then((user) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({ status : 'Registration Successful!', user : user});
  }, (err) => next(err))
  .catch((err) => next(err));
});

router.post('/login', (req,res,next) => {
  if(!req.session.user) {

    var authheader = req.headers.authorization;
    if(!authheader){
      var err = new Error('You are not permitted to Authenticate');
      res.setHeader("WWW-Authenticate", 'Basic');
      err.status = 401;
      return next(err);
    }
  
    var auth = new Buffer.from(authheader.split(' ')[1], 'base64').toString().split(':');
    var username = auth[0];
    var password = auth[1];

    User.findOne({username : username})
    .then((user) => {
      if(user === null){
        var err = new Error('User '+username+'doesnot exists!');
        err.status = 403;
        return next(err);
      }
      else if(user.password !== 'password'){
        var err = new Error('Your Password is not Valid!');
        err.status = 403;
        return next(err);
      }
      else if(user.username === username && user.password ==='password'){
        req.session.user = 'authenticated';
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are authenticated');
      }
    })
    .catch((err) => next(err));

  }
  else{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are already authenticated');
  }
});

router.get('/logout', (req,res) => {
  if(req.session){
    req.session.destroy();
    res.clearCookie('session');
    res.redirect('/');
  }
  else{
    var err = new Error('You are not logged in');
    res.statusCode = 403;
    next(err);
  }
});

module.exports = router;
