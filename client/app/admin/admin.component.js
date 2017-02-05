'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routes from './admin.routes';
import AdminController from './admin.controller';

export default angular.module('shyApp.admin', ['shyApp.auth', uiRouter])
  .config(routes)
  .component('admin', {
    template: require('./admin.pug'),
    controller: AdminController
  })
  .name;
