
const express = require('express')
const Controller = require('./impots.controller')
const Auth = require('../../auth/auth')
const format = require('../lib/utils/format')

const router = express.Router()

module.exports = function (options) {
  const impotsController = new Controller(options)
  const auth = new Auth(options)

  router.get('/ping', impotsController.ping, format)
  router.use(auth.canAccessApi)
  router.get('/svair', impotsController.svair, format)
  router.get('/adress', impotsController.adress, format)
  router.use((req, res, next) => impotsController.authorize(req, res, next))

  return router
}
