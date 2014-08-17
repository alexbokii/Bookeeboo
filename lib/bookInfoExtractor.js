var S = require('string');
var booksInfoExtractor = {};

booksInfoExtractor.extract = function(rawBook) {
  var description = rawBook.EditorialReviews ? rawBook.EditorialReviews.EditorialReview.Content : 'No Description';
  var info = rawBook.ItemAttributes;

  var book = {
    title: info.Title,
    author: info.Author,
    pageCount: info.NumberOfPages,
    imageUrl: rawBook.LargeImage ? rawBook.LargeImage.URL : ''
  };

  if (description) {
    book.description = S(description).stripTags().s;
  }

  return book;
};

module.exports = booksInfoExtractor;
