'use strict'

const fs = require('fs')
const path = require('path')
const definition = fs.readFileSync(path.join(__dirname, '../../swagger.yaml'))

class SystemController {
  ping (req, res, next) {
    res.data = 'pong'
    return next()
  }

  swagger (req, res) {
    return res.send(definition)
  }
}

module.exports = SystemController
