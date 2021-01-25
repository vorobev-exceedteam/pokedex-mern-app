const checkDecodedCredentials = require('../utills/checkDecodedCredentials');
const extractTokenFromHeader = require('../utills/extractTokenFromHeader');
const { AuthTokenInvalid } = require('../utills/Errors');
const User = require('../models/User');

const verifyAuthJWT = async (req, done) => {
  try {
    const authToken = extractTokenFromHeader(req);
    if (!authToken) {
      return done(new AuthTokenInvalid());
    }
    const decoded = await req.jwtk.verify(authToken, process.env.AUTH_SECRET);
    const user = await User.findOne({
      _id: decoded._id,
      email: decoded.email,
      passwordHash: decoded.passwordHash,
      googleID: decoded.googleID
    });
    if (!user) {
      return done(new AuthTokenInvalid());
    }
    return done(null, user);
  } catch (e) {
    e.tokenType = 'auth';
    return done(e);
  }
};

module.exports = verifyAuthJWT;
