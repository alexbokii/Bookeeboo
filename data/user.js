var user = {};
var _ = require('lodash');
var Promise = require('bluebird');

user.get = function(userId) {
  return knex('users').where('id', userId);
};

module.exports = user;

