
const express = require('express')
const Controller = require('./impots.controller')
const Auth = require('../../auth/token')

const router = express.Router()

module.exports = function (options) {
  const impotsController = new Controller(options)
  const auth = new Auth(options)

  router.get('/svair', auth.canAccessApi, impotsController.svair)
  router.get('/adress', auth.canAccessApi, impotsController.adress)
  router.get('/ping', impotsController.ping)

  return router
}
