'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routes from './shynet.routes';

export class SHYnetController {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
  }

  $onInit() {
  }
}

export default angular.module('shyApp.shynet', [uiRouter])
  .config(routes)
  .component('shynet', {
    template: require('./shynet.pug'),
    controller: SHYnetController
  })
  .name;
