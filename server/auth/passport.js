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
  User.findOne({username}, null, {collation: {locale: 'en', strength: 2}}, (error, user) => {

    if (error) {
      return done(error);
    }
    if (!user) {
      return done(null, false, {error: 'Неверный логин или пароль.', errno: 41});
    }

    user.comparePassword(password, (error, isMatch) => {

      if (error) {
        return done(error);
      }
      if (!isMatch) {
        return done(null, false, {error: 'Неверный логин или пароль.', errno: 41});
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
  User.findOne({_id: payload._id, username: payload.username, password: payload.password}, (error, user) => {
    if (error) {
      return done(error, false);
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