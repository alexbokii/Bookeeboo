var fs = require('fs'),
    request = require('request'),
    Promise = require('bluebird');

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

module.exports = Promise.promisify(download);
