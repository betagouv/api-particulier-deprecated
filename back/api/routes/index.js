var SystemController = require('../controllers/system');
var ImpotsController = require('../impots/impots.controller');
var CafController = require('../caf/caf.controller');
var AdminController = require ('../controllers/admin')
exports.configure = function (app, options) {

  var systemController = new SystemController(options);
  var impotsController = new ImpotsController(options);

  var adminOptions = {
    usersService: app.get('usersService'),
    logger: app.get('logger')
  }
  var adminController = new AdminController(adminOptions);
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
  app.get('/api/admin/users', adminController.getUsers);
  app.post('/api/admin/users', adminController.createUser);
  app.delete('/api/admin/users/:name', adminController.deleteUser);


};
