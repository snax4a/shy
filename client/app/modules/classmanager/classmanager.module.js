import angular from 'angular';
import UibModalDirective from 'angular-ui-bootstrap/src/modal/index-nocss.js';
import { ClassManagerComponent } from './classmanager.component';

export default angular.module('shyApp.classmanager', [UibModalDirective])
  .component('classmanager', {
    template: require('./classmanager.pug'),
    controller: ClassManagerComponent
  })
  .name;
