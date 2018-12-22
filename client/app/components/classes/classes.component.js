'use strict';
import angular from 'angular';
import ngRoute from 'angular-route';
import routes from './classes.routes';
import AmPmFilter from '../../filters/ampm/ampm.filter';
import DayToDateFilter from '../../filters/daytodate/daytodate.filter';
import HtmlIdFilter from '../../filters/htmlid/htmlid.filter';

export class ClassesComponent {
  /*@ngInject*/
  constructor(ScheduleService) {
    this.ScheduleService = ScheduleService;
  }

  $onInit() {
    this.classes = this.ScheduleService.classes;
    this.classSchedule = this.ScheduleService.classSchedule;
  }
}

export default angular.module('shyApp.classes', [ngRoute, AmPmFilter, DayToDateFilter, HtmlIdFilter])
  .config(routes)
  .component('classes', {
    template: require('./classes.pug'),
    controller: ClassesComponent
  })
  .name;
