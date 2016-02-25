
const express = require('express');
const Controller = require('./admin.controller');
const Auth = require('../../auth/auth');

const router = express.Router();

module.exports = function(options){
  const adminController = new Controller(options);
  const auth = new Auth(options.usersService);

  router.get('/users', auth.canAccessApi, auth.canAccessAdminFunction, adminController.getUsers);
  router.post('/users', auth.canAccessApi, auth.canAccessAdminFunction, adminController.createUser);
  router.delete('/users/:name', auth.canAccessApi, auth.canAccessAdminFunction, adminController.deleteUser);

  return router
}
