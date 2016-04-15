'use strict';

const format = require('./../lib/utils/format')

class SystemController {

  ping(req, res) {
    return format(res, 'pong')
  }
}

module.exports = SystemController;
