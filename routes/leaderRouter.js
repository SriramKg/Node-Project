const express = require('express');
const bodyParser = require('body-parser');
const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plaintext');
    next();
})

.get((req,res,next) => {
    res.end('Will give all the details about the leaders!');
})

.post((req,res,next) => {
    res.end('Will update the leaders: '+req.body.name+ ' with the description: '+req.body.description);
})

.put((req,res,next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported ')
})

.delete((req,res,next) => {
    res.end('Will delete all the leaders!!');
});

leaderRouter.route('/:leaderid')
.all( (req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plaintext');
    next();
})
.get( (req,res,next) => {
    res.end('Will send all the specific detail of the leader '+req.params.leaderid);
})

.post( (req,res,next) => {
    res.statusCode = 403;
    res.end('POST operation not supported');
})

.put((req,res,next) => {
    res.write('Updating the details of the leader '+req.params.leaderid+'.');
    res.write('\n');
    res.end('Will update the leader : '+ req.body.name +' with the description: '+req.body.description);
})

.delete( (req,res,next) => {
    res.end('Deleting the leader :'+req.params.leaderid);
});

module.exports = leaderRouter;