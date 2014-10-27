var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var user = require('./data/user');
var passwordHash = require('password-hash');

module.exports = function() {
  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, done) {
      user.getByEmail(email).then(function(user) {
        if (user && passwordHash.verify(password, user.passwordHash)) {
          return done(null, user);
        }

        return done(null, false);
      }).catch(function(err) {
        return done(err);
      });
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    done(null, id);
  });
}
