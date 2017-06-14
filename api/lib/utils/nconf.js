const nconf = require('nconf')

nconf.env({
  separator: '_'
}).argv()
nconf.defaults(require('../../../defaults'))

module.exports = nconf
