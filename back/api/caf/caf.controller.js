'use strict';

const StandardError = require('standard-error');
const CafService = require('./caf.service');
const format = require('./../lib/utils/format')


module.exports = CafController;

function CafController(options) {
  options = options || {};
  var cafService = new CafService(options)



  this.ping = function(req, res, next) {
    var codePostal = options.codePostal;
    var numeroAllocataire = options.numeroAllocataire;
    cafService.getFamily(codePostal, numeroAllocataire, (err) => {
      if(err) return next(err);
      return format(res, 'pong')
    })
  }

  this.getQf = function(req, res, next) {
    var codePostal = req.query.codePostal;
    var numeroAllocataire = req.query.numeroAllocataire;
    cafService.getQf(codePostal, numeroAllocataire, (err, data) => {
      if(err) return next(err);
      if(data.quotientFamilial === 0) {
        return next(new StandardError('Pas de QF sur cette période', {code: 404}))
      }
      return format(res, data)
    })
  }

  this.getAdress = function(req, res, next) {
    var codePostal = req.query.codePostal;
    var numeroAllocataire = req.query.numeroAllocataire;
    cafService.getAdress(codePostal, numeroAllocataire, (err, data) => {
      if(err) return next(err);
      return format(res, data)
    })
  }

  this.getFamily = function(req, res, next) {
    var codePostal = req.query.codePostal;
    var numeroAllocataire = req.query.numeroAllocataire;
    cafService.getFamily(codePostal, numeroAllocataire, (err, data) => {
      if(err) return next(err);
      return format(res, data)
    })
  }
}
