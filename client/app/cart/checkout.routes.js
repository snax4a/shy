'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('checkout', {
      url: '/checkout',
      template: '<checkout></checkout>'
    });
}
