const express = require('express');
const bodyParser = require('body-parser');
const promotionRouter = express.Router();
const authenticate = require('../authenticate');

const mongoose = require('mongoose');
const Promotions = require('../models/promotions');

promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
.get((req,res,next) => {
    Promotions.find({})
    .then((promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(authenticate.verifyUser, (req,res,next) => {
    Promotions.create(req.body)
    .then((promotion) => {
        console.log("Promotion created successfully",promotion);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.put(authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported ')
})

.delete(authenticate.verifyUser, (req,res,next) => {
    Promotions.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    },(err) => next(err))
    .catch((err) => next(err));
});

promotionRouter.route('/:promoid')
.get( (req,res,next) => {
    Promotions.findById(req.params.promoid)
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    },(err) => next(err))
    .catch((err) => next(err));
})

.post(authenticate.verifyUser, (req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation not supported');
})

.put(authenticate.verifyUser, (req,res,next) => {
    Promotions.findByIdAndUpdate(req.params.promoid, {
        $set : req.body
    },{ new : true})
    .then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    },(err) => next(err))
    .catch((err) => next(err));
})

.delete(authenticate.verifyUser, (req,res,next) => {
    Promotions.findByIdAndRemove(req.params.promoid)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    },(err) => next(err))
    .catch((err) => next(err));
});

module.exports = promotionRouter;
