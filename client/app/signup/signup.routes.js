'use strict';

export default function($stateProvider) {
  'ngInject';
  $stateProvider
    .state('signup', {
      url: '/signup',
      template: '<signup></signup>',
      title: 'Schoolhouse Yoga Account Signup'
    });
}
