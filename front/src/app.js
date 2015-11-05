import 'bootstrap/dist/css/bootstrap.css';

import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './app.config';
import landingPage from './features/landingPage';
import admin from './features/admin';

angular.module('app', [uirouter, landingPage, admin])
  .config(routing);
