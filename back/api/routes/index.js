var SystemController = require('../system/system.controller');
var ImpotsController = require('../impots/impots.controller');

const admin = require('./../admin')
const caf = require('./../caf')

exports.configure = function (app, options) {

  var systemController = new SystemController(options);
  var impotsController = new ImpotsController(options);

  app.get('/api/ping', systemController.ping);
  app.get('/api/impots/svair', impotsController.svair);
  app.get('/api/ping/impots', impotsController.ping);
  app.get('/api/impots/adress', impotsController.adress);


  app.use('/api/admin', admin(options));

  app.use('/api/caf', caf(options));
};
