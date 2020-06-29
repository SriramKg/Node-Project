const mongoose = require('mongoose');
const schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const promoSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        unique : true
    },
    image : {
        type : String,
        required : true
    },
    label : {
        type : String,
        default : ''
    },
    price : {
        type : Currency,
        required : true,
        min : 0
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
 
var Promotions = mongoose.model('promotion', promoSchema);
module.exports = Promotions;