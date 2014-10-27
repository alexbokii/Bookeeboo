var user = {};
var _ = require('lodash');
var Promise = require('bluebird');
var passwordHash = require('password-hash');

user.get = function(userId) {
  return knex('users').where('id', userId);
};

user.getByEmail = function(email) {
  return knex('users').where('email', email).first();
}

user.signup = function(email, password) {
  var hash = passwordHash.generate(password);
  var user = {
    email: email,
    passwordHash: hash,
    unorderedOrder: "",
    queueOrder: ""
  };

  return knex('users').returning('id').insert(user);
}

user.exists = function(email) {
  return knex('users').where('email', email).count('id').first();
}

module.exports = user;

