'use strict';
import angular from 'angular';
import routes from './teachers.routes';
import uiRouter from 'angular-ui-router';
//import teachers from '../../assets/data/teachers.json'; // not needed for async approach

export class TeachersController {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
  }

  $onInit() {
    // Load faculty from JSON asynchronously
    // In theory, this should cut 23K from the initial load
    this.$http.get('/assets/data/teachers.json')
      .then(response => {
        this.faculty = response.data;
        return null;
      });

    // Load faculty from JSON synchronously
    //this.faculty = teachers;
  }
}

export default angular.module('shyApp.teachers', [uiRouter])
  .config(routes)
  .component('teachers', {
    template: require('./teachers.pug'),
    controller: TeachersController
  })
  .name;
