const getUA = (req) => {
  return req.headers['user-agent'] || 'unknown'
}

module.exports = getUA;
