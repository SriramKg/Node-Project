const mongoose = require('mongoose');
const schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const leaderSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        unique : true
    },
    image : {
        type : String,
        required : true
    },
    designation : {
        type : String,
        required : true
    },
    abbr : {
        type : String,
        required : true
    },
    featured : {
        type : Boolean,
        default : true
    },
    description : {
        type :String,
        required : true
    }
},{
    timestamps : true
});

var Leaders = mongoose.model('leader', leaderSchema);
module.exports = Leaders;