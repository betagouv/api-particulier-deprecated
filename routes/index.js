var SystemController = require('../controllers/system');
var ImpotsController = require('../controllers/impots');

exports.configure = function (app) {

  var systemController = new SystemController();
  var impotsController = new ImpotsController();


  app.get('/api/ping', systemController.ping);
  app.get('/api/impots/svair', impotsController.svair);

};
