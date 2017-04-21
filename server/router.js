const express = require('express');
const passport = require('passport');

const passportService = require('./auth/passport');
const authenticationController = require('./controllers/authentication');
const roles = require('../config/roles');

const apiRouter = express.Router();


const requireAuth = passport.authenticate('jwt', {session: false});
const requireLogin = passport.authenticate('local', {session: false});

// Авторизация
const authRouter = express.Router();
authRouter.post('/login', requireLogin, authenticationController.login);
authRouter.post('/register', requireAuth, authenticationController.roleAuthorization(roles.Admin), authenticationController.register); //

// Тестовый
const testRouter = express.Router();
testRouter.all('/admin-only', requireAuth, authenticationController.roleAuthorization(roles.Admin), (req, res) => {
  res.send('Whoop!');
});
testRouter.all('/member-only', requireAuth, authenticationController.roleAuthorization(roles.Member), (req, res) => {
  res.send(':3');
});


apiRouter.use('/auth', authRouter);
apiRouter.use('/test', testRouter);
module.exports = apiRouter;