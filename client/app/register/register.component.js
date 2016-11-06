'use strict';
import angular from 'angular';
import routes from './register.routes';
//import uiRouter from 'angular-ui-router';

export class RegisterController {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('shyApp.register', [])
  .config(routes)
  .component('register', {
    template: require('./register.pug'),
    controller: RegisterController
  })
  .name;
