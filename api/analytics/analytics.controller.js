'use strict'

const Service = require('./analytics.service')
const StandardError = require('standard-error')

function AnalyticsController (options) {
  this.service = new Service(options)
  this.requestsLast30days = (req, res, next) => {
    this.service.getRequestFromtheLastXdays(31)
      .then((result) => res.json(result))
      .catch((error) => {
        req.log.error({ error }, 'Got error while gathering analytics')
        next(new StandardError('impossible to gather data', {code: 500}))
      })
  }
}

module.exports = AnalyticsController
