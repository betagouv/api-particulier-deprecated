
var express = require('express');
var Controller = require('./caf.controller');

var router = express.Router();

module.exports = function(options){
  var cafController = new Controller(options);

  router.get('/qf', cafController.getQf);
  router.get('/adresse', cafController.getAdress);
  router.get('/famille', cafController.getFamily);
  router.get('/attestation/droits', cafController.attestationDroits);
  router.get('/attestation/qf', cafController.attestationQf);
  router.get('/ping', cafController.ping);

  return router
}
