const express = require('express');
const bodyParser = require('body-parser');
const favoriteRouter = express.Router();
const authenticate = require('../authenticate');
const cors = require('./cors');

const mongoose = require('mongoose');
const Favorites = require('../models/favorites');
const { ExtractJwt } = require('passport-jwt');
const { count } = require('../models/favorites');

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .all(authenticate.verifyOrdinaryUser)
    .get(function (req, res, next) {
        Favorites.find({'postedBy': req.decoded._doc._id})
            .populate('postedBy')
            .populate('dishes')
            .exec(function (err, favorites) {
                if (err) return err;
                res.json(favorites);
            });
    })

    .post(function (req, res, next) {

        Favorites.find({'postedBy': req.decoded._doc._id})
            .exec(function (err, favorites) {
                if (err) throw err;
                req.body.postedBy = req.decoded._doc._id;

                if (favorites.length) {
                    var favoriteAlreadyExist = false;
                    if (favorites[0].dishes.length) {
                        for (var i = (favorites[0].dishes.length - 1); i >= 0; i--) {
                            favoriteAlreadyExist = favorites[0].dishes[i] == req.body._id;
                            if (favoriteAlreadyExist) break;
                        }
                    }
                    if (!favoriteAlreadyExist) {
                        favorites[0].dishes.push(req.body._id);
                        favorites[0].save(function (err, favorite) {
                            if (err) throw err;
                            console.log('Um somethings up!');
                            res.json(favorite);
                        });
                    } else {
                        console.log('Setup!');
                        res.json(favorites);
                    }

                } else {

                    Favorites.create({postedBy: req.body.postedBy}, function (err, favorite) {
                        if (err) throw err;
                        favorite.dishes.push(req.body._id);
                        favorite.save(function (err, favorite) {
                            if (err) throw err;
                            console.log('Something is up!');
                            res.json(favorite);
                        });
                    })
                }
            });
    })

    .
    delete(function (req, res, next) {
        Favorites.remove({'postedBy': req.decoded._doc._id}, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        })
    });


/*.options(cors.corsWithOptions, (req,res) => { res.sendStatus(200);})
.get(cors.cors, authenticate.verifyOrdinaryUser, (req, res, next) =>{
	Favorite.findOne({user: req.user._id})
	.populate('user')
	.populate('dishes')
	.then( (favorite) =>{
		if(favorite != null){
			res.statusCode = 200
			res.setHeader('content-type', 'application/json')
			res.json(favorite)
		}else{
			var err = new Error("User don't have favorite dishes lists! ...")
            err.status = 404
            return next(err)
		}
	}, (err) => next(err))
	.catch( (err) =>next(err))  
})
.post(cors.corsWithOptions, authenticate.verifyOrdinaryUser, (req, res, next) =>{
	Favorite.findOne({user: req.user._id})
	.then( (user) =>{
		if(user == null){
			Favorite.create({user: req.user._id})
			.then( (favorite) =>{
				res.statusCode = 200
				res.setHeader('content-type', 'application/json')
				for(const i in req.body){
					favorite.dishes.push(req.body[i])
				}
				favorite.save()
				.then( (result) =>{
					res.json(result)
				}, (err) => next(err))
			}, (err) => next(err))
		}else{
			for(const j in req.body){
				if (user.dishes.indexOf(req.body[j]._id) == -1) {
					user.dishes.push(req.body[j])				
				}else{
					console.log('Dish '+ req.body[j]._id+' Already Exist!...')
				}
			}
			user.save()
			.then( (result) =>{
				res.statusCode = 200
				res.setHeader('content-type','application/json')
				res.json(result)
			}, (err) => next(err))	
		}
	}, (err) => next(err))	
	.catch( (err) =>next(err))
})
.put(cors.corsWithOptions, authenticate.verifyOrdinaryUser, (req, res, next) =>{
	res.statusCode = 403
	res.end('Put operation not supported on /favorites/')
})
.delete(cors.corsWithOptions, authenticate.verifyOrdinaryUser, (req, res, next) =>{
	Favorite.findOne({user: req.user._id})
	.then((favorite) =>{
		if(favorite != null){
			Favorite.remove(favorite)
			.then( (result) =>{
				res.statusCode = 200
				res.setHeader('content-type','application/json')
				res.json(result)
			}, (err) => next(err))
			.catch( (err) => next(err))
		}else{
			var err = new Error("User don't have favorite dishes lists! ...")
            err.status = 404
            return next(err)
		}
	}, (err) => next(err))
	.catch( (err) => next(err))
});*/
/*.get(cors.cors, (req,res,next) => {
    Favorites.find({})
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    },(err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyOrdinaryUser, (req,res,next) => {
    Favorites.findOne({user : req.body._id})
    .populate('dishes')
    .populate('user')
    .then((favorite) => {
        if(favorite == null) {
            Favorites.create()
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                for( const i in req.body){
                    favorite.dishes.push(req.body[i]);
                }
                favorite.save();
                res.json(favorite);
            }, (err) => next(err))
        }
        else{
            for( const i in req.body){
                Favorites.findOne({user : req.user.id})
                .then((favorite) => {
                    if(favorite == null){
                        favorite.dishes.push(req.body[i]);
                    }
                });
            }
            favorite.save();
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        }

    },(err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyOrdinaryUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported');
})
.delete(cors.corsWithOptions, authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req,res,next) => {
    Favorites.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },(err) => next(err))
    .catch((err) => next(err));
});*/

favoriteRouter.route('/:favoriteId')
.options(cors.corsWithOptions, (req,res) => { res.sendStatus(200);})
/*.get(cors.cors, authenticate.verifyOrdinaryUser, (req, res, next) => {
    Favorites.findById(req.params.favoriteId)
    .then((favorite) => {
        if(!(favorite.user.equals(req.user._id))) {
            var err = new Error("Only Author can access this!!");
            err.status = 401;
            return next(err);
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);

    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.cors, authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
    Favorites.findById(req.body._id)
        .then((favorite) => {
            if (favorite == null) {
                let newFavorite = {};
                newFavorite.user = req.user._id;
                Favorites.create(newFavorite)
                    .then((favorite) => {
                        console.log('Favorite Created ', newFavorite);
                        favorite.dishes.push(req.params.favoriteId)
                        favorite.save()
                            .then((favorite) => {
                                Dishes.findById(favorite._id)
                                    .then((favorite) => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(favorite);
                                    })
                            }, (err) => next(err));
                    }, (err) => next(err))
                    .catch((err) => next(err));
            } else {
                err = new Error('Dish ' + req.params.dishId + ' already exist');
                err.status = 404;
                return next(err);
            }
        })
})
.put(cors.cors, authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
    Favorites.findByIdAndUpdate(req.params.favoriteId, {
        $set: req.body
    }, {new: true})
        .then((leader) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(leader);
        }, (err) => next(err))
        .catch((err) => next(err));
})
.delete(cors.cors, authenticate.verifyOrdinaryUser, authenticate.verifyAdmin, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
        .then((favorite) => {
            favorite.dishes.remove(req.params.favoriteId);
            favorite.save()
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }, (err) => next(err));
        })
        .catch((err) => next(err));
});*/
.get(cors.cors, (req, res, next) =>{
	res.statusCode = 403
	res.end('Get operation not supported on /favorites/'+ req.params.dishId)
})
.put(cors.corsWithOptions, authenticate.verifyOrdinaryUser, (req, res, next) =>{
	res.statusCode = 403
	res.end('Put operation not supported on /favorites/'+ req.params.dishId)
})
.post(cors.corsWithOptions, authenticate.verifyOrdinaryUser, (req, res, next)=>{
	Favorites.findOne({user: req.user._id})
	.then( (favorite) =>{
		if(favorite != null){
			if(favorite.dishes.indexOf(req.params.dishId) == -1){
				favorite.dishes.push(req.params.dishId)
			}else{ console.log('Already Exist!...')}
			favorite.save()
			.then( (result) =>{
				res.statusCode = 200
				res.setHeader('content-type','application/json')
				res.json(result)
			}, (err)=> next(err))
			.catch( (err) => next(err))
		}else{
			var err = new Error("User don't have favorite dishes lists! ...")
            err.status = 404
            return next(err)
		}
	}, (err) => next(err))
	.catch( (err) => next(err) )
})
.delete(cors.corsWithOptions, authenticate.verifyOrdinaryUser, (req, res, next) =>{
	Favorites.findOne({user: req.user._id})
	.then( (favorite) => {
		if(favorite != null){
			var indice
			if((indice = favorite.dishes.indexOf(req.params.dishId)) != -1){
				favorite.dishes.splice(indice, indice+1)
			}
			favorite.save()
			.then( (result) =>{
				res.statusCode = 200
				res.setHeader('content-type','application/json')
				res.json(result)
			}, (err) => next(err))
			.catch( (err) => next(err) ) 
		}else{
			var err = new Error("User don't have favorite dishes lists! ...")
            err.status = 404
            return next(err)
		}
	}, (err) => next(err))
	.catch( (err) => next(err) ) 
});



module.exports = favoriteRouter;
