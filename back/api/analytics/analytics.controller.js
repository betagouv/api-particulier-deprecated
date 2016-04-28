'use strict';

const format = require('./../lib/utils/format')
const Service = require('./analytics.service')
const StandardError = require('standard-error');

class AnalyticsController {
  constructor(options) {
    this.service = new Service(options)
  }

  requestsLast30days(req, res, next) {
    this.service.getRequestFromtheLastXdays(31)
      .then((result) => {
        format(res, result)
      }, () => {
        next(new StandardError('impossible to gather data', {code: 500}))
      })
  }
}

module.exports = AnalyticsController;
