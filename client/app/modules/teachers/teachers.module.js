import angular from 'angular';
import routes from './teachers.routes';
import ngRoute from 'angular-route';
import HtmlIdFilter from '../../filters/htmlid/htmlid.filter';
import { TeachersComponent } from './teachers.component';
import { TeacherService } from '../../services/teacher.service';

export default angular.module('shyApp.teachers', [ngRoute, HtmlIdFilter])
  .config(routes)
  .service('TeacherService', TeacherService)
  .component('teachers', {
    template: require('./teachers.pug'),
    controller: TeachersComponent
  })
  .name;
