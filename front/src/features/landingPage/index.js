import 'jquery';

import './css/landingPage.css';
import './css/main.css';
import './css/landingPage.css';
require('font-awesome/css/font-awesome.css');



import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './landingPage.routes';


export default angular.module('app.landingPage', [uirouter])
  .config(routing)
  .name;
