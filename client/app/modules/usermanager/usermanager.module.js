'use strict';
import angular from 'angular';
import CompareToDirective from '../../directives/compareto/compareto.directive';
import PaginationDirective from 'angular-utils-pagination';
import UibAlertDirective from 'angular-ui-bootstrap/src/alert';
import UibDatepickerPopupDirective from 'angular-ui-bootstrap/src/datepickerPopup/index-nocss.js';
import UibModalDirective from 'angular-ui-bootstrap/src/modal/index-nocss.js';
import { UserManagerComponent } from './usermanager.component';

export default angular.module('shyApp.usermanager', [CompareToDirective, PaginationDirective, UibAlertDirective, UibDatepickerPopupDirective, UibModalDirective])
.component('usermanager', {
  require: { parent: '?^^shynet' }, // silently ignore if shynet is not parent
  template: require('./usermanager.pug'),
  controller: UserManagerComponent,
  bindings: {
    mini: '<',
    user: '<'
  }
})
.name;