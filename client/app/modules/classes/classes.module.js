import angular from 'angular';
import ngRoute from 'angular-route';
import routes from './classes.routes';
import AmPmFilter from '../../filters/ampm/ampm.filter';
import DayToDateFilter from '../../filters/daytodate/daytodate.filter';
import HtmlIdFilter from '../../filters/htmlid/htmlid.filter';
import { ClassesComponent } from './classes.component';
import { ClassesService } from './classes.service';

export default angular.module('shyApp.classes', [ngRoute, AmPmFilter, DayToDateFilter, HtmlIdFilter])
  .config(routes)
  .service('ClassesService', ClassesService)
  .component('classes', {
    template: require('./classes.pug'),
    controller: ClassesComponent
  })
  .name;
