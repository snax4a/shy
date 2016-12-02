'use strict';
import angular from 'angular';
import routes from './teachers.routes';
import uiRouter from 'angular-ui-router';
import teachers from '../../assets/data/teachers.json';

export class TeachersController {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
  }

  $onInit() {
    // Load teachers from JSON
    this.faculty = teachers;
  }
}

export default angular.module('shyApp.teachers', [uiRouter])
  .config(routes)
  .component('teachers', {
    template: require('./teachers.pug'),
    controller: TeachersController
  })
  .name;
