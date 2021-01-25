const checkDecodedCredentials = require('../utills/checkDecodedCredentials');
const { RefreshedTokenInvalid } = require('../utills/Errors');
const User = require('../models/User');

const verifyRefreshJWT = async (req, done) => {
  try {
    const receivedToken = req.body.refreshJWT;
    if (!receivedToken) {
      return done(new RefreshedTokenInvalid());
    }
    const decoded = await req.jwtk.verify(
      receivedToken,
      process.env.REFRESH_SECRET
    );
    const user = await User.findOne({
      _id: decoded._id,
      email: decoded.email,
      passwordHash: decoded.passwordHash,
      googleID: decoded.googleID
    });
    if (!user) {
      return done(new RefreshedTokenInvalid());
    }
    return done(null, user);
  } catch (e) {
    e.tokenType = 'refresh';
    return done(e);
  }
};

module.exports = verifyRefreshJWT;
