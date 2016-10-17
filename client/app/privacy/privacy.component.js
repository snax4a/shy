'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routes from './privacy.routes';

export class PrivacyComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('shyApp.privacy', [uiRouter])
  .config(routes)
  .component('privacy', {
    template: require('./privacy.pug'),
    controller: PrivacyComponent
  })
  .name;
