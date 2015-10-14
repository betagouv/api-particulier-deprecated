var SystemController = require('../controllers/system');

exports.configure = function (app) {

  var systemController = new SystemController();


  app.get('/api/ping', systemController.ping);

};
