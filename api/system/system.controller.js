'use strict'

const fs = require('fs')
const path = require('path')
const format = require('./../lib/utils/format')
const definition = fs.readFileSync(path.join(__dirname, '../../swagger.yaml'))

class SystemController {
  ping (req, res) {
    return format(res, 'pong')
  }

  swagger (req, res) {
    return res.send(definition)
  }
}

module.exports = SystemController
