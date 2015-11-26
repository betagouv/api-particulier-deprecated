"use strict";

var svair = require('svair-api')
var StandardError = require('standard-error');
var js2xmlparser = require("js2xmlparser");

class ImpotController {

  constructor(options) {
    this.options = options || {}
  }

  adress(req, res, next) {
    var numeroFiscal = req.query.numeroFiscal;
    var referenceAvis = req.query.referenceAvis;
    if (!numeroFiscal || !referenceAvis) {
      return next(new StandardError('Les paramètres numeroFiscal et referenceAvis doivent être fournis dans la requête.', {code: 400}));
    } else {
      next()
    }
  }

  svair(req, res, next) {
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
          return res.format({
            'application/json': function(){
               res.json(result)
            },

            'application/xml': function(){
              res.send(js2xmlparser("result", result))
            },
            'default': function() {
              res.status(406).send('Not Acceptable');
            }
          });
        }
      });
    }
  }
}

module.exports = ImpotController;
