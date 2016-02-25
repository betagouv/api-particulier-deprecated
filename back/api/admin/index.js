
const express = require('express');
const Controller = require('./admin.controller');
const Auth = require('../../auth/token');

const router = express.Router();

module.exports = function(options){
  const adminController = new Controller(options);
  const auth = new Auth(options.usersService);

  router.get('/users', auth.canAccessAdminFunction, adminController.getUsers);
  router.post('/users', auth.canAccessAdminFunction, adminController.createUser);
  router.delete('/users/:name', auth.canAccessAdminFunction, adminController.deleteUser);

  return router
}
