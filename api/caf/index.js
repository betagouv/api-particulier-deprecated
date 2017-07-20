const express = require('express')
const Auth = require('../../auth/auth')
const Controller = require('./caf.controller')

module.exports = function (options) {
  const router = express.Router()
  const auth = new Auth(options)
  const cafController = new Controller(options)

  router.use(cafController.prepare())

  router.get('/ping', cafController.ping)
  router.use(auth.canAccessApi)
  router.get('/famille', cafController.famille)

  return router
}
