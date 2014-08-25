var book = {};

book.save = function(book) {
  return knex('books').returning('id').insert(book);
};

book.updateCurrentPage = function(bookId, currentPage) {
  return knex('books').where('id', bookId).update({
    currentPage: currentPage
  });
};

book.get = function(bookId) {
  return knex('books').where('id', bookId);
};

book.delete = function(bookId) {
  return knex('books').where('id', bookId).del();
};

module.exports = book;
