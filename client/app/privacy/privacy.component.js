'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

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
