'use strict'

module.exports = function identifyUser (req, res, next) {
  req.user = req.headers['X-User'] || req.query.user || 'Anonymous'
  next()
}
