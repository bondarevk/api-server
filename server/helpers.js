module.exports.getUserInfo = (user) => {
  return {
    _id: user._id,
    username: user.username,
    role: user.role
  };
};