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
exports.login = (req, res, next) => {
  const userInfo = helpers.getUserInfo(req.user);

  res.status(200).json({
    result: 'success',
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
    return res.status(400).json({error: 'Для регистрации пользователя требуется Username.', errno: 31});
  }

  if (!password) {
    return res.status(400).json({error: 'Для регистрации пользователя требуется Password.', errno: 31});
  }

  User.findOne({username}, null, {collation: {locale: 'en', strength: 2}}, (error, existingUser) => {
    if (error) {
      return next(error);
    }

    if (existingUser) {
      return res.status(400).json({error: 'Этот логин занят.', errno: 32});
    }

    // Создаем нового пользователя
    const user = new User({
      username: username,
      password: password
    });

    user.save((error, user) => {
      if (error) {
        if (error.name === 'ValidationError') {
          res.status(400).json({error: 'Ошибка валидации.', errno: 33});
          return;
        }
        return next(error);
      }

      res.status(201).json({
        result: 'success'
      });
    });
  });
};

/**
 * Ограничение прав по уровням доступа
 * @param requiredRole Требуемый уровень
 */
exports.roleAuthorization = function (requiredRole) {
  return function (req, res, next) {
    User.findById(req.user.id, (error, user) => {
      if (error) {
        res.status(401).send('Unauthorized');
        return next(error);
      }

      if (user.role >= requiredRole) {
        return next();
      }

      return res.status(403).json({error: 'Доступ запрещен.', errno: 51});
    })
  }
};