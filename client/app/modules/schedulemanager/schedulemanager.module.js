import angular from 'angular';
import WeekdayFilter from '../../filters/weekday/weekday.filter';
import UibModalDirective from 'angular-ui-bootstrap/src/modal/index-nocss.js';
import { ScheduleManagerComponent } from './schedulemanager.component';

export default angular.module('shyApp.schedulemanager', [UibModalDirective, WeekdayFilter])
  .component('schedulemanager', {
    template: require('./schedulemanager.pug'),
    controller: ScheduleManagerComponent
  })
  .name;
