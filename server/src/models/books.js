let mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bookSchema = new Schema({
    ISBN: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    current_owner: {
        type: String,
        required: true
    },
    image:{
        type:Object,
        default:{}
    },
    bookUrl: {
    	type:String,
    	default: ''
    },    
    requested_From:{
      type:Array,
      default:[]
    },
    request_accepted:{
      type:Boolean,
      default:false
    }
})
module.exports = mongoose.model('books', bookSchema);
