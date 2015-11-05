import 'lodash'

import angular from 'angular';
import angularCookies from 'angular-cookies';
import uirouter from 'angular-ui-router';

import routing from './admin.routes';
import UserController from './user/user.controller';
import LoginController from './login/login.controller';

import UserService from './user/user.service'


export default angular.module('app.admin', [uirouter, angularCookies, UserService])
  .config(routing)
  .controller('UserController', UserController)
  .controller('LoginController', LoginController)
  .name;
