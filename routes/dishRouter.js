const express = require('express');
const bodyParser = require('body-parser');
const dishRouter = express.Router();

const mongoose = require('mongoose');
const Dishes = require('../models/dishes');

dishRouter.use(bodyParser.json());

dishRouter.route('/')
/*.all( (req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plaintext');
    next();
})*/
.get( (req,res,next) => {
    Dishes.find({})
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes);
    },(err) => next(err))
    .catch((err) => next(err));
})

.post( (req,res,next) => {
    Dishes.create(req.body)
    .then((dish) => {
        console.log("Dish created successfully",dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    },(err) => next(err))
    .catch((err) => next(err));
})

.put((req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported');
})

.delete( (req,res,next) => {
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
.get( (req,res,next) => {
    Dishes.findById(req.params.dishid)
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    },(err) => next(err))
    .catch((err) => next(err));
})

.post( (req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation not supported');
})

.put((req,res,next) => {
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

.delete( (req,res,next) => {
    Dishes.findByIdAndRemove(req.params.dishid)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },(err) => next(err))
    .catch((err) => next(err));
});

module.exports = dishRouter;