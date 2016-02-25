var SystemController = require('../system/system.controller');
var ImpotsController = require('../impots/impots.controller');
var CafController = require('../caf/caf.controller');
const admin = require('./../admin')

exports.configure = function (app, options) {

  var systemController = new SystemController(options);
  var impotsController = new ImpotsController(options);

  var cafController = new CafController(options);

  app.get('/api/ping', systemController.ping);
  app.get('/api/impots/svair', impotsController.svair);
  app.get('/api/ping/impots', impotsController.ping);
  app.get('/api/impots/adress', impotsController.adress);
  app.get('/api/caf/attestation/qf', cafController.attestationQf);
  app.get('/api/caf/qf', cafController.getQf);
  app.get('/api/caf/adresse', cafController.getAdress);
  app.get('/api/caf/famille', cafController.getFamily);
  app.get('/api/caf/attestation/droits', cafController.attestationDroits);
  app.get('/api/ping/caf', cafController.ping);

  app.use('/api/admin', admin(options));
};
