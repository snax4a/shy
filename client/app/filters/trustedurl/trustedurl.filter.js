import angular from 'angular';
import ngResource from 'angular-resource';

export function trustedurlFilter($sce) {
  'ngInject';
  return input => $sce.trustAsResourceUrl(input);
}

export default angular.module('shyApp.trustedurl', [ngResource])
  .filter('trustedurl', trustedurlFilter)
  .name;
