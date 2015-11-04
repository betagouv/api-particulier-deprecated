import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './admin.routes';
import AdminController from './admin.controller';

import UserService from './user.service'


export default angular.module('app.admin', [uirouter, UserService])
  .config(routing)
  .controller('AdminController', AdminController)
  .name;
