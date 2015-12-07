"use strict";


const StandardError = require('standard-error');


module.exports =
 function(usersService) {
   return function isAuthorized(req, res, next) {
   var token = req.get('X-API-Key') || ""

   usersService.getUser(token, (err, result) => {
     if(err) {
       req.logger.error(err);
       return next(err)
     }
     if(result) {
       req.logger.debug({ event: 'authorization' }, result.name + ' is authorized ('+ result.role+')');
       req.userConnected = result;
       next()
     } else {
       req.logger.debug({ event: 'authorization' }, 'not authorized');
       next(new StandardError('You are not authorized to use the api', {code: 401}));
     }
   })
 }

}
