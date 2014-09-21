var book = {};
var downloadImage = require('../lib/utils/downloadImage'),
    _ = require('lodash');

book.save = function(book) {
  var coverImageName = _.last(book.imageUrl.split('/')).replace('%', '');
  var localPath = 'public/images/covers/' + coverImageName;
  var savePath = '/images/covers/' + coverImageName;

  return downloadImage(book.imageUrl, localPath)
  .then(function() {
    book.imageUrl = savePath;

    return knex('books').returning('id').insert(book);
  });
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
