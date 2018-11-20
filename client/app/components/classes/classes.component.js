'use strict';
import angular from 'angular';
import ngRoute from 'angular-route';
import routes from './classes.routes';
import AmPmFilter from '../../filters/ampm/ampm.filter';
import DayToDateFilter from '../../filters/daytodate/daytodate.filter';
import HtmlIdFilter from '../../filters/htmlid/htmlid.filter';

export class ClassesComponent {
  /*@ngInject*/
  constructor($http, $anchorScroll, $timeout) {
    this.$http = $http;
    this.$anchorScroll = $anchorScroll;
    this.$timeout = $timeout;
  }

  $onInit() {
    const getClasses = this.$http.get('/assets/data/classes.json')
      .then(response => {
        this.classes = response.data;
        return null;
      });
    const getSchedule = this.$http.get('/api/schedule')
      .then(response => {
        this.classSchedule = response.data;
        return null;
      });
    Promise.all([getClasses, getSchedule])
      .then(() => this.$timeout(this.$anchorScroll, 50));
  }
}

export default angular.module('shyApp.classes', [ngRoute, AmPmFilter, DayToDateFilter, HtmlIdFilter])
  .config(routes)
  .component('classes', {
    template: require('./classes.pug'),
    controller: ClassesComponent
  })
  .name;
