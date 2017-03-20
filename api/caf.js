const express = require('express')
const { ping, injectClient, fetch } = require('api-caf/lib/components')
const Auth = require('../auth/token')
const fs = require('fs')

module.exports = function (options) {
  const router = express.Router()
  const auth = new Auth(options)

  router.use(injectClient({
    host: options.cafHost,
    cert: fs.readFileSync(options.cafSslCertificate),
    key: fs.readFileSync(options.cafSslKey)
  }))

  router.get('/ping', ping(options.cafPingParams))
  router.get('/famille', auth.canAccessApi, fetch())

  return router
}
