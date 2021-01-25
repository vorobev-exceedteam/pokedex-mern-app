const crypto = require('crypto');

const createKeyvTokens = async (jwtk, payload, ua) => {
  const hash = crypto.createHash('md5');
  const authJTI = hash
    .copy()
    .update(payload._id + ua)
    .digest('base64');
  const refreshJTI = hash.update(authJTI).digest('base64');
  const authPayload = { ...payload };
  const refreshPayload = { ...payload };
  authPayload.jti = authJTI;
  refreshPayload.jti = refreshJTI;
  const authToken = await jwtk.sign(authPayload, process.env.AUTH_SECRET, {
    expiresIn: process.env.AUTH_TOKEN_EXPIRATION_TIME
  });
  const refreshToken = await jwtk.sign(
    refreshPayload,
    process.env.REFRESH_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME
    }
  );
  return [authToken, refreshToken];
};

module.exports = createKeyvTokens;
