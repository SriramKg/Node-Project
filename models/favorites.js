const mongoose = require('mongoose');
const schema = mongoose.Schema;
var passortLocalMongoose = require('passport-local-mongoose');


const favoriteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dishes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'dish'}]

});

var Favorites = mongoose.model('favorite', favoriteSchema);
module.exports = Favorites;