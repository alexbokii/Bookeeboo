var book = {};

book.save = function(book) {
  return knex('books').returning('id').insert(book);
};

book.get = function(bookId) {
  return knex('books').where('id', bookId);
};

book.delete = function(bookId) {
  return knex('books').where('id', bookId).del();
};

module.exports = book;
