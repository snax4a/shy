import angular from 'angular';

export default angular.module('shyApp.constants', [])
  .constant('appConfig', require('../../server/config/environment/shared'))
  .name;
