const JWTK = require('jwt-keyv').default;

exports.expressJWTK = (keyvClient, options) => (req, res, next) => {
  req.jwtk = new JWTK(keyvClient, options);
  req.keyv = keyvClient;
  return next();
}
