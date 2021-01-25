const crypto = require('crypto');

const destroyKeyvTokens = async (jwtk, userid, ua) => {
  const hash = crypto.createHash('md5');
  const authJTI = hash.copy().update(userid+ua).digest('base64');
  const refreshJTI = hash.update(authJTI).digest('base64')
  await jwtk.destroy(authJTI);
  await jwtk.destroy(refreshJTI);
};

module.exports = destroyKeyvTokens;
