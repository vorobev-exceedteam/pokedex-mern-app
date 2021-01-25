const User = require('../models/User');
const getUA = require('../utills/getUA');

const verifyGoogle = async (req, accessToken, refreshToken, profile, cb) => {
  try {
    const ua = getUA(req);
    let user = await User.findOne({ email: profile.email });
    if (user) {
      if (!user.googleID) {
        user.googleID = profile.id;
      }
      if (!user.ua.includes(ua)) {
        user.ua.push(ua);
      }
      await user.save();
    } else {
      user = new User({
        email: profile.email,
        googleID: profile.id,
        ua: [ua]
      });
      await user.save();
    }
    return cb(null, user);
  } catch (e) {
    return cb(e);
  }
};

module.exports = verifyGoogle;
