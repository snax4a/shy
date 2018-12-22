'use strict';
import angular from 'angular';
import routes from './teachers.routes';
import ngRoute from 'angular-route';
import HtmlIdFilter from '../../filters/htmlid/htmlid.filter';
import NoSubsFilter from '../../filters/nosubs/nosubs.filter';
import { TeachersComponent } from './teachers.component';
import { TeachersService } from './teachers.service';

export default angular.module('shyApp.teachers', [ngRoute, HtmlIdFilter, NoSubsFilter])
  .config(routes)
  .service('TeachersService', TeachersService)
  .component('teachers', {
    template: require('./teachers.pug'),
    controller: TeachersComponent
  })
  .name;
