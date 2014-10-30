var book = {};
var path = require('path');
var downloadImage = require('../lib/utils/downloadImage'),
    _ = require('lodash');

book.save = function(book, isDefault) {
  var coverImageName = _.last(book.imageUrl.split('/')).replace('%', '');
  var localPath = path.join(process.env.PWD, 'public', 'images', 'covers', coverImageName);
  //var localPath = '/home/bookeeboo/Bookeeboo/public/images/covers/' + coverImageName;
  var savePath = '/images/covers/' + coverImageName;

  return downloadImage(book.imageUrl, localPath)
  .then(function() {
    book.imageUrl = savePath;

    var table = isDefault ? 'defaultBooks' : 'books';
    return knex(table).returning('id').insert(book);
  });
};

book.resaveFromDefault = function(defaultBook) {
  return knex('books').returning('id').insert(defaultBook);
}

book.updateCurrentPage = function(bookId, currentPage) {
  return knex('books').where('id', bookId).update({
    currentPage: currentPage
  });
};

book.get = function(bookId, isDefault) {
  var table = isDefault ? 'defaultBooks' : 'books';
  return knex(table).where('id', bookId);
};

book.delete = function(bookId) {
  return knex('books').where('id', bookId).del();
};

module.exports = book;
