var testData = {};
var booksSearch = require('../lib/booksSearch');
var book = require('./book');
var unordered = require('./unordered');
var queue = require('./queue');
var _ = require('lodash');
var Promise = require('bluebird');

testData.createTestUser = function() {
  var testUser = {
    email: 'test@gmail.com',
    passwordHash: ''
  };

  return knex('users').where({
    email: 'test@gmail.com'
  }).then(function(user) {
    return knex('users').returning('id').insert(testUser);
  });
};

testData.createUnordered = function(userId) {
  return booksSearch.search('kittens', 1)
  .then(function(results) {
    var kittens = _.chain(results.books).first(6).map(function(b) {
      b.userId = userId;
      return book.save(b);
    }).value();

    return Promise.all(kittens);
  })
  .then(function(ids) {
    return unordered.save(userId, ids.join(','));
  });
};

testData.createQueue = function(userId) {
  return booksSearch.search('fashion design', 1)
  .then(function(results) {

    var fashion = results.books.map(function(b) {
      b.userId = userId;
      return book.save(b);
    });

    return Promise.all(fashion);
  })
  .then(function(ids) {
    return queue.save(userId, ids.join(','));
  });
};

module.exports = testData;
