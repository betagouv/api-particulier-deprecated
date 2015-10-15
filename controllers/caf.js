var StandardError = require('standard-error');
var CafService = require('../lib/services/caf')

module.exports = CafController;

function CafController(options) {
  options = options || {};
  var logger = options.logger;
  var cafService = new CafService(options)

  this.attestation = function(req, res, next) {
    res.append("Content-Type", "application/pdf")
    cafService.attestation(function(err, data) {
      logger.debug(err)
      if(err) return next(new StandardError("impossible de contacter la CAF", {code: 500}));
      res.send(data)
      res.end()
    })
  }
}
