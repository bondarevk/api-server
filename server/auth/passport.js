const passport = require('passport');
const extractJwt = require('passport-jwt').ExtractJwt;
const jwtStrategy = require('passport-jwt').Strategy;
const localStrategy = require('passport-local');

const config = require('../../config/main');
const User = require('../models/user');

/**
 * Авторизация по логину и паролю
 */
const localOptions = {
  usernameField: 'username'
};
const localLogin = new localStrategy(localOptions, (username, password, done) => {
  User.findOne({username}, (error, user) => {

    if (error) {
      return done(error);
    }
    if (!user) {
      return done(null, false, {error: 'Your login details could not be verified. Please try again.'});
    }

    user.comparePassword(password, (error, isMatch) => {

      if (error) {
        return done(error);
      }
      if (!isMatch) {
        return done(null, false, {error: 'Your login details could not be verified. Please try again.'});
      }

      return done(null, user);
    });
  });
});


/**
 * Авторизация по токену
 */
const jwtOptions = {
  jwtFromRequest: extractJwt.fromAuthHeader(),
  secretOrKey: config.jwtSecret
};
const jwtLogin = new jwtStrategy(jwtOptions, (payload, done) => {
  User.findById(payload._id, (error, user) => {
    if (error) {
      return done(err, false);
    }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

passport.use(jwtLogin);
passport.use(localLogin);