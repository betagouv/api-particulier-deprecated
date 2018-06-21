var util = require('util')
var StandardError = require('standard-error')

module.exports = MissingError

util.inherits(MissingError, StandardError)
MissingError.prototype.name = 'MissingError'

function MissingError (resourceType) {
  StandardError.call(this, util.format('%s is missing', resourceType), {
    code: 404
  })
}
