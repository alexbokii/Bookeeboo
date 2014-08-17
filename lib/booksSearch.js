var booksSearch = {};
var Promise = require('bluebird');
var aws = require('aws-lib');
var bookInfoExtractor = require('./bookInfoExtractor');

booksSearch.search = function (query, page) {
  var prodAdv = aws.createProdAdvClient(process.env.AMAZON_ACCESS_KEY, process.env.AMAZON_SECRET_KEY, 'bookeebo');
  var options = {SearchIndex: "Books", Keywords: query, ResponseGroup: "Medium", ItemPage: page};

  var call = Promise.promisify(prodAdv.call, prodAdv);
  return call("ItemSearch", options).then(function(response) {
    var books = [];

    if (response.Items.TotalResults > 1) {
      books = response.Items.Item.map(bookInfoExtractor.extract);
    } else if (response.Items.TotalResults == 1) {
      books = [bookInfoExtractor.extract(response.Items.Item)];
    }

    var result = {
      total: response.Items.TotalResults,
      books: books
    };

    return result;
  });
};

module.exports = booksSearch;
