'use strict'

class SystemController {
  ping (req, res, next) {
    res.data = 'pong'
    return next()
  }
}

module.exports = SystemController
