import angular from 'angular';
import ngRoute from 'angular-route';
import ngCookies from 'angular-cookies';
import { UtilService } from './util.service';
import { authInterceptor } from './interceptor.service';
import { routerDecorator } from './router.decorator';
import { AuthService } from './auth.service';
import { UserResource } from './user.service';

function addInterceptor($httpProvider) {
  'ngInject';
  $httpProvider.interceptors.push('authInterceptor');
}

export default angular.module('shyApp.auth', [ngRoute, ngCookies])
  .factory('Util', UtilService)
  .factory('authInterceptor', authInterceptor)
  .run(routerDecorator)
  .factory('Auth', AuthService)
  .factory('User', UserResource)
  .config(['$httpProvider', addInterceptor])
  .name;
