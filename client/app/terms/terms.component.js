'use strict';
import angular from 'angular';
import routes from './terms.routes';

export class TermsComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('shyApp.terms', [])
  .config(routes)
  .component('terms', {
    template: require('./terms.pug'),
    controller: TermsComponent
  })
  .name;
