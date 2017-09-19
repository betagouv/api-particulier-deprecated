
var express = require('express')
var Controller = require('./system.controller')
var format = require('../lib/utils/format')

var router = express.Router()

module.exports = function (options) {
  var systemController = new Controller(options)

  router.get('/swagger.yaml', systemController.swagger)
  router.get('/ping', systemController.ping)
  router.get('/ping', format)
  router.get('/introspect', (req, res, next) => { systemController.introspect(req, res, next) })
  router.get('/introspect', format)
  return router
}
