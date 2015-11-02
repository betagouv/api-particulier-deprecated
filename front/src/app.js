import 'bootstrap/dist/css/bootstrap.css';

import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './app.config';
import landingPage from './features/landingPage';

angular.module('app', [uirouter, landingPage])
  .config(routing);
