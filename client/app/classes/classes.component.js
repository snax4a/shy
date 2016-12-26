'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routes from './classes.routes';
import classes from '../../assets/data/classes.json';
import classSchedule from '../../assets/data/class-schedule.json';

export class ClassesController {
  $onInit() {
    // Load objects from JSON
    this.classes = classes;
    this.classSchedule = classSchedule;
  }
}

export default angular.module('shyApp.classes', [uiRouter])
  .config(routes)
  .component('classes', {
    template: require('./classes.pug'),
    controller: ClassesController
  })
  .name;
