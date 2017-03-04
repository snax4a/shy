'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('profile', {
      url: '/profile',
      template: '<profile></profile>'
    });
}
