'use strict';
import angular from 'angular';
import routes from './teachers.routes';
//import uiRouter from 'angular-ui-router';

export class TeachersComponent {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
  }

  $onInit() {
    this.$http.get('/assets/data/teachers.json')
      .then(response => {
        // Use faculty so as to not conflict with component name
        this.faculty = response.data;
      });
  }
}

export default angular.module('shyApp.teachers', [])
  .config(routes)
  .component('teachers', {
    template: require('./teachers.pug'),
    controller: TeachersComponent
  })
  .name;
