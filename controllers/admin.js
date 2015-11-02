var StandardError = require('standard-error');
var Redis = require('ioredis');


module.exports = CafController;

function CafController(options) {
  options = options || {};
  logger = options.logger;

  this.getUsers = function(req, res, next) {
    if(req.userConnected.role && req.userConnected.role !== 'admin') {
      return next(new StandardError('Vous n\'être pas administrateur', {code: 403}));
    }
    options.usersService.getUsers(function(err, results) {
      if(err) {
        logger.error(err);
        return next(err)
      }
      res.send(results)
    });
  }
}
