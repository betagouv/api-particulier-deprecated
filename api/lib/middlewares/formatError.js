'use strict'
const StandardError = require('standard-error')
const http = require('http')
const js2xmlparser = require('js2xmlparser')

module.exports = function (err, req, res, next) {
  req.logger.error({error: err}, err.message)
  if (err.code) {
    if (err instanceof StandardError) {
      let error = {
        error: http.STATUS_CODES[err.code].toLowerCase().split(' ').join('_'),
        reason: err.message,
        message: err.message
      }
      return res.format({
        'application/json': function () {
          res.status(err.code).json(error)
        },

        'application/xml': function () {
          res
            .status(err.code)
            .send(js2xmlparser('error', error))
        },
        'default': function () {
          res
            .status(err.code)
            .send(error.reason)
        }
      })
    }
  }
  next(err)
}
