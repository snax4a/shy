'use strict';

import angular from 'angular';
import ngCookies from 'angular-cookies';
import constants from '../../app.constants';
import UtilModule from '../util/util.module';

import { authInterceptor } from './interceptor.service';
import { routerDecorator } from './router.decorator';
import { AuthService } from './auth.service';
import { UserResource } from './user.service';
import ngRoute from 'angular-route';

function addInterceptor($httpProvider) {
  'ngInject';
  $httpProvider.interceptors.push('authInterceptor');
}

export default angular.module('shyApp.auth', [ngRoute, ngCookies, constants, UtilModule])
  .factory('authInterceptor', authInterceptor)
  .run(routerDecorator)
  .factory('Auth', AuthService)
  .factory('User', UserResource)
  .config(['$httpProvider', addInterceptor])
  .name;
