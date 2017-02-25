'use strict';
import angular from 'angular';
import ngResource from 'angular-resource';
import uiRouter from 'angular-ui-router';
import routes from './admin.routes';
import AdminController from './admin.controller';
import AuthModule from '../../components/auth/auth.module';
import uiBootstrap from 'angular-ui-bootstrap';

export default angular.module('shyApp.admin', [uiRouter, AuthModule, uiBootstrap, ngResource])
  .config(routes)
  .component('admin', {
    template: require('./admin.pug'),
    controller: AdminController
  })
  .name;
