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
    table.string('passwordHash').notNullable();
    table.string('unorderedOrder').defaultTo('');
    table.string('queueOrder').defaultTo('');
  },

  'books': function(table) {
    table.increments('id').primary();
  }
};

data.initTables = function() {
  var existPromises = tables.map(function(t) {
    return data._tableExist(t);
  });

  return Promise.all(existPromises).then(function(results) {
    var createWrappers = [];
    results.forEach(function(r, index) {
      if (!r) {
        createWrappers.push(data._createTable(tables[index], definitions[tables[index]]));
      }
    });

    return Promise.all(createWrappers);
  });
};

data.fillWithTestData = function() {
  var testUser = {
    email: 'test-email',
    passwordHash: ''
  };

  return knex('users').where({
    email: 'test-email'
  }).then(function(user) {
    if (user.length > 1) {
      console.log('YOU HAVE MORE THAN ONE TEST USER');
    } else if (user.length === 0) {
      return knex('users').insert(testUser);
    }
  });
};

data._recreateTables = function() {
  var recreatePromises = tables.forEach(function(t) {
    return knex.schema.dropTableIfExists(t);
  });

  Promise.all(recreatePromises).then(function() {
    return initTables();
  });
};

data._tableExist = function(tableName) {
  return this.knex.schema.hasTable(tableName);
};

data._createTable = function(tableName, definition) {
  return knex.schema.createTable(tableName, definition);
};

module.exports = data;
