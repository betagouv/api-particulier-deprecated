'use strict'

const formatsDict = {
  xml: 'application/xml',
  json: 'application/json'
}

module.exports = function getApiKeyFromQueryParam (req, res, next) {
  if (req.query['format']) {
    req.headers['accept'] = formatsDict[req.query['format']]
  }
  next()
}
