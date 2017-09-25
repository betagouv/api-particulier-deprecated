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
  }
  ping (req, res, next) {
    res.data = 'pong'
    return next()
  }

  swagger (req, res) {
    return res.send(definition)
  }

  introspect (req, res, next) {
    return this.dbTokenService.getToken(req.query['token']).then((result) => {
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
