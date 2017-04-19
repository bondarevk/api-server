const jwt = require('jsonwebtoken');

const User = require('../models/user');
const helpers = require('../helpers');
const config = require('../../config/main');

/**
 *
 * @param user
 * @returns {*}
 */
function generateToken(user) {
    return jwt.sign(user, config.jwtSecret, {
        expiresIn: config.jwtSignExpiresIn
    });
}

/**
 * Login
 * @param req
 * @param res
 * @param next
 */
module.exports.login = (req, res, next) => {
    const userInfo = helpers.getUserInfo(req.user);

    res.status(200).json({
        token: `JWT ${generateToken(userInfo)}`,
        user: userInfo
    });
};

/**
 * Registration
 * @param req
 * @param res
 * @param next
 */
exports.register = function (req, res, next) {
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const password = req.body.password;

    if (!email) {
        return res.status(422).send({ error: 'You must enter an email address.' });
    }

    if (!firstName || !lastName) {
        return res.status(422).send({ error: 'You must enter your full name.' });
    }

    if (!password) {
        return res.status(422).send({ error: 'You must enter a password.' });
    }

    User.findOne({ email }, (err, existingUser) => {
        if (err) { return next(err); }

        if (existingUser) {
            return res.status(422).send({ error: 'That email address is already in use.' });
        }

        const user = new User({
            email,
            password,
            profile: { firstName, lastName }
        });

        user.save((err, user) => {
            if (err) { return next(err); }

            const userInfo = helpers.getUserInfo(user);

            res.status(201).json({
                token: `JWT ${generateToken(userInfo)}`,
                user: userInfo
            });
        });
    });
};