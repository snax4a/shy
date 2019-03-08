import angular from 'angular';
import ngRoute from 'angular-route';
import routes from './classes.routes';
import HtmlIdFilter from '../../filters/htmlid/htmlid.filter';
import { ClassesComponent } from './classes.component';
import { ClassService } from '../../services/class.service';

export default angular.module('shyApp.classes', [ngRoute, HtmlIdFilter])
  .config(routes)
  .service('ClassService', ClassService)
  .component('classes', {
    template: require('./classes.pug'),
    controller: ClassesComponent
  })
  .name;
