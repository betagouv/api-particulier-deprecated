'use strict'
const crypto = require('crypto')

module.exports.excludes = ['req', 'res', 'req-headers', 'res-headers', 'msg', 'url', 'short-body', 'body']

module.exports.includesFn = function (req, res) {
  let url = (req.baseUrl || '') + String(req.url || '')
  url = url.replace(/([?&])API-Key=([^&]+)/, '$1API-Key=XXX')
  let queryString = url.match(/\?(.+)/)
  queryString = queryString && queryString[0]
  url = url.replace(/\?(.+)/, '')

  const hash = crypto.createHash('sha512')
  hash.update(queryString || '')
  const queryHash = hash.digest('hex')

  return {
    correlationId: req.id,
    consumer: {
      organisation: req.consumer ? req.consumer.name : undefined,
      user: req.user
    },
    host: req.headers.host,
    realIp: req.headers['x-real-ip'],
    queryHash,
    url
  }
}
