'use strict'

const format = require('./../lib/utils/format')
const fs = require('fs')
const definition = fs.readFileSync(__dirname + '/../../swagger.yaml')

class SystemController {
  ping (req, res) {
    return format(res, 'pong')
  }

  swagger (req, res) {
    return res.send(definition)
  }
}

module.exports = SystemController
