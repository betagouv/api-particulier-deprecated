const bunyan = require('bunyan')

exports.createLogger = function (nconf, id = '') {
  const logger = bunyan.createLogger({
    name: nconf.get('appname') + id,
    level: nconf.get('log:level'),
    streams: exports._streams(nconf),
    serializers: {
      req: reqSerializer,
      res: bunyan.stdSerializers.res,
      err: bunyan.stdSerializers.err
    }
  })
  return logger
}

function reqSerializer (req) {
  return {
    method: req.method,
    url: req.url.replace(/\?(.+)/, ''),
    headers: req.headers,
    remoteAddress: req.connection.remoteAddress,
    remotePort: req.connection.remotePort
  }
}

exports._streams = function (nconf) {
  const streams = [{
    type: 'rotating-file',
    period: '7d',
    count: 108,
    path: nconf.get('logginPath')
  }]
  return streams
}
