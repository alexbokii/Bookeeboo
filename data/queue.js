var queue = {};
var user = require('./user');
var _ = require('lodash');
var Promise = require('bluebird');

queue.getQueue = function(userId) {
  return user.get(userId).then(function(user) {
    return user[0].queueOrder;
  });
};

queue.save = function(userId, queueOrderString) {
  return user.get(userId).update({queueOrder: queueOrderString});
};

queue.getBooks = function(userId) {
  return user.get(userId).then(function(users) {
    var user = users[0];

    if (!user.queueOrder) {
      return [];
    }

    var order = _.map(user.queueOrder.split(','), function(u) {return parseInt(u, 10);});

    return knex('books').whereIn('id', order).then(function(books) {
      return _.map(order, function(o) { return _.find(books, function(b) { return b.id === o; }); });
    });
  });
};

module.exports = queue;
