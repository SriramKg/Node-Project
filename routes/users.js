var express = require('express');
const BodyParser = require('body-parser');
var passport = require('passport');
var User = require('../models/users');
var authenticate = require('../authenticate');
var router = express.Router();

router.use(BodyParser.json());
/* GET home page. */
router.get('/',authenticate.verifyOrdinaryUser,authenticate.verifyAdmin, function(req, res, next) {
  User.find({})
  .then((users) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users);
  }, (err) => next(err))
  .catch((err) => next(err));
  //res.render('index', { title: 'Express' });
});


router.post('/signup', (req, res, next) => {
  User.register(new User({username : req.body.username}), req.body.password, (err,user) => {
    if(err){
      err.status = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err:err});
    }
    else{
      if(req.body.firstname)
        user.firstname = req.body.firstname
      if(req.body.lastname)
        user.lastname = req.body.lastname
      user.save((err, user) => {
        if(err){
          err.status = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err:err});
          return ;
        }
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success : true, status : 'Registration Successful!'});
      });  
      });
    }
  });
});

router.post('/login', passport.authenticate('local'), (req,res) => {
  var token = authenticate.getToken({_id : req.user._id});
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success : true, token : token, status : 'You are logged in successfully!'});
});  

/*router.get('/users',authenticate.verifyAdmin, (req,res) => {
  User.find({})
  .then((users) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users);
  }, (err) => next(err))
  .catch((err) => next(err));

})*/
  /*if(!req.session.user) {

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
  }*/


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
