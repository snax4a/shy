import angular from 'angular';
import UibModalDirective from 'angular-ui-bootstrap/src/modal/index-nocss.js';
import { LocationManagerComponent } from './locationmanager.component';
import { LocationService } from './location.service';

export default angular.module('shyApp.classmanager', [UibModalDirective])
  .service('LocationService', LocationService)
  .component('locationmanager', {
    template: require('./locationmanager.pug'),
    controller: LocationManagerComponent
  })
  .name;
