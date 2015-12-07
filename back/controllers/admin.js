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

  this.createUser = function(req, res, next) {
    if(isNotAdmin(req)) {
      return next(new StandardError('Vous n\'être pas administrateur', {code: 403}));
    }
    logger.debug('body = ' + JSON.stringify(req.body));
    options.usersService.createUser(req.body, function(err, result) {
      if(err) {
        logger.error(err);
        return next(err)
      }
      res.status(201);
      res.send(result)
    });
  }

  this.deleteUser = function(req, res, next) {
    if(isNotAdmin(req)) {
      return next(new StandardError('Vous n\'être pas administrateur', {code: 403}));
    }
    options.usersService.deleteUser(req.params.name, function(err, result) {
      if(err) {
        logger.error(err);
        return next(err)
      }
      if(result) {
        res.status(204);
      } else {
        res.status(404);
      }
      res.end();
    });
  }

  function isNotAdmin(req) {
    return req.userConnected.role && req.userConnected.role !== 'admin';
  }
}
