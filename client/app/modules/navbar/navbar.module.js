'use strict';
import angular from 'angular';
import UibCollapseDirective from 'angular-ui-bootstrap/src/collapse';
import UibDatepickerPopupDirective from 'angular-ui-bootstrap/src/datepickerPopup/index-nocss.js';
import UibDropdownDirective from 'angular-ui-bootstrap/src/dropdown/index-nocss.js';
import UibModalDirective from 'angular-ui-bootstrap/src/modal/index-nocss.js';
import { NavbarComponent } from './navbar.component';
import { ContactService } from './contact.service';

export default angular.module('shyApp.navbar', [UibCollapseDirective, UibDatepickerPopupDirective, UibDropdownDirective, UibModalDirective])
  .service('ContactService', ContactService)
  .component('navbar', {
    template: require('./navbar.pug'),
    controller: NavbarComponent
  })
  .name;
