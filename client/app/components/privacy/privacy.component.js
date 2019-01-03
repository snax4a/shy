'use strict';
import angular from 'angular';
import routes from './privacy.routes';
import ngRoute from 'angular-route';

export class PrivacyComponent {
  /*@ngInject*/
  constructor() {}

  $onInit() {}
}

export default angular.module('shyApp.privacy', [ngRoute])
  .config(routes)
  .component('privacy', {
    template: require('./privacy.pug'),
    controller: PrivacyComponent
  })
  .name;
