const User = require('../models/User');

const checkDecodedCredentials = (decoded) => {
  return User.exists({
    _id: decoded._id,
    email: decoded.email,
    passwordHash: decoded.passwordHash,
    googleID: decoded.googleID
  });
};

module.exports = checkDecodedCredentials;
