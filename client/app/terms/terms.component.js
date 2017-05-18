'use strict';
import angular from 'angular';
import routes from './terms.routes';
import ngRoute from 'angular-route';

export class TermsController {
  /*@ngInject*/
}

export default angular.module('shyApp.terms', [ngRoute])
  .config(routes)
  .component('terms', {
    template: require('./terms.pug'),
    controller: TermsController
  })
  .name;
