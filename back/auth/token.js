'use strict';

const StandardError = require('standard-error');
const compose = require('composable-middleware');

module.exports = Auth

function Auth(usersService) {

  this.canAccessApi = function(req, res, next) {
    var token = req.get('X-API-Key') || ""

    usersService.getUser(token, (err, result) => {
      if(err) {
       req.logger.warn(err);
       return next(err)
      }
      if(result) {
       req.logger.debug({ event: 'authorization' }, result.name + ' is authorized ('+ result.role+')');
       req.consumer = result;
       next()
      } else {
       req.logger.debug({ event: 'authorization' }, 'not authorized');
       req.consumer= {}
       next(new StandardError('You are not authorized to use the api', {code: 401}));
      }
    })
  }

  var canAccesAdmin = function(req, res, next) {
    if(req.consumer.role && req.consumer.role !== 'admin') {
      next(new StandardError('Vous n\'être pas administrateur', {code: 403}));
    } else {
      next()
    }
  }

  this.canAccessAdminFunction = compose()
      .use(this.canAccessApi)
      .use(canAccesAdmin)
}
