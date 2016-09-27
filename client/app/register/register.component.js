'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './register.routes';

export class RegisterComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('shyApp.register', [uiRouter])
  .config(routes)
  .component('register', {
    template: require('./register.pug'),
    controller: RegisterComponent
  })
  .name;
