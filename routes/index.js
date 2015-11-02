var SystemController = require('../controllers/system');
var ImpotsController = require('../controllers/impots');
var CafController = require('../controllers/caf');
var AdminController = require ('../controllers/admin')
exports.configure = function (app) {

  var systemController = new SystemController();
  var impotsController = new ImpotsController();

  var adminOptions = {
    usersService: app.get('usersService'),
    logger: app.get('logger')
  }
  var adminController = new AdminController(adminOptions);

  var cafOptions = {
    logger: app.get('logger'),
    cafHost: app.get('cafHost'),
    cafSslCertificate: app.get('cafSslCertificate'),
    cafSslKey: app.get('cafSslKey'),
  }
  var cafController = new CafController(cafOptions);

  app.get('/api/ping', systemController.ping);
  app.get('/api/impots/svair', impotsController.svair);
  app.get('/api/caf/attestation', cafController.attestation);
  app.get('/api/admin/users', adminController.getUsers);
  app.post('/api/admin/users', adminController.createUsers);


};
