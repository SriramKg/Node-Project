const express = require('express');
const bodyParser = require('body-parser');
const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route('/')
.all( (req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plaintext');
    next();
})
.get( (req,res,next) => {
    res.end('Will send all the details of the dish');
})

.post( (req,res,next) => {
    res.end('Will update the dishes :'+ req.body.name +' with the description:'+req.body.description);
})

.put((req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported');
})

.delete( (req,res,next) => {
    res.end('Deleting all the dishes for you!');
});

dishRouter.route('/:dishid')
.all( (req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plaintext');
    next();
})
.get( (req,res,next) => {
    res.end('Will send all the specific detail of the dish '+req.params.dishid);
})

.post( (req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation not supported');
})

.put((req,res,next) => {
    res.write('Updating the details of the dish '+req.params.dishid+'.');
    res.write('\n');
    res.end(' Will update the dishes : '+ req.body.name +' with the description: '+req.body.description);
})

.delete( (req,res,next) => {
    res.end('Deleting the dish :'+req.params.dishid);
});

module.exports = dishRouter;