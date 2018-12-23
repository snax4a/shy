'use strict';
import angular from 'angular';
import ngRoute from 'angular-route';
import routes from './shynet.routes';
import UibDatepickerPopupDirective from 'angular-ui-bootstrap/src/datepickerPopup/index-nocss.js';
import UibModalDirective from 'angular-ui-bootstrap/src/modal/index-nocss.js';
import UserManagerComponent from '../../components/usermanager/usermanager.component';
import { SHYnetComponent } from './shynet.component';
import { AttendanceService } from './attendance.service';

export default angular.module('shyApp.shynet', [ngRoute, UibDatepickerPopupDirective, UibModalDirective, UserManagerComponent])
  .config(routes)
  .service('AttendanceService', AttendanceService)
  .component('shynet', {
    template: require('./shynet.pug'),
    controller: SHYnetComponent
  })
  .name;
