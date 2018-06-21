module.exports = function getApiKeyFromQueryParam (req, res, next) {
  if (req.query['API-Key'] && !req.get('X-API-Key')) {
    req.headers['x-api-key'] = req.query['API-Key']
  }
  next()
}
