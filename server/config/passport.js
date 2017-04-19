const passport = require('passport');
const extractJwt = require('passport-jwt').ExtractJwt;
const jwtStrategy = require('passport-jwt').Strategy;
const localStrategy = require('passport-local');

const config = require('../../config/main');
const User = require('../models/user');

const localOptions = {
    usernameField: 'email'
};

const jwtOptions = {
    jwtFromRequest: extractJwt.fromAuthHeader(),
    secretOrKey: config.jwtSecret
};

const localLogin = new localStrategy(localOptions, (email, password, done) => {
    User.findOne({ email }, (err, user) => {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { error: 'Your login details could not be verified. Please try again.' }); }

        user.comparePassword(password, (err, isMatch) => {
            if (err) { return done(err); }
            if (!isMatch) { return done(null, false, { error: 'Your login details could not be verified. Please try again.' }); }

            return done(null, user);
        });
    });
});

const jwtLogin = new jwtStrategy(jwtOptions, (payload, done) => {
    User.findById(payload._id, (err, user) => {
        if (err) { return done(err, false); }

        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
});

passport.use(jwtLogin);
passport.use(localLogin);