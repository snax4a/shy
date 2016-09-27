'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('register', {
      url: '/register',
      template: '<register></register>'
    });
}
