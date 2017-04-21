module.exports.getUserInfo = (user) => {
  return {
    username: user.username,
    role: user.role
  };
};