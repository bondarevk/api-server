

module.exports.getUserInfo = (user) => {
    return {
        _id: user._id,
        firstName: user.profile.firstName,
        lastName: user.profile.lastName,
        email: user.email,
        role: user.role
    };
};