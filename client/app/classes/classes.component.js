'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routes from './classes.routes';

export class ClassesController {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
  }

  $onInit() {
    this.$http.get('/assets/data/classes.json')
      .then(response => {
        this.classes = response.data;
        return null;
      });
    this.$http.get('/api/schedule')
      .then(response => {
        this.classSchedule = response.data;
        return null;
      });
  }
}

export default angular.module('shyApp.classes', [uiRouter])
  .config(routes)
  .component('classes', {
    template: require('./classes.pug'),
    controller: ClassesController
  })
  .name;
