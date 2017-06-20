const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const ValidationError = mongoose.Error.ValidationError;

const roles = require('../../config/roles');

/**
 * Модель пользователя
 */
const UserSchema = new Schema({
    username: {
      type: String,
      index: true,
      unique: true,
      required: true,
      match: /^[\w@$!%*#?&]{6,12}$/
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: Number,
      enum: roles,
      default: 1
    }
  },
  {
    timestamps: true
  });

/**
 * Хэширование пароля
 */
UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();

  if (!this.password.match(/^[\w@$!%*#?&]{8,32}$/)) {
    const err = new ValidationError('Password Validation Error');
    next(err);
    return;
  }

  const saltRounds = 10;
  bcrypt.hash(this.password, saltRounds, (error, hash) => {
    if (error) return next(error);
    this.password = hash;
    next();
  });
});

/**
 * Проверка пароля
 * @param candidatePassword Пароль в чистом виде
 * @param cb CallBack
 */
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (error, result) => {
    if (error) {
      return cb(error);
    }
    cb(null, result);
  });
};

module.exports = mongoose.model('User', UserSchema);