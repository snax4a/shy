import angular from 'angular';
import UibModalDirective from 'angular-ui-bootstrap/src/modal/index-nocss.js';
import { WorkshopManagerComponent } from './workshopmanager.component';

export default angular.module('shyApp.workshopmanager', [UibModalDirective])
  .component('workshopmanager', {
    template: require('./workshopmanager.pug'),
    controller: WorkshopManagerComponent
  })
  .name;
