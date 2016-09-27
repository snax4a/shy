'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('locations', {
      url: '/locations',
      template: '<locations></locations>'
    });
}
