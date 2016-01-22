"use strict";

const StandardError = require('standard-error');
const CafService = require('../lib/services/caf');
const fs = require('fs')
const iconv = require('iconv-lite');
const format = require('./../lib/utils/format')


module.exports = CafController;

function CafController(options) {
  options = options || {};
  var logger = options.logger;
  var cafService = new CafService(options)

  this.getAttestation = function(name) {
    return function(req, res, next) {
      res.append("Content-Type", "application/pdf")
      var codeOrganisme = req.query.codeOrganisme || 148;
      var numeroAllocataire = req.query.numeroAllocataire || 354;
      cafService.attestation(codeOrganisme, numeroAllocataire, name, function(err, data) {
        logger.debug(err)
        if(err) return next(new StandardError("impossible de contacter la CAF", {code: 500}));
        res.send(data);
      })
    }
  }

  this.attestationQf = this.getAttestation("qf")
  this.attestationDroits = this.getAttestation("droits")

  this.ping = function(req, res, next) {
    cafService.attestation(148, 354, "qf", function(err, data) {
      if(err) return next(new StandardError("impossible de contacter la CAF", {code: 500}));
      return format(res, 'pong')
    })
  }
}
