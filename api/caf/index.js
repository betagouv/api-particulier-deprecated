const express = require('express')
const Auth = require('../../auth/auth')
const Controller = require('./caf.controller')
const format = require('../lib/utils/format')

module.exports = function (options) {
  const router = express.Router()
  const auth = new Auth(options)
  const cafController = new Controller(options)

  router.use(cafController.prepare())

  router.get('/ping', cafController.ping, format)
  router.get('/famille', auth.canAccessApi, cafController.famille, format)
  router.use((req, res, next) => cafController.authorize(req, res, next))

  return router
}
