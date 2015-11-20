"use strict";


const StandardError = require('standard-error');
const _ = require('lodash');




module.exports =
 function(usersService) {
   return function isAuthorized(req, res, next) {
   var token = req.get('X-API-Key') || ""

   usersService.getUsers(function(err, results) {
     if(err) {
       req.logger.error(err);
       return next(err)
     }
     req.logger.debug({ event: 'authorization' }, JSON.stringify(results));
     var userConnected = _.find(results, {token: token})
     if(userConnected) {
       req.logger.debug({ event: 'authorization' }, userConnected.name + ' is authorized ('+ userConnected.role+')');
       req.userConnected = userConnected;
       next()
     } else {
       req.logger.debug({ event: 'authorization' }, 'not authorized');
       next(new StandardError('You are not authorized to use the api', {code: 401}));
     }
   })
 }

}
