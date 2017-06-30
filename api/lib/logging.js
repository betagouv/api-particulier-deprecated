const bunyan = require('bunyan')
const bunyanFormat = require('bunyan-format')
const BunyanElasticsearch = require('bunyan-elasticsearch')

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
  }]
  if (nconf.get('es:host')) {
    streams.push({
      stream: new BunyanElasticsearch({
        indexPattern: nconf.get('es:indexPattern'),
        host: nconf.get('es:host')
      })
    })
  }
  return streams
}
