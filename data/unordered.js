var unordered = {};
var user = require('./user');
var Promise = require('bluebird');
var _ = require('lodash');

unordered.getUnordered = function(userId) {
  return user.get(userId).then(function(user) {
    return user[0].unorderedOrder;
  });
};

unordered.save = function(userId, unorderedString) {
  return user.get(userId).update({unorderedOrder: unorderedString});
};

unordered.getBooks = function(userId) {
  return user.get(userId).then(function(users) {
    var user = users[0];
    var order = _.map(user.unorderedOrder.split(','), function(u) {return parseInt(u, 10);});

    return knex('books').whereIn('id', order).then(function(books) {
      return _.map(order, function(o) { return _.find(books, function(b) { return b.id === o; }); });
    });
  });
};

module.exports = unordered;
