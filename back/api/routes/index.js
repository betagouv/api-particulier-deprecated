var SystemController = require('../system/system.controller');

const admin = require('./../admin')
const caf = require('./../caf')
const impots = require('./../impots')

exports.configure = function (app, options) {

  var systemController = new SystemController(options);

  app.get('/api/ping', systemController.ping);

  app.use('/api/impots', impots(options));

  app.use('/api/admin', admin(options));

  app.use('/api/caf', caf(options));
};
