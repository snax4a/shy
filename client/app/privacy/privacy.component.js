'use strict';
import angular from 'angular';
import routes from './privacy.routes';
//import uiRouter from 'angular-ui-router';

export class PrivacyComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('shyApp.privacy', [])
  .config(routes)
  .component('privacy', {
    template: require('./privacy.pug'),
    controller: PrivacyComponent
  })
  .name;
