'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('terms', {
      url: '/terms',
      template: '<terms></terms>'
    });
}
