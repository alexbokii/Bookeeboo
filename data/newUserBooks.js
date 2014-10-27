var booksSearch = require('../lib/booksSearch');
var book = require('./book');
var unordered = require('../data/unordered');
var queue = require('../data/queue');
var Promise = require('bluebird');
var _ = require('lodash');

var newUserBooks = {};

var booksIsbns = [
  "0446310786",
  "1783190612",
  "0547928211",
  "0316769487",
  "1497458862",
  "0064404994",
  "0764108212",
  "0151010269",
  "1451626657",
  "0822204754",
  "1451635621",
  "0440180295",
  "9582701048",
  "0451163966",
  "0393312836",
  "1481409948",
  "1596381787",
  "1401238963",
  "1496145828",
  "0878912339",
  "1476739951",
  "0007934408",
  "1400033411",
  "0451531671",
  "0140283293",
  "0679601406",
  "0375712356",
  "0156711427",
  "1433213818",
  "0061120065",
  "0393964817",
  "0156012952",
  "006053348X",
  "0812978188",
  "0618526412",
  "0679732268",
  "0385720955",
  "0802122078",
  "0316066524",
  "0156907399",
  "9780316291163",
  "0143124757",
  "0679728759",
  "0140274987",
  "0553380958",
  "0307270890",
  "0316216453",
  "0812976533",
  "0679728899",
  "0060088877"
];

function findBookAndSave(isbn) {
  booksSearch.search(isbn, 1)
  .then(function(results) {
    if (results.books.length == 0) {
      return;
    }

    console.log("Adding default book: ", results.books[0].title);
    return book.save(results.books[0], true);
  });
}

function getRandomArbitrary(max) {
  var min = 1;
  return Math.floor(Math.random() * (max - min)) + min; 
}

function getRandomIds(numberOfIds) {
  var result = [];

  do {
    // +1 to include the last id
    var id = getRandomArbitrary(booksIsbns.length);

    if (result.indexOf(id) === -1) {
      result.push(id);
    }
    
  } while(result.length <= numberOfIds)

  return result;
}

function copyDefaultToUser(userId, defaultBookId) {
  return book.get(defaultBookId, true).then(function(books) {
    var b = books[0];
    b.currentPage = 0;
    b.userId = userId;
    delete b.id;
    
    return book.resaveFromDefault(b);
  });
}

newUserBooks.init = function() {
  book.get(1, true).then(function(books) {
    if (books.length != 0) {
      return;
    }
    
    var index = 0;
    var interval = setInterval(function() {
      findBookAndSave(booksIsbns[index]);
      if (++index >= (booksIsbns.length - 1)) {
        clearInterval(interval);
        console.log("Done adding default books");
        return;
      }
    }, 1000);
  });
}

newUserBooks.copyDefaultBooksToUser = function(userId, numberOfUnorderedBooks, numberOfOrderedBooks) {
  var ids = getRandomIds(numberOfUnorderedBooks + numberOfOrderedBooks);
  var orderedIds = _.first(ids, numberOfOrderedBooks);
  var unorderedIds = _.last(ids, numberOfUnorderedBooks);

  var orderedBooks = Promise.all(_.map(orderedIds, function (id) {
    return copyDefaultToUser(userId, id);
  })).then(function(ids) {
    return queue.save(userId, ids.join(','));
  });
           
  var unorderedBooks = Promise.all(_.map(unorderedIds, function (id) {
    return copyDefaultToUser(userId, id);
  })).then(function(ids) {
    return unordered.save(userId, ids.join(','));
  });

  return Promise.all([orderedBooks, unorderedBooks]);
}

module.exports = newUserBooks;
