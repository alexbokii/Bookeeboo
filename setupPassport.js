var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function() {
  passport.use(new LocalStrategy(
    function(username, password, done) {
      console.log('username ', username);
      console.log('password ', password);
    }
  ));
}
