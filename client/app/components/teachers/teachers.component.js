'use strict';
import angular from 'angular';
import routes from './teachers.routes';
import ngRoute from 'angular-route';
import HtmlIdFilter from '../../filters/htmlid/htmlid.filter';
import NoSubsFilter from '../../filters/nosubs/nosubs.filter';

export class TeachersComponent {
  /*@ngInject*/
  constructor($http, $anchorScroll, $timeout) {
    this.$http = $http;
    this.$anchorScroll = $anchorScroll;
    this.$timeout = $timeout;
  }

  $onInit() {
    // Load faculty from JSON asynchronously to reduce initial load by 23K
    this.$http.get('/assets/data/teachers.json')
      .then(response => {
        this.faculty = response.data;
        this.$timeout(this.$anchorScroll, 50);
        return null;
      });
  }
}

export default angular.module('shyApp.teachers', [ngRoute, HtmlIdFilter, NoSubsFilter])
  .config(routes)
  .component('teachers', {
    template: require('./teachers.pug'),
    controller: TeachersComponent
  })
  .name;
