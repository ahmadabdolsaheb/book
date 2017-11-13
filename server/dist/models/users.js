'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserBooks = new Schema({
  name: String,
  ISDN: Number
});
var userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  timezone: {
    type: String,
    required: true
  },
  pass_digest: {
    type: String,
    required: true
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  city: {
    type: String
  },
  state: {
    type: String
  },
  zipcode: {
    type: Number,
    required: true
  },
  books: {
    type: [UserBooks],
    default: [],
    required: false,
    unique: true
  },
  lastSearch: String
});

module.exports = mongoose.model('UserModel', userSchema);