module.exports.getUserInfo = (user) => {
  return {
    username: user.username,
    role: user.role
  };
};

module.exports.changeUserPassword = (user, password, cb) => {
  user.password = password;
  user.save()
    .then((user) => {
      cb(null)
    })
    .catch((error) => {
      cb(error);
    })
};