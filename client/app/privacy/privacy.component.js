'use strict';
import angular from 'angular';
import routes from './privacy.routes';
import ngRoute from 'angular-route';

export class PrivacyController {
  /*@ngInject*/
}

export default angular.module('shyApp.privacy', [ngRoute])
  .config(routes)
  .component('privacy', {
    template: require('./privacy.pug'),
    controller: PrivacyController
  })
  .name;
