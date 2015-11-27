"use strict";

const svair = require('svair-api')
const StandardError = require('standard-error');
const SvairBanService = require('./../lib/services/svairBan')
const js2xmlparser = require('js2xmlparser')

function ImpotController(options) {
    var options = options || {}
    var svairBanService = new SvairBanService(options)

  this.adress = function(req, res, next) {
    var numeroFiscal = req.query.numeroFiscal;
    var referenceAvis = req.query.referenceAvis;
    if (!numeroFiscal || !referenceAvis) {
      return next(new StandardError('Les paramètres numeroFiscal et referenceAvis doivent être fournis dans la requête.', {code: 400}));
    } else {
      svairBanService.getAdress(numeroFiscal, referenceAvis, (err, data) => {
        if(err) return next(err)
        return res.format({
          'application/json': function(){
             res.json(data)
          },

          'application/xml': function(){
            res.send(js2xmlparser("result", data))
          },
          'default': function() {
            res.status(406).send('Not Acceptable');
          }
        });
      })

    }
  }

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
