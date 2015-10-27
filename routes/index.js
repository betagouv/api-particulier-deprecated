var SystemController = require('../controllers/system');
var ImpotsController = require('../controllers/impots');
var CafController = require('../controllers/caf');

exports.configure = function (app) {
  var options = {
    logger: app.get('logger'),
    cafHost: app.get('cafHost'),
    cafSslCertificate: app.get('cafSslCertificate'),
    cafSslKey: app.get('cafSslKey'),
  }
  var systemController = new SystemController();
  var impotsController = new ImpotsController();
  var cafController = new CafController(options);

  app.get('/api/ping', systemController.ping);
  options.logger.debug('route', '/api/ping registered');
  app.get('/api/impots/svair', impotsController.svair);
  options.logger.debug('route', '/api/impots/svair registered');
  app.get('/api/caf/attestation', cafController.attestation);
  options.logger.debug('route', '/api/caf/attestation registered');


};
