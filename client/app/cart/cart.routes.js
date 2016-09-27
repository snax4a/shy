'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('cart', {
      url: '/cart',
      template: '<cart></cart>'
    });
}
