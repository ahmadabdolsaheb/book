'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _signup = require('../shared/validations/signup');

var _signup2 = _interopRequireDefault(_signup);

var _users = require('../models/users');

var _users2 = _interopRequireDefault(_users);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _isEmpty = require('lodash/isEmpty');

var _isEmpty2 = _interopRequireDefault(_isEmpty);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post('/settings', function (req, res) {
  var _req$body = req.body,
      firstName = _req$body.firstName,
      lastName = _req$body.lastName,
      city = _req$body.city,
      state = _req$body.state,
      zipcode = _req$body.zipcode,
      userID = _req$body.userID;


  _users2.default.findOne({ _id: userID }, function (err, user) {
    if (err) console.log(err);else {
      user.firstName = firstName;
      user.lastName = lastName;
      user.city = city;
      user.state = state;
      user.zipcode = zipcode;
      user.save(function (err, user) {
        if (err) {
          res.status(500).json({ error: err });
        } else {
          var token = _jsonwebtoken2.default.sign({
            id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            city: user.city,
            state: user.state,
            zipcode: user.zipcode,
            books: user.books
          }, process.env.JWT_SECRET);

          res.json({ token: token, user: user });
        }
      });
    }
  });
});

function validateInput(data, otherValidations) {
  var _otherValidations = otherValidations(data),
      errors = _otherValidations.errors;

  return _users2.default.find({
    $or: [{ username: data.username }, { email: data.email }]
  }).then(function (user) {
    if (user.length) {
      if (user[0].username === data.username) {
        errors.username = 'Username has been taken';
      }
      if (user[0].email === data.email) {
        errors.email = 'Email is already registered';
      }
    }
    return {
      errors: errors,
      isValid: (0, _isEmpty2.default)(errors)
    };
  });
}

router.get('/:identifier', function (req, res) {
  return _users2.default.find({
    $or: [{ username: req.params.identifier }, { email: req.params.identifier }]
  }).then(function (user) {
    res.json({ user: user });
  });
});

router.post('/', function (req, res) {
  validateInput(req.body, _signup2.default).then(function (_ref) {
    var errors = _ref.errors,
        isValid = _ref.isValid;

    if (isValid) {
      var _req$body2 = req.body,
          username = _req$body2.username,
          password = _req$body2.password,
          timezone = _req$body2.timezone,
          email = _req$body2.email,
          zipcode = _req$body2.zipcode;

      var pass_diest = _bcrypt2.default.hashSync(password, 10);

      var newUser = new _users2.default({
        username: username,
        email: email,
        timezone: timezone,
        pass_digest: pass_diest,
        zipcode: zipcode
      });

      newUser.save(function (err) {
        if (err) {
          res.status(500).json({ error: err });
        } else {
          res.json({ success: true });
        }
      });
    } else {
      res.status(400).json(errors);
    }
  });
});

exports.default = router;