var bootstrap = {};
var Promise = require('bluebird');

var tables = [
  'users',
  'books'
];

var definitions = {
  'users': function(table) {
    table.increments('id').primary();
    table.string('email').unique();
    table.string('passwordHash').notNullable();
    table.string('unorderedOrder').defaultTo('');
    table.string('queueOrder').defaultTo('');
  },

  'books': function(table) {
    table.increments('id').primary();
    table.integer('userId').references('id').inTable('users');
    table.string('title').notNullable();
    table.string('author');
    table.integer('pageCount');
    table.string('imageUrl');
    table.text('description');
    table.integer('currentPage').notNullable().defaultTo(0);
  }
};

bootstrap.createTablesIfMissing = function() {
  var existPromises = tables.map(function(t) {
    return bootstrap._tableExist(t);
  });

  return Promise.all(existPromises).then(function(results) {
    var createWrappers = [];
    results.forEach(function(r, index) {
      if (!r) {
        createWrappers.push(bootstrap._createTable(tables[index], definitions[tables[index]]));
      }
    });

    return Promise.all(createWrappers);
  });
};

bootstrap._tableExist = function(tableName) {
  return knex.schema.hasTable(tableName);
};

bootstrap._createTable = function(tableName, definition) {
  return knex.schema.createTable(tableName, definition);
};

module.exports = bootstrap;
