'use strict';
import angular from 'angular';
import routes from './teachers.routes';
import ngRoute from 'angular-route';
import HtmlIdFilter from '../../filters/htmlid/htmlid.filter';
import NoSubsFilter from '../../filters/nosubs/nosubs.filter';

export class TeachersController {
  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
  }

  $onInit() {
    // Load faculty from JSON asynchronously to reduce initial load by 23K
    this.$http.get('/assets/data/teachers.json')
      .then(response => {
        this.faculty = response.data;
        return null;
      });
  }
}

export default angular.module('shyApp.teachers', [ngRoute, HtmlIdFilter, NoSubsFilter])
  .config(routes)
  .component('teachers', {
    template: require('./teachers.pug'),
    controller: TeachersController
  })
  .name;
