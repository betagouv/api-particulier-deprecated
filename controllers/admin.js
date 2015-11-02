var StandardError = require('standard-error');

module.exports = CafController;

function CafController(options) {
  options = options || {};


  this.getUsers = function(req, res, next) {
    if(req.userConnected.role && req.userConnected.role !== 'admin') {
      return next(new StandardError('Vous n\'être pas administrateur', {code: 403}));
    }
    res.send({})
  }
}
