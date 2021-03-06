const express = require('express');
const bodyParser = require('body-parser');
const leaderRouter = express.Router();
const authenticate = require('../authenticate');
const cors = require('./cors');

const mongoose = require('mongoose');
const Leaders = require('../models/leaders');


leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.options(cors.corsWithOptions, (req,res) => { res.sendStatus(200);})
.get(cors.cors, (req,res,next) => {
    Leaders.find({})
    .then((leaders) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(leaders);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyOrdinaryUser,authenticate.verifyAdmin, (req,res,next) => {
    Leaders.create(req.body)
    .then((leader) => {
        console.log("Leader created Successfully ",leader);
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.put(cors.corsWithOptions, authenticate.verifyOrdinaryUser,authenticate.verifyAdmin, (req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported ')
})

.delete(cors.corsWithOptions, authenticate.verifyOrdinaryUser,authenticate.verifyAdmin, (req,res,next) => {
    Leaders.remove({})
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

leaderRouter.route('/:leaderid')
.options(cors.corsWithOptions, (req,res) => { res.sendStatus(200);})
.get(cors.cors, (req,res,next) => {
    Leaders.findById(req.params.leaderid)
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyOrdinaryUser,authenticate.verifyAdmin, (req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation not supported');
})

.put(cors.corsWithOptions, authenticate.verifyOrdinaryUser,authenticate.verifyAdmin, (req,res,next) => {
    Leaders.findByIdAndUpdate(req.params.leaderid, {
        $set : req.body
    }, { new : true})
    .then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(leader); 
    }, (err) => next(err))
    .catch((err) => next(err));
})

.delete(cors.corsWithOptions, authenticate.verifyOrdinaryUser,authenticate.verifyAdmin, (req,res,next) => {
    Leaders.findByIdAndRemove(req.params.leaderid)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(resp); 
    },(err) => next(err))
    .catch((err) => next(err));
});

module.exports = leaderRouter;