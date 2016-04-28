'use strict';

const format = require('./../lib/utils/format')

class AnalyticsController {

  requestsLast30days(req, res) {
    return format(res, 'pong')
  }
}

module.exports = AnalyticsController;
