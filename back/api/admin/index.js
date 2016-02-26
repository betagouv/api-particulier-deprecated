
const express = require('express');
const Controller = require('./admin.controller');
const Auth = require('../../auth/token');

const router = express.Router();

module.exports = function(options){
  const adminController = new Controller(options);
  const auth = new Auth(options);

  router.get('/users', auth.canAccessAdminFunction, adminController.getTokens);
  router.post('/users', auth.canAccessAdminFunction, adminController.createToken);
  router.delete('/users/:name', auth.canAccessAdminFunction, adminController.deleteToken);

  return router
}
