var express = require('express');
var Promise = require('bluebird');
var router = express.Router();
var booksSearch = require('../lib/booksSearch');
var queue = require('../data/queue');
var book = require('../data/book');
var user = require('../data/user');
var unordered = require('../data/unordered');
var newUserBooks = require('../data/newUserBooks');
var _ = require('lodash');
var passport = require('passport');
var passwordHash = require('password-hash');

function auth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/');
}

router.get('/', function(req, res) {
  if (req.isAuthenticated()) {
    res.redirect('/main');
  } else {
    res.render('index', {error: req.flash('error')});
  }
});

router.post('/', function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var type = req.body.type;

  if (!email || !password || !type) {
    return res.send(500, {error: "Required fields are not present"}); 
  }

  if (type === 'signup') {
    user.exists(email)
      .then(function(checkResult) {
        if (parseInt(checkResult.count)) {
          req.flash('error', "User with such email already exists");
          res.redirect('/');
          
          return Promise.reject("user exists");
        } else {
          return user.signup(email, password);
        }})
      .then(function(userId) {
        return newUserBooks.copyDefaultBooksToUser(userId[0], 4, 10)
      })
      .then(function() {
        passport.authenticate('local')(req, res, function() {
          req.flash('isJustRegistered', true);
          res.redirect('/main');
        });
      })
      .catch(function(err) {
        if (err === "user exists") {
          return;
        }
      });
  } else {
    passport.authenticate('local', {failureRedirect: "/", failureFlash: 'Invalid email or password.'})(req, res, function() {
      res.redirect('/main');
    });
  }
});

router.get('/signout', auth, function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/main', auth, function(req, res) {
  res.render('main', {isJustRegistered: req.flash('isJustRegistered').length != 0});
})

router.post('/api/books', auth, function(req, res) {
  var userId = req.session.passport.user;
  req.body.book.userId = userId;

  var newId;
  Promise.join(unordered.getUnordered(userId), book.save(req.body.book), function(unorderedOrder, bookId) {
    var newUnordered = '';
    if (unorderedOrder) {
      newUnordered = bookId + ',' + unorderedOrder;
    } else {
      newUnordered = bookId.toString();
    }

    newId = bookId[0];

    return unordered.save(userId, newUnordered);
  })
    .then(function() {
      return book.get(newId);
    })
    .then(function(book) {
      res.send(200, book);
    })
    .catch(function(err) {
      res.send(500, {error: err.message});
    });
});

router.post('/api/books/page', auth, function(req, res) {
  //TODO check that user has user id
  book.get(req.body.bookId).then(function(b) {
    return book.updateCurrentPage(req.body.bookId, req.body.page);
  })
    .then(function() {
      res.send(200);
    })
    .catch(function(err) {
      res.send(500, {error: err.message});
    });
});

router.post('/api/books/delete-from-queue', auth, function(req, res) {
  var userId = req.session.passport.user;
  //check that userId is for the user from the session and that book belongs to the user
  book.get(req.body.bookId)
    .then(function(books) {
      var b = books[0];

      if (b.userId !== userId) {
        return res.send(403);
      }

      var updateQueue = queue.getQueue(b.userId).then(function(queueOrder) {
        var newQueue = _(queueOrder.split(',')).without(b.id.toString()).value().join(',');
        return queue.save(b.userId, newQueue);
      });

      return Promise.all([book.delete(b.id), updateQueue]);
    })
    .then(function() {
      res.send(200);
    })
    .catch(function(err) {
      res.send(500, {error: err.message});
    });
});

router.post('/api/books/delete-from-unordered', auth, function(req, res) {
  var userId = req.session.passport.user;
  //TODO check that userId is for the user from the session and that book belongs to the user
  book.get(req.body.bookId)
    .then(function(books) {
      var b = books[0];

      if (b.userId !== userId) {
        return res.send(403);
      }

      var updateUnordered = unordered.getUnordered(b.userId).then(function(unorderedOrder) {
        var newUnordered = _(unorderedOrder.split(',')).without(b.id.toString()).value().join(',');
        return unordered.save(b.userId, newUnordered);
      });

      return Promise.all([book.delete(b.id), updateUnordered]);
    })
    .then(function() {
      res.send(200);
    })
    .catch(function(err) {
      res.send(500, {error: err.message});
    });
});

router.get('/api/books/queue', auth, function(req, res) {
  var userId = req.session.passport.user;
  
  queue.getBooks(userId).then(function(results) {
    return res.json(results);
  })
    .catch(function(err) {
      res.send(500, {error: err.message});
    });
});

router.get('/api/books/unordered', auth, function(req, res) {
  unordered.getBooks(req.session.passport.user).then(function(results) {
    return res.json(results);
  })
    .catch(function(err) {
      res.send(500, {error: err.message});
    });
});

router.post('/api/order/queue', auth, function(req, res) {
  //check that userId is for the user from the session
  var userId = req.session.passport.user;

  var newOrderedBooks = '';
  if (req.body.queue) {
    newOrderedBooks = req.body.queue.join(',');
  }

  return queue.save(userId, newOrderedBooks)
    .then(function() {
      res.send(200);
    })
    .catch(function(err) {
      res.send(500, {error: err.message});
    });
});

router.post('/api/order/unordered', function(req, res) {
  //check that userId is for the user from the session
  var userId = req.session.passport.user;

  var newUnorderedBooks = '';
  if (req.body.unordered) {
    newUnorderedBooks = req.body.unordered.join(',');
  }

  return unordered.save(userId, newUnorderedBooks)
    .then(function() {
      res.send(200);
    })
    .catch(function(err) {
      res.send(500, {error: err.message});
    });
});

router.get('/api/search', auth, function(req, res) {
  booksSearch.search(req.query.query, req.query.page)
    .then(function(results) {
      res.send(results);
    })
    .catch(function(err) {
      res.send(500, {error: err.message});
    });
});

module.exports = router;
