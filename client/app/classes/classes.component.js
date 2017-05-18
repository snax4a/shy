'use strict';
import angular from 'angular';
import ngRoute from 'angular-route';
import routes from './classes.routes';
import amPM from '../../components/ampm/ampm.filter';
import daytodate from '../../components/daytodate/daytodate.filter';
import htmlid from '../../components/htmlid/htmlid.filter';

export class ClassesController {
  /*@ngInject*/
  constructor($http, $anchorScroll) {
    this.$http = $http;
    this.$anchorScroll = $anchorScroll;
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
        // this.$anchorScroll();
        // console.log('classes autoscroll');
        return null;
      });
  }
}

export default angular.module('shyApp.classes', [ngRoute, amPM, daytodate, htmlid])
  .config(routes)
  .component('classes', {
    template: require('./classes.pug'),
    controller: ClassesController
  })
  .name;
