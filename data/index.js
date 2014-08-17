var knex = require('knex')({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: process.env.BOOKEEBOO_PG_USER,
    password: '',
    database: 'bookeeboo'
  }
});
var Promise = require('bluebird');
var data = {
  knex: knex
};

var tables = [
  'users',
  'books'
];

var definitions = {
  'users': function(table) {
    table.increments('id').primary();
    table.string('email');
    table.string('passwordHash');
    table.string('unsortedOrder').defaultTo('');
    table.string('queueOrder').defaultTo('');
  },

  'books': function(table) {
    table.increments('id').primary();
  }
};

data.initTables = function() {
  tables.forEach(function(t) {
    data._tableExist(t).then(function(exists) {
      if (!exists) {
        data._createTable(t, definitions[t]);
      }
    })
  });
};

data._recreateTables = function() {
  var wrappers = tables.forEach(function(t) {
    return function() {
      knex.schema.dropTableIfExists(t);
    };
  });

  Promise.all(wrappers).then(function() {
    initTables();
  });
};

data._tableExist = function(tableName) {
  return this.knex.schema.hasTable(tableName);
};

data._createTable = function(tableName, definition) {
  return knex.schema.createTable(tableName, definition).then(function() {});
};

module.exports = data;
