const jwt = require('jsonwebtoken');

const User = require('../models/user');
const helpers = require('../helpers');
const config = require('../../config/main');

/**
 * Генерация токена
 * @param userInfo Базовая информация о пользователе
 * @returns {string} Токен
 */
function generateToken(userInfo) {
  return jwt.sign(userInfo, config.jwtSecret, {
    expiresIn: config.jwtSignExpiresIn
  });
}

/**
 * Авторизация логином и паролем
 */
module.exports.login = (req, res, next) => {
  const userInfo = helpers.getUserInfo(req.user);

  res.status(200).json({
    token: `JWT ${generateToken(userInfo)}`,
    user: userInfo
  });
};

/**
 * Регистрация нового пользователя
 */
exports.register = function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  if (!username) {
    return res.status(400).send({error: 'Для регистрации пользователя требуется Username.'});
  }

  if (!password) {
    return res.status(400).send({error: 'Для регистрации пользователя требуется Password.'});
  }

  User.findOne({username}, (error, existingUser) => {
    if (error) {
      return next(error);
    }

    if (existingUser) {
      return res.status(400).send({error: 'Этот логин занят.'});
    }

    // Создаем нового пользователя
    const user = new User({
      username: username,
      password: password
    });

    user.save((error, user) => {
      if (error) {
        return next(error);
      }

      const userInfo = helpers.getUserInfo(user);

      res.status(200).json({
        result: 'success'
      });
    });
  });
};