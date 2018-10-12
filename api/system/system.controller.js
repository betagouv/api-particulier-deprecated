'use strict'

const StandardError = require('standard-error')
const DbTokenService = require('../../auth/db-tokens.service')

class SystemController {
  constructor (options) {
    this.dbTokenService = new DbTokenService(options)
    this.dbTokenService.initialize()
    this.options = options
  }
  ping (req, res, next) {
    res.data = 'pong'
    return next()
  }

  introspect (req, res, next) {
    const token = req.query.token
    return this.dbTokenService.getConsumer({ token }).then((result) => {
      if (result) {
        res.data = result
        next()
      } else {
        next(new StandardError('Token not found', {code: 404}))
      }
    })
  }
}

module.exports = SystemController
