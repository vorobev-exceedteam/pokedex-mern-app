const extractTokenFromHeader = (req) => {
  const authHeader = req.headers['authorization'];
  return authHeader && authHeader.split(' ')[1];
};

module.exports = extractTokenFromHeader;
