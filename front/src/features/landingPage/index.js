import 'jquery';

import './css/landingPage.css';
import './css/main.css';
import './css/landingPage.css';
require('font-awesome/css/font-awesome.css');

require('./charte.pdf')

require('highlight.js/styles/github.css')
var hljs = require('highlight.js/lib/highlight')
hljs.registerLanguage('bash', require('highlight.js/lib/languages/bash'));
hljs.registerLanguage('json', require('highlight.js/lib/languages/json'));
hljs.initHighlightingOnLoad();

import angular from 'angular';
import uirouter from 'angular-ui-router';

import routing from './landingPage.routes';


export default angular.module('app.landingPage', [uirouter])
  .config(routing)
  .name;
