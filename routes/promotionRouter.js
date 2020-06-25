const express = require('express');
const bodyParser = require('body-parser');
const promotionRouter = express.Router();

promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plaintext');
    next();
})

.get((req,res,next) => {
    res.end('Will give all the details about the promotions!');
})

.post((req,res,next) => {
    res.end('Will update the promotions: '+req.body.name+ ' with the description: '+req.body.description);
})

.put((req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported ')
})

.delete((req,res,next) => {
    res.end('Will delete all the promotions!!');
});

promotionRouter.route('/:promoid')
.all( (req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plaintext');
    next();
})
.get( (req,res,next) => {
    res.end('Will send all the specific detail of the promotion '+req.params.promoid);
})

.post( (req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation not supported');
})

.put((req,res,next) => {
    res.write('Updating the details of the promotion '+req.params.promoid+'.');
    res.write('\n');
    res.end('Will update the promotion : '+ req.body.name +' with the description: '+req.body.description);
})

.delete( (req,res,next) => {
    res.end('Deleting the promotion :'+req.params.promoid);
});

module.exports = promotionRouter;
