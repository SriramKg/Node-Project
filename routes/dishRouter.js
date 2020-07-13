const express = require('express');
const bodyParser = require('body-parser');
const dishRouter = express.Router();
const authenticate = require('../authenticate');

const mongoose = require('mongoose');
const Dishes = require('../models/dishes');
const { ExtractJwt } = require('passport-jwt');

dishRouter.use(bodyParser.json());

dishRouter.route('/')
/*.all( (req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plaintext');
    next();
})*/
.get(authenticate.verifyOrdinaryUser, (req,res,next) => {
    Dishes.find({})
    //.populate('comments.author')
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
    },(err) => next(err))
    .catch((err) => next(err));
})

.post(authenticate.verifyOrdinaryUser,authenticate.verifyAdmin, (req,res,next) => {
    Dishes.create(req.body)
    .then((dish) => {
        console.log("Dish created successfully",dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    },(err) => next(err))
    .catch((err) => next(err));
})

.put(authenticate.verifyOrdinaryUser,authenticate.verifyAdmin, (req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported');
})

.delete(authenticate.verifyOrdinaryUser,authenticate.verifyAdmin, (req,res,next) => {
    Dishes.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },(err) => next(err))
    .catch((err) => next(err));
});

dishRouter.route('/:dishid')
/*.all( (req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plaintext');
    next();
})*/
.get(authenticate.verifyOrdinaryUser, (req,res,next) => {
    Dishes.findById(req.params.dishid)
    .populate('comments.author')
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    },(err) => next(err))
    .catch((err) => next(err));
})

.post(authenticate.verifyOrdinaryUser,authenticate.verifyAdmin, (req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation not supported');
})

.put(authenticate.verifyOrdinaryUser,authenticate.verifyAdmin, (req,res,next) => {
    Dishes.findByIdAndUpdate(req.params.dishid, {
        $set : req.body
    }, { new: true})
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    },(err) => next(err))
    .catch((err) => next(err));
})

.delete(authenticate.verifyOrdinaryUser,authenticate.verifyAdmin, (req,res,next) => {
    Dishes.findByIdAndRemove(req.params.dishid)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },(err) => next(err))
    .catch((err) => next(err));
});

dishRouter.route('/:dishid/comments')
/*.all( (req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plaintext');
    next();
})*/
.get( (req,res,next) => {
    Dishes.findById(req.params.dishid)
    .populate('comments.author')
    .then((dish) => {
        if(dish != null){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments);
        }
        else{
            err = new Error('Dish '+ req.params.dishid+ ' not found');
            err.statusCode = 404;
            return next(err);
        }
    },(err) => next(err))
    .catch((err) => next(err));
})

.post(authenticate.verifyOrdinaryUser, (req,res,next) => {
    Dishes.findById(req.params.dishid)
    .then((dish) => {
        if(dish != null){
            req.body.author = req.user._id;
            dish.comments.push(req.body);
            dish.save()
            .then((dish) => {
                Dishes.findById(dish._id)
                    .populate('comments.author')
                    .then((dish) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(dish);
                    })
                
            }, (err) => next(err));

        }
        else{
            err = new Error('Dish '+ req.params.dishid+ ' not found');
            err.statusCode = 404;
            return next(err);
        }
    },(err) => next(err))
    .catch((err) => next(err));
})

.put(authenticate.verifyOrdinaryUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes'+ req.params.dishid);
})

.delete(authenticate.verifyOrdinaryUser, (req,res,next) => {
    Dishes.findById(req.params.dishid)
    .then((dish) => {
        if(dish != null){
            for (var i = (dish.comments.length -1); i>=0 ;i--){
                dish.comments.id(dish.comments[i]._id).remove();
            }
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err));
        }
        else{
            err = new Error('Dish '+ req.params.dishid+ ' not found');
            err.statusCode = 404;
            return next(err);
        }
    },(err) => next(err))
    .catch((err) => next(err));
});

dishRouter.route('/:dishid/comments/:commentid')
/*.all( (req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plaintext');
    next();
})*/
.get( (req,res,next) => {
    Dishes.findById(req.params.dishid)
    .populate('comments.author')
    .then((dish) => {
        if(dish != null && dish.comments.id(req.params.commentid) != null){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments.id(req.params.commentid));
        }
        else if(dish == null){
            err = new Error('Dish '+ req.params.dishid+ ' not found');
            err.statusCode = 404;
            return next(err);
        }
        else{
            err = new Error('Comment '+ req.params.commentid+ ' not found');
            err.statusCode = 404;
            return next(err); 
        }
    },(err) => next(err))
    .catch((err) => next(err));
})

.post(authenticate.verifyOrdinaryUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes'+ req.params.dishid+' /comments'+req.params.commentid);
})

.put(authenticate.verifyOrdinaryUser, (req,res,next) => {
    Dishes.findById(req.params.dishid)
    .then((dish) => {
        let id1 = dish.comments.id(req.params.commentid).author//dish.comments.id(req.params.id)
        let id2 = req.user.id
        if(dish != null && dish.comments.id(req.params.commentid) != null && id1.equals(id2)){
            if(req.body.rating){
                dish.comments.id(req.params.commentid).rating = req.body.rating;
            }
            if(req.body.comment){
                dish.comments.id(req.params.commentid).comment = req.body.comment;
            }
            dish.save()
            .then((dish) => {
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);
                })
            }, (err) => next(err));
        }
        else if(id1!==id2){
            err = new Error('You are not authorized to modify this comment');
            err.status = 403;
            return next(err);
        }
        else if(dish == null){
            err = new Error('Dish '+ req.params.dishid+ ' not found');
            err.statusCode = 404;
            return next(err);
        }
        else{
            err = new Error('Comment '+ req.params.commentid+ ' not found');
            err.statusCode = 404;
            return next(err); 
        }
    },(err) => next(err))
    .catch((err) => next(err));
})

.delete(authenticate.verifyOrdinaryUser, (req,res,next) => {
    //console.log(req);
    Dishes.findById(req.params.dishid)
    .then((dish) => {
        let id1 = dish.comments.id(req.params.commentid).author
        let id2 = req.user.id
        //console.log(id1);
        //console.log(id2);
        if(dish != null && dish.comments.id(req.params.commentid) != null && id1.equals(id2)){
            
            dish.comments.id(req.params.commentid).remove();
            dish.save()
            .then((dish) => {
                Dishes.findById(dish._id)
                .populate('comments.author')
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);
                })
            }, (err) => next(err));
        }
        else if(id1!==id2){
            err = new Error('You are not authorized to delete this comment');
            err.status = 403;
            return next(err);
        }
        else if(dish == null){
            err = new Error('Dish '+ req.params.dishid+ ' not found');
            err.statusCode = 404;
            return next(err);
        }
        else{
            err = new Error('Comment '+ req.params.commentid+ ' not found');
            err.statusCode = 404;
            return next(err); 
        }
    },(err) => next(err))
    .catch((err) => next(err));
});

module.exports = dishRouter;