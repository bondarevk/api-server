const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
        email: {
            type: String,
            lowercase: true,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        profile: {
            firstName: {type: String},
            lastName: {type: String}
        },
        resetPasswordToken: {type: String},
        resetPasswordExpires: {type: Date}
    },
    {
        timestamps: true
    });


UserSchema.pre('save', function (next) {
    const user = this;
    const saltRounds = 10;

    if (!user.isModified('password')) return next();

    bcrypt.hash(user.password, saltRounds, (err, hash) => {
        if (err) return next(err);
        user.password = hash;
        next();
    });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, res) => {
        if (err) {
            return cb(err);
        }
        cb(null, res);
    });
};

module.exports = mongoose.model('User', UserSchema);