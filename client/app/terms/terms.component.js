'use strict';
import angular from 'angular';
import routes from './terms.routes';
import uiRouter from 'angular-ui-router';

export class TermsController {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('shyApp.terms', [uiRouter])
  .config(routes)
  .component('terms', {
    template: require('./terms.pug'),
    controller: TermsController
  })
  .name;
