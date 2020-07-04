const mongoose = require('mongoose');
const schema = mongoose.Schema;
var passortLocalMongoose = require('passport-local-mongoose');

var User = new mongoose.Schema({

    admin : {
        type : Boolean,
        default : false
    }
});

User.plugin(passortLocalMongoose);
module.exports = mongoose.model('User' , User);