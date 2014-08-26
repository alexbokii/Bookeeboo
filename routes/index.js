var express = require('express');
var router = express.Router();
var booksSearch = require('../lib/booksSearch');
var _ = require('lodash');

router.get('/', function(req, res) {
  res.render('index');
});

router.get('/main', function(req, res) {
  res.render('main');
});

router.get('/api/queue', function (req, res) {
  booksSearch.search('kittens', 1)
  .then(function(results) {
    res.send(results);
  })
  .error(function(err) {
    return res.send(500, {message: err});
  });
});

router.get('/api/unordered', function (req, res) {
  booksSearch.search('england', 1)
  .then(function(results) {
    res.send(results);
  })
  .error(function(err) {
    return res.send(500, {message: err});
  });
});

router.get('/api/search', function(req, res) {
  booksSearch.search(req.query.query, req.query.page)
  .then(function(results) {
    res.send(results);
  })
  .error(function(err) {
    return res.send(500, {message: err});
  });
});

module.exports = router;
