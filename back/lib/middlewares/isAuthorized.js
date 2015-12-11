"use strict";


const StandardError = require('standard-error');
const unless = require('express-unless')

module.exports =
 function(usersService) {
   const middleware =  function isAuthorized(req, res, next) {
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
 middleware.unless = unless
 return middleware;
}
