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
    this.$http.get('/assets/data/teachers.json')
      .then(response => {
        this.teachers = response.data;
        return null;
      });
    this.$http.get('/assets/data/classes.json')
      .then(response => {
        this.classes = response.data;
        return null;
      });
    this.$http.get('/assets/data/locations.json')
      .then(response => {
        this.locations = response.data;
        return null;
      });
  }
}

export default angular.module('shyApp.shynet', [uiRouter])
  .config(routes)
  .component('shynet', {
    template: require('./shynet.pug'),
    controller: SHYnetController
  })
  .name;
