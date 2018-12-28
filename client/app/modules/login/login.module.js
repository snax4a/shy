'use strict';

import angular from 'angular';
import ngRoute from 'angular-route';
import routes from './login.routes';
import UibDatepickerPopupDirective from 'angular-ui-bootstrap/src/datepickerPopup/index-nocss.js';
import UibModalDirective from 'angular-ui-bootstrap/src/modal/index-nocss.js';
import GoogleButtonComponent from '../../components/google-button/google-button.component';
import { LoginComponent } from './login.component';

export default angular.module('shyApp.login', [ngRoute, UibDatepickerPopupDirective, UibModalDirective, GoogleButtonComponent])
  .config(routes)
  .component('login', {
    template: require('./login.pug'),
    controller: LoginComponent
  })
  .name;
