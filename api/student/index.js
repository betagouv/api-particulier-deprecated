const express = require('express')
const Auth = require('../../auth/auth')
const Controller = require('./student.controller')
const format = require('../lib/utils/format')
const scopeAuthorization = require('../lib/middlewares/scopeAuthorization')

module.exports = function (options) {
  const router = express.Router()
  const auth = new Auth(options)
  const studentController = new Controller(options)

  router.get('/ping', studentController.ping, format)
  router.get(
    '/',
    auth.canAccessApi,
    studentController.student,
    studentController.authorize,
    scopeAuthorization,
    format
  )

  return router
}
