var knex = require('knex')({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: process.env.BOOKEEBOO_PG_USER,
    password: '',
    database: 'bookeeboo'
  }
});

module.exports = knex;
