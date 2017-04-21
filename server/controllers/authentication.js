const jwt = require('jsonwebtoken');

const User = require('../models/user');
const helpers = require('../helpers');
const config = require('../../config/main');

/**
 * Генерация токена
 * @param user Информация о пользователе
 * @returns {string} Токен
 */
function generateToken(user) {
  return jwt.sign({
    _id: user.id,
    username: user.username,
    password: user.password
  }, config.jwtSecret, {
    expiresIn: config.jwtSignExpiresIn
  });
}

/**
 * Авторизация логином и паролем
 */
exports.login = (req, res, next) => {
  res.status(200).json({
    result: 'success',
    token: `JWT ${generateToken(req.user)}`,
    user: helpers.getUserInfo(req.user)
  })
};

/**
 * Регистрация нового пользователя
 */
exports.register = function (req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({error: 'Отсутствуют обязательные параметры.', errno: 31});
  }

  User.findOne({username}, null, {collation: {locale: 'en', strength: 2}})
    .then((existingUser) => {

      if (existingUser) {
        return res.status(400).json({error: 'Этот логин занят.', errno: 32});
      }

      // Создаем нового пользователя
      const user = new User({
        username: username,
        password: password
      });
      user.save()
        .then((user) => {
          res.status(200).json({result: 'success'})
        })
        .catch((error) => {
          if (error.name === 'ValidationError') {
            return res.status(400).json({error: 'Ошибка валидации.', errno: 33});
          }
          return next(error);
        })
    })
    .catch((error) => {
      return next(error);
    })
};

/**
 * Изменение пароля
 */
exports.resetPassword = function (req, res, next) {
  const user = req.user;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({error: 'Отсутствуют обязательные параметры.', errno: 31});
  }

  user.comparePassword(oldPassword, (error, result) => {
    if (error) {
      return res.status(400).json({error: 'Ошибка проверки пароля.', errno: 62});
    }
    if (!result) {
      return res.status(400).json({error: 'Неверный старый пароль.', errno: 63});
    }
    helpers.changeUserPassword(user, newPassword, (error) => {

      if (error) {
        if (error.name === 'ValidationError') {
          return res.status(400).json({error: 'Ошибка валидации.', errno: 33})
        }
        return res.status(400).json({error: 'Ошибка изменения пароля.', errno: 64})
      }

      res.status(200).json({
        result: 'success',
        token: `JWT ${generateToken(user)}`,
        user: helpers.getUserInfo(user)
      })
    })
  })
};

/**
 * Ограничение прав по уровням доступа
 * @param requiredRole Требуемый уровень
 */
exports.roleAuthorization = function (requiredRole) {
  return function (req, res, next) {
    User.findById(req.user.id)
      .then((user) => {
        if (user.role >= requiredRole) {
          return next();
        }
        return res.status(403).json({error: 'Доступ запрещен.', errno: 51});
      })
      .catch((error) => {
        res.status(401).send('Unauthorized');
        return next(error);
      })
  }
};