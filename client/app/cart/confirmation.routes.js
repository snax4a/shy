'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('confirmation', {
      url: '/confirmation',
      template: '<confirmation></confirmation>',
      title: 'Schoolhouse Yoga Checkout'
    });
}
