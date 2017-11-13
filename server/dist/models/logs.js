'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var logSchema = new Schema({
    ISBN: {
        //id of the book
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: false
    },
    username: {
        // user himself will the sender
        type: String,
        required: true
    },
    requestedFrom: {
        type: String,
        required: true
    },
    accepted: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Number,
        default: Date.now()
    }
});
module.exports = mongoose.model('logs', logSchema);