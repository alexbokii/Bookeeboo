var express = require('express');
var Promise = require('bluebird');
var router = express.Router();
var booksSearch = require('../lib/booksSearch');
var queue = require('../data/queue');
var book = require('../data/book');
var user = require('../data/user');
var unordered = require('../data/unordered');
var _ = require('lodash');

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/main', function(req, res) {
  res.render('main');
})

router.post('/api/books', function(req, res) {
  req.body.userId = 1;
  req.body.book.userId = 1;

  var newId;
  Promise.join(unordered.getUnordered(req.body.userId), book.save(req.body.book), function(unorderedOrder, bookId) {
    var newUnordered = '';
    if (unorderedOrder) {
     newUnordered = bookId + ',' + unorderedOrder;
    } else {
      newUnordered = bookId.toString();
    }

    newId = bookId[0];

    return unordered.save(req.body.userId, newUnordered);
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

router.post('/api/books/page', function(req, res) {
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

router.post('/api/books/delete-from-queue', function(req, res) {
  req.body.userId = 1;
  //check that userId is for the user from the session and that book belongs to the user
  book.get(req.body.bookId)
  .then(function(books) {
    var b = books[0];

    if (b.userId !== req.body.userId) {
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

router.post('/api/books/delete-from-unordered', function(req, res) {
  req.body.userId = 1;
  //check that userId is for the user from the session and that book belongs to the user
  book.get(req.body.bookId)
  .then(function(books) {
    var b = books[0];

    if (b.userId !== req.body.userId) {
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

router.get('/api/books/queue', function(req, res) {
  queue.getBooks(1).then(function(results) {
    return res.json(results);
  })
  .catch(function(err) {
    res.send(500, {error: err.message});
  });
});

router.get('/api/books/unordered', function(req, res) {
  unordered.getBooks(1).then(function(results) {
    return res.json(results);
  })
  .catch(function(err) {
    res.send(500, {error: err.message});
  });
});

router.post('/api/order/queue', function(req, res) {
  //check that userId is for the user from the session
  var userId = 1;

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
  var userId = 1;

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

router.get('/api/search', function(req, res) {
  booksSearch.search(req.query.query, req.query.page)
  .then(function(results) {
    res.send(results);
  })
  .catch(function(err) {
    res.send(500, {error: err.message});
  });
});

module.exports = router;
