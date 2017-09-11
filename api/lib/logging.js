const bunyan = require('bunyan')

exports.createLogger = function (nconf, id = '') {
  const logger = bunyan.createLogger({
    name: nconf.get('appname') + id,
    level: nconf.get('log:level'),
    streams: exports._streams(nconf),
    serializers: bunyan.stdSerializers
  })
  return logger
}

exports._streams = function (nconf) {
  const streams = [{
    type: 'rotating-file',
    period: '7d',
    count: 108,
    path: '/var/log/api-particulier/api-particulier.log'
  }]
  return streams
}
