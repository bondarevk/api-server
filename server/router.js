const express = require('express');
const passport = require('passport');

const authenticationController = require('./controllers/authentication');

const apiRouter = express.Router();
const authRouter = express.Router();
const testRouter = express.Router();

const passportService = require('./config/passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireLogin = passport.authenticate('local', { session: false });

// Auth Router
apiRouter.use('/auth', authRouter);
authRouter.post('/login', requireLogin, authenticationController.login);
authRouter.post('/register', authenticationController.register);

// Test Router
apiRouter.use('/test', testRouter);
testRouter.get('/at', requireAuth, (req, res) => {
    res.send('ok');
});


module.exports = apiRouter;