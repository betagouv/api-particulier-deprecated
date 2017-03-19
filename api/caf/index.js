
const express = require('express');
const Controller = require('./caf.controller');
const Auth = require('../../auth/token')

const router = express.Router();

module.exports = function(options){
  const cafController = new Controller(options);
  const auth = new Auth(options)

  router.get('/qf', auth.canAccessApi, cafController.getQf);
  router.get('/adresse', auth.canAccessApi, cafController.getAdress);
  router.get('/famille', auth.canAccessApi, cafController.getFamily);
  router.get('/attestation/droits', auth.canAccessApi, cafController.attestationDroits);
  router.get('/attestation/qf', auth.canAccessApi, cafController.attestationQf);
  router.get('/ping', cafController.ping);

  return router
}
