const passport = require('passport');

const passportAuth = (strategy, options) => (req, res, next) => {
  passport.authenticate(strategy, options, async (err, user) => {
    if (err) {
      return next(err);
    }
    req.user = user;
    return next();
  })(req, res, next);
};

module.exports = passportAuth;
