
const express = require('express')
const Controller = require('./impots.controller')
const Auth = require('../../auth/auth')
const format = require('../lib/utils/format')

const router = express.Router()

module.exports = function (options) {
  const impotsController = new Controller(options)
  const auth = new Auth(options)

  router.get('/ping', impotsController.ping)
  router.use(auth.canAccessApi)
  router.get('/svair', impotsController.svair)
  router.get('/adress', impotsController.adress)
  router.use(impotsController.authorize)
  router.use(format)

  return router
}
