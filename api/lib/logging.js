const bunyan = require('bunyan')
const bunyanFormat = require('bunyan-format')

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
    stream: bunyanFormat({
      outputMode: nconf.get('log:format')
    })
  }, {
    path: '/var/log/api-particulier/api-particulier.log'
  }]
  return streams
}
