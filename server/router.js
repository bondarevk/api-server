const express = require('express');
const passport = require('passport');

const authenticationController = require('./controllers/authentication');

const apiRouter = express.Router();

const passportService = require('./auth/passport');

const requireAuth = passport.authenticate('jwt', {session: false});
const requireLogin = passport.authenticate('local', {session: false});

// Авторизация
const authRouter = express.Router();
authRouter.post('/login', requireLogin, authenticationController.login);
authRouter.post('/register', authenticationController.register);

// Тестовый
const testRouter = express.Router();
testRouter.get('/at', requireAuth, (req, res) => {
  res.send('ok');
});


apiRouter.use('/auth', authRouter);
apiRouter.use('/test', testRouter);
module.exports = apiRouter;