var StandardError = require('standard-error');
var Redis = require('ioredis');


module.exports = CafController;

function CafController(options) {
  options = options || {};
  logger = options.logger;

  this.getUsers = function(req, res, next) {
    if(isNotAdmin(req)) {
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

  this.createUsers = function(req, res, next) {
    if(isNotAdmin(req)) {
      return next(new StandardError('Vous n\'être pas administrateur', {code: 403}));
    }
    logger.debug('body = ' + JSON.stringify(req.body));
    options.usersService.createUser(JSON.stringify(req.body), function(err, result) {
      if(err) {
        logger.error(err);
        return next(err)
      }
      res.status(201);
      res.send(result)
    });
  }

  function isNotAdmin(req) {
    return req.userConnected.role && req.userConnected.role !== 'admin';
  }
}
