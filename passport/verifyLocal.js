const bcrypt = require('bcrypt');
const { ValidationError } = require('../utills/Errors');
const User = require('../models/User');
const getUA = require("../utills/getUA");

const verifyLocal = async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return done(
        new ValidationError('login', [
          {
            message: `User with email ${email} is not exist`,
            key: 'email'
          }
        ])
      );
    }
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return done(
        new ValidationError('login', [
          {
            message: 'Password is not valid',
            key: 'password'
          }
        ])
      );
    }
    return done(null, user);
  } catch (e) {
    return done(e);
  }
};

module.exports = verifyLocal;
