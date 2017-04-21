const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const roles = require('../../config/roles');

/**
 * Модель пользователя
 */
const UserSchema = new Schema({
    username: {
      type: String,
      index: true,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: Number,
      enum: roles,
      default: 1
    },
    resetPasswordToken: {type: String},
    resetPasswordExpires: {type: Date}
  },
  {
    timestamps: true
  });

/**
 * Хэширование пароля
 */
UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();

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