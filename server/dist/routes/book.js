'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _lodash = require('lodash');

var _authenticate = require('../middlewares/authenticate');

var _authenticate2 = _interopRequireDefault(_authenticate);

var _books = require('../models/books');

var _books2 = _interopRequireDefault(_books);

var _users = require('../models/users');

var _users2 = _interopRequireDefault(_users);

var _regeneratorRuntime = require('regenerator-runtime');

var _regeneratorRuntime2 = _interopRequireDefault(_regeneratorRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var fetch = require('node-fetch');
var router = _express2.default.Router();

router.get('/allBooks', function (req, res) {
  _books2.default.find().then(function (r) {
    res.send(r);
  }).catch(function (e) {
    res.send([e]);
  });
});

router.post('/addBook', function (req, res) {
  var getBookFromIsbn = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime2.default.mark(function _callee(isbn, username) {
      var url;
      return _regeneratorRuntime2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              //api of openbooks which returns the book details for the given isbn number
              url = "https://openlibrary.org/api/books?bibkeys=ISBN:" + isbn + "&jscmd=data&format=json";


              _books2.default.find().then(function (allBooks) {
                fetch(url).then(function (json) {
                  json.json().then(function (output0) {
                    var output = output0['ISBN:' + isbn];

                    //save as a model
                    var newBook = new _books2.default({
                      ISBN: parseInt(isbn),
                      title: output.title,
                      current_owner: username,
                      image: output.cover,
                      bookUrl: output.url
                    });

                    message.messageMessage = '"' + output.title + '" has been added';

                    //save in the db
                    newBook.save().then(function () {
                      _books2.default.find().then(function (r) {
                        res.send([r, message]);
                      }).catch(function (e) {
                        message = { 'messageType': 'error', 'messageMessage': 'ISBN not found' };
                        res.send([[e], message]);
                      });
                    }).catch(function (e) {
                      message = { 'messageType': 'error', 'messageMessage': 'ISBN not found' };
                      res.send([allBooks, message]);
                    });
                  }).catch(function (e) {
                    message = { 'messageType': 'error', 'messageMessage': 'ISBN not found' };
                    res.send([allBooks, message]);
                  });
                }).catch(function (e) {
                  message = { 'messageType': 'error', 'messageMessage': 'ISBN not found' };
                  res.send([allBooks, message]);
                });
              }).catch(function (e) {
                message = { 'messageType': 'error', 'messageMessage': 'ISBN not found' };
                res.send([[e], message]);
              });

            case 2:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    return function getBookFromIsbn(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();

  var _req$body = req.body,
      isbn = _req$body.isbn,
      username = _req$body.username;

  var message = { 'messageType': 'success', 'messageMessage': 'Book Added' };

  getBookFromIsbn(isbn, username);
});

router.patch('/deleteBook/:id', function (req, res) {
  var deleteBookID = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime2.default.mark(function _callee2(_id) {
      return _regeneratorRuntime2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _books2.default.find().then(function (allBooks) {
                _books2.default.findOne({ "_id": _id }, function (err, book) {
                  if (err) {
                    message = { 'messageType': 'error', 'messageMessage': 'server error' };
                    res.send([allBooks, message]);
                  }

                  message.messageMessage = '"' + book.title + '" has been removed';

                  _books2.default.remove({ _id: _id }).then(function () {
                    _books2.default.find().then(function (r) {
                      res.send([r, message]);
                    }).catch(function (e) {
                      message = { 'messageType': 'error', 'messageMessage': 'server error' };
                      res.send([[e], message]);
                    });
                  }).catch(function (e) {
                    message = { 'messageType': 'error', 'messageMessage': 'server error' };
                    res.send([allBooks, message]);
                  });
                });
              }).catch(function (e) {
                message = { 'messageType': 'error', 'messageMessage': 'server error' };
                res.send([[e], message]);
              });

            case 1:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    return function deleteBookID(_x3) {
      return _ref2.apply(this, arguments);
    };
  }();

  var _id = req.params.id;
  var message = { 'messageType': 'error', 'messageMessage': 'This book has been removed' };

  deleteBookID(_id);
});

router.post('/requestBook', function (req, res) {
  var request = function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime2.default.mark(function _callee3(_id, username) {
      return _regeneratorRuntime2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _books2.default.find().then(function (allBooks) {
                _books2.default.findOne({ "_id": _id }, function (err, book) {
                  if (err) {
                    message = { 'messageType': 'error', 'messageMessage': 'server error' };
                    res.send([allBooks, message]);
                  }

                  message.messageMessage = '"' + book.title + '" has been requested';
                  book.requested_From.push(username);
                  book.save().then(function () {
                    _books2.default.find().then(function (r) {
                      res.send([r, message]);
                    }).catch(function (e) {
                      message = { 'messageType': 'error', 'messageMessage': 'server error' };
                      res.send([[e], message]);
                    });
                  }).catch(function (e) {
                    message = { 'messageType': 'error', 'messageMessage': 'server error' };
                    res.send([allBooks, message]);
                  });
                });
              }).catch(function (e) {
                message = { 'messageType': 'error', 'messageMessage': 'server error' };
                res.send([[e], message]);
              });

            case 1:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    return function request(_x4, _x5) {
      return _ref3.apply(this, arguments);
    };
  }();

  var _req$body2 = req.body,
      _id = _req$body2._id,
      username = _req$body2.username;


  var message = { 'messageType': 'success', 'messageMessage': 'Book Requested' };

  request(_id, username);
});

router.post('/unrequestBook', function (req, res) {
  var unrequest = function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime2.default.mark(function _callee4(_id, username) {
      return _regeneratorRuntime2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _books2.default.findOne({ "_id": _id }, function (err, book) {
                if (err) {
                  message = { 'messageType': 'error', 'messageMessage': 'server error' };
                  res.send([[err], message]);
                }

                message.messageMessage = '"' + book.title + '" is no longer requested';
                var index = book.requested_From.indexOf(username);

                if (index > -1) {
                  book.requested_From.splice(index, 1);
                }

                book.save().then(function (err) {
                  _books2.default.find().then(function (r) {
                    res.send([r, message]);
                  }).catch(function (e) {
                    message = { 'messageType': 'error', 'messageMessage': 'server error' };
                    res.send([[e], message]);
                  });
                }).catch(function (e) {
                  message = { 'messageType': 'error', 'messageMessage': 'server error' };
                  res.send([[e], message]);
                });
              });

            case 1:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    return function unrequest(_x6, _x7) {
      return _ref4.apply(this, arguments);
    };
  }();

  var _req$body3 = req.body,
      _id = _req$body3._id,
      username = _req$body3.username;

  var message = { 'messageType': 'error', 'messageMessage': 'Book Unrequested' };

  unrequest(_id, username);
});

router.patch('/acceptOffer', function (req, res) {
  var accept = function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime2.default.mark(function _callee5(_id, username, reqUsername) {
      return _regeneratorRuntime2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _books2.default.find().then(function (allBooks) {
                _books2.default.findOne({ "_id": _id }, function (err, book) {
                  if (err) {
                    message = { 'messageType': 'error', 'messageMessage': 'server error' };
                    res.send([[err], message]);
                  }

                  message.messageMessage = 'Offer for "' + book.title + '" has been accepted';
                  book.requested_From = [reqUsername];
                  book.request_accepted = true;

                  book.save().then(function () {
                    _books2.default.find().then(function (r) {
                      res.send([r, message]);
                    }).catch(function (e) {
                      message = { 'messageType': 'error', 'messageMessage': 'server error' };
                      res.send([[e], message]);
                    });
                  }).catch(function (e) {
                    message = { 'messageType': 'error', 'messageMessage': 'server error' };
                    res.send([allBooks, message]);
                  });
                }).catch(function (e) {
                  message = { 'messageType': 'error', 'messageMessage': 'server error' };
                  res.send([[e], message]);
                });
              });

            case 1:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    return function accept(_x8, _x9, _x10) {
      return _ref5.apply(this, arguments);
    };
  }();

  var _req$body4 = req.body,
      _id = _req$body4._id,
      username = _req$body4.username,
      reqUsername = _req$body4.reqUsername;

  var message = { 'messageType': 'success', 'messageMessage': 'Offer Accepted' };

  accept(_id, username, reqUsername);
});

exports.default = router;