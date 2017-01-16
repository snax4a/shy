'use strict';

import angular from 'angular';
import NavbarController from './navbar.controller';

export default angular.module('shyApp.navbar', [])
  .component('navbar', {
    template: require('./navbar.pug'),
    controller: NavbarController
  })
  .name;
