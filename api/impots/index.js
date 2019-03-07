const scopeAuthorization = require('../lib/middlewares/scopeAuthorization')
const express = require('express')
const Controller = require('./impots.controller')
const Auth = require('../../auth/auth')
const format = require('../lib/utils/format')

const router = express.Router()

module.exports = function (options) {
  const impotsController = new Controller(options)
  const auth = new Auth(options)

  router.get('/ping', impotsController.ping, format)
  router.get(
    '/svair',
    auth.canAccessApi,
    impotsController.svair,
    impotsController.authorize,
    scopeAuthorization,
    format
  )

  return router
}
