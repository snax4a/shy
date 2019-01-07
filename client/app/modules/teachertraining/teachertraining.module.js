import angular from 'angular';
import routes from './teachertraining.routes';
import ngRoute from 'angular-route';
import { TeacherTrainingComponent } from './teachertraining.component';

export default angular.module('shyApp.teachertraining', [ngRoute])
  .config(routes)
  .component('teachertraining', {
    template: require('./teachertraining.pug'),
    controller: TeacherTrainingComponent
  })
  .name;
