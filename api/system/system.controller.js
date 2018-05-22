'use strict'

const StandardError = require('standard-error')
const fs = require('fs')
const path = require('path')
const definition = fs.readFileSync(path.join(__dirname, '../../swagger.yaml'))
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

  swagger (req, res) {
    return res.send(definition)
  }

  introspect (req, res, next) {
    if (this.options.mockIntrospect) {
      if (req.query['token'] === 'test-token') {
        res.data = {
          '_id': 'test-token',
          'name': 'test-token',
          'email': 'test@test.test'
        }
        next()
      } else {
        next(new StandardError('Token not found', {code: 404}))
      }
    } else {
      return this.dbTokenService.getConsumer(req).then((result) => {
        if (result) {
          res.data = result
          next()
        } else {
          next(new StandardError('Token not found', {code: 404}))
        }
      })
    }
  }
}

module.exports = SystemController
