'use strict';
import angular from 'angular';
import routes from './terms.routes';

export class TermsController {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('shyApp.terms', [])
  .config(routes)
  .component('terms', {
    template: require('./terms.pug'),
    controller: TermsController
  })
  .name;
