import angular from 'angular';
import AmPmFilter from '../../filters/ampm/ampm.filter';
import WeekdayFilter from '../../filters/weekday/weekday.filter';
import UibModalDirective from 'angular-ui-bootstrap/src/modal/index-nocss.js';
import { ScheduleManagerComponent } from './schedulemanager.component';

export default angular.module('shyApp.schedulemanager', [UibModalDirective, AmPmFilter, WeekdayFilter])
  .component('schedulemanager', {
    template: require('./schedulemanager.pug'),
    controller: ScheduleManagerComponent
  })
  .name;
