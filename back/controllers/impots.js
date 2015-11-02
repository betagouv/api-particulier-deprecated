var svair = require('svair-api')
var StandardError = require('standard-error');

module.exports = SystemController;

function SystemController(options) {
  options = options || {};

  this.svair = function(req, res, next) {
    var numeroFiscal = req.query.numeroFiscal;
    var referenceAvis = req.query.referenceAvis;
    if (!numeroFiscal || !referenceAvis) {
        return next(new StandardError('Les paramètres numeroFiscal et referenceAvis doivent être fournis dans la requête.', {code: 400}));
    } else {
        svair(numeroFiscal, referenceAvis, function (err, result) {
            if (err && err.message === 'Invalid credentials') {
                next(new StandardError('Les paramètres fournis sont incorrects ou ne correspondent pas à un avis', {code: 404}));
            } else if (err) {
              next(new StandardError(err.message, {code: 500}));
            } else {
                res.send(result);
            }
        });
    }
  }

}
