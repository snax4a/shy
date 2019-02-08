import angular from 'angular';
import UibModalDirective from 'angular-ui-bootstrap/src/modal/index-nocss.js';
import { ClassManagerComponent } from './classmanager.component';
import { ClassService } from './class.service';

export default angular.module('shyApp.classmanager', [UibModalDirective])
  .service('ClassService', ClassService)
  .component('classmanager', {
    template: require('./classmanager.pug'),
    controller: ClassManagerComponent
  })
  .name;
