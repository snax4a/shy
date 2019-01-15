import angular from 'angular';
import CompareToDirective from '../../directives/compare-to/compare-to.directive';
import JsonTextDirective from '../../directives/json-text/json-text.directive';
import PaginationDirective from 'angular-utils-pagination';
import UibAlertDirective from 'angular-ui-bootstrap/src/alert';
import UibDatepickerPopupDirective from 'angular-ui-bootstrap/src/datepickerPopup/index-nocss.js';
import UibModalDirective from 'angular-ui-bootstrap/src/modal/index-nocss.js';
import { UserManagerComponent } from './usermanager.component';
import { HistoryService } from './history.service';

export default angular.module('shyApp.usermanager', [CompareToDirective, JsonTextDirective, PaginationDirective, UibAlertDirective, UibDatepickerPopupDirective, UibModalDirective])
  .service('HistoryService', HistoryService)
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
