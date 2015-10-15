var SystemController = require('../controllers/system');
var ImpotsController = require('../controllers/impots');
var CafController = require('../controllers/caf');

exports.configure = function (app) {
  var options = {
    logger: app.get('logger')
  }
  var systemController = new SystemController();
  var impotsController = new ImpotsController();
  var cafController = new CafController(options);


  app.get('/api/ping', systemController.ping);
  app.get('/api/impots/svair', impotsController.svair);
  app.get('/api/caf/attestation', cafController.attestation);


};
