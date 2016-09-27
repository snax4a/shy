'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './teachers.routes';

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

export default angular.module('shyApp.teachers', [uiRouter])
  .config(routes)
  .component('teachers', {
    template: require('./teachers.pug'),
    controller: TeachersComponent
  })
  .name;
